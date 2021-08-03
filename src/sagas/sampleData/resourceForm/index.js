import { select, takeLatest, call, put } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { apiCallWithRetry } from '../../index';
import { constructResourceFromFormValues } from '../../utils';
import { pageProcessorPreview } from '../utils/previewCalls';
import requestRealTimeMetadata from '../sampleDataGenerator/realTimeSampleData';
import {
  isRealTimeOrDistributedResource,
  isFileAdaptor,
  isAS2Resource,
} from '../../../utils/resource';
import { getFormattedResourceForPreview } from '../../../utils/flowData';
import { previewFileData } from '../../../utils/exportPanel';
import { processJsonSampleData, processJsonPreviewData } from '../../../utils/sampleData';
import { generateFileParserOptionsFromResource } from '../utils/fileParserUtils';
import { evaluateExternalProcessor } from '../../editor';
import { getCsvFromXlsx } from '../../../utils/file';
import { safeParse } from '../../../utils/string';

const EXPORT_FILE_UPLOAD_SUPPORTED_FILE_TYPES = ['csv', 'xlsx', 'json', 'xml'];
const IMPORT_FILE_UPLOAD_SUPPORTED_FILE_TYPES = ['csv', 'xlsx', 'json'];
const FILE_DEFINITION_TYPES = ['filedefinition', 'fixed', 'delimited/edifact'];
/*
 * Parsers for different file types used for converting into JSON format
 * For XLSX Files , this saga receives converted csv content as input
 * so it uses same csv parser
 */
const PARSERS = {
  csv: 'csvParser',
  xlsx: 'csvParser',
  xml: 'xmlParser',
  fileDefinitionParser: 'structuredFileParser',
  fileDefinitionGenerator: 'structuredFileGenerator',
};

export function extractResourcePath(value, initialResourcePath) {
  if (value) {
    const jsonValue = safeParse(value) || {};

    return jsonValue.resourcePath;
  }

  return initialResourcePath;
}

function* clearResourceSampleDataStages({ resourceId }) {
  yield put(actions.resourceFormSampleData.clearStages(resourceId));
  yield put(actions.resourceFormSampleData.setStatus(resourceId, 'received'));
}

export function* _getProcessorOutput({ processorData }) {
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

function* fetchResourceInfoFromFormKey({ formKey }) {
  const formState = yield select(selectors.formState, formKey);
  const parentContext = (yield select(selectors.formParentContext, formKey) || {});
  const resourceObj = (yield call(constructResourceFromFormValues, {
    formValues: formState?.value || {},
    resourceId: parentContext.resourceId,
    resourceType: parentContext.resourceType,
  })) || {};

  return {
    formState,
    ...parentContext,
    resourceObj,
  };
}

function* handlePreviewError({ e, resourceId }) {
// Handling Errors with status code between 400 and 500
  if (e.status === 403 || e.status === 401) {
    return;
  }

  if (e.status >= 400 && e.status < 500) {
    const parsedError = JSON.parse(e.message);

    return yield put(
      actions.resourceFormSampleData.receivedPreviewError(resourceId, parsedError)
    );
  }
}
function* requestRealTimeSampleData({ formKey, refreshCache = false }) {
  const { resourceObj, resourceId } = yield call(fetchResourceInfoFromFormKey, { formKey });

  const realTimeSampleData = yield call(requestRealTimeMetadata, { resource: resourceObj, refresh: refreshCache });

  yield put(actions.resourceFormSampleData.setParseData(resourceId, realTimeSampleData));
}

function* requestExportPreviewData({ formKey }) {
  const { resourceObj, resourceId, flowId, integrationId } = yield call(fetchResourceInfoFromFormKey, { formKey });

  // 'getFormattedResourceForPreview' util removes unnecessary props of resource that should not be sent in preview calls
  const body = getFormattedResourceForPreview(resourceObj);
  // BE need flowId and integrationId in the preview call
  // if in case integration settings were used in export
  const flow = yield select(selectors.resource, 'flows', flowId);

  // while working with newly created flows, flowId could be temporary UI generated. Rely on flow._id as flowId while making page processor preview call.
  // refer IO-21519
  body._flowId = flow?._id;
  body._integrationId = integrationId;

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
    yield call(handlePreviewError, { e, resourceId });
  }
}

/**
 * Checks if the constructed body from formValues has same file type as saved resource
 * and if body has sampleData
 */
export function* _hasSampleDataOnResource({ formKey }) {
  const { resourceObj, resourceId, resourceType } = yield call(fetchResourceInfoFromFormKey, { formKey });
  const resource = yield select(selectors.resource, resourceType, resourceId);

  if (!resource || !resourceObj?.sampleData) return false;
  const resourceFileType = resource?.file?.type;
  const bodyFileType = resourceObj?.file?.type;

  if (
    ['filedefinition', 'fixed', 'delimited/edifact'].includes(bodyFileType) &&
      resourceFileType === 'filedefinition'
  ) {
    return true;
  }

  return bodyFileType === resourceFileType;
}

