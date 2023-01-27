import { put, select, call, takeLatest } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { REVISION_TYPES } from '../../constants';
import { VALID_REVERT_TO_QUERIES, VALID_REVISION_TYPES_FOR_CREATION } from '../../utils/revisions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import inferErrorMessages from '../../utils/inferErrorMessages';
import { isOauth } from '../../utils/resource';
import { openOAuthWindowForConnection } from '../resourceForm/connections/index';

export function* requestIntegrationCloneFamily({ integrationId }) {
  try {
    const cloneFamily = yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/clonefamily`,
      opts: {
        method: 'GET',
      },
    });

    yield put(actions.integrationLCM.cloneFamily.received(integrationId, cloneFamily));
  } catch (error) {
    yield put(actions.integrationLCM.cloneFamily.receivedError(integrationId, error));
  }
}

function* createRevision({ integrationId, newRevisionId}) {
  const {type, revisionInfo} = (yield select(selectors.tempRevisionInfo, integrationId, newRevisionId)) || {};
  const { description, integration: cloneIntegrationId, revertToConfig = {}} = revisionInfo || {};

  if (!VALID_REVISION_TYPES_FOR_CREATION.includes(type)) {
    return;
  }

  let path;

  if (type === REVISION_TYPES.SNAPSHOT) {
    path = `/integrations/${integrationId}/revisions/create`;
  } else if (type === REVISION_TYPES.PULL) {
    path = `/integrations/${integrationId}/pull/${cloneIntegrationId}/open`;
  } else {
    const { revertTo, revisionId } = revertToConfig;
    const queryParam = `${VALID_REVERT_TO_QUERIES.includes(revertTo) ? `?${revertTo}=true` : ''}`;

    path = `/integrations/${integrationId}/revisions/${revisionId}/revert/open${queryParam}`;
  }
  try {
    const createdRevision = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'POST',
        body: { description },
      },
    });

    yield put(actions.resource.received(`integrations/${integrationId}/revisions`, createdRevision));
    yield put(actions.resource.created(createdRevision._id, newRevisionId));
    yield put(actions.integrationLCM.revision.created(integrationId, newRevisionId));
  } catch (e) {
  // errors
    const errors = inferErrorMessages(e.message);

    yield put(actions.integrationLCM.revision.creationError(integrationId, newRevisionId, errors?.[0]));
  }
}

function* comparePullRequest({ integrationId, revisionId }) {
  try {
    const { revisionInfo = {}} = (yield select(selectors.tempRevisionInfo, integrationId, revisionId)) || {};
    const { integration: cloneIntegrationId } = revisionInfo;
    const resourceDiff = yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/pull/${cloneIntegrationId}/compare`,
      opts: {
        method: 'POST',
      },
      hidden: true,
    });

    yield put(actions.integrationLCM.compare.receivedDiff(integrationId, resourceDiff));
  } catch (e) {
    const errors = inferErrorMessages(e.message);

    yield put(actions.integrationLCM.compare.receivedDiffError(integrationId, errors?.[0]));
  }
}

function* compareRevertRequest({ integrationId, revisionId }) {
  try {
    const tempRevisionInfo = (yield select(selectors.tempRevisionInfo, integrationId, revisionId)) || {};
    const { revertTo, revisionId: revertToRevisionId } = tempRevisionInfo?.revisionInfo?.revertToConfig;

    const queryParam = `${VALID_REVERT_TO_QUERIES.includes(revertTo) ? `?${revertTo}=true` : ''}`;

    const resourceDiff = yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/revisions/${revertToRevisionId}/revert/compare${queryParam}`,
      opts: {
        method: 'POST',
      },
      hidden: true,
    });

    yield put(actions.integrationLCM.compare.receivedDiff(integrationId, resourceDiff));
  } catch (e) {
    const errors = inferErrorMessages(e.message);

    yield put(actions.integrationLCM.compare.receivedDiffError(integrationId, errors?.[0]));
  }
}
function* compareRevisionChanges({ integrationId, revisionId }) {
  try {
    const resourceDiff = yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/revisions/${revisionId}/diff`,
      opts: {
        method: 'GET',
      },
      hidden: true,
    });

    yield put(actions.integrationLCM.compare.receivedDiff(integrationId, resourceDiff));
  } catch (e) {
    const errors = inferErrorMessages(e.message);

    yield put(actions.integrationLCM.compare.receivedDiffError(integrationId, errors?.[0]));
  }
}

