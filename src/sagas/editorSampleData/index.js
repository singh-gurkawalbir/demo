import { call, put, select, takeEvery } from 'redux-saga/effects';
import { requestSampleData } from '../sampleData/flows';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import * as selectors from '../../reducers';
import { apiCallWithRetry } from '../index';
import { constructResourceFromFormValues, requestExportSampleData } from '../sampleData';
import { isNewId, isFileAdaptor, isAS2Resource } from '../../utils/resource';

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
  const isPageGenerator = yield select(
    selectors.isPageGenerator,
    flowId,
    resourceId,
    resourceType
  );
  const resource = yield call(constructResourceFromFormValues, {
    formValues,
    resourceId,
    resourceType,
  });
  let sampleData;

  if (isPageGenerator) {
    const isRestCsvMediaType = yield select(
      selectors.isRestCsvMediaTypeExport,
      resourceId
    );

    if (
      isFileAdaptor(resource) ||
      isAS2Resource(resource) ||
      isRestCsvMediaType
    ) {
      yield call(requestExportSampleData, { resourceId, resourceType, values: formValues })
      const parsedData = yield select(
        selectors.getResourceSampleDataWithStatus,
        resourceId,
        'preview'
      );
      if (parsedData && parsedData.data) {
        sampleData = parsedData.data;
      }
    }
  } else {
    const flowSampleData = yield select(selectors.getSampleDataContext, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });

    sampleData = flowSampleData && flowSampleData.data;
  }

  if (!sampleData && !isPageGenerator) {
    // sample data not present.trigger action to get sample data
    yield call(requestSampleData, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    });
    // get sample data from the selector once loaded
    const flowSampleData = yield select(selectors.getSampleDataContext, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });

    sampleData = flowSampleData && flowSampleData.data;
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
      data: sampleData || {
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
    const response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Fetching editor sample data',
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
