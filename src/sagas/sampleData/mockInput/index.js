import { select, takeLatest, call, put } from 'redux-saga/effects';
import { deepClone } from 'fast-json-patch';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { pageProcessorPreview } from '../utils/previewCalls';
import {
  VALID_RESOURCE_TYPES_FOR_SAMPLE_DATA,
} from '../resourceForm/utils';
import { safeParse } from '../../../utils/string';
import { getConstructedResourceObj } from '../flows/utils';
import { isOneToManyResource } from '../../../utils/flowData';
import { processOneToManySampleData } from '../../../utils/sampleData';

export function* _handlePreviewError({ e, resourceId }) {
  if (!resourceId || !e) {
    return;
  }
  if (e.status >= 400 && e.status < 500) {
    const parsedError = safeParse(e.message);

    return yield put(
      actions.mockInput.receivedError(resourceId, parsedError)
    );
  }
}

export function* _requestLookupMockInput({ resourceId, resourceType, flowId, refresh = false }) {
  const { formKey } = (yield select(selectors.getFlowDataState, flowId)) || {};

  const { transform, filter, mockOutput, hooks, sampleData, ..._pageProcessorDoc } = yield call(getConstructedResourceObj, {
    resourceId,
    resourceType,
    formKey,
  }) || {};

  try {
    let pageProcessorPreviewData = yield call(pageProcessorPreview, {
      flowId,
      _pageProcessorId: resourceId,
      resourceType,
      hidden: true,
      previewType: 'flowInput',
      _pageProcessorDoc,
      throwOnError: true,
      includeStages: false,
      refresh,
      includeFilterProcessing: true,
    });

    if (isOneToManyResource(_pageProcessorDoc)) {
      pageProcessorPreviewData = processOneToManySampleData(deepClone(pageProcessorPreviewData), _pageProcessorDoc);
    }

    yield put(
      actions.mockInput.received(resourceId, pageProcessorPreviewData)
    );
  } catch (e) {
    yield call(_handlePreviewError, { e, resourceId });
  }
}

export function* _requestImportMockInput({ resourceId, resourceType, flowId, refresh = false }) {
  const { formKey } = (yield select(selectors.getFlowDataState, flowId)) || {};

  const { sampleData, mockResponse, ..._pageProcessorDoc } = yield call(getConstructedResourceObj, {
    resourceId,
    resourceType,
    formKey,
  }) || {};

  try {
    let pageProcessorPreviewData = yield call(pageProcessorPreview, {
      flowId,
      _pageProcessorId: resourceId,
      resourceType,
      hidden: true,
      _pageProcessorDoc,
      throwOnError: true,
      includeStages: false,
      refresh,
      includeFilterProcessing: true,
    });

    if (isOneToManyResource(_pageProcessorDoc)) {
      pageProcessorPreviewData = processOneToManySampleData(deepClone(pageProcessorPreviewData), _pageProcessorDoc);
    }

    yield put(
      actions.mockInput.received(resourceId, pageProcessorPreviewData)
    );
  } catch (e) {
    yield call(_handlePreviewError, { e, resourceId });
  }
}

export function* requestMockInput({ resourceId, resourceType, flowId, options = {} }) {
  if (!resourceId || !resourceType || !VALID_RESOURCE_TYPES_FOR_SAMPLE_DATA.includes(resourceType)) return;

  const isLookUpExport = yield select(selectors.isLookUpExport, { flowId, resourceId, resourceType: 'exports' });

  const { refreshCache: refresh } = options;

  if (isLookUpExport) {
    yield call(_requestLookupMockInput, { resourceId, resourceType, flowId, refresh });
  }
  if (resourceType === 'imports') {
    yield call(_requestImportMockInput, { resourceId, resourceType, flowId, refresh });
  }
}

export default [
  takeLatest(actionTypes.MOCK_INPUT.REQUEST, requestMockInput),
];