function* parseFileData({ resourceId, fileContent, fileProps = {}, fileType, parserOptions, isNewSampleData = false }) {
  const recordSize = yield select(selectors.sampleDataRecordSize, resourceId);

  if (isNewSampleData) {
    yield put(actions.resourceFormSampleData.setRawData(resourceId, fileContent));
  }
  switch (fileType) {
    case 'json': {
      const processedJsonData = processJsonPreviewData(fileContent, fileProps);
      const parseData = processJsonSampleData(fileContent, fileProps);

      yield put(actions.resourceFormSampleData.setParseData(resourceId, parseData));
      yield put(actions.resourceFormSampleData.setPreviewData(resourceId, previewFileData(processedJsonData, recordSize)));
      break;
    }
    case 'csv': {
      const processorData = {
        rule: parserOptions,
        data: fileContent,
        editorType: PARSERS.csv,
      };
      const processorOutput = yield call(_getProcessorOutput, { processorData });

      if (processorOutput?.data) {
        const previewData = processorOutput.data.data;

        yield put(actions.resourceFormSampleData.setParseData(resourceId, processJsonSampleData(previewData)));
        yield put(actions.resourceFormSampleData.setPreviewData(resourceId, previewFileData(previewData, recordSize)));
      }
      if (processorOutput?.error) {
        return yield put(
          actions.resourceFormSampleData.receivedError(resourceId, processorOutput.error)
        );
      }
      break;
    }
    case 'xml': {
      const processorData = {
        rule: parserOptions,
        data: fileContent,
        editorType: PARSERS.xml,
      };
      const processorOutput = yield call(_getProcessorOutput, { processorData });

      if (processorOutput?.data) {
        const previewData = processorOutput.data.data;

        yield put(actions.resourceFormSampleData.setParseData(resourceId, processJsonSampleData(previewData)));
        yield put(actions.resourceFormSampleData.setPreviewData(resourceId, previewFileData(previewData, recordSize)));
      }
      if (processorOutput?.error) {
        return yield put(
          actions.resourceFormSampleData.receivedError(resourceId, processorOutput.error)
        );
      }
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
      if (processorOutput?.data) {
        const previewData = processorOutput.data.data;

        yield put(actions.resourceFormSampleData.setParseData(resourceId, processJsonSampleData(previewData)));
        yield put(actions.resourceFormSampleData.setPreviewData(resourceId, previewFileData(previewData, recordSize)));
      }
      if (processorOutput?.error) {
        // TODO: review this part
        return yield put(
          actions.resourceFormSampleData.receivedError(resourceId, processorOutput.error)
        );
      }
      break;
    }
    case 'fileDefinitionParser': {
      const processorData = {
        rule: parserOptions,
        data: fileContent,
        editorType: PARSERS.fileDefinitionParser,
      };

      const processorOutput = yield call(_getProcessorOutput, { processorData });

      yield put(actions.resourceFormSampleData.setRawData(resourceId, fileContent));
      if (processorOutput?.data) {
        const previewData = processorOutput.data.data;

        yield put(actions.resourceFormSampleData.setParseData(resourceId, processJsonSampleData(previewData)));
        yield put(actions.resourceFormSampleData.setPreviewData(resourceId, previewFileData(previewData, recordSize)));
      }
      if (processorOutput?.error) {
        return yield put(
          actions.resourceFormSampleData.receivedError(resourceId, processorOutput.error)
        );
      }
      break;
    }
    default:
  }
  yield put(actions.resourceFormSampleData.setStatus(resourceId, 'received'));
}