function* cancelRevision({ integrationId, revisionId }) {
  try {
    yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/revisions/${revisionId}/cancel`,
      opts: {
        method: 'POST',
      },
    });

    yield put(actions.resource.request(`integrations/${integrationId}/revisions`, revisionId));
  } catch (e) {
    // errors
  }
}

function* handleOAuthConnectionStep({ revisionId, integrationId, connectionDoc }) {
  const revisionInstallSteps = yield select(selectors.revisionInstallSteps, integrationId, revisionId);
  const currentConnectionStep = revisionInstallSteps.find(step => step.completed === false && step._connectionId);

  if (currentConnectionStep?._connectionId && !isEmpty(connectionDoc)) {
    // Incase of user configuring a new connection, connectionDoc is passed in request body above
    // In that case, fetch the latest connection Doc created
    yield put(actions.resource.request('connections', currentConnectionStep._connectionId));
  }

  if (currentConnectionStep?._connectionId && isOauth(connectionDoc)) {
    try {
      yield put(actions.integrationLCM.installSteps.setOauthConnectionMode({
        connectionId: currentConnectionStep._connectionId,
        revisionId,
        openOauthConnection: true,
      }));
      yield call(openOAuthWindowForConnection, currentConnectionStep._connectionId);
    } catch (e) {
      // could not close the window
    }
  }
}

function* installStep({ integrationId, revisionId, stepInfo }) {
  try {
    const updatedRevision = yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/revisions/${revisionId}/installSteps`,
      opts: {
        method: 'POST',
        body: stepInfo,
      },
    });

    yield put(actions.resource.received(`integrations/${integrationId}/revisions`, updatedRevision));
    const isInstallationDone = yield select(selectors.areAllRevisionInstallStepsCompleted, integrationId, revisionId);

    yield put(actions.integrationLCM.installSteps.completedStepInstall(revisionId));
    if (isInstallationDone) {
      yield put(actions.resource.request('integrations', integrationId));
      yield put(actions.resource.requestCollection('flows', null, true));
      yield put(actions.resource.requestCollection('exports', null, true));
      yield put(actions.resource.requestCollection('imports', null, true));
      yield put(actions.resource.requestCollection('connections', null, true));
      yield put(actions.resource.requestCollection('scripts', null, true));
      yield put(actions.resource.requestCollection('filedefinitions', null, true));
      yield put(actions.resource.requestCollection('asynchelpers', null, true));

      return;
    }
    // Does needed actions incase of oAuth connection step
    yield call(handleOAuthConnectionStep, {
      integrationId,
      revisionId,
      connectionDoc: stepInfo.connection,
    });
  } catch (e) {
    yield put(actions.integrationLCM.installSteps.updateStep(revisionId, 'failed'));
  // TODO: Handle errors and trigger failed action
  }
}

export function* fetchRevisionErrors({integrationId, revisionId }) {
  try {
    const errors = yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/revisions/${revisionId}/errors`,
      opts: {
        method: 'GET',
      },
    });

    yield put(actions.integrationLCM.revision.receivedErrors(integrationId, revisionId, errors));
  } catch (e) {
    // TODO: check if we need to handle errors
  }
}

export function* verifyBundleOrPackageInstall({
  integrationId,
  connectionId,
  revisionId,
  type,
}) {
  const path = type ? `/connections/${connectionId}/distributed?type=${type}` : `/connections/${connectionId}/distributed`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: type ? `Verifying ${type} Installation...` : 'Verifying Bundle/Package Installation...',
    });
  } catch (error) {
    yield put(actions.integrationLCM.installSteps.updateStep(revisionId, 'failed'));

    return;
  }

  if (response?.success) {
    yield put(actions.integrationLCM.installSteps.installStep(integrationId, revisionId));
  } else if (
    response &&
      !response.success &&
      (response.resBody || response.message)
  ) {
    // TODO @Raghu: Why do we need this condition to be handled?
    // Similar pattern has been used at other places like IA/template install bundle verification
    yield put(actions.integrationLCM.installSteps.updateStep(revisionId, 'failed'));
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

export function* verifySuiteAppInstall({
  id,
  connectionId,
  installerFunction,
  isFrameWork2,
}) {
  const path = `/connection/${connectionId}/distributed?type=suiteapp`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: 'Verifying SuiteApp Installation...',
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
      (response.resBody || response.message)
  ) {
    yield put(
      actions.integrationApp.installer.updateStep(
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

export default [
  takeLatest(actionTypes.INTEGRATION_LCM.CLONE_FAMILY.REQUEST, requestIntegrationCloneFamily),
  takeLatest(actionTypes.INTEGRATION_LCM.REVISION.CREATE, createRevision),
  takeLatest(actionTypes.INTEGRATION_LCM.REVISION.CREATE_SNAPSHOT, createRevision),
  takeLatest(actionTypes.INTEGRATION_LCM.COMPARE.PULL_REQUEST, comparePullRequest),
  takeLatest(actionTypes.INTEGRATION_LCM.COMPARE.REVERT_REQUEST, compareRevertRequest),
  takeLatest(actionTypes.INTEGRATION_LCM.COMPARE.REVISION_REQUEST, compareRevisionChanges),
  takeLatest(actionTypes.INTEGRATION_LCM.REVISION.CANCEL, cancelRevision),
  takeLatest(actionTypes.INTEGRATION_LCM.INSTALL_STEPS.STEP.INSTALL, installStep),
  takeLatest(actionTypes.INTEGRATION_LCM.REVISION.FETCH_ERRORS, fetchRevisionErrors),
  takeLatest(actionTypes.INTEGRATION_LCM.INSTALL_STEPS.STEP.VERIFY_BUNDLE_INSTALL, verifyBundleOrPackageInstall),
  takeLatest(actionTypes.INTEGRATION_LCM.INSTALL_STEPS.STEP.VERIFY_SUITEAPP_INSTALL, verifySuiteAppInstall),
];
