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
import { refreshConnectionMetadata } from '../resources/meta';
import { INSTALL_STEP_TYPES } from '../../constants';
import openExternalUrl from '../../utils/window';

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
      yield put(actions.resource.requestCollection('flows', null, true, id));
      yield put(actions.resource.requestCollection('exports', null, true, id));
      yield put(actions.resource.requestCollection('imports', null, true, id));
      yield put(actions.resource.requestCollection('connections', null, true, id));
      yield put(actions.resource.requestCollection('asynchelpers', null, true, id));
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

function* refreshIntegrationConnectionsMetadata({ integrationId }) {
  const installSteps = yield select(selectors.integrationInstallSteps, integrationId);
  const connections = installSteps
    .filter(step => step.type === 'connection' && ['netsuite', 'salesforce'].includes(step.sourceConnection?.type) && step._connectionId)
    .map(step => ({ type: step.sourceConnection?.type, _id: step._connectionId }));

  yield call(refreshConnectionMetadata, { connections });
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
    // refresh NS/SF connection's metadata once the integration install steps are completed
    yield call(refreshIntegrationConnectionsMetadata, { integrationId: id });
    // to clear session state
    yield put(
      actions.integrationApp.installer.completedStepInstall(
        { stepsToUpdate: [] },
        id
      )
    );

    return yield put(actions.resource.request('integrations', id));
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

export function* verifyBundleOrPackageInstall({
  id,
  connectionId,
  installerFunction,
  isFrameWork2,
  variant,
  isManualVerification = true,
}) {
  const path = variant ? `/connections/${connectionId}/distributed?type=${variant}` : `/connections/${connectionId}/distributed`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: variant ? `Verifying ${variant} Installation...` : 'Verifying Bundle/Package Installation...',
    });
  } catch (error) {
    yield put(
      actions.integrationApp.installer.updateStep(
        id,
        '',
        'failed'
      )
    );

    return undefined;
  }

  if (response?.success) {
    if (isFrameWork2) {
      yield put(
        actions.integrationApp.installer.scriptInstallStep(id)
      );
    } else {
      yield put(
        actions.integrationApp.installer.installStep(
          id,
          installerFunction,
        )
      );
    }
  } else if (
    response &&
      !response.success &&
      isManualVerification &&
      (response.resBody || response.message)
  ) {
    yield put(
      actions.api.failure(
        path,
        'GET',
        response.resBody || response.message,
        false
      )
    );
  }
  yield put(
    actions.integrationApp.installer.updateStep(
      id,
      installerFunction,
      'failed'
    )
  );
}

export function* installChildStep({ id, installerFunction, formVal }) {
  const path = `/integrations/${id}/installer/${installerFunction}`;
  let stepCompleteResponse;
  const body = formVal ? { formVal } : {};

  try {
    stepCompleteResponse = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: { body, method: 'PUT' },
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

// for certain type of steps ('form'/'url' for now), in order to display the step for the user,
// we need to invoke get /currentStep route to get the form metadata or url
export function* getCurrentStep({ id, step }) {
  const { type, form, initFormFunction, getUrlFunction } = step;

  //  currently only handling 'form' and 'url' type step
  if (type !== INSTALL_STEP_TYPES.FORM && type !== INSTALL_STEP_TYPES.URL) {
    return;
  }

  if (type === INSTALL_STEP_TYPES.FORM && !initFormFunction) {
    // update form meta in the session state
    return yield put(
      actions.integrationApp.installer.updateStep(id, '', 'inProgress', form)
    );
  }
  if (type === INSTALL_STEP_TYPES.URL && !getUrlFunction) {
    // fail the step if no url or function available
    return yield put(actions.integrationApp.installer.updateStep(id, '', 'failed'));
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

  const result = currentStepResponse?.result;

  if (type === INSTALL_STEP_TYPES.URL) {
    if (!result) {
      return yield put(actions.integrationApp.installer.updateStep(id, '', 'failed'));
    }

    yield call(openExternalUrl, { url: result });

    return yield put(
      actions.integrationApp.installer.updateStep(
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
      actions.integrationApp.installer.updateStep(id, '', 'inProgress', form)
    );
  }

  return yield put(
    actions.integrationApp.installer.updateStep(
      id,
      '',
      'inProgress',
      result
    )
  );
}

export default [
  takeEvery(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.REQUEST, installStep),
  takeEvery(actionTypes.INTEGRATION_APPS.TEMPLATES.INSTALLER.VERIFY_BUNDLE_INSTALL, verifyBundleOrPackageInstall),
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
