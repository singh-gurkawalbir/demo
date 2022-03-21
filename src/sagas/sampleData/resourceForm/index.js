import { select, takeLatest, call, put, delay } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { apiCallWithRetry } from '../../index';
import { pageProcessorPreview } from '../utils/previewCalls';
import requestRealTimeMetadata from '../sampleDataGenerator/realTimeSampleData';
import {
  isRealTimeOrDistributedResource,
  isFileAdaptor,
  isAS2Resource,
} from '../../../utils/resource';
import { getFormattedResourceForPreview } from '../../../utils/flowData';
import {
  _fetchResourceInfoFromFormKey,
  extractFileSampleDataProps,
  executeTransformationRules,
  executeJavascriptHook,
  SUITESCRIPT_FILE_RESOURCE_TYPES,
  FILE_DEFINITION_TYPES,
  IMPORT_FILE_UPLOAD_SUPPORTED_FILE_TYPES,
  VALID_RESOURCE_TYPES_FOR_SAMPLE_DATA,
} from './utils';
import { STANDALONE_INTEGRATION } from '../../../utils/constants';
import { previewFileData } from '../../../utils/exportPanel';
import { processJsonSampleData } from '../../../utils/sampleData';
import { evaluateExternalProcessor } from '../../editor';
import { getCsvFromXlsx } from '../../../utils/file';
import { safeParse } from '../../../utils/string';

/*
 * Parsers for different file types used for converting into JSON format
 * For XLSX Files , this saga receives converted csv content as input
 * so it uses same csv parser
 */
const PARSERS = {
  csv: 'csvParser',
  xlsx: 'csvParser',
  xml: 'xmlParser',
  json: 'jsonParser',
  fileDefinitionParser: 'structuredFileParser',
  fileDefinitionGenerator: 'structuredFileGenerator',
};

export function* _getProcessorOutput({ processorData }) {
  const processedData = yield call(evaluateExternalProcessor, {
    processorData,
  });

  // Currently, we do not need to show violations ( which is a rare case out side of editor )
  // So, if at all violations are thrown, we reset the sample data to empty
  if (processedData?.violations) return;

  return processedData;
}

export function* _handlePreviewError({ e, resourceId }) {
// Handling Errors with status code between 400 and 500
  if (!resourceId || !e || e.status === 403 || e.status === 401) {
    return;
  }

  if (e.status >= 400 && e.status < 500) {
    const parsedError = safeParse(e.message);

    return yield put(
      actions.resourceFormSampleData.receivedPreviewError(resourceId, parsedError)
    );
  }
}
export function* _requestRealTimeSampleData({ formKey, refreshCache = false }) {
  const { resourceObj, resourceId } = yield call(_fetchResourceInfoFromFormKey, { formKey });

  const realTimeSampleData = yield call(requestRealTimeMetadata, { resource: resourceObj, refresh: refreshCache });

  yield put(actions.resourceFormSampleData.setParseData(resourceId, realTimeSampleData));
  yield put(actions.resourceFormSampleData.setStatus(resourceId, 'received'));
}

export function* _requestExportPreviewData({ formKey, executeProcessors = false }) {
  const { resourceObj, resourceId, flowId, integrationId } = yield call(_fetchResourceInfoFromFormKey, { formKey });

  // 'getFormattedResourceForPreview' util removes unnecessary props of resource that should not be sent in preview calls
  const body = getFormattedResourceForPreview(resourceObj);

  if (!executeProcessors) {
    delete body.transform;
    delete body.hooks;
  }
  // BE need flowId and integrationId in the preview call
  // if in case integration settings were used in export
  const flow = yield select(selectors.resource, 'flows', flowId);

  // while working with newly created flows, flowId could be temporary UI generated. Rely on flow._id as flowId while making page processor preview call.
  // refer IO-21519
  body._flowId = flow?._id;
  body._integrationId = integrationId !== STANDALONE_INTEGRATION.id ? integrationId : undefined;

  const recordSize = yield select(selectors.sampleDataRecordSize, resourceId);

  if (recordSize && !Number.isNaN(recordSize)) {
    body.test = { limit: recordSize };
  }

  try {
    const previewData = yield call(apiCallWithRetry, {
      path: '/exports/preview',
      opts: { method: 'POST', body },
      hidden: true,
    });

    // handle state updates for real time resources here
    yield put(actions.resourceFormSampleData.receivedPreviewStages(resourceId, previewData));
  } catch (e) {
    yield call(_handlePreviewError, { e, resourceId });
  }
}

