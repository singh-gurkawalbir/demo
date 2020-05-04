import { takeLatest, put, select, call } from 'redux-saga/effects';
import { deepClone, applyPatch } from 'fast-json-patch';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { resourceData, getResourceSampleDataWithStatus } from '../../reducers';
import { createFormValuesPatchSet, SCOPES } from '../resourceForm';
import { evaluateExternalProcessor } from '../../sagas/editor';
import requestRealTimeMetadata from './sampleDataGenerator/realTimeSampleData';
import { getCsvFromXlsx } from '../../utils/file';
import { processJsonSampleData } from '../../utils/sampleData';
import { getFormattedResourceForPreview } from '../../utils/flowData';
import { pageProcessorPreview } from './utils/previewCalls';
import { isRealTimeOrDistributedResource } from '../../utils/resource';

/*
 * Parsers for different file types used for converting into JSON format
 * For XLSX Files , this saga receives converted csv content as input
 * so it uses same csv parser
 */
const PARSERS = {
  csv: 'csvParser',
  xlsx: 'csvParser',
  xml: 'xmlParser',
  fileDefinition: 'structuredFileParser',
  fileDefinitionParser: 'structuredFileParser',
  fileDefinitionGenerator: 'structuredFileGenerator',
};

export function* constructResourceFromFormValues({
  formValues = {},
  resourceId,
  resourceType,
}) {
  const { patchSet } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values: formValues,
    scope: SCOPES.VALUE,
  });
  const { merged } = yield select(
    resourceData,
    resourceType,
    resourceId,
    SCOPES.VALUE
  );

  return applyPatch(merged ? deepClone(merged) : {}, deepClone(patchSet))
    .newDocument;
}

function getRulesFromResourceFormValues(formValues = {}) {
  if (!formValues['/transform']) return [];
  const transformRules = formValues['/transform'].rules;

  return transformRules && transformRules.length ? transformRules : [];
}

function* getPreviewData({ resourceId, resourceType, values, runOffline }) {
  let body = yield call(constructResourceFromFormValues, {
    formValues: values,
    resourceId,
    resourceType,
  });

  // 'getFormattedResourceForPreview' util removes unnecessary props of resource that should not be sent in preview calls
  // Example: "type": "once" should not be sent while previewing
  body = getFormattedResourceForPreview(body);

  if (runOffline && body.rawData) {
    body = {
      ...body,
      verbose: true,
      runOfflineOptions: {
        runOffline: true,
        runOfflineSource: 'db',
      },
    };
  } else {
    delete body.rawData;
  }

  // eslint-disable-next-line no-restricted-globals
  if (body.pageSize && !isNaN(body.pageSize)) {
    body.test = { limit: parseInt(body.pageSize, 10) };
  }

  const path = `/${resourceType}/preview`;

  try {
    let previewData;

    if (isRealTimeOrDistributedResource(body)) {
      // Handles SF/NS : Fetches metadata for the real time adaptors
      // @Raghu: Update this when we support other real time adaptors like Webhooks
      previewData = yield call(requestRealTimeMetadata, { resource: body });
    } else {
      // Makes base preview calls for all other adaptors
      previewData = yield call(apiCallWithRetry, {
        path,
        opts: { method: 'POST', body },
        message: `Fetching ${resourceType} Preview`,
        hidden: true,
      });
    }

    yield put(actions.sampleData.received(resourceId, previewData));
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status === 403 || e.status === 401) {
      return;
    }

    if (e.status >= 400 && e.status < 500) {
      const parsedError = JSON.parse(e.message);

      return yield put(
        actions.sampleData.receivedError(resourceId, parsedError)
      );
    }
  }
}

function* processData({ resourceId, processorData, stage }) {
  try {
    const processedData = yield call(evaluateExternalProcessor, {
      processorData,
    });

    yield put(actions.sampleData.update(resourceId, processedData, stage));
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status >= 400 && e.status < 500) {
      const parsedError = JSON.parse(e.message);

      yield put(
        actions.sampleData.receivedError(resourceId, parsedError, stage)
      );
    }
  }
}

