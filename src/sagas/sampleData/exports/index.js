import { takeLatest, put, select, call } from 'redux-saga/effects';
import { deepClone } from 'fast-json-patch';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { apiCallWithRetry } from '../../index';
import { selectors } from '../../../reducers';
import requestRealTimeMetadata from '../sampleDataGenerator/realTimeSampleData';
import { requestFileAdaptorPreview, parseFilePreviewData } from '../sampleDataGenerator/fileAdaptorSampleData';
import { getCsvFromXlsx } from '../../../utils/file';
import { processJsonSampleData, processJsonPreviewData } from '../../../utils/sampleData';
import { getFormattedResourceForPreview } from '../../../utils/flowData';
import { pageProcessorPreview } from '../utils/previewCalls';
import {
  isRealTimeOrDistributedResource,
  isFileAdaptor,
  isAS2Resource,
} from '../../../utils/resource';
import { generateFileParserOptionsFromResource } from '../utils/fileParserUtils';
import { DEFAULT_RECORD_SIZE, previewFileData } from '../../../utils/exportPanel';
import {
  constructResourceFromFormValues,
} from '../../utils';
import { evaluateExternalProcessor } from '../../editor';

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

export function* _getSampleDataRecordSize({ resourceId }) {
  const recordSize = yield select(selectors.sampleDataRecordSize, resourceId);

  return recordSize || DEFAULT_RECORD_SIZE;
}

/**
 * Checks if the constructed body from formValues has same file type as saved resource
 * and if body has sampleData
 */
export function* _hasSampleDataOnResource({ resourceId, resourceType, body }) {
  const resource = yield select(selectors.resource, resourceType, resourceId);

  if (!resource || !body?.sampleData) return false;
  const resourceFileType = resource?.file?.type;
  const bodyFileType = body?.file?.type;

  if (
    ['filedefinition', 'fixed', 'delimited/edifact'].includes(bodyFileType) &&
      resourceFileType === 'filedefinition'
  ) {
    return true;
  }

  return bodyFileType === resourceFileType;
}

