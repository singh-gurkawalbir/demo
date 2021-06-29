import { call, put, takeLatest, select, race, take } from 'redux-saga/effects';
import shortid from 'shortid';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import { emptyList, emptyObject } from '../../utils/constants';
import { apiCallWithRetry } from '../index';
import { getResourceCollection, getResource } from '../resources';

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
      message: 'Requesting license upgrade.',
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
    yield put(
      actions.integrationApp.settings.addOnLicenseMetadataFailed(integrationId)
    );

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
        actions.integrationApp.settings.categoryMappings.receivedGeneratesMetadata(
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
      message: 'Saving...',
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
              requestOptions: [
                { operation: 'mappingData', params: {} },
                {
                  operation: 'generatesMetaData',
                  params: {
                    categoryId: 'commonAttributes',
                    categoryRelationshipData: true,
                  },
                }],
            },
          },
        },
        method: 'PUT',
      },
      message: 'Loading',
    }) || {});
  } catch (error) {
    yield put(
      actions.integrationApp.settings.categoryMappings.loadFailed(
        integrationId,
        flowId
      )
    );

    return undefined;
  }

  const updatedMappings = response.find(op => op.operation === 'mappingData');

  // On change of categoryMappings IA may add/remove flows in the integration.
  yield call(getResourceCollection, { resourceType: 'flows' });
  yield call(getResource, {resourceType: 'integrations', id: integrationId});

  yield put(
    actions.integrationApp.settings.categoryMappings.receivedUpdatedMappingData(
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
      message: 'Upgrading...',
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

export function* initCategoryMappings({ integrationId, flowId, id, sectionId, depth, isVariationAttributes, variation, isVariationMapping }) {
  const categoryMappingData = yield select(selectors.categoryMappingData, integrationId, flowId);

  if (!categoryMappingData) {
    const { cancelInit } = yield race({
      fetchData: call(getCategoryMappingMetadata, {
        flowId,
        integrationId,
      }),
      cancelInit: take(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.CLEAR),
    });

    if (cancelInit) return;
  }
  const generatesData = yield select(selectors.mkCategoryMappingGenerateFields(), integrationId, flowId, { sectionId, depth });
  let { fields: generateFields = emptyList} = generatesData || emptyObject;

  if (isVariationAttributes) {
    const { variation_attributes: variationAttributes } = generatesData || emptyObject;

    generateFields = variationAttributes;
  }
  let fieldMappings;
  let lookups;
  let deleted;

  if (isVariationMapping) {
    const mappingsForVariation = yield select(selectors.mkMappingsForVariation(), integrationId, flowId, {
      sectionId,
      variation,
      isVariationAttributes,
      depth,
    });

    ({ fieldMappings = emptyList} = mappingsForVariation || {});
  } else {
    const mappingsForCategory = yield select(selectors.mkMappingsForCategory(), integrationId, flowId, { depth, sectionId });

    ({ fieldMappings, lookups = [], deleted = false } = mappingsForCategory || {});
  }

  const mappings = yield select(selectors.categoryMappingById, integrationId, flowId, id);
  const { staged } = mappings || emptyObject;
  const formattedMappings = staged || fieldMappings;

  yield put(
    actions.integrationApp.settings.categoryMappings.initComplete(
      integrationId,
      flowId,
      id,
      {
        mappings: formattedMappings.map(m => ({
          ...m,
          key: shortid.generate(),
        })),
        lookups,
        isCategoryMapping: true,
        adaptorType: 'netsuite',
        application: 'netsuite',
        flowId,
        generateFields,
        deleted,
        isVariationMapping,
        childCategoryId: sectionId,
        variation,
        isVariationAttributes,
      })
  );
}

export default [
  takeLatest(
    actionTypes.INTEGRATION_APPS.SETTINGS.REQUEST_UPGRADE,
    requestUpgrade
  ),
  takeLatest(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.INIT, initCategoryMappings),
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
