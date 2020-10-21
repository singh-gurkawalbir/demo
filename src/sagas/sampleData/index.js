import { takeLatest, put, select, call } from 'redux-saga/effects';
import { deepClone, applyPatch } from 'fast-json-patch';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import { createFormValuesPatchSet, SCOPES } from '../resourceForm';
import { evaluateExternalProcessor } from '../editor';
import requestRealTimeMetadata from './sampleDataGenerator/realTimeSampleData';
import requestFileAdaptorSampleData from './sampleDataGenerator/fileAdaptorSampleData';
import { getCsvFromXlsx } from '../../utils/file';
import { processJsonSampleData } from '../../utils/sampleData';
import { getFormattedResourceForPreview } from '../../utils/flowData';
import { pageProcessorPreview } from './utils/previewCalls';
import {
  isRealTimeOrDistributedResource,
  isFileAdaptor,
  isAS2Resource,
} from '../../utils/resource';
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
    selectors.resourceData,
    resourceType,
    resourceId,
    SCOPES.VALUE
  );

  try {
    return applyPatch(merged ? deepClone(merged) : {}, deepClone(patchSet))
      .newDocument;
  } catch (e) {
    return {};
  }
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
        message: 'Loading',
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

      return {error: parsedError};
    }
  }
}
/**
 * Given list of stages mapped with data to be saved against it
 * Triggers action that saves each stage with data on resource's sample data
 */
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
  const body = yield call(constructResourceFromFormValues, {
    formValues,
    resourceId,
    resourceType,
  });
  const { file: fileProps} = body || {};

  // If there are no editorValues passed from the editor,
  // parse the resourceBody and construct props to process file content
  if (!values.editorValues) {
    // eslint-disable-next-line no-param-reassign
    values.editorValues = generateFileParserOptionsFromResource(body);
  }
  const dataForEachStageMap = {
    rawFile: { data: [{ body: file, type }] },
    raw: { data: [{ body: file }] },
  };
  const processorData = deepClone(values.editorValues || {});

  if (type === 'json') {
    // For JSON, no need of processor call, the below util takes care of parsing json file as per options
    const options = { resourcePath: fileProps.json && fileProps.json.resourcePath };

    dataForEachStageMap.parse = { data: [processJsonSampleData(file, options)] };
    yield call(updateDataForStages, { resourceId, dataForEachStageMap });

    return;
  }
  // For all other file types processor call gives us the JSON format based on the options user configured
  if (type === 'xlsx') {
    const { result } = yield call(getCsvFromXlsx, file);

    dataForEachStageMap.csv = { data: [{ body: result }] };
    // save csv content of xlsx file uploaded to be 'data' for the processor call
    processorData.data = result;
  }

  if (type === 'csv') {
    dataForEachStageMap.csv = { data: [{ body: file }] };
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

  if (processorOutput && processorOutput.data) {
    dataForEachStageMap.parse = processorOutput.data;
    yield call(updateDataForStages, { resourceId, dataForEachStageMap });
  }
  if (processorOutput && processorOutput.error) {
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
  const isRestCsvExport = yield select(selectors.isRestCsvMediaTypeExport, resourceId);

  // If it is a file adaptor/Rest csv export , follows a different approach to fetch sample data
  if (isFileAdaptor(body) || isAS2Resource(body) || isRestCsvExport) {
    // extract all details needed for a file sampledata
    const { data: fileDetails } = yield select(selectors.getResourceSampleDataWithStatus, resourceId, 'rawFile');

    if (!fileDetails) {
      // when no file uploaded , try fetching sampleData on resource
      const parsedData = yield call(requestFileAdaptorSampleData, { resource: body });

      if (parsedData) {
        return yield put(actions.sampleData.update(resourceId, { data: [parsedData] }, 'parse'));
      }

      // If no sample data on resource too...
      // Show empty data representing no data is being passed
      return yield put(actions.sampleData.update(resourceId, { data: [] }, 'parse'));
    }
    if (body.file.output === 'blobKeys') {
      // If the output mode is 'blob' , no data is passed so show empty data
      return yield put(actions.sampleData.update(resourceId, { data: [] }, 'parse'));
    }
    const fileProps = {
      type: fileDetails?.type,
      file: fileDetails?.body,
      formValues: values,
    };

    return yield call(processRawData, {
      resourceId,
      resourceType,
      values: fileProps,
    });
  }
  // For all other adaptors, go make preview api call for the sampleData
  yield call(getPreviewData, {
    resourceId,
    resourceType,
    values,
    runOffline,
  });
}

export function* requestExportSampleData({
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
  // delete sampleData property if exists on pageProcessor Doc
  // as preview call considers sampleData to show instead of fetching
  delete _pageProcessorDoc.sampleData;

  try {
    const pageProcessorPreviewData = yield call(pageProcessorPreview, {
      flowId,
      _pageProcessorId: resourceId,
      resourceType,
      hidden: true,
      _pageProcessorDoc,
      throwOnError: true,
      includeStages: true,
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
  takeLatest(actionTypes.SAMPLEDATA.REQUEST, requestExportSampleData),
  takeLatest(actionTypes.SAMPLEDATA.LOOKUP_REQUEST, requestLookupSampleData),
];