export function* _requestImportPreviewData({ formKey, executeProcessors = false }) {
  const { resourceObj, resourceId, flowId, integrationId } = yield call(_fetchResourceInfoFromFormKey, { formKey });

  // 'getFormattedResourceForPreview' util removes unnecessary props of resource that should not be sent in preview calls
  const body = getFormattedResourceForPreview(resourceObj);

  if (!executeProcessors) {
    delete body.transform;
    delete body.hooks;
  }
  // BE need flowId and integrationId in the preview call
  // if in case integration settings were used in export
  const flow = yield select(selectors.resource, 'flows', flowId);

  // while working with newly created flows, flowId could be temporary UI generated. Rely on flow._id as flowId while making page processor preview call.
  // refer IO-21519
  body._flowId = flow?._id;
  body._integrationId = integrationId !== STANDALONE_INTEGRATION.id ? integrationId : undefined;

  const recordSize = yield select(selectors.sampleDataRecordSize, resourceId);

  if (recordSize && !Number.isNaN(recordSize)) {
    body.test = { limit: recordSize };
  }

  try {
    const previewData = yield call(apiCallWithRetry, {
      path: '/imports/preview',
      opts: { method: 'POST', body },
      hidden: true,
    });

    // handle state updates for real time resources here
    yield put(actions.resourceFormSampleData.receivedPreviewStages(resourceId, previewData));
  } catch (e) {
    yield call(_handlePreviewError, { e, resourceId });
  }
}

export function* _parseFileData({ resourceId, fileContent, fileProps = {}, fileType, parserOptions, isNewSampleData = false }) {
  const recordSize = yield select(selectors.sampleDataRecordSize, resourceId);

  if (isNewSampleData) {
    yield put(actions.resourceFormSampleData.setRawData(resourceId, fileContent));
  }
  switch (fileType) {
    case 'json':
    case 'csv':
    case 'xml': {
      const processorData = {
        rule: parserOptions,
        data: fileContent,
        editorType: PARSERS[fileType],
      };
      const processorOutput = yield call(_getProcessorOutput, { processorData });

      if (processorOutput?.error) {
        return yield put(
          actions.resourceFormSampleData.receivedProcessorError(resourceId, processorOutput.error)
        );
      }
      const previewData = processorOutput?.data;

      yield put(actions.resourceFormSampleData.setParseData(resourceId, processJsonSampleData(previewData)));
      yield put(actions.resourceFormSampleData.setPreviewData(resourceId, previewFileData(previewData, recordSize)));
      break;
    }
    case 'xlsx': {
      let csvFileContent = fileContent;

      // Incase of sample data from resource, we save csv content on the resource, so file content type will be string
      // Incase of file upload from the user, fileContent is xlsx and we extract csv content out of it
      if (typeof fileContent !== 'string') {
        csvFileContent = (yield call(getCsvFromXlsx, fileContent))?.result;
      }
      const processorData = {
        rule: parserOptions,
        data: csvFileContent,
        editorType: PARSERS.xlsx,
      };
      const processorOutput = yield call(_getProcessorOutput, { processorData });

      if (isNewSampleData) {
        yield put(actions.resourceFormSampleData.setCsvFileData(resourceId, csvFileContent));
      }
      if (processorOutput?.error) {
        return yield put(
          actions.resourceFormSampleData.receivedProcessorError(resourceId, processorOutput.error)
        );
      }
      const previewData = processorOutput.data;

      yield put(actions.resourceFormSampleData.setParseData(resourceId, processJsonSampleData(previewData)));
      yield put(actions.resourceFormSampleData.setPreviewData(resourceId, previewFileData(previewData, recordSize)));
      break;
    }
    case 'fileDefinitionParser': {
      const {groupByFields, sortByFields} = fileProps;

      const processorData = {
        rule: parserOptions,
        data: fileContent,
        editorType: PARSERS.fileDefinitionParser,
        groupByFields,
        sortByFields,
      };

      const processorOutput = yield call(_getProcessorOutput, { processorData });

      yield put(actions.resourceFormSampleData.setRawData(resourceId, fileContent));
      if (processorOutput?.error) {
        return yield put(
          actions.resourceFormSampleData.receivedProcessorError(resourceId, processorOutput.error)
        );
      }
      const previewData = processorOutput.data;

      yield put(actions.resourceFormSampleData.setParseData(resourceId, processJsonSampleData(previewData)));
      yield put(actions.resourceFormSampleData.setPreviewData(resourceId, previewFileData(previewData, recordSize)));
      break;
    }
    default:
  }
  yield put(actions.resourceFormSampleData.setStatus(resourceId, 'received'));
}

