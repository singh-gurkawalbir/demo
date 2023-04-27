import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import { apiCallWithRetry } from '../index';
import { openOAuthWindowForConnection } from '../resourceForm/connections/index';
import { isOauth } from '../../utils/resource';
import { isJsonString } from '../../utils/string';
import { refreshConnectionMetadata } from '../resources/meta';
import { INSTALL_STEP_TYPES } from '../../constants';
import openExternalUrl from '../../utils/window';
import customCloneDeep from '../../utils/customCloneDeep';

export function* changeEdition({ integrationId }) {
  yield put(actions.integrationApp.upgrade.setStatus(integrationId, { status: 'inProgress' }));
  const path = `/integrations/${integrationId}/changeEdition`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: { body: {}, method: 'POST' },
      message: 'Requesting for change edition',
    }) || {};
  } catch (error) {
    yield put(actions.integrationApp.upgrade.setStatus(integrationId, {
      status: 'error',
      errMessage: error.message,
    }));

    return;
  }
  yield put(actions.resource.request('integrations', integrationId));
  yield put(actions.integrationApp.upgrade.getSteps(integrationId));
}
export function* getSteps({ integrationId }) {
  yield put(actions.integrationApp.upgrade.setStatus(integrationId, { status: 'inProgress' }));
  const path = `/integrations/${integrationId}/changeEditionSteps`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: { method: 'GET' },
      message: 'Requesting edition steps',
    }) || {};
  } catch (error) {
    yield put(actions.integrationApp.upgrade.setStatus(integrationId, {
      status: 'error',
      errMessage: error.message,
    }));

    return;
  }

  if (!response.showWizard) {
    yield put(actions.integrationApp.upgrade.postChangeEditonSteps(integrationId));
  }

  const obj = {
    steps: response.steps,
    showWizard: response.showWizard,
    status: 'hold',
  };

  yield put(actions.integrationApp.upgrade.setStatus(integrationId, obj));
}
export function* postChangeEditionSteps({ integrationId }) {
  const path = `/integrations/${integrationId}/changeEditionSteps`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: { body: {}, method: 'POST' },
      message: 'Posting edition steps',
    }) || {};
  } catch (error) {
    yield put(actions.integrationApp.upgrade.setStatus(integrationId, {
      status: 'error',
      errMessage: error.message,
    }));

    return;
  }
  if (response?.done === true) {
    yield put(actions.integrationApp.upgrade.setStatus(integrationId, { status: 'done' }));
    yield put(actions.resource.request('integrations', integrationId));
    yield put(actions.resource.requestCollection('flows', null, true, integrationId));
    yield put(actions.resource.requestCollection('exports', null, true, integrationId));
    yield put(actions.resource.requestCollection('imports', null, true, integrationId));
    yield put(actions.resource.requestCollection('connections', null, true, integrationId));
    yield put(actions.resource.requestCollection('asynchelpers', null, true, integrationId));
    yield put(actions.resource.requestCollection('licenses'));
  } else {
    const obj = {
      steps: response,
    };

    yield put(actions.integrationApp.upgrade.setStatus(integrationId, obj));
  }
}

function* refreshIntegrationConnectionsMetadata({ integrationId }) {
  const changeEditionSteps = yield select(selectors.integrationChangeEditionSteps, integrationId);
  const connections = changeEditionSteps
    .filter(step => step.type === 'connection' && ['netsuite', 'salesforce'].includes(step.sourceConnection?.type) && step._connectionId)
    .map(step => ({ type: step.sourceConnection?.type, _id: step._connectionId }));

  yield call(refreshConnectionMetadata, { connections });
}

