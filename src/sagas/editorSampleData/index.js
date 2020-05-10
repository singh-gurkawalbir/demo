import { call, put, select, takeEvery } from 'redux-saga/effects';
import { requestSampleData } from '../sampleData/flows';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import * as selectors from '../../reducers';
import { apiCallWithRetry } from '../index';
import { constructResourceFromFormValues } from '../sampleData';

export function* requestEditorSampleData({
  flowId,
  resourceId,
  resourceType,
  stage,
  fieldType,
  formValues,
  isV2NotSupported,
  requestedTemplateVersion,
}) {
  let flowSampleData = yield select(selectors.getSampleDataContext, {
    flowId,
    resourceId,
    resourceType,
    stage,
  });

  if (!flowSampleData || !flowSampleData.data) {
    // sample data not present.trigger action to get sample data
    yield call(requestSampleData, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    });
    // get sample data from the selector once loaded
    flowSampleData = yield select(selectors.getSampleDataContext, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });
  }

  let isEditorV2Supported;

  if (isV2NotSupported) {
    isEditorV2Supported = false;
  } else {
    isEditorV2Supported = yield select(
      selectors.isEditorV2Supported,
      resourceId,
      resourceType
    );
  }

  if (!isEditorV2Supported) {
    const _sampleData = {
      data: flowSampleData.data || {
        myField: 'sample',
      },
    };

    yield put(
      actions.editorSampleData.received({
        flowId,
        resourceId,
        fieldType,
        sampleData: _sampleData,
      })
    );

    // call diff action to render old sample data
  } else {
    const resource = yield call(constructResourceFromFormValues, {
      formValues,
      resourceId,
      resourceType,
    });
    const body = {
      sampleData: flowSampleData.data || { myField: 'sample' },
      templateVersion: requestedTemplateVersion,
    };

    body[resourceType === 'imports' ? 'import' : 'export'] = resource;

    body.fieldPath = fieldType;

    const opts = {
      method: 'POST',
      body,
    };
    const path = '/processors/handleBar/getContext';
    const response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: `Fetching editor sample data`,
      hidden: false,
    });

    if (response) {
      const { context, templateVersion } = response;

      yield put(
        actions.editorSampleData.received({
          flowId,
          resourceId,
          fieldType,
          sampleData: context,
          templateVersion,
        })
      );
    } else {
      yield put(
        actions.editorSampleData.receivedError({
          resourceId,
          flowId,
          fieldType,
        })
      );
    }
  }
}

export default [
  takeEvery(actionTypes.EDITOR_SAMPLE_DATA.REQUEST, requestEditorSampleData),
];