export function* _requestFileSampleData({ formKey }) {
  const { resourceObj: resourceInfo, resourceId, ssLinkedConnectionId } = yield call(_fetchResourceInfoFromFormKey, { formKey });

  const resourceObj = { ...resourceInfo };

  if (ssLinkedConnectionId && SUITESCRIPT_FILE_RESOURCE_TYPES.includes(resourceObj.type)) {
    resourceObj.file.type = 'csv';
  }
  const fileType = resourceObj?.file?.type;

  if (!fileType) {
    return yield put(actions.resourceFormSampleData.clearStages(resourceId));
  }
  const { sampleData, isNewSampleData, parserOptions, fileProps } = yield call(extractFileSampleDataProps, { formKey });

  if (sampleData) {
    return yield call(_parseFileData, {
      resourceId,
      fileContent: sampleData,
      fileType: FILE_DEFINITION_TYPES.includes(fileType) ? 'fileDefinitionParser' : fileType,
      fileProps,
      parserOptions,
      isNewSampleData,
    });
  }
  // no sample data - so clear sample data from state
  yield put(actions.resourceFormSampleData.clearStages(resourceId));
}

// Deals with fetching transform & preSavePage hook data
export function* _fetchFBActionsSampleData({ formKey }) {
  const { resourceObj, resourceId } = yield call(_fetchResourceInfoFromFormKey, { formKey });
  const parsedData = (yield select(
    selectors.getResourceSampleDataWithStatus,
    resourceId,
    'parse'
  ))?.data;

  const {data: transformedOutput, hasNoRulesToProcess} = yield call(executeTransformationRules, {
    transform: resourceObj?.transform,
    sampleData: parsedData,
  });

  yield put(actions.resourceFormSampleData.setProcessorData({
    resourceId,
    processor: 'transform',
    processorData: hasNoRulesToProcess ? parsedData : transformedOutput,
  }));

  const transformedData = (yield select(
    selectors.getResourceSampleDataWithStatus,
    resourceId,
    'transform'
  ))?.data;

  const {data: preSavePageHookOutput, hasNoRulesToProcess: hasNoHook} = yield call(executeJavascriptHook, {
    hook: resourceObj?.hooks?.preSavePage,
    sampleData: transformedData,
  });

  yield put(actions.resourceFormSampleData.setProcessorData({
    resourceId,
    processor: 'preSavePageHook',
    processorData: hasNoHook ? transformedData : preSavePageHookOutput,
  }));
}