export function* _getProcessorOutput({ processorData }) {
  try {
    // TODO: change this evaluateExternalProcessor to use refactored AFE code and
    // add the property 'editorType' in processorData
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
export function* _updateDataForStages({resourceId, dataForEachStageMap }) {
  if (!dataForEachStageMap) return;
  const stages = Object.keys(dataForEachStageMap);

  for (let stageIndex = 0; stageIndex < stages.length; stageIndex += 1) {
    const stage = stages[stageIndex];
    const stageData = dataForEachStageMap[stage];

    yield put(actions.sampleData.update(resourceId, stageData, stage));
  }
}

export function* _getPreviewData({ resourceId, resourceType, values, runOffline }) {
  const { transform, filter, hooks, ...constructedResourceObj } = yield call(constructResourceFromFormValues, {
    formValues: values,
    resourceId,
    resourceType,
  }) || {};

  let body = constructedResourceObj;

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

  const recordSize = yield call(_getSampleDataRecordSize, { resourceId });

  // eslint-disable-next-line no-restricted-globals
  if (recordSize && !isNaN(recordSize)) {
    body.test = { limit: recordSize };
  }

  const path = `/${resourceType}/preview`;

  try {
    let previewData;

    if (isRealTimeOrDistributedResource(body)) {
      // Handles SF/NS : Fetches metadata for the real time adaptors
      // @Raghu: Update this when we support other real time adaptors like Webhooks
      const data = yield call(requestRealTimeMetadata, { resource: body });

      previewData = [data];
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

export function* _processRawData({ resourceId, resourceType, values = {} }) {
  const { type, formValues } = values;
  const { file } = values;
  const body = yield call(constructResourceFromFormValues, {
    formValues,
    resourceId,
    resourceType,
  });

  const { file: fileProps} = body || {};

  const recordSize = yield call(_getSampleDataRecordSize, { resourceId });

  let {editorValues} = values;

  // If there are no editorValues passed from the editor,
  // parse the resourceBody and construct props to process file content
  if (!editorValues) {
    editorValues = generateFileParserOptionsFromResource(body);
  }
  const dataForEachStageMap = {
    rawFile: { data: { body: file, type } },
    raw: { data: { body: file } },
  };
  const processorData = deepClone(editorValues || {});

  if (type === 'json') {
    // For JSON, no need of processor call, the below util takes care of parsing json file as per options
    const options = { resourcePath: fileProps.json && fileProps.json.resourcePath };
    const previewData = processJsonPreviewData(file, options);

    dataForEachStageMap.preview = { data: previewFileData(previewData, recordSize) };
    dataForEachStageMap.parse = { data: [processJsonSampleData(file, options)] };

    yield call(_updateDataForStages, { resourceId, dataForEachStageMap });

    return;
  }
  // For all other file types processor call gives us the JSON format based on the options user configured
  if (type === 'xlsx') {
    const { result } = yield call(getCsvFromXlsx, file);

    dataForEachStageMap.csv = { data: { body: result } };
    // save csv content of xlsx file uploaded to be 'data' for the processor call
    processorData.data = result;
  }

  if (type === 'csv') {
    dataForEachStageMap.csv = { data: { body: file } };
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
  const processorOutput = yield call(_getProcessorOutput, { processorData });

  if (processorOutput?.data) {
    const previewData = processorOutput.data.data;

    dataForEachStageMap.preview = { data: previewFileData(previewData, recordSize) };
    dataForEachStageMap.parse = { data: [processJsonSampleData(previewData)] };

    return yield call(_updateDataForStages, { resourceId, dataForEachStageMap });
  }
  if (processorOutput?.error) {
    yield call(_updateDataForStages, { resourceId, dataForEachStageMap });
    yield put(
      actions.sampleData.receivedError(resourceId, processorOutput.error, 'parse')
    );
  }
}

export function* _fetchExportPreviewData({
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

  const recordSize = yield call(_getSampleDataRecordSize, { resourceId });
  const isRestCsvExport = yield select(selectors.isRestCsvMediaTypeExport, resourceId);
  const isFileProviderAssistant = yield select(selectors.isFileProviderAssistant, resourceId);

  // If it is a file adaptor/Rest csv export , follows a different approach to fetch sample data
  if (isFileAdaptor(body) || isAS2Resource(body) || isRestCsvExport || isFileProviderAssistant) {
    // extract all details needed for a file sampledata
    const { data: fileDetails } = yield select(selectors.getResourceSampleDataWithStatus, resourceId, 'rawFile');

    if (!fileDetails) {
      // when no file uploaded , try fetching sampleData on resource
      const hasSampleData = yield call(_hasSampleDataOnResource, { resourceId, resourceType, body});
      const previewData = yield call(requestFileAdaptorPreview, { resource: body });
      const previewRecords = previewFileData(previewData, recordSize);

      if (hasSampleData && previewData) {
        yield put(actions.sampleData.update(resourceId, { data: previewRecords }, 'preview'));
        const parsedData = parseFilePreviewData({ resource: body, previewData});

        return yield put(actions.sampleData.update(resourceId, { data: [parsedData] }, 'parse'));
      }

      // If no sample data on resource too...
      // Show empty data representing no data is being passed
      yield put(actions.sampleData.update(resourceId, { data: undefined }, 'preview'));

      return yield put(actions.sampleData.update(resourceId, { data: undefined }, 'parse'));
    }
    if (body.file?.output === 'blobKeys') {
      // If the output mode is 'blob' , no data is passed so show empty data
      yield put(actions.sampleData.update(resourceId, { data: undefined }, 'preview'));

      return yield put(actions.sampleData.update(resourceId, { data: undefined }, 'parse'));
    }
    const fileProps = {
      type: fileDetails?.type,
      file: fileDetails?.body,
      formValues: values,
    };

    yield call(_processRawData, {
      resourceId,
      resourceType,
      values: fileProps,
    });

    return;
  }
  // For all other adaptors, go make preview api call for the sampleData
  yield call(_getPreviewData, {
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
  options = {},
}) {
  const { runOffline } = options;

  if (stage) {
    yield call(_processRawData, {
      resourceId,
      resourceType,
      values,
      stage,
    });
  } else {
    yield call(_fetchExportPreviewData, {
      resourceId,
      resourceType,
      values,
      runOffline,
    });
  }
}

export function* requestLookupSampleData({ resourceId, flowId, formValues }) {
  const resourceType = 'exports';
  const recordSize = yield select(selectors.sampleDataRecordSize, resourceId) || DEFAULT_RECORD_SIZE;
  const { transform, filter, hooks, ...constructedResourceObj } = yield call(constructResourceFromFormValues, {
    formValues,
    resourceId,
    resourceType,
  }) || {};

  let _pageProcessorDoc = constructedResourceObj;

  // TODO @Raghu: Should handle in metadata to pass boolean instead of string
  if (_pageProcessorDoc.oneToMany) {
    const oneToMany = _pageProcessorDoc.oneToMany === 'true';

    _pageProcessorDoc = { ..._pageProcessorDoc, oneToMany };
  }
  // delete sampleData property if exists on pageProcessor Doc
  // as preview call considers sampleData to show instead of fetching
  delete _pageProcessorDoc.sampleData;
  // add recordSize if passed to limit number of records from preview
  if (recordSize) {
    _pageProcessorDoc.test = { limit: recordSize };
  }

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