function* transformData({ resourceId, values, stage }) {
  const { data } = yield select(
    getResourceSampleDataWithStatus,
    resourceId,
    stage
  );
  const processorData = values || {};

  processorData.data = data;
  processorData.processor = stage;

  yield call(processData, { resourceId, processorData, stage });
}

function* processRawData({ resourceId, resourceType, values = {}, stage }) {
  if (stage === 'transform') {
    return yield call(transformData, { resourceId, values, stage });
  }

  const { type, formValues } = values;
  let { file } = values;

  // Add file type and file body as part of the state with a 'rawFile'
  yield put(
    actions.sampleData.update(
      resourceId,
      { data: [{ body: file, type }] },
      'rawFile'
    )
  );
  // Update Raw Data with the file uploaded before parsing
  yield put(
    actions.sampleData.update(resourceId, { data: [{ body: file }] }, 'raw')
  );

  // JSON file does not need parsing
  if (type === 'json') {
    // Update the parsed JSON file in parse stage
    yield put(
      actions.sampleData.update(
        resourceId,
        { data: [{ body: processJsonSampleData(file) }] },
        'parse'
      )
    );

    return;
  }

  // For xlsx file , content gets converted to 'csv' before parsing
  if (type === 'xlsx') {
    const { result } = getCsvFromXlsx(file);

    file = result;
    // Saving csv file content for xlsx in sample data for future use
    // Incase of FTP Imports, sampleData field in resource expects 'csvContent' for xlsx file upload to be saved
    yield put(
      actions.sampleData.update(resourceId, { data: [{ body: file }] }, 'csv')
    );
  }

  const processorData = values.editorValues || {};

  processorData.data = file;
  processorData.processor = processorData.processor || PARSERS[type];
  yield call(processData, { resourceId, processorData, stage: 'parse' });
  // Call Transform processor if rules exist for this resource
  const transformRules = getRulesFromResourceFormValues(formValues);

  if (transformRules.length) {
    yield put(
      actions.sampleData.request(
        resourceId,
        resourceType,
        transformRules,
        'transform'
      )
    );
  }
}

function* requestSampleData({
  resourceId,
  resourceType,
  values,
  stage,
  runOffline,
}) {
  // deepcloning the value to avoid mutation of object being passed from the component
  const valuesCopy = deepClone(values);

  if (stage) {
    yield call(processRawData, {
      resourceId,
      resourceType,
      values: valuesCopy,
      stage,
    });
  } else {
    yield call(getPreviewData, {
      resourceId,
      resourceType,
      values: valuesCopy,
      runOffline,
    });
  }
}

// TODO @Raghu: Merge this into existing requestSampleData
function* requestLookupSampleData({ resourceId, flowId, formValues }) {
  const resourceType = 'exports';
  let _pageProcessorDoc = yield call(constructResourceFromFormValues, {
    formValues,
    resourceId,
    resourceType,
  });

  // TODO @Raghu: Should handle in metadata to pass boolean instead of string
  if (_pageProcessorDoc.oneToMany) {
    const oneToMany = _pageProcessorDoc.oneToMany === 'true';

    _pageProcessorDoc = { ..._pageProcessorDoc, oneToMany };
  }

  try {
    const pageProcessorPreviewData = yield call(pageProcessorPreview, {
      flowId,
      _pageProcessorId: resourceId,
      resourceType,
      hidden: true,
      _pageProcessorDoc,
      throwOnError: true,
    });

    yield put(
      actions.sampleData.received(resourceId, pageProcessorPreviewData)
    );
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status === 403 || e.status === 401) {
      return;
    }

    if (e.status >= 400 && e.status < 500) {
      const parsedError = JSON.parse(e.message);

      return yield put(
        actions.sampleData.receivedError(resourceId, parsedError)
      );
    }
  }
}

export default [
  takeLatest(actionTypes.SAMPLEDATA.REQUEST, requestSampleData),
  takeLatest(actionTypes.SAMPLEDATA.LOOKUP_REQUEST, requestLookupSampleData),
];
