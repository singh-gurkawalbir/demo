/* global describe, test */

import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { call, select } from 'redux-saga/effects';
import { selectors } from '../../reducers';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { getCurrentStep } from './installer';
import {
  requestUpgrade,
  upgrade,
  getAddOnLicenseMetadata,
  getCategoryMappingMetadata,
  saveCategoryMappings,
  getMappingMetadata,
} from './settings';
import {initUninstall, uninstallStep, requestSteps} from './uninstaller2.0';

describe('installer saga', () => {
  describe('getCurrentStep generator', () => {
    const id = '1234';
    const form = {
      fieldMap: {
        storeName: {
          id: 'storeName',
          name: 'storeName',
        },
        category: {
          id: 'category',
          name: 'category',
        },
      },
    };

    test('should do nothing if step is not form type', () => {
      const step = { type: 'dummy', form };
      const saga = testSaga(getCurrentStep, { id, step });

      saga.next().isDone();
    });

    test('should dispatch update step action with step form meta and not make API call, if no init form function', () => {
      const step = { type: 'form', form };

      return expectSaga(getCurrentStep, { id, step })
        .not.call.fn(apiCallWithRetry)
        .put(
          actions.integrationApp.installer.updateStep(id, '', 'inProgress', form)
        )
        .run();
    });

    test('should make API call when init function present and dispatch action with updated form meta', () => {
      const step = { type: 'form', form, initFormFunction: 'somefunc' };
      const expectedOut = {
        result: {
          fieldMap: {
            dummy: {
              id: 'dummy',
              name: 'dummy',
            },
          },
        },
      };

      return expectSaga(getCurrentStep, { id, step })
        .provide([[matchers.call.fn(apiCallWithRetry), expectedOut]])
        .call.fn(apiCallWithRetry)
        .put(
          actions.integrationApp.installer.updateStep(
            id,
            '',
            'inProgress',
            expectedOut.result
          )
        )
        .run();
    });

    test('should dispatch failed step action if API call fails', () => {
      const step = { type: 'form', form, initFormFunction: 'somefunc' };
      const error = { code: 422, message: 'unprocessable entity' };

      return expectSaga(getCurrentStep, { id, step })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
        .call.fn(apiCallWithRetry)
        .put(actions.integrationApp.installer.updateStep(id, '', 'failed'))
        .run();
    });
  });
});
describe('settings saga', () => {
  const integrationId = '123';

  describe('requestUpgrade generator', () => {
    const options = {
      licenseId: 'dummy',
      addOnName: 'dummy',
    };
    const { licenseId, addOnName } = options;
    const integration = {
      _id: 'dummy',
      name: 'dummy',
      _connectorId: 'dummy',
    };
    const { _connectorId, name, _id } = integration;
    const args = {
      path: `/connectors/${_connectorId}/licenses/${licenseId}/upgradeRequest`,
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
    };

    test('On successful api call, it should dispatch requestUpgrade action to upgrade license status', () =>
      expectSaga(requestUpgrade, { integrationId, options })
        .provide([
          [
            select(selectors.resource, 'integrations', integrationId),
            integration,
          ],
          [call(apiCallWithRetry, args)],
        ])
        .call(apiCallWithRetry, args)
        .put(
          actions.integrationApp.settings.requestedUpgrade(options.licenseId)
        )
        .run());

    test('should return undefined if api call fails', () =>
      expectSaga(requestUpgrade, { integrationId, options })
        .provide([
          [
            select(selectors.resource, 'integrations', integrationId),
            integration,
          ],
          [call(apiCallWithRetry, args), throwError(undefined)],
        ])
        .call(apiCallWithRetry, args)
        .not.put(
          actions.integrationApp.settings.requestedUpgrade(options.licenseId)
        )
        .run());
  });
  describe('upgrade generator', () => {
    const license = {
      opts: 'dummy',
    };
    const args = {
      path: `/integrations/${integrationId}/settings/changeEdition`,
      opts: {
        body: { licenseOpts: license.opts, _integrationId: integrationId },
        method: 'PUT',
      },
      message: 'Upgrading...',
    };

    test('if upgradeResponse of the api call is not success, it should not dispatch any action', () => {
      const upgradeResponse = {
        success: false,
      };

      return expectSaga(upgrade, { integrationId, license })
        .provide([[call(apiCallWithRetry, args), upgradeResponse]])
        .call(apiCallWithRetry, args)
        .not.put(actions.resource.request('integrations', integrationId))
        .run();
    });
    test('if upgradeResponse of the api call is success, it should dispatch required actions', () => {
      const upgradeResponse = {
        success: true,
      };

      return expectSaga(upgrade, { integrationId, license })
        .provide([[call(apiCallWithRetry, args), upgradeResponse]])
        .call(apiCallWithRetry, args)
        .put(actions.resource.request('integrations', integrationId))
        .put(actions.resource.requestCollection('flows'))
        .put(actions.resource.requestCollection('exports'))
        .put(actions.resource.requestCollection('imports'))
        .run();
    });
    test('if the api call fails, it returns undefined', () =>
      expectSaga(upgrade, { integrationId, license })
        .provide([[call(apiCallWithRetry, args), throwError(undefined)]])
        .call(apiCallWithRetry, args)
        .not.put(actions.resource.request('integrations', integrationId))
        .run());
  });
  describe('getAddOnLicenseMetadata generator', () => {
    const args = {
      path: `/integrations/${integrationId}/settings/getLicenseMetadata`,
      opts: {
        method: 'PUT',
        body: {},
      },
      hidden: true,
    };

    test('if api call is success but there is no response, it should not dispatch any action', () => {
      const response = null;

      return expectSaga(getAddOnLicenseMetadata, { integrationId })
        .provide([[call(apiCallWithRetry, args), response]])
        .call(apiCallWithRetry, args)
        .not.put(
          actions.integrationApp.settings.addOnLicenseMetadataUpdate(
            integrationId,
            response
          )
        )
        .run();
    });
    test('on successful api call with response, it should dispatch addOnLicenseMetadataUpdate', () => {
      const response = { dummy: 'dummy' };

      return expectSaga(getAddOnLicenseMetadata, { integrationId })
        .provide([[call(apiCallWithRetry, args), response]])
        .call(apiCallWithRetry, args)
        .put(
          actions.integrationApp.settings.addOnLicenseMetadataUpdate(
            integrationId,
            response
          )
        )
        .run();
    });
    test('if the api call fails, should dispatch addOnLicenseMetadataFailed', () =>
      expectSaga(getAddOnLicenseMetadata, { integrationId })
        .provide([[call(apiCallWithRetry, args), throwError(undefined)]])
        .call(apiCallWithRetry, args)
        .put(
          actions.integrationApp.settings.addOnLicenseMetadataFailed(
            integrationId
          )
        )
        .run());
  });
  describe('getCategoryMappingMetadata generator', () => {
    const flowId = 'dummy';
    const categoryId = 'dummy';
    const payload = {
      utilities: {
        options: {
          _flowId: flowId,
          requestOptions: [],
        },
      },
    };
    const args = {
      path: `/integrations/${integrationId}/utilities/loadMarketplaceCategoryMapping`,
      opts: {
        method: 'PUT',
        body: payload,
      },
      hidden: false,
    };

    test('if api call is success but there is no response, it should not dispatch any action', () => {
      const options = {
        generatesMetadata: false,
      };

      args.opts.body.utilities.options.requestOptions = [
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
      const response = null;

      return expectSaga(getCategoryMappingMetadata, {
        integrationId,
        flowId,
        categoryId,
        options,
      })
        .provide([[call(apiCallWithRetry, args), response]])
        .call(apiCallWithRetry, args)
        .not.put(
          actions.integrationApp.settings.receivedCategoryMappingMetadata(
            integrationId,
            flowId,
            response
          )
        )
        .run();
    });

    test('should make api call and dispatch receivedCategoryMappingMetadata if options.generatesMetadata is false', () => {
      const options = {
        generatesMetadata: false,
      };

      args.opts.body.utilities.options.requestOptions = [
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
      const response = { dummy: 'dummy' };

      return expectSaga(getCategoryMappingMetadata, {
        integrationId,
        flowId,
        categoryId,
        options,
      })
        .provide([[call(apiCallWithRetry, args), response]])
        .call(apiCallWithRetry, args)
        .put(
          actions.integrationApp.settings.receivedCategoryMappingMetadata(
            integrationId,
            flowId,
            response
          )
        )
        .run();
    });

    test('should make api call and dispatch receivedCategoryMappingGeneratesMetadata if options,generatesMetadata is true', () => {
      const options = {
        generatesMetadata: true,
      };

      args.opts.body.utilities.options.requestOptions = [
        {
          operation: 'generatesMetaData',
          params: {
            categoryId,
          },
        },
      ];
      const response = { dummy: 'dummy' };

      return expectSaga(getCategoryMappingMetadata, {
        integrationId,
        flowId,
        categoryId,
        options,
      })
        .provide([[call(apiCallWithRetry, args), response]])
        .call(apiCallWithRetry, args)
        .put(
          actions.integrationApp.settings.receivedCategoryMappingGeneratesMetadata(
            integrationId,
            flowId,
            response
          )
        )
        .run();
    });
    test('if the api call fails, it returns undefined', () => {
      const options = {
        generatesMetadata: true,
      };

      return expectSaga(getCategoryMappingMetadata, {
        integrationId,
        flowId,
        categoryId,
        options,
      })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError('undefined')],
        ])
        .call.fn(apiCallWithRetry)
        .run();
    });
  });
  describe('saveCategoryMappings generator', () => {
    const flowId = '111';
    const mappingData = {
      operation: 'mappingData',
    };
    const args1 = {
      path: `/integrations/${integrationId}/utilities/saveMarketplaceCategoryMapping`,
      opts: {
        body: { utilities: { options: { _flowId: flowId }, mappingData } },
        method: 'PUT',
      },
      message: 'Saving...',
    };
    const args2 = {
      path: `/integrations/${integrationId}/utilities/loadMarketplaceCategoryMapping`,
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
      message: 'Loading',
    };

    test('should dispatch receivedCategoryMappingData, on successful loading and saving of category mappings', () => {
      const response = [
        {
          operation: 'mappingData',
        },
      ];

      return expectSaga(saveCategoryMappings, { integrationId, flowId })
        .provide([
          [
            select(selectors.pendingCategoryMappings, integrationId, flowId),
            mappingData,
          ],
          [call(apiCallWithRetry, args1)],
          [call(apiCallWithRetry, args2), { response }],
        ])
        .call(apiCallWithRetry, args1)
        .call(apiCallWithRetry, args2)
        .put(
          actions.integrationApp.settings.receivedCategoryMappingData(
            integrationId,
            flowId,
            mappingData
          )
        )
        .run();
    });
    test('should dispatch saveFailed action when saving of category mappings failed', () =>
      expectSaga(saveCategoryMappings, { integrationId, flowId })
        .provide([
          [
            select(selectors.pendingCategoryMappings, integrationId, flowId),
            mappingData,
          ],
          [call(apiCallWithRetry, args1), throwError(undefined)],
        ])
        .call(apiCallWithRetry, args1)
        .put(
          actions.integrationApp.settings.categoryMappings.saveFailed(
            integrationId,
            flowId
          )
        )
        .run());
    test('should dispatch loadFailed action when category mappings are saved successfully but loading the same failed', () =>
      expectSaga(saveCategoryMappings, { integrationId, flowId })
        .provide([
          [
            select(selectors.pendingCategoryMappings, integrationId, flowId),
            mappingData,
          ],
          [call(apiCallWithRetry, args1)],
          [call(apiCallWithRetry, args2), throwError(undefined)],
        ])
        .call(apiCallWithRetry, args1)
        .call(apiCallWithRetry, args2)
        .put(
          actions.integrationApp.settings.categoryMappings.loadFailed(
            integrationId,
            flowId
          )
        )
        .run());
  });
  describe('getMappingMetaData generator', () => {
    const args = {
      path: `/integrations/${integrationId}/settings/getMappingMetadata`,
      opts: {
        method: 'PUT',
        body: {},
      },
      hidden: true,
    };

    test('should make api call but does not dispatch as there is no response', () => {
      const response = null;

      return expectSaga(getMappingMetadata, { integrationId })
        .provide([[call(apiCallWithRetry, args), response]])
        .call(apiCallWithRetry, args)
        .not.put(
          actions.integrationApp.settings.mappingMetadataUpdate(
            integrationId,
            response
          )
        )
        .run();
    });
    test('should dispatch mappingMetadataUpdate on successful api call with response', () => {
      const response = { dummy: 'dummy' };

      return expectSaga(getMappingMetadata, { integrationId })
        .provide([[call(apiCallWithRetry, args), response]])
        .call(apiCallWithRetry, args)
        .put(
          actions.integrationApp.settings.mappingMetadataUpdate(
            integrationId,
            response
          )
        )
        .run();
    });
    test('if the api call fails, should dispatch mappingMetadataError', () => {
      const error = { code: 'dummy', message: 'dummy' };

      return expectSaga(getMappingMetadata, { integrationId })
        .provide([[call(apiCallWithRetry, args), throwError(error)]])
        .call(apiCallWithRetry, args)
        .put(
          actions.integrationApp.settings.mappingMetadataError(
            integrationId,
            error.message
          )
        )
        .run();
    });
  });
});
describe('uninstaller2.0 saga', () => {
  const id = '123';

  describe('initUninstall generator', () => {
    test('should make an API call and dispatch resource request action', () => expectSaga(initUninstall, { id })
      .provide([[matchers.call.fn(apiCallWithRetry)]])
      .call.fn(apiCallWithRetry)
      .put(actions.resource.request('integrations', '123'))
      .run());

    test('should dispatch failed action if API call throws error', () => {
      const error = { code: 404, message: 'integration not found' };

      return expectSaga(initUninstall, { id })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
        .call.fn(apiCallWithRetry)
        .not.put(actions.resource.request('integrations', '123'))
        .put(
          actions.integrationApp.uninstaller2.failed(
            id,
            error.message
          )
        )
        .run();
    });
  });

  describe('uninstallStep generator', () => {
    test('should make API call and dispatch received steps action, if there is an API response', () => {
      const uninstallSteps = [{type: 'form', completed: true}, {type: 'url', completed: false}];

      return expectSaga(uninstallStep, { id })
        .provide([[matchers.call.fn(apiCallWithRetry), uninstallSteps]])
        .call.fn(apiCallWithRetry)
        .put(
          actions.integrationApp.uninstaller2.receivedSteps(
            id,
            uninstallSteps,
          )
        )
        .run();
    });
    test('should make API call and dispatch resource request action, if there is no API response', () => expectSaga(uninstallStep, { id })
      .provide([[matchers.call.fn(apiCallWithRetry), undefined]])
      .call.fn(apiCallWithRetry)
      .put(
        actions.integrationApp.uninstaller2.updateStep(
          id,
          'completed'
        )
      )
      .put(actions.resource.requestCollection('integrations'))
      .put(
        actions.integrationApp.uninstaller2.complete(
          id,
        )
      )
      .not.put(
        actions.integrationApp.uninstaller2.receivedSteps(
          id,
          [],
        )
      )
      .run());
    test('should dispatch failed action if API call throws error', () => {
      const error = { code: 404, message: 'integration not found' };

      return expectSaga(uninstallStep, { id })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
        .call.fn(apiCallWithRetry)
        .not.put(
          actions.integrationApp.uninstaller2.receivedSteps(
            id,
            [],
          )
        )
        .put(
          actions.integrationApp.uninstaller2.failed(
            id,
            error.message
          )
        )
        .run();
    });
  });

  describe('requestSteps generator', () => {
    test('should make API call and dispatch received steps action', () => {
      const uninstallSteps = [{type: 'form', completed: true}, {type: 'url', completed: false}];

      return expectSaga(requestSteps, { id })
        .provide([[matchers.call.fn(apiCallWithRetry), uninstallSteps]])
        .call.fn(apiCallWithRetry)
        .put(
          actions.integrationApp.uninstaller2.receivedSteps(
            id,
            uninstallSteps,
          )
        )
        .not.call(uninstallStep, { id })
        .run();
    });
    test('should make API call and call uninstallStep function if all steps are completed', () => {
      const uninstallSteps = [{type: 'form', completed: true}, {type: 'url', completed: true}];

      return expectSaga(requestSteps, { id })
        .provide([[matchers.call.fn(apiCallWithRetry), uninstallSteps]])
        .call.fn(apiCallWithRetry)
        .put(
          actions.integrationApp.uninstaller2.receivedSteps(
            id,
            uninstallSteps,
          )
        )
        .call(uninstallStep, { id })
        .run();
    });
    test('should dispatch failed action if API call throws error', () => {
      const error = { code: 404, message: 'integration not found' };

      return expectSaga(requestSteps, { id })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
        .call.fn(apiCallWithRetry)
        .not.put(
          actions.integrationApp.uninstaller2.receivedSteps(
            id,
            [],
          )
        )
        .put(
          actions.integrationApp.uninstaller2.failed(
            id,
            error.message
          )
        )
        .run();
    });
  });
});