export function* _requestPGExportSampleData({ formKey, refreshCache, executeProcessors }) {
  const { resourceObj, resourceId } = yield call(_fetchResourceInfoFromFormKey, { formKey });
  const isRestCsvExport = yield select(selectors.isRestCsvMediaTypeExport, resourceId);

  if (isFileAdaptor(resourceObj) || isAS2Resource(resourceObj) || isRestCsvExport) {
    yield call(_requestFileSampleData, { formKey });
    if (executeProcessors) {
      yield call(_fetchFBActionsSampleData, { formKey });
    }

    return;
  }
  if (isRealTimeOrDistributedResource(resourceObj)) {
    yield call(_requestRealTimeSampleData, { formKey, refreshCache });
    if (executeProcessors) {
      yield call(_fetchFBActionsSampleData, { formKey });
    }

    return;
  }
  yield call(_requestExportPreviewData, { formKey, executeProcessors });
}
export function* _requestPGImportSampleData({ formKey, executeProcessors }) {
  yield call(_requestImportPreviewData, { formKey, executeProcessors });
}

export function* _requestLookupSampleData({ formKey, refreshCache = false }) {
  const { resourceId, resourceObj, flowId } = yield call(_fetchResourceInfoFromFormKey, { formKey });
  const isRestCsvExport = yield select(selectors.isRestCsvMediaTypeExport, resourceId);

  // make file adaptor sample data calls
  if (isFileAdaptor(resourceObj) || isAS2Resource(resourceObj) || isRestCsvExport) {
    return yield call(_requestFileSampleData, { formKey });
  }
  // make PP preview call incase of all other adaptors
  const resourceType = 'exports';
  const recordSize = yield select(selectors.sampleDataRecordSize, resourceId);
  // exclude sampleData property if exists on pageProcessor Doc
  // as preview call considers sampleData to show instead of fetching
  const { transform, filter, hooks, sampleData, ...constructedResourceObj } = resourceObj;

  let _pageProcessorDoc = constructedResourceObj;

  if (_pageProcessorDoc.oneToMany) {
    const oneToMany = _pageProcessorDoc.oneToMany === 'true';

    _pageProcessorDoc = { ..._pageProcessorDoc, oneToMany };
  }
  // add recordSize if passed to limit number of records from preview
  if (recordSize && !Number.isNaN(recordSize)) {
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
      refresh: refreshCache,
    });

    yield put(
      actions.resourceFormSampleData.receivedPreviewStages(resourceId, pageProcessorPreviewData)
    );
  } catch (e) {
    yield call(_handlePreviewError, { e, resourceId });
  }
}
export function* _requestImportSampleData({ formKey, refreshCache = false }) {
  const { resourceId, resourceObj, flowId } = yield call(_fetchResourceInfoFromFormKey, { formKey });

  // make PP preview call incase of all other adaptors
  const resourceType = 'imports';
  const recordSize = yield select(selectors.sampleDataRecordSize, resourceId);
  // const sampleDataType = yield select(selectors.typeOfSampleData, resourceId);

  // exclude sampleData property if exists on pageProcessor Doc
  // as preview call considers sampleData to show instead of fetching
  const { transform, filter, hooks, sampleData, ...constructedResourceObj } = resourceObj;

  let _pageProcessorDoc = constructedResourceObj;

  if (_pageProcessorDoc.oneToMany) {
    const oneToMany = _pageProcessorDoc.oneToMany === 'true';

    _pageProcessorDoc = { ..._pageProcessorDoc, oneToMany };
  }
  // add recordSize if passed to limit number of records from preview
  if (recordSize && !Number.isNaN(recordSize)) {
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
      refresh: refreshCache,
    });

    yield put(
      actions.resourceFormSampleData.receivedPreviewStages(resourceId, pageProcessorPreviewData)
    );
  } catch (e) {
    yield call(_handlePreviewError, { e, resourceId });
  }
}

