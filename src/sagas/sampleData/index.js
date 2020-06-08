import { takeLatest, put, select, call } from 'redux-saga/effects';
import { deepClone, applyPatch } from 'fast-json-patch';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { resourceData, getResourceSampleDataWithStatus } from '../../reducers';
import { createFormValuesPatchSet, SCOPES } from '../resourceForm';
import { evaluateExternalProcessor } from '../editor';
import requestRealTimeMetadata from './sampleDataGenerator/realTimeSampleData';
import requestFileAdaptorSampleData from './sampleDataGenerator/fileAdaptorSampleData'
import { getCsvFromXlsx } from '../../utils/file';
import { processJsonSampleData } from '../../utils/sampleData';
import { getFormattedResourceForPreview } from '../../utils/flowData';
import { pageProcessorPreview } from './utils/previewCalls';
import { isRealTimeOrDistributedResource, isFileAdaptor } from '../../utils/resource';
import { generateFileParserOptionsFromResource } from './utils/fileParserUtils';
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

function* getProcessorOutput({ processorData }) {
  try {
    const processedData = yield call(evaluateExternalProcessor, {
      processorData,
    });

    return { data: processedData };
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status >= 400 && e.status < 500) {
      const parsedError = JSON.parse(e.message);

      return {error: parsedError}
    }
  }
}

function* updateDataForStages({resourceId, dataForEachStageMap }) {
  const stages = Object.keys(dataForEachStageMap);
  for (let stageIndex = 0; stageIndex < stages.length; stageIndex += 1) {
    const stage = stages[stageIndex];
    const stageData = dataForEachStageMap[stage];
    yield put(actions.sampleData.update(resourceId, stageData, stage));
  }
}

function* processRawData({ resourceId, resourceType, values = {} }) {
  const { type, formValues } = values;
  const { file } = values;
  const { file: fileProps} = yield call(constructResourceFromFormValues, {
    formValues,
    resourceId,
    resourceType,
  });
  const dataForEachStageMap = {
    rawFile: { data: [{ body: file, type }] },
    raw: { data: [{ body: file }] },
  };
  const processorData = deepClone(values.editorValues || {});

  if (type === 'json') {
    // For JSON, no need of processor call, the below util takes care of parsing json file as per options
    const options = { resourcePath: fileProps.json && fileProps.json.resourcePath };
    dataForEachStageMap.parse = { data: [{ body: processJsonSampleData(file, options) }] }
    yield call(updateDataForStages, { resourceId, dataForEachStageMap });
    return;
  }
  // For all other file types processor call gives us the JSON format based on the options user configured
  if (type === 'xlsx') {
    const { result } = getCsvFromXlsx(file);
    dataForEachStageMap.csv = { data: [{ body: result }] }
    // save csv content of xlsx file uploaded to be 'data' for the processor call
    processorData.data = result;
  }

  if (type === 'csv') {
    dataForEachStageMap.csv = { data: [{ body: file }] }
  }

  if (type === 'xml') {
    processorData.resourcePath = fileProps.xml && fileProps.xml.resourcePath;
  }
  if (type !== 'xlsx') {
    // 'data' here represents the source file content (based on file type) against which processor runs to get JSON data
    // Only exception is xlsx, where 'data' is 'csv' content as we use csv processor
    processorData.data = file;
  }
  processorData.processor = processorData.processor || PARSERS[type];
  const processorOutput = yield call(getProcessorOutput, { processorData });
  if (processorOutput.data) {
    dataForEachStageMap.parse = processorOutput.data;
    yield call(updateDataForStages, { resourceId, dataForEachStageMap });
  }
  if (processorOutput.error) {
    yield call(updateDataForStages, { resourceId, dataForEachStageMap });
    yield put(
      actions.sampleData.receivedError(resourceId, processorOutput.error, 'parse')
    );
  }
}

function* fetchExportPreviewData({
  resourceId,
  resourceType,
  values,
  runOffline,
}) {
  const body = yield call(constructResourceFromFormValues, {
    formValues: values,
    resourceId,
    resourceType,
  });
  if (isFileAdaptor(body)) {
    const fileType = body.file.type;
    // extract all details needed for a file sampledata
    const { data: fileDetails = {} } = yield select(getResourceSampleDataWithStatus, resourceId, 'rawFile');
    const fileProps = {
      type: fileDetails.type,
      file: fileDetails.body,
      formValues: values,
      editorValues: generateFileParserOptionsFromResource(body, fileType),
    }
    if (!fileDetails.body) {
      // when no file uploaded , try fetching sampleData on resource
      const parsedData = yield call(requestFileAdaptorSampleData, { resource: body });

      if (parsedData) {
        return yield put(actions.sampleData.update(resourceId, { data: [parsedData] }, 'parse'));
      }
      // If no sample data on resource too.... Show empty data representing no data is being passed
      // TODO @Raghu: Handle case where user selects not to transfer data
      // In that case, show empty data also not save any sampleData on resource save
      return yield put(actions.sampleData.update(resourceId, { data: [] }, 'parse'));
    }
    return yield call(processRawData, {
      resourceId,
      resourceType,
      values: fileProps
    })
  }
  // For all other adaptors, go make preview api call for the sampleData
  yield call(getPreviewData, {
    resourceId,
    resourceType,
    values,
    runOffline,
  });
}

function* requestSampleData({
  resourceId,
  resourceType,
  values,
  stage,
  runOffline,
}) {
  if (stage) {
    yield call(processRawData, {
      resourceId,
      resourceType,
      values,
      stage,
    });
  } else {
    yield call(fetchExportPreviewData, {
      resourceId,
      resourceType,
      values,
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