export function* upgradeInstallScriptStep({
  id,
  connectionId,
  connectionDoc,
  formSubmission,
  stackId,
}) {
  const path = `/integrations/${id}/changeEditionSteps`;
  let stepCompleteResponse;
  // connectionDoc will be included only in IA2.0 only. UI needs to send a complete connection doc to backend to
  // create a connection If step doesn't contain a connection Id.
  let body = {};

  if (stackId) {
    body = { _stackId: stackId };
  } else {
    body = formSubmission ||
    (connectionId
      ? { _connectionId: connectionId }
      : { connection: connectionDoc });
  }

  try {
    stepCompleteResponse = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: {
        body,
        method: 'POST',
      },
      hidden: true,
    }) || {};
  } catch (error) {
    const parsedError = isJsonString(error.message)
      ? JSON.parse(error.message)
      : error.message;

    if (parsedError?.steps) {
      // BE can return updated steps in case of errors also, eg
      // connectionId got updated in the installSteps but IA installer threw some error
      yield put(
        actions.integrationApp.upgrade.installer.completedStepInstall(
          { stepsToUpdate: parsedError.steps },
          id
        )
      );
      if (connectionId || !isEmpty(connectionDoc)) {
        yield put(actions.resource.requestCollection('connections'));
      }
    }
    yield put(actions.integrationApp.upgrade.installer.updateStep(id, '', 'failed'));

    return yield put(actions.api.failure(path, 'PUT', error.message, false));
  }

  if (!stepCompleteResponse || stepCompleteResponse.warnings) {
    // refresh NS/SF connection's metadata once the integration changeEdition steps are completed
    yield call(refreshIntegrationConnectionsMetadata, { integrationId: id });
    // to clear session state
    yield put(
      actions.integrationApp.upgrade.installer.completedStepInstall(
        { stepsToUpdate: [] },
        id
      )
    );

    return yield put(actions.resource.request('integrations', id));
  }

  if (stepCompleteResponse?.done) {
    const status = yield select(selectors.getStatus, id);
    const steps = customCloneDeep(status?.steps);

    if (steps.length) {
      let lastStep = steps.length ? steps[steps.length - 1] : {};

      lastStep = {...lastStep, completed: true};
      steps[steps.length - 1] = lastStep;
    }
    yield put(actions.integrationApp.upgrade.setStatus(id, { status: 'done', steps }));
    yield put(actions.resource.request('integrations', id));
    yield put(actions.resource.requestCollection('flows', null, true, id));
    yield put(actions.resource.requestCollection('exports', null, true, id));
    yield put(actions.resource.requestCollection('imports', null, true, id));
    yield put(actions.resource.requestCollection('connections', null, true, id));
    yield put(actions.resource.requestCollection('asynchelpers', null, true, id));
    yield put(actions.resource.requestCollection('licenses'));

    return;
  // eslint-disable-next-line no-else-return
  } else {
    yield put(actions.integrationApp.upgrade.setStatus(id, {steps: stepCompleteResponse}));
  }

  const filteredConnectionSteps =
    stepCompleteResponse &&
    Array.isArray(stepCompleteResponse) &&
    stepCompleteResponse.filter(
      temp => temp._connectionId
    );

  // we need to find the currentConnectionStep
  const currentConnectionStep = filteredConnectionSteps?.length && filteredConnectionSteps[filteredConnectionSteps.length - 1];

  if (!isEmpty(connectionDoc) && currentConnectionStep?._connectionId) {
    yield put(actions.resource.request('connections', currentConnectionStep?._connectionId));
  }

  if (currentConnectionStep && isOauth(connectionDoc)) {
    yield put(actions.integrationApp.upgrade.installer.setOauthConnectionMode(currentConnectionStep._connectionId, true, id));
    try {
      yield call(
        openOAuthWindowForConnection,
        currentConnectionStep._connectionId
      );
    } catch (e) {
      // could not close the window
    }
  }

  yield put(
    actions.integrationApp.upgrade.installer.completedStepInstall(
      { stepsToUpdate: stepCompleteResponse },
      id
    )
  );
}

