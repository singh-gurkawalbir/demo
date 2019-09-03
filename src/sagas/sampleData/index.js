/*
 * After ftp related processor functions we must include transform to json
 * Doubt: What data to be shown on first load - make a preview call on load of export form? or make a preview call on first load of rawData field
 * Handle errors in transform/preview/parsers
 */

import { takeLatest, put, select, call } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { resourceData, getResourceSampleDataWithStatus } from '../../reducers';
import { createFormValuesPatchSet, SCOPES } from '../resourceForm';

function* getPreviewData(resourceId, resourceType, values) {
  const { patchSet } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values,
    scope: SCOPES.VALUE,
  });
  const { merged } = yield select(
    resourceData,
    resourceType,
    resourceId,
    SCOPES.VALUE
  );
  const patchResult = jsonPatch.applyPatch(
    merged ? jsonPatch.deepClone(merged) : {},
    jsonPatch.deepClone(patchSet)
  );
  const body = patchResult.newDocument;

  // Removing rawData field as it is not being handled form backend
  delete body.rawData;
  body.verbose = true;
  const path = `/${resourceType}/preview`;

  try {
    const previewData = yield call(apiCallWithRetry, {
      path,
      opts: { method: 'POST', body },
      message: `Fetching ${resourceType} Preview`,
    });

    yield put(actions.sampleData.received(resourceId, previewData));
  } catch (e) {
    return undefined;
  }
}

function* getProcessorData(resourceId, resourceType, values, stage) {
  const path = `/processors/${stage}`;
  // Get Pre Processed data from State
  const { data: preProcessedData } = yield select(
    getResourceSampleDataWithStatus,
    resourceId,
    stage
  );
  const body = {
    data: [preProcessedData],
    rules: { rules: values },
    options: {},
  };
  const opts = {
    method: 'POST',
    body,
  };
  const processedData = yield call(apiCallWithRetry, {
    path,
    opts,
  });

  yield put(actions.sampleData.update(resourceId, processedData, stage));
}

function* requestSampleData({ resourceId, resourceType, values, stage }) {
  // Call preview/processor based on stage
  // If stage is specified make a processor call else preview
  // Takes a different route for File processors
  if (stage) {
    if (stage === 'file') {
      // console.log('test', values, stage);
    } else {
      yield getProcessorData(resourceId, resourceType, values, stage);
    }
  } else {
    yield getPreviewData(resourceId, resourceType, values);
  }
}

export default [takeLatest(actionTypes.SAMPLEDATA.REQUEST, requestSampleData)];
