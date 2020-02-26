import { call, put, takeLatest, select } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import * as selectors from '../../reducers';
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

export function* getMappingMetadata({ integrationId }) {
  const path = `/integrations/${integrationId}/settings/getMappingMetadata`;
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
    yield put(
      actions.integrationApp.settings.mappingMetadataError(
        integrationId,
        error.message
      )
    );
  }

  if (response) {
    yield put(
      actions.integrationApp.settings.mappingMetadataUpdate(
        integrationId,
        response
      )
    );
  }
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

export function* getCategoryMappingMetadata({
  integrationId,
  flowId,
  categoryId,
  options = {},
}) {
  const path = `/integrations/${integrationId}/utilities/loadMarketplaceCategoryMapping`;
  let response;
  let requestOptions = [
    { operation: 'mappingData', params: {} },
    {
      operation: 'extractsMetaData',
      params: {
        type: 'searchColumns',
        searchColumns: { recordType: 'item' },
      },
    },
    {
      operation: 'generatesMetaData',
      params: {
        categoryId,
        categoryRelationshipData: true,
      },
    },
  ];

  if (options.generatesMetadata) {
    requestOptions = [
      {
        operation: 'generatesMetaData',
        params: {
          categoryId,
        },
      },
    ];
  }

  const payload = {
    utilities: {
      options: {
        _flowId: flowId,
        requestOptions,
      },
    },
  };

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'PUT',
        body: payload,
      },
      hidden: false,
    });
  } catch (error) {
    return undefined;
  }

  if (response) {
    if (options.generatesMetadata) {
      yield put(
        actions.integrationApp.settings.receivedCategoryMappingGeneratesMetadata(
          integrationId,
          flowId,
          response
        )
      );
    } else {
      yield put(
        actions.integrationApp.settings.receivedCategoryMappingMetadata(
          integrationId,
          flowId,
          response
        )
      );
    }
  }
}

export function* saveVariationMappings({ integrationId, flowId, data = {} }) {
  const mappings = yield select(
    selectors.pendingVariationMappings,
    integrationId,
    flowId,
    data
  );

  yield put(
    actions.integrationApp.settings.saveVariationMappings(
      integrationId,
      flowId,
      data,
      mappings
    )
  );
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
  takeLatest(
    actionTypes.INTEGRATION_APPS.SETTINGS.REQUEST_CATEGORY_MAPPING_METADATA,
    getCategoryMappingMetadata
  ),
  takeLatest(
    actionTypes.INTEGRATION_APPS.SETTINGS.SAVE_VARIATION_MAPPINGS,
    saveVariationMappings
  ),
  takeLatest(
    actionTypes.INTEGRATION_APPS.SETTINGS.MAPPING_METADATA_REQUEST,
    getMappingMetadata
  ),
];