export function* upgradeVerifyBundleOrPackageInstall({
  id,
  connectionId,
  installerFunction,
  isFrameWork2,
  variant,
}) {
  const path = variant ? `/connections/${connectionId}/distributed?type=${variant}` : `/connections/${connectionId}/distributed`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: variant ? `Verifying ${variant} Installation...` : 'Verifying Bundle/Package Installation...',
    });
  } catch (error) {
    return yield put(
      actions.integrationApp.upgrade.installer.updateStep(
        id,
        '',
        'failed'
      )
    );
  }

  if (response?.success) {
    if (isFrameWork2) {
      yield put(
        actions.integrationApp.upgrade.installer.scriptInstallStep(id)
      );
    }
  } else if (
    response &&
      !response.success &&
      (response.resBody || response.message)
  ) {
    yield put(
      actions.integrationApp.upgrade.installer.updateStep(
        id,
        installerFunction,
        'failed'
      )
    );
    yield put(
      actions.api.failure(
        path,
        'GET',
        response.resBody || response.message,
        false
      )
    );
  }
}

// for certain type of steps ('form'/'url' for now), in order to display the step for the user,
// we need to invoke get /currentStep route to get the form metadata or url
export function* upgradeGetCurrentStep({ id, step }) {
  const { type, form, initFormFunction, getUrlFunction } = step;

  //  currently only handling 'form' and 'url' type step
  if (type !== INSTALL_STEP_TYPES.FORM && type !== INSTALL_STEP_TYPES.URL) {
    return;
  }

  if (type === INSTALL_STEP_TYPES.FORM && !initFormFunction) {
    // update form meta in the session state
    return yield put(
      actions.integrationApp.upgrade.installer.updateStep(id, '', 'inProgress', form)
    );
  }
  if (type === INSTALL_STEP_TYPES.URL && !getUrlFunction) {
    // fail the step if no url or function available
    return yield put(actions.integrationApp.upgrade.installer.updateStep(id, '', 'failed'));
  }

  const path = `/integrations/${id}/currentStep`;
  let currentStepResponse;

  try {
    currentStepResponse = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: {
        method: 'GET',
      },
      hidden: true,
    });
  } catch (error) {
    yield put(actions.integrationApp.upgrade.installer.updateStep(id, '', 'failed'));

    return yield put(actions.api.failure(path, 'PUT', error.message, false));
  }

  const result = currentStepResponse?.result;

  if (type === INSTALL_STEP_TYPES.URL) {
    if (!result) {
      return yield put(actions.integrationApp.upgrade.installer.updateStep(id, '', 'failed'));
    }

    yield call(openExternalUrl, { url: result });

    return yield put(
      actions.integrationApp.upgrade.installer.updateStep(
        id,
        '',
        'inProgress',
        undefined,
        result
      )
    );
  }
  if (!result) {
    return yield put(
      actions.integrationApp.upgrade.installer.updateStep(id, '', 'inProgress', form)
    );
  }

  return yield put(
    actions.integrationApp.upgrade.installer.updateStep(
      id,
      '',
      'inProgress',
      result
    )
  );
}

export default [
  takeLatest(actionTypes.INTEGRATION_APPS.SETTINGS.V2.UPGRADE, changeEdition),
  takeLatest(actionTypes.INTEGRATION_APPS.SETTINGS.V2.GET_STEPS, getSteps),
  takeLatest(actionTypes.INTEGRATION_APPS.SETTINGS.V2.POST_CHANGE_EDITION_STEPS, postChangeEditionSteps),
  takeEvery(actionTypes.INTEGRATION_APPS.TEMPLATES.V2.INSTALLER.VERIFY_BUNDLE_INSTALL, upgradeVerifyBundleOrPackageInstall),
  takeEvery(
    actionTypes.INTEGRATION_APPS.INSTALLER.V2.STEP.SCRIPT_REQUEST,
    upgradeInstallScriptStep
  ),
  takeEvery(
    actionTypes.INTEGRATION_APPS.INSTALLER.V2.STEP.CURRENT_STEP,
    upgradeGetCurrentStep
  ),
];
