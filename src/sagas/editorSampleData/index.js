import { call, put, select, takeLatest } from 'redux-saga/effects';
import { deepClone } from 'fast-json-patch/lib/core';
import { requestSampleData } from '../sampleData/flows';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import * as selectors from '../../reducers';
import { apiCallWithRetry } from '../index';

export function* requestEditorSampleData({
  flowId,
  resourceId,
  resourceType,
  stage,
  fieldType,
  requestedEditorVersion,
}) {
  const resource = yield select(selectors.resource, resourceType, resourceId);
  const path = '/processors/handleBar/getContext';
  let flowSampleData = yield select(selectors.getSampleDataContext, {
    flowId,
    resourceId,
    resourceType,
    stage,
  }).data;

  if (!flowSampleData) {
    // sample data not present.
    // trigger action to get sample data
    yield call(requestSampleData, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
      isInitialized: true,
    });
    // get sample data from the selector once loaded
    flowSampleData = yield select(selectors.getSampleDataContext, {
      flowId,
      resourceId,
      resourceType,
      stage,
    }).data;
  }

  if (!resource) {
    yield put(
      actions.editorSampleData.failed({
        resourceId,
        flowId,
        fieldType,
      })
    );

    return;
  }

  const body = {
    sampleData: flowSampleData || { myField: 'sample' },
  };
  const _resource = deepClone(resource);

  if (requestedEditorVersion)
    _resource.fieldEditorVersion = requestedEditorVersion;
  body[resourceType === 'imports' ? 'import' : 'export'] = _resource;

  body.fieldPath = fieldType;

  const opts = {
    method: 'POST',
    body,
  };
  const response = yield call(apiCallWithRetry, {
    path,
    opts,
    // hidden: true,
  });

  if (response) {
    const { context, fieldEditorVersion } = response;

    yield put(
      actions.editorSampleData.received({
        flowId,
        resourceId,
        fieldType,
        sampleData: context,
        fieldEditorVersion,
      })
    );
  } else {
    yield put(
      actions.editorSampleData.failed({
        resourceId,
        flowId,
        fieldType,
      })
    );
  }
}

export default [
  takeLatest(actionTypes.EDITOR_SAMPLE_DATA.REQUEST, requestEditorSampleData),
];
