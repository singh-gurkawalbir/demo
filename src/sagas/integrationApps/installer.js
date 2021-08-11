import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { openOAuthWindowForConnection } from '../resourceForm/connections/index';
import { isOauth } from '../../utils/resource';
import { isJsonString } from '../../utils/string';
import { selectors } from '../../reducers';
import { getResource } from '../resources';
import { INSTALL_STEP_TYPES } from '../../utils/constants';

export function* initInstall({ id }) {
  const path = `/integrations/${id}/installSteps`;

  try {
    yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: { method: 'GET' },
      message: 'Init install',
    });
  } catch (error) {
    return;
  }

  // once init is complete, BE will update the hidden step (if any) with completed true
  // so need to get updated doc
  yield put(actions.resource.request('integrations', id));
}

export function* installStep({ id, installerFunction, childId, addOnId, formVal }) {
  const path = `/integrations/${id}/installer/${installerFunction}`;
  let stepCompleteResponse;
  const body = { storeId: childId, addOnId, ...(formVal && { formVal }) };

  try {
    stepCompleteResponse = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: { body, method: 'PUT' },
      hidden: true,
    }) || {};
  } catch (error) {
    if (addOnId) {
      yield put(
        actions.integrationApp.isAddonInstallInprogress(false, addOnId)
      );
    }

    yield put(
      actions.integrationApp.installer.updateStep(
        id,
        installerFunction,
        'failed'
      )
    );
    yield put(actions.api.failure(path, 'PUT', error.message, false));

    return undefined;
  }

  if (stepCompleteResponse && stepCompleteResponse.success) {
    yield put(
      actions.integrationApp.installer.completedStepInstall(
        stepCompleteResponse,
        id,
        installerFunction
      )
    );

    if (addOnId) {
      yield put(
        actions.integrationApp.settings.requestAddOnLicenseMetadata(id)
      );
      yield put(actions.resource.request('integrations', id));
      yield put(actions.resource.requestCollection('flows', null, true));
      yield put(actions.resource.requestCollection('exports', null, true));
      yield put(actions.resource.requestCollection('imports', null, true));
      yield put(actions.resource.requestCollection('connections', null, true));
      yield put(
        actions.integrationApp.isAddonInstallInprogress(false, addOnId)
      );
    }
  } else if (
    stepCompleteResponse &&
    !stepCompleteResponse.success &&
    (stepCompleteResponse.resBody || stepCompleteResponse.message)
  ) {
    yield put(
      actions.api.failure(
        path,
        'PUT',
        stepCompleteResponse.resBody || stepCompleteResponse.message,
        false
      )
    );
  }
}
export function* installInitChild({ id }) {
  const path = `/integrations/${id}/initChild`;

  try {
    const childIntegration = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: {
        method: 'POST',
      },
      hidden: true,
    }) || {};
    const { _childIntegrationId } = childIntegration;

    yield put(
      actions.resource.request('integrations', _childIntegrationId)
    );
    yield put(
      actions.resource.updateChildIntegration(id, _childIntegrationId)
    );
  } catch (error) {
    yield put(actions.api.failure(path, 'PUT', error.message, false));
  }
}

export function* installScriptStep({
  id,
  connectionId,
  connectionDoc,
  formSubmission,
  stackId,
}) {
  const path = `/integrations/${id}/installSteps`;
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
        actions.integrationApp.installer.completedStepInstall(
          { stepsToUpdate: parsedError.steps },
          id
        )
      );
      if (connectionId || !isEmpty(connectionDoc)) {
        yield put(actions.resource.requestCollection('connections'));
      }
    }
    yield put(actions.integrationApp.installer.updateStep(id, '', 'failed'));
    yield put(actions.api.failure(path, 'PUT', error.message, false));

    return undefined;
  }

  if (!stepCompleteResponse || stepCompleteResponse.warnings) {
    const integration = yield select(selectors.resource, 'integrations', id);

    if (
      integration &&
      integration.initChild &&
      integration.initChild.function
    ) {
      yield call(installInitChild, { id });
    }

    // to clear session state
    yield put(
      actions.integrationApp.installer.completedStepInstall(
        { stepsToUpdate: [] },
        id
      )
    );

    return yield put(actions.resource.request('integrations', id));
  }

  const currentConnectionStep =
    stepCompleteResponse &&
    Array.isArray(stepCompleteResponse) &&
    stepCompleteResponse.find(
      temp =>
        temp.completed === false &&
        temp._connectionId
    );

  if (!isEmpty(connectionDoc)) {
    yield put(actions.resource.request('connections', currentConnectionStep?._connectionId));
  }

  if (currentConnectionStep && isOauth(connectionDoc)) {
    yield put(actions.integrationApp.installer.setOauthConnectionMode(currentConnectionStep._connectionId, true, id));
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
    actions.integrationApp.installer.completedStepInstall(
      { stepsToUpdate: stepCompleteResponse },
      id
    )
  );
}

