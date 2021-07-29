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

const FILE_UPLOAD_SUPPORTED_FILE_TYPES = ['csv', 'xlsx', 'json', 'xml'];

function* fetchResourceInfoFromFormKey({ formKey }) {
  const formState = yield select(selectors.formState, formKey);
  const parentContext = (yield select(selectors.formParentContext, formKey) || {});
  const resourceObj = (yield call(constructResourceFromFormValues, {
    formValues: formState?.value || [],
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
function* requestRealTimeSampleData({ formKey, refreshCache = true }) {
  const { resourceObj, resourceId } = yield call(fetchResourceInfoFromFormKey, { formKey });

  const realTimeSampleData = yield call(requestRealTimeMetadata, { resource: resourceObj, refresh: refreshCache });

  // TODO: should we morph this to array here or state handles it ?
  // Figure out once we start dealing with file related sample data
  yield put(actions.resourceFormSampleData.receivedParseData(resourceId, realTimeSampleData));
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

  const recordSize = yield select(selectors.getSampleDataRecordSize, resourceId);

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

function* requestFileSampleData({ formKey }) {
  // file related sample data is handled here
  const { resourceObj, resourceId } = yield call(fetchResourceInfoFromFormKey, { formKey });

  const fileType = resourceObj?.file?.type;

  if (!fileType) {
    return;
  }
  const recordSize = yield select(selectors.getSampleDataRecordSize, resourceId);
  const fileProps = resourceObj.file[fileType] || {};
  const fileId = `${resourceId}-uploadFile`;
  const uploadedFileObj = yield select(selectors.getUploadedFile, fileId);
  const { file: uploadedFile } = uploadedFileObj || {};
  const hasSampleData = yield call(_hasSampleDataOnResource, { formKey });

  if (FILE_UPLOAD_SUPPORTED_FILE_TYPES.includes(fileType) && uploadedFile) {
    // parse through the file and update state
    if (fileType === 'json') {
      yield put(actions.resourceFormSampleData.receivedRawData(resourceId, uploadedFile));
      const options = { resourcePath: fileProps.json && fileProps.json.resourcePath };
      const processedJsonData = processJsonPreviewData(uploadedFile, options);
      const parseData = processJsonSampleData(uploadedFile, options);

      yield put(actions.resourceFormSampleData.receivedParseData(resourceId, parseData));
      yield put(actions.resourceFormSampleData.receivedPreviewData(resourceId, previewFileData(processedJsonData, recordSize)));
    }
  } else if (hasSampleData) {
    // fetch from sample data and update state
    const { sampleData } = resourceObj;

    if (fileType === 'json') {
      yield put(actions.resourceFormSampleData.receivedRawData(resourceId, sampleData));
      const options = { resourcePath: fileProps.json && fileProps.json.resourcePath };
      const processedJsonData = processJsonPreviewData(sampleData, options);
      const parseData = processJsonSampleData(sampleData, options);

      yield put(actions.resourceFormSampleData.receivedParseData(resourceId, parseData));
      yield put(actions.resourceFormSampleData.receivedPreviewData(resourceId, previewFileData(processedJsonData, recordSize)));
    }
  } else {
    // no sample data - so update with undefined
    yield put(actions.resourceFormSampleData.receivedParseData(resourceId, undefined));
    yield put(actions.resourceFormSampleData.receivedRawData(resourceId, undefined));
  }
}

function* requestPGExportSampleData({ formKey }) {
  const { resourceObj, resourceId } = yield call(fetchResourceInfoFromFormKey, { formKey });
  const isRestCsvExport = yield select(selectors.isRestCsvMediaTypeExport, resourceId);

  if (isFileAdaptor(resourceObj) || isAS2Resource(resourceObj) || isRestCsvExport) {
    return yield call(requestFileSampleData, { formKey });
  }
  if (isRealTimeOrDistributedResource(resourceObj)) {
    return yield call(requestRealTimeSampleData, { formKey });
  }
  yield call(requestExportPreviewData, { formKey });
}

function* requestLookupSampleData({ formKey }) {
  const { resourceId, resourceObj, flowId } = yield call(fetchResourceInfoFromFormKey, { formKey });
  const resourceType = 'exports';
  const recordSize = yield select(selectors.getSampleDataRecordSize, resourceId);
  // exclude sampleData property if exists on pageProcessor Doc
  // as preview call considers sampleData to show instead of fetching
  const { transform, filter, hooks, sampleData, ...constructedResourceObj } = resourceObj;

  // TODO: handle file related sample data for lookups
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
      refresh: true, // TODO: revisit to pass from options r not
    });

    yield put(
      actions.resourceFormSampleData.receivedPreviewStages(resourceId, pageProcessorPreviewData)
    );
  } catch (e) {
    yield call(handlePreviewError, { e, resourceId });
  }
}

function* requestExportSampleData({ formKey }) {
  const { resourceId, flowId } = yield call(fetchResourceInfoFromFormKey, { formKey });

  if (!resourceId) return;

  const isPageGenerator = !flowId || (yield select(selectors.isPageGenerator, flowId, resourceId));

  if (isPageGenerator) {
    yield call(requestPGExportSampleData, { formKey });
  } else {
    yield call(requestLookupSampleData, { formKey });
  }
}

function* requestImportSampleData({ formKey }) {
  // handle file related sample data for imports
}

function* requestResourceFormSampleData({ formKey }) {
  const { resourceType, resourceId } = yield call(fetchResourceInfoFromFormKey, { formKey });

  yield put(actions.resourceFormSampleData.requested(resourceId));
  if (resourceType === 'exports') {
    yield call(requestExportSampleData, { formKey });
  } else {
    // import stuff
    yield call(requestImportSampleData, { formKey });
  }
}

export default [
  takeLatest(actionTypes.RESOURCE_FORM_SAMPLE_DATA.REQUEST, requestResourceFormSampleData),
];

