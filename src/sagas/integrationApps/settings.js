import { call, put, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* requestUpgrade({ integration, options }) {
  const { licenseId, addOnName } = options;
  const { _connectorId, name, _id } = integration;
  const path = `/connectors/${_connectorId}/licenses/${licenseId}/upgradeRequest`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        body: {
          _connectorId,
          connectorName: name,
          _integrationId: _id,
          _id: licenseId,
          addOnName,
        },
        method: 'POST',
      },
      message: `Requesting license upgrade.`,
    });
  } catch (error) {
    return undefined;
  }

  yield put(actions.integrationApp.settings.requestedUpgrade(licenseId));
}

export function* getAddOnLicenseMetadata({ integrationId }) {
  const path = `/integrations/${integrationId}/settings/getLicenseMetadata`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'PUT',
        body: {},
      },
      hidden: true,
    });
  } catch (error) {
    return undefined;
  }

  if (response) {
    yield put(
      actions.integrationApp.settings.addOnLicenseMetadataUpdate(
        integrationId,
        response
      )
    );
  }
}

export function* upgrade({ integration, license }) {
  const path = `/integrations/${integration._id}/settings/changeEdition`;
  let upgradeResponse;

  try {
    upgradeResponse = yield call(apiCallWithRetry, {
      path,
      opts: {
        body: { licenseOpts: license.opts, _integrationId: integration._id },
        method: 'PUT',
      },
      message: `Upgrading...`,
    }) || {};
  } catch (error) {
    return undefined;
  }

  if (upgradeResponse.success) {
    yield put(actions.resource.request('integrations', integration._id));
    yield put(actions.resource.requestCollection('flows'));
    yield put(actions.resource.requestCollection('exports'));
    yield put(actions.resource.requestCollection('imports'));
  }
}

export default [
  takeLatest(
    actionTypes.INTEGRATION_APPS.SETTINGS.REQUEST_UPGRADE,
    requestUpgrade
  ),
  takeLatest(actionTypes.INTEGRATION_APPS.SETTINGS.UPGRADE, upgrade),
  takeLatest(
    actionTypes.INTEGRATION_APPS.SETTINGS.ADDON_LICENSES_METADATA,
    getAddOnLicenseMetadata
  ),
];