export function* installChildStep({ id, installerFunction }) {
  const path = `/integrations/${id}/installer/${installerFunction}`;
  let stepCompleteResponse;

  try {
    stepCompleteResponse = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: { body: {}, method: 'PUT' },
      hidden: true,
      message: 'Installing',
    }) || {};
  } catch (error) {
    yield put(
      actions.integrationApp.child.updateStep(id, installerFunction, 'failed')
    );
    yield put(actions.api.failure(path, 'PUT', error, false));

    return undefined;
  }

  if (stepCompleteResponse && stepCompleteResponse.success) {
    yield call(getResource, { resourceType: 'integrations', id });

    yield put(
      actions.integrationApp.settings.requestAddOnLicenseMetadata(id)
    );
    yield put(
      actions.integrationApp.child.completedStepInstall(
        id,
        installerFunction,
        stepCompleteResponse.stepsToUpdate
      )
    );
  } else if (
    stepCompleteResponse &&
    !stepCompleteResponse.success &&
    (stepCompleteResponse.resBody || stepCompleteResponse.message)
  ) {
    yield put(
      actions.api.failure(
        path,
        'PUT',
        stepCompleteResponse.resBody || stepCompleteResponse.message,
        false
      )
    );
  }
}

export function* addNewChild({ id }) {
  const path = `/integrations/${id}/installer/addNewStore`;
  let steps;

  try {
    steps = yield call(apiCallWithRetry, {
      path,
      opts: { body: {}, method: 'PUT' },
      hidden: true,
      message: 'Installing',
    });
  } catch (error) {
    yield put(actions.api.failure(path, 'PUT', error && error.message, false));
    yield put(
      actions.integrationApp.child.failedNewChildSteps(id, error.message)
    );

    return undefined;
  }

  if (steps) {
    yield put(actions.resource.requestCollection('connections'));
    yield put(actions.integrationApp.child.receivedNewChildSteps(id, steps));
  }
}

// for certain type of steps ('form' for now), in order to display the step for the user,
// we need to invoke get /currentStep route to get the form metadata
export function* getCurrentStep({ id, step }) {
  const { type, form, initFormFunction } = step;

  //  currently only handling 'form' type step
  if (type !== INSTALL_STEP_TYPES.FORM) {
    return;
  }

  if (!initFormFunction) {
    // update formmeta in the session state
    return yield put(
      actions.integrationApp.installer.updateStep(id, '', 'inProgress', form)
    );
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
    yield put(actions.integrationApp.installer.updateStep(id, '', 'failed'));

    return yield put(actions.api.failure(path, 'PUT', error.message, false));
  }

  if (!currentStepResponse || !currentStepResponse.result) {
    return yield put(
      actions.integrationApp.installer.updateStep(id, '', 'inProgress', form)
    );
  }

  return yield put(
    actions.integrationApp.installer.updateStep(
      id,
      '',
      'inProgress',
      currentStepResponse.result
    )
  );
}

export default [
  takeEvery(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.REQUEST, installStep),
  takeEvery(
    actionTypes.INTEGRATION_APPS.INSTALLER.STEP.SCRIPT_REQUEST,
    installScriptStep
  ),
  takeEvery(
    actionTypes.INTEGRATION_APPS.INSTALLER.STEP.CURRENT_STEP,
    getCurrentStep
  ),
  takeLatest(actionTypes.INTEGRATION_APPS.CHILD.ADD, addNewChild),
  takeLatest(actionTypes.INTEGRATION_APPS.CHILD.INSTALL, installChildStep),
  takeLatest(actionTypes.INTEGRATION_APPS.INSTALLER.INIT_CHILD, installInitChild),
  takeLatest(actionTypes.INTEGRATION_APPS.INSTALLER.INIT, initInstall),
];