function* requestFileSampleData({ formKey }) {
  // file related sample data is handled here
  const { resourceObj, resourceId } = yield call(fetchResourceInfoFromFormKey, { formKey });

  const fileType = resourceObj?.file?.type;

  if (!fileType) {
    return yield call(clearResourceSampleDataStages, { resourceId });
  }

  const fileProps = resourceObj.file[fileType] || {};
  const fileId = `${resourceId}-uploadFile`;
  const uploadedFileObj = yield select(selectors.getUploadedFile, fileId);
  const { file: uploadedFile } = uploadedFileObj || {};
  const hasSampleData = yield call(_hasSampleDataOnResource, { formKey });
  const parserOptions = generateFileParserOptionsFromResource(resourceObj);

  if (FILE_DEFINITION_TYPES.includes(fileType)) {
    const fieldState = yield select(selectors.fieldState, formKey, 'file.filedefinition.rules');
    const {userDefinitionId, fileDefinitionResourcePath, value: fieldValue, options: fieldOptions} = fieldState;
    const { format, definitionId } = fieldOptions || {};
    const resourcePath = extractResourcePath(fieldValue, fileDefinitionResourcePath);

    const fileDefinitionData = yield select(selectors.fileDefinitionSampleData, {
      userDefinitionId,
      resourceType: 'exports',
      options: { format, definitionId, resourcePath },
    });

    yield call(parseFileData, {
      resourceId,
      fileContent: fileDefinitionData?.sampleData || resourceObj.sampleData,
      parserOptions: fieldValue || fileDefinitionData?.rule,
      fileType: 'fileDefinitionParser',
    });
  } else if (EXPORT_FILE_UPLOAD_SUPPORTED_FILE_TYPES.includes(fileType) && uploadedFile) {
    // parse through the file and update state
    yield call(parseFileData, { resourceId, fileContent: uploadedFile, fileType, fileProps, parserOptions, isNewSampleData: true});
  } else if (hasSampleData) {
    // fetch from sample data and update state
    yield call(parseFileData, { resourceId, fileContent: resourceObj.sampleData, fileProps, fileType, parserOptions});
  } else {
    // no sample data - so clear sample data from state
    yield call(clearResourceSampleDataStages, { resourceId });
  }
}

function* requestPGExportSampleData({ formKey, refreshCache }) {
  const { resourceObj, resourceId } = yield call(fetchResourceInfoFromFormKey, { formKey });
  const isRestCsvExport = yield select(selectors.isRestCsvMediaTypeExport, resourceId);

  if (isFileAdaptor(resourceObj) || isAS2Resource(resourceObj) || isRestCsvExport) {
    return yield call(requestFileSampleData, { formKey });
  }
  if (isRealTimeOrDistributedResource(resourceObj)) {
    return yield call(requestRealTimeSampleData, { formKey, refreshCache });
  }
  yield call(requestExportPreviewData, { formKey });
}

function* requestLookupSampleData({ formKey, refreshCache }) {
  const { resourceId, resourceObj, flowId } = yield call(fetchResourceInfoFromFormKey, { formKey });
  const isRestCsvExport = yield select(selectors.isRestCsvMediaTypeExport, resourceId);

  // make file adaptor sample data calls
  if (isFileAdaptor(resourceObj) || isAS2Resource(resourceObj) || isRestCsvExport) {
    return yield call(requestFileSampleData, { formKey });
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
      refresh: refreshCache,
    });

    yield put(
      actions.resourceFormSampleData.receivedPreviewStages(resourceId, pageProcessorPreviewData)
    );
  } catch (e) {
    yield call(handlePreviewError, { e, resourceId });
  }
}

function* requestExportSampleData({ formKey, refreshCache }) {
  const { resourceId, flowId } = yield call(fetchResourceInfoFromFormKey, { formKey });
  const isPageGenerator = !flowId || (yield select(selectors.isPageGenerator, flowId, resourceId));
  const isStandaloneExport = yield select(selectors.isStandaloneExport, flowId, resourceId);

  // need to handle standalone export as isPageGenerator returns false but still it needs export sample data
  // ref: IO-21691
  if (isPageGenerator || isStandaloneExport) {
    yield call(requestPGExportSampleData, { formKey, refreshCache });
  } else {
    yield call(requestLookupSampleData, { formKey, refreshCache });
  }
}

function* requestImportFileSampleData({ formKey }) {
  // file related sample data is handled here
  const { resourceObj, resourceId } = yield call(fetchResourceInfoFromFormKey, { formKey });

  const fileType = resourceObj?.file?.type;

  if (!fileType) {
    return yield call(clearResourceSampleDataStages, { resourceId });
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
    yield call(clearResourceSampleDataStages, { resourceId });
  }
  yield put(actions.resourceFormSampleData.setStatus(resourceId, 'received'));
}

function* requestImportSampleData({ formKey }) {
  // handle file related sample data for imports
  // make file adaptor sample data calls
  const { resourceObj } = yield call(fetchResourceInfoFromFormKey, { formKey });

  if (isFileAdaptor(resourceObj) || isAS2Resource(resourceObj)) {
    yield call(requestImportFileSampleData, { formKey });
  }
}

export function* requestResourceFormSampleData({ formKey, options = {} }) {
  if (!formKey) {
    return;
  }
  const { resourceType, resourceId } = yield call(fetchResourceInfoFromFormKey, { formKey });

  if (!resourceId) return;

  yield put(actions.resourceFormSampleData.setStatus(resourceId, 'requested'));
  if (resourceType === 'exports') {
    const { refreshCache } = options;

    yield call(requestExportSampleData, { formKey, refreshCache });
  }
  if (resourceType === 'imports') {
    yield call(requestImportSampleData, { formKey });
  }
}

export default [
  takeLatest(actionTypes.RESOURCE_FORM_SAMPLE_DATA.REQUEST, requestResourceFormSampleData),
];

