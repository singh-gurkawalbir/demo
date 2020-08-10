import { call, put, takeEvery } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';

function* makeRequest({ path, method = 'GET', message}) {
  let response;

  try {
    response = yield call(apiCallWithRetry, {path, opts: {method}, message});
  } catch (error) {
    return {error};
  }

  return {response};
}

export function* getPackageURLs({ ssLinkedConnectionId, connectorId }) {
  const path = `/suitescript/connections/${ssLinkedConnectionId}/installer/getPackageURLs`;
  const { response } = yield makeRequest({ path});
  // dont do anything if there is error and use the static package urls

  if (response && response.success) {
    if (response.data) {
      if (response.data.integratorPackageURL) {
        yield put(
          actions.suiteScript.installer.updatePackage(
            connectorId,
            'verifyIntegratorPackage',
            response.data.integratorPackageURL
          )
        );
      }
      if (response.data.connectorPackageURL) {
        yield put(
          actions.suiteScript.installer.updatePackage(
            connectorId,
            'verifyConnectorPackage',
            response.data.connectorPackageURL
          )
        );
      }
    }
  }
}

export function* isConnectionOnline({ ssLinkedConnectionId, ssConnId}) {
  const path = `/suitescript/connections/${ssLinkedConnectionId}/connections/${ssConnId}/ping`;
  const { error, response } = yield makeRequest({ path });

  if (error || !response || response.code !== 200 || response.errors) {
    return false;
  }

  return true;
}

export function* verifySSConnection({ ssLinkedConnectionId, connectorId }) {
  const path = `/suitescript/connections/${ssLinkedConnectionId}/connections`;
  const { error, response } = yield makeRequest({ path });

  if (error || !response) {
    return yield put(
      actions.suiteScript.installer.updateStep(
        connectorId,
        'reset'
      )
    );
  }
  let nsConnIdx;
  let sfConnIdx;

  if (Array.isArray(response)) {
    nsConnIdx = response.findIndex(c => c.type === 'netsuite' && c.id !== 'CELIGO_JAVA_INTEGRATOR_NETSUITE_CONNECTION');
    sfConnIdx = response.findIndex(c => c.type === 'salesforce');
  }
  if (sfConnIdx > -1) {
    // save doc in session state
    yield put(
      actions.suiteScript.installer.updateSSConnection(
        connectorId,
        'SALESFORCE_CONNECTION',
        response[sfConnIdx],
      )
    );
  }
  if (nsConnIdx > -1) {
    // save doc in session state
    yield put(
      actions.suiteScript.installer.updateSSConnection(
        connectorId,
        'NETSUITE_CONNECTION',
        response[nsConnIdx],
      )
    );
    const isNSOnline = yield call(isConnectionOnline, { ssLinkedConnectionId, connectorId, ssConnId: 'NETSUITE_CONNECTION'});

    if (isNSOnline) {
      yield put(
        actions.suiteScript.installer.updateStep(
          connectorId,
          'completed'
        )
      );

      // verify next SF connection step now
      yield put(actions.suiteScript.installer.updateStep(
        connectorId,
        'verify'
      ));
      const isSFOnline = yield call(isConnectionOnline, { ssLinkedConnectionId, connectorId, ssConnId: 'SALESFORCE_CONNECTION'});

      if (isSFOnline) {
        // get package urls once SF connection is verified
        yield call(getPackageURLs, { ssLinkedConnectionId, connectorId });

        return yield put(
          actions.suiteScript.installer.updateStep(
            connectorId,
            'completed'
          )
        );
      }
    }
  }
  yield put(
    actions.suiteScript.installer.updateStep(
      connectorId,
      'reset'
    )
  );
}

export function* verifyConnectorBundle({ ssLinkedConnectionId, connectorId, ssName }) {
  const path = `/suitescript/connections/${ssLinkedConnectionId}/tiles`;
  const { error, response } = yield makeRequest({ path });

  if (error || !response) {
    return yield put(
      actions.suiteScript.installer.updateStep(
        connectorId,
        'reset'
      )
    );
  }

  let found = [];

  if (Array.isArray(response)) {
    found = response.filter(t => t.isConnector && t.name === ssName);
  }
  if (found && found.length > 0) {
    yield put(
      actions.suiteScript.installer.updateStep(
        connectorId,
        'completed'
      )
    );
    yield put(actions.suiteScript.installer.updateSSIntegrationId(connectorId, found[0]._integrationId));

    // link the integration with the connection id
    yield put(actions.suiteScript.resource.connections.linkIntegrator(ssLinkedConnectionId, true));

    // to verify the next SS connections step
    yield put(actions.suiteScript.installer.updateStep(
      connectorId,
      'verify'
    ));
    yield call(verifySSConnection, { ssLinkedConnectionId, connectorId });

    return;
  }

  return yield put(
    actions.suiteScript.installer.updateStep(
      connectorId,
      'reset'
    )
  );
}

export function* checkNetSuiteDABundle({ ssLinkedConnectionId, connectorId, shouldContinue, ssName }) {
  const path = `/connections/${ssLinkedConnectionId}/distributed`;
  const { error, response } = yield makeRequest({ path });

  if (error || !response || !response.success) {
    return yield put(
      actions.suiteScript.installer.updateStep(
        connectorId,
        'reset'
      )
    );
  }

  yield put(
    actions.suiteScript.installer.updateStep(
      connectorId,
      'completed'
    )
  );
  if (shouldContinue) {
    // to verify the next SF bundle step
    yield put(actions.suiteScript.installer.updateStep(
      connectorId,
      'verify'
    ));
    yield call(verifyConnectorBundle, { ssLinkedConnectionId, connectorId, ssName });
  }
}

export function* verifyPackage({ssLinkedConnectionId, connectorId, installerFunction}) {
  const path = `/suitescript/connections/${ssLinkedConnectionId}/installer/${installerFunction}`;
  const { error, response } = yield makeRequest({ path });

  if (error || !response || !response.success) {
    yield put(
      actions.suiteScript.installer.updateStep(
        connectorId,
        'reset'
      )
    );

    return yield put(
      actions.suiteScript.installer.failed(
        connectorId,
        error || 'Package is not installed yet.'
      )
    );
  }
  yield put(
    actions.suiteScript.installer.updateStep(
      connectorId,
      'completed'
    )
  );
}

export function* postInstallComplete({ssLinkedConnectionId, connectorId}) {
  const path = `/suitescript/connections/${ssLinkedConnectionId}/connectors/postInstall`;
  const { error, response } = yield makeRequest({ path, method: 'PUT' });

  if (error || !response || !response.success) {
    return yield put(
      actions.suiteScript.installer.failed(
        connectorId,
        error
      )
    );
  }
  yield put(
    actions.suiteScript.installer.done(
      connectorId
    )
  );
}

export default [
  takeEvery(actionTypes.SUITESCRIPT.INSTALLER.VERIFY.INTEGRATOR_BUNDLE, checkNetSuiteDABundle),
  takeEvery(actionTypes.SUITESCRIPT.INSTALLER.VERIFY.CONNECTOR_BUNDLE, verifyConnectorBundle),
  takeEvery(actionTypes.SUITESCRIPT.INSTALLER.VERIFY.SS_CONNECTION, verifySSConnection),
  takeEvery(actionTypes.SUITESCRIPT.INSTALLER.VERIFY.PACKAGE, verifyPackage),
  takeEvery(actionTypes.SUITESCRIPT.INSTALLER.REQUEST_PACKAGES, getPackageURLs),
  takeEvery(actionTypes.SUITESCRIPT.INSTALLER.POST_INSTALL, postInstallComplete),
];