export function* _requestExportSampleData({ formKey, refreshCache, executeProcessors }) {
  const { resourceId, flowId, ssLinkedConnectionId, resourceObj } = yield call(_fetchResourceInfoFromFormKey, { formKey });

  if (ssLinkedConnectionId) {
    if (SUITESCRIPT_FILE_RESOURCE_TYPES.includes(resourceObj?.type)) {
      return yield call(_requestFileSampleData, { formKey });
    }

    return yield put(actions.resourceFormSampleData.clearStages(resourceId));
  }
  const isLookUpExport = yield select(selectors.isLookUpExport, { flowId, resourceId, resourceType: 'exports' });

  if (isLookUpExport) {
    yield call(_requestLookupSampleData, { formKey, refreshCache });
  } else {
    yield call(_requestPGExportSampleData, { formKey, refreshCache, executeProcessors });
  }
}

export function* _requestImportFileSampleData({ formKey }) {
  // file related sample data is handled here
  const { resourceObj, resourceId } = yield call(_fetchResourceInfoFromFormKey, { formKey });

  const fileType = resourceObj?.file?.type;

  if (!fileType) {
    return yield put(actions.resourceFormSampleData.clearStages(resourceId));
  }

  const fileId = `${resourceId}-uploadFile`;
  const uploadedFileObj = yield select(selectors.getUploadedFile, fileId);
  const { file: uploadedFile } = uploadedFileObj || {};

  if (FILE_DEFINITION_TYPES.includes(fileType)) {
    const fieldState = yield select(selectors.fieldState, formKey, 'file.filedefinition.rules');
    const {userDefinitionId, options: fieldOptions} = fieldState;
    const { format, definitionId } = fieldOptions || {};

    const fileDefinitionData = yield select(selectors.fileDefinitionSampleData, {
      userDefinitionId,
      resourceType: 'imports',
      options: { format, definitionId },
    });

    const sampleData = fileDefinitionData?.sampleData || resourceObj.sampleData;

    yield put(actions.resourceFormSampleData.setRawData(resourceId, sampleData));
  } else if (IMPORT_FILE_UPLOAD_SUPPORTED_FILE_TYPES.includes(fileType) && uploadedFile) {
    yield put(actions.resourceFormSampleData.setRawData(resourceId, uploadedFile));
    if (fileType === 'json') {
      // update parse stage for json file type as import saves parsed json file as sampleData
      yield put(actions.resourceFormSampleData.setParseData(resourceId, processJsonSampleData(uploadedFile)));
    }
    if (fileType === 'xlsx') {
      // update csv stage for xlsx file type as import saves csv content as sampleData
      const csvFileContent = (yield call(getCsvFromXlsx, uploadedFile))?.result;

      yield put(actions.resourceFormSampleData.setCsvFileData(resourceId, csvFileContent));
    }
  } else {
    yield put(actions.resourceFormSampleData.clearStages(resourceId));
  }
  yield put(actions.resourceFormSampleData.setStatus(resourceId, 'received'));
}

// export function* _requestImportSampleData({ formKey }) {
//   // handle file related sample data for imports
//   // make file adaptor sample data calls
//   const { resourceObj } = yield call(_fetchResourceInfoFromFormKey, { formKey });

//   if (isFileAdaptor(resourceObj) || isAS2Resource(resourceObj)) {
//     yield call(_requestImportFileSampleData, { formKey });
//   }
// }

export function* requestResourceFormSampleData({ formKey, options = {} }) {
  if (!formKey) {
    return;
  }
  const { resourceType, resourceId } = yield call(_fetchResourceInfoFromFormKey, { formKey });

  if (!resourceId || !VALID_RESOURCE_TYPES_FOR_SAMPLE_DATA.includes(resourceType)) return;
  yield delay(500);

  yield put(actions.resourceFormSampleData.setStatus(resourceId, 'requested'));
  if (resourceType === 'exports') {
    const { refreshCache, executeProcessors } = options;

    yield call(_requestExportSampleData, { formKey, refreshCache, executeProcessors });
  }
  if (resourceType === 'imports') {
    yield call(_requestImportSampleData, { formKey });
  }
}

export default [
  takeLatest(actionTypes.RESOURCE_FORM_SAMPLE_DATA.REQUEST, requestResourceFormSampleData),
];

