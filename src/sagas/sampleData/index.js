import { put, takeEvery, select, call } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { resourceData, stagedResource, getSampleData } from '../../reducers';
import { apiCallWithRetry } from '../index';
import { createFormValuesPatchSet, SCOPES } from '../resourceForm';

export function* fetchSampleData({ resourceId, resourceType, values }) {
  const { patchSet } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values,
    scope: SCOPES.VALUE,
  });

  if (patchSet && patchSet.length > 0) {
    yield put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE));
  }

  const { patch } = yield select(stagedResource, resourceId, SCOPES.VALUE);

  if (patch && patch.length) {
    const { merged } = yield select(
      resourceData,
      resourceType,
      resourceId,
      SCOPES.VALUE
    );

    delete merged.transform;
    // make api preview and send resource as payload for that
    const path = `/${resourceType}/preview`;

    try {
      const previewData = yield call(apiCallWithRetry, {
        path,
        opts: { method: 'POST', body: merged },
        message: `Fetching ${resourceType} Preview`,
      });

      yield put(actions.exportData.received(resourceId, previewData));
      yield put(actions.resource.clearStaged(resourceId, SCOPES.VALUE));
    } catch (e) {
      yield put(actions.resource.clearStaged(resourceId, SCOPES.VALUE));
    }
  }
}

export function* updateSampleData({ resourceId, data }) {
  const sampleData = yield select(getSampleData, resourceId);
  const path = `/processors/${data.processor}`;
  const body = {
    data: (sampleData && sampleData.data) || [data.data],
    rules: { rules: data.rules },
    options: data.options || {},
  };
  const opts = {
    method: 'POST',
    body,
  };
  const results = yield call(apiCallWithRetry, { path, opts, hidden: true });

  // Push this stage to the corresponding resourceId's sampleData
  yield put(
    actions.exportData.updateStage(resourceId, data.processor, results)
  );
}

export const sampleDataSagas = [
  takeEvery(actionTypes.SAMPLEDATA.FETCH, fetchSampleData),
  takeEvery(actionTypes.SAMPLEDATA.UPDATE, updateSampleData),
];
