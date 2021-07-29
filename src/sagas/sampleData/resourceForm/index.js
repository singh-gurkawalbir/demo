import { select, takeLatest, call, put } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { apiCallWithRetry } from '../../index';
import { DEFAULT_RECORD_SIZE } from '../../../utils/exportPanel';
import { constructResourceFromFormValues } from '../../utils';
import { pageProcessorPreview } from '../utils/previewCalls';
import requestRealTimeMetadata from '../sampleDataGenerator/realTimeSampleData';
import {
  isRealTimeOrDistributedResource,
  isFileAdaptor,
  isAS2Resource,
} from '../../../utils/resource';
import { getFormattedResourceForPreview } from '../../../utils/flowData';

function* fetchResourceInfoFromFormKey({ formKey }) {
  const formState = yield select(selectors.formState, formKey);
  const parentContext = (yield select(selectors.formParentContext, formKey) || {});
  const resourceObj = (yield call(constructResourceFromFormValues, {
    formValues: formState?.value || [],
    resourceId: parentContext.resourceObj,
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

function* requestFileSampleData({ formKey }) {
  // file related sample data is handled here
  console.log('entered file sample data ', formKey);
  yield 5;
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
  const recordSize = yield select(selectors.getSampleDataRecordSize, resourceId) || DEFAULT_RECORD_SIZE;
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

