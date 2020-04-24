import { call, put, takeLatest, select } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import * as selectors from '../../reducers';
import { apiCallWithRetry } from '../index';

export function* requestUpgrade({ integrationId, options }) {
  const { licenseId, addOnName } = options;
  const integration = yield select(
    selectors.resource,
    'integrations',
    integrationId
  );
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

export function* saveCategoryMappings({ integrationId, flowId }) {
  const mappingData = yield select(
    selectors.pendingCategoryMappings,
    integrationId,
    flowId
  );
  let path = `/integrations/${integrationId}/utilities/saveMarketplaceCategoryMapping`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        body: { utilities: { options: { _flowId: flowId }, mappingData } },
        method: 'PUT',
      },
      message: `Saving...`,
    }) || {};
  } catch (error) {
    yield put(
      actions.integrationApp.settings.categoryMappings.saveFailed(
        integrationId,
        flowId
      )
    );

    return undefined;
  }

  path = `/integrations/${integrationId}/utilities/loadMarketplaceCategoryMapping`;
  let response;

  try {
    ({ response } = yield call(apiCallWithRetry, {
      path,
      opts: {
        body: {
          utilities: {
            options: {
              _flowId: flowId,
              requestOptions: [{ operation: 'mappingData', params: {} }],
            },
          },
        },
        method: 'PUT',
      },
      message: `Fetching...`,
    }) || {});
  } catch (error) {
    yield put(
      actions.integrationApp.settings.saveCategoryMappingsFailed(
        integrationId,
        flowId
      )
    );

    return undefined;
  }

  const updatedMappings = response.find(op => op.operation === 'mappingData');

  yield put(
    actions.integrationApp.settings.receivedCategoryMappingData(
      integrationId,
      flowId,
      updatedMappings
    )
  );
}

export function* upgrade({ integrationId, license }) {
  const path = `/integrations/${integrationId}/settings/changeEdition`;
  let upgradeResponse;

  try {
    upgradeResponse = yield call(apiCallWithRetry, {
      path,
      opts: {
        body: { licenseOpts: license.opts, _integrationId: integrationId },
        method: 'PUT',
      },
      message: `Upgrading...`,
    }) || {};
  } catch (error) {
    return undefined;
  }

  if (upgradeResponse.success) {
    yield put(actions.resource.request('integrations', integrationId));
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
    actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.SAVE,
    saveCategoryMappings
  ),
  takeLatest(
    actionTypes.INTEGRATION_APPS.SETTINGS.MAPPING_METADATA_REQUEST,
    getMappingMetadata
  ),
];
