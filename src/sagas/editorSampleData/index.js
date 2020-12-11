import { call, put, select, takeEvery } from 'redux-saga/effects';
import { requestSampleData } from '../sampleData/flows';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import { apiCallWithRetry } from '../index';
import { requestExportSampleData } from '../sampleData/exports';
import { constructResourceFromFormValues } from '../utils';
import { isNewId } from '../../utils/resource';

export function* requestEditorSampleData({
  flowId,
  resourceId,
  resourceType,
  stage = 'flowInput',
  fieldType,
  formKey,
  isEditorV2Supported,
  requestedTemplateVersion,
}) {
  const isPageGenerator = yield select(
    selectors.isPageGenerator,
    flowId,
    resourceId,
    resourceType
  );

  const {formSaveStatus} = yield select(
    selectors.resourceFormState,
    resourceType,
    resourceId
  );

  // we are ignoring editor sample data class when the form's save is in progress
  // TODO: sort of a hack for IO-19380 after Ashu's afe refactor
  // we can remove this check

  if (formSaveStatus === 'loading') {
    return;
  }
  const formState = yield select(selectors.formState, formKey);
  const formValues = formState?.value || {};

  const resource = yield call(constructResourceFromFormValues, {
    formValues,
    resourceId,
    resourceType,
  });
  let sampleData;

  if (isPageGenerator && isEditorV2Supported) {
    yield call(requestExportSampleData, { resourceId, resourceType, values: formValues });
    const parsedData = yield select(
      selectors.getResourceSampleDataWithStatus,
      resourceId,
      'parse'
    );

    sampleData = parsedData?.data;
  } else {
    const flowSampleData = yield select(selectors.getSampleDataContext, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });

    sampleData = flowSampleData?.data;
  }

  if (!sampleData && !isPageGenerator) {
    // sample data not present, trigger action to get sample data
    yield call(requestSampleData, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });
    // get sample data from the selector once loaded
    const flowSampleData = yield select(selectors.getSampleDataContext, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });

    sampleData = flowSampleData?.data;
  }

  if (!isEditorV2Supported) {
    const _sampleData = sampleData ? {
      data: sampleData,
    } : undefined;

    yield put(
      actions.editorSampleData.received({
        flowId,
        resourceId,
        fieldType,
        sampleData: _sampleData,
      })
    );
  } else {
    const body = {
      sampleData: sampleData || { myField: 'sample' },
      templateVersion: requestedTemplateVersion,
    };

    body[resourceType === 'imports' ? 'import' : 'export'] = resource;
    body.fieldPath = fieldType;

    const opts = {
      method: 'POST',
      body,
    };
    const path = '/processors/handleBar/getContext';

    try {
      const response = yield call(apiCallWithRetry, {
        path,
        opts,
        message: 'Loading',
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
          actions.editorSampleData.failed({
            resourceId,
            flowId,
            fieldType,
          })
        );
      }
    } catch (e) {
      // TODO: How do we show error in case getContext api fails with some response
      yield put(
        actions.editorSampleData.failed({
          resourceId,
          flowId,
          fieldType,
        })
      );
    }
  }
}

export function* clearEditorSampleData({ resourceType, id }) {
  const isNew = isNewId(id);

  if (!isNew) {
    if (['flows', 'imports', 'exports'].includes(resourceType)) {
      const options =
        resourceType === 'flows'
          ? { flowId: id }
          : {
            resourceId: id,
          };

      yield put(actions.editorSampleData.clear(options));
    }
  }
}

export default [
  takeEvery(actionTypes.EDITOR_SAMPLE_DATA.REQUEST, requestEditorSampleData),
  takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, clearEditorSampleData),
];
