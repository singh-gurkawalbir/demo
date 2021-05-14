/* global describe, test */

import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { call, select } from 'redux-saga/effects';
import { selectors } from '../../reducers';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { openOAuthWindowForConnection } from '../resourceForm/connections/index';
import { getResource } from '../resources';
import {
  installStep,
  installScriptStep,
  getCurrentStep,
  addNewStore,
  installStoreStep,
  installInitChild,
} from './installer';
import {
  requestUpgrade,
  upgrade,
  getAddOnLicenseMetadata,
  getCategoryMappingMetadata,
  saveCategoryMappings,
  getMappingMetadata,
} from './settings';
import { preUninstall, uninstallIntegration, uninstallStep as uninstallStepGen } from './uninstaller';
import {initUninstall, uninstallStep, requestSteps} from './uninstaller2.0';
import {resumeIntegration} from './resume';

describe('installer saga', () => {
  describe('installStep generator', () => {
    const id = 'dummyId';
    const installerFunction = () => {};
    const childId = 'dummyChildId';
    const path = `/integrations/${id}/installer/${installerFunction}`;
    const args = {
      path,
      timeout: 5 * 60 * 1000,
      opts: { body: { storeId: childId }, method: 'PUT' },
      hidden: true,
    };

    test('if api call is successful but without response, should not dispatch any action', () => {
      const addOnId = 'dummyAddOnId';
      const stepCompleteResponse = null;

      args.opts.body.addOnId = addOnId;

      return expectSaga(installStep, {
        id,
        installerFunction,
        childId,
        addOnId,
      })
        .provide([[call(apiCallWithRetry, args), stepCompleteResponse]])
        .call(apiCallWithRetry, args)
        .not.put(
          actions.api.failure(
            path,
            'PUT',
            null,
            false
          )
        )
        .run();
    });
    test('if api call is successful but stepCompleteResponse.success is false, should dispatch api.failure', () => {
      const addOnId = 'dummyAddOnId';
      const stepCompleteResponse = {
        success: false,
        resBody: {dummy: 'dummy'},
      };

      args.opts.body.addOnId = addOnId;

      return expectSaga(installStep, {
        id,
        installerFunction,
        childId,
        addOnId,
      })
        .provide([[call(apiCallWithRetry, args), stepCompleteResponse]])
        .call(apiCallWithRetry, args)
        .put(
          actions.api.failure(
            path,
            'PUT',
            stepCompleteResponse.resBody || stepCompleteResponse.message,
            false
          )
        )
        .run();
    });
    test('if api is successful and response is a success, should dispatch completedInstall and other actions if addOnId is present', () => {
      const addOnId = 'dummyAddOnId';
      const stepCompleteResponse = {
        success: true,
        stepsToUpdate: [{ a: 1, b: 2 }, { a: 2, b: 1 }],
      };

      args.opts.body.addOnId = addOnId;

      return expectSaga(installStep, {
        id,
        installerFunction,
        childId,
        addOnId,
      })
        .provide([[call(apiCallWithRetry, args), stepCompleteResponse]])
        .call(apiCallWithRetry, args)
        .put(
          actions.integrationApp.installer.completedStepInstall(
            stepCompleteResponse,
            id,
            installerFunction
          )
        )
        .put(actions.integrationApp.settings.requestAddOnLicenseMetadata(id))
        .put(actions.resource.request('integrations', id))
        .put(actions.resource.requestCollection('flows'))
        .put(actions.resource.requestCollection('exports'))
        .put(actions.resource.requestCollection('imports'))
        .put(actions.resource.requestCollection('connections'))
        .put(actions.integrationApp.isAddonInstallInprogress(false, addOnId))
        .run();
    });
    test('if api call fails, should dispatch updateStep and api.failure, and isAddOnInstallInprogress action if addOnId is present', () => {
      const addOnId = 'dummyAddOnId';
      const error = new Error();

      args.opts.body.addOnId = addOnId;

      return expectSaga(installStep, {
        id,
        installerFunction,
        childId,
        addOnId,
      })
        .provide([[call(apiCallWithRetry, args), throwError(error)]])
        .call(apiCallWithRetry, args)
        .put(actions.integrationApp.isAddonInstallInprogress(false, addOnId))
        .put(
          actions.integrationApp.installer.updateStep(
            id,
            installerFunction,
            'failed'
          )
        )
        .put(actions.api.failure(path, 'PUT', error.message, false))
        .run();
    });
  });
  describe('installScriptStep generator', () => {
    const id = '123';
    let connectionId = 'dummyId';
    let formSubmission = null;
    let stackId = 'dummyStackId';
    const path = `/integrations/${id}/installSteps`;
    let body = {};

    const args = {
      path,
      timeout: 5 * 60 * 1000,
      opts: {
        method: 'POST',
      },
      hidden: true,
    };

    test('if api call is successful but with warnings, should dispatch completedStepInstall and resource.request', () => {
      const connectionDoc = {
        rest: {
          authType: 'oauth',
        },
      };

      stackId = null;

      if (stackId) {
        body = {_stackId: stackId};
      } else {
        body = formSubmission ||
        (connectionId
          ? { _connectionId: connectionId }
          : { connection: connectionDoc });
      }

      args.opts.body = body;
      const stepCompleteResponse = {
        warnings: 'dummy',
      };
      const integration = {
        initChild: {
          function: 'somefunc',
        },
      };

      return expectSaga(installScriptStep, {
        id,
        connectionId,
        connectionDoc,
        formSubmission,
        stackId,
      })
        .provide([
          [select(selectors.resource, 'integrations', id), integration],
          [call(apiCallWithRetry, args), stepCompleteResponse],
          [call(installInitChild, { id })],
        ])
        .call(apiCallWithRetry, args)
        .call(installInitChild, { id })
        .put(
          actions.integrationApp.installer.completedStepInstall(
            { stepsToUpdate: [] },
            id
          )
        )
        .put(actions.resource.request('integrations', id))
        .run();
    });
    test('if api call is successful with response having a connection not authorized and is OAuth type, should authorize the connection and dispatch completedStepInstall', () => {
      const connectionDoc = {
        rest: {
          authType: 'oauth',
        },
      };

      stackId = null;
      formSubmission = {
        dummy: 'dummy',
      };

      if (stackId) {
        body = { _stackId: stackId };
      } else {
        body =
          formSubmission ||
          (connectionId
            ? { _connectionId: connectionId }
            : { connection: connectionDoc });
      }

      args.opts.body = body;
      const stepCompleteResponse = [
        {
          completed: false,
          _connectionId: '222',
        },
      ];
      const currentConnectionStep = {
        completed: false,
        _connectionId: '222',
      };

      return expectSaga(installScriptStep, {
        id,
        connectionId,
        connectionDoc,
        formSubmission,
        stackId,
      })
        .provide([
          [call(apiCallWithRetry, args), stepCompleteResponse],
          [
            call(
              openOAuthWindowForConnection,
              currentConnectionStep._connectionId
            ),
          ],
        ])
        .call(apiCallWithRetry, args)
        .put(actions.resource.request('connections', currentConnectionStep._connectionId))
        .put(
          actions.integrationApp.installer.setOauthConnectionMode(
            currentConnectionStep._connectionId,
            true,
            id
          )
        )
        .call(openOAuthWindowForConnection, currentConnectionStep._connectionId)
        .put(
          actions.integrationApp.installer.completedStepInstall(
            { stepsToUpdate: stepCompleteResponse },
            id
          )
        )
        .run();
    });
    test('if api is successful but connectionDoc is empty, should dispatch completedStepInstall only', () => {
      const connectionDoc = null;

      if (stackId) {
        body = {_stackId: stackId};
      } else {
        body = formSubmission ||
        (connectionId
          ? { _connectionId: connectionId }
          : { connection: connectionDoc });
      }

      args.opts.body = body;
      const stepCompleteResponse = [
        {
          completed: false,
          _connectionId: '222',
        },
      ];
      const currentConnectionStep = {
        completed: false,
        _connectionId: '222',
      };

      return expectSaga(installScriptStep, {
        id,
        connectionId,
        connectionDoc,
        formSubmission,
        stackId,
      })
        .provide([[call(apiCallWithRetry, args), stepCompleteResponse]])
        // .call(apiCallWithRetry, args)
        .not.put(actions.resource.request('connections', currentConnectionStep._connectionId))
        .not.put(
          actions.integrationApp.installer.setOauthConnectionMode(
            currentConnectionStep._connectionId,
            true,
            id
          )
        )
        .put(
          actions.integrationApp.installer.completedStepInstall(
            { stepsToUpdate: stepCompleteResponse },
            id
          )
        )
        .run();
    });
    test('if api call is successful with response having a connection not authorized and is OAuth type, but the authorization of connection fails', () => {
      const connectionDoc = {
        rest: {
          authType: 'oauth',
        },
      };

      stackId = null;
      connectionId = null;

      if (stackId) {
        body = {_stackId: stackId};
      } else {
        body = formSubmission ||
        (connectionId
          ? { _connectionId: connectionId }
          : { connection: connectionDoc });
      }

      args.opts.body = body;
      const stepCompleteResponse = [
        {
          completed: false,
          _connectionId: '222',
        },
      ];
      const currentConnectionStep = {
        completed: false,
        _connectionId: '222',
      };

      return expectSaga(installScriptStep, {
        id,
        connectionId,
        connectionDoc,
        formSubmission,
        stackId,
      })
        .provide([
          [call(apiCallWithRetry, args), stepCompleteResponse],
          [call(openOAuthWindowForConnection, currentConnectionStep._connectionId), throwError()],
        ])
        .call(apiCallWithRetry, args)
        .put(actions.resource.request('connections', currentConnectionStep._connectionId))
        .put(
          actions.integrationApp.installer.setOauthConnectionMode(
            currentConnectionStep._connectionId,
            true,
            id
          )
        )
        .call(openOAuthWindowForConnection, currentConnectionStep._connectionId)
        .put(
          actions.integrationApp.installer.completedStepInstall(
            { stepsToUpdate: stepCompleteResponse },
            id
          )
        )
        .run();
    });
    test('if api call fails with some error message and both connectionDoc and connectionId are null, should dispatch completedStepInstall, updateStep and api.failure', () => {
      const connectionDoc = null;

      connectionId = null;

      if (stackId) {
        body = {_stackId: stackId};
      } else {
        body = formSubmission ||
        (connectionId
          ? { _connectionId: connectionId }
          : { connection: connectionDoc });
      }

      args.opts.body = body;
      const error = {
        message: {
          steps: [{ a: 1, b: 2 }, { a: 2, b: 1 }],
        },
      };

      return expectSaga(installScriptStep, {
        id,
        connectionId,
        connectionDoc,
        formSubmission,
        stackId,
      })
        .provide([[call(apiCallWithRetry, args), throwError(error)]])
        .call(apiCallWithRetry, args)
        .put(
          actions.integrationApp.installer.completedStepInstall(
            { stepsToUpdate: error.message.steps },
            id
          )
        )
        .not.put(actions.resource.requestCollection('connections'))
        .put(actions.integrationApp.installer.updateStep(id, '', 'failed'))
        .put(actions.api.failure(path, 'PUT', error.message, false))
        .run();
    });
    test('if api call fails with some error message and either of connectionDoc or connectionId is truthy, should dispatch completedStepInstall, requestCollection, updateStep and api.failure', () => {
      const connectionDoc = {
        rest: {
          authType: 'oauth',
        },
      };

      connectionId = null;

      if (stackId) {
        body = {_stackId: stackId};
      } else {
        body = formSubmission ||
        (connectionId
          ? { _connectionId: connectionId }
          : { connection: connectionDoc });
      }

      args.opts.body = body;
      const error = {
        message: {
          steps: [{ a: 1, b: 2 }, { a: 2, b: 1 }],
        },
      };

      return expectSaga(installScriptStep, {
        id,
        connectionId,
        connectionDoc,
        formSubmission,
        stackId,
      })
        .provide([[call(apiCallWithRetry, args), throwError(error)]])
        .call(apiCallWithRetry, args)
        .put(
          actions.integrationApp.installer.completedStepInstall(
            { stepsToUpdate: error.message.steps },
            id
          )
        )
        .put(actions.resource.requestCollection('connections'))
        .put(actions.integrationApp.installer.updateStep(id, '', 'failed'))
        .put(actions.api.failure(path, 'PUT', error.message, false))
        .run();
    });
    test('if api call fails and error message does not have any steps to complete, should dispatch updateStep and api.failure', () => {
      const connectionDoc = {
        rest: {
          authType: 'oauth',
        },
      };

      connectionId = null;

      if (stackId) {
        body = {_stackId: stackId};
      } else {
        body = formSubmission ||
        (connectionId
          ? { _connectionId: connectionId }
          : { connection: connectionDoc });
      }

      args.opts.body = body;
      const error = {
        message: {
          steps: null,
        },
      };

      return expectSaga(installScriptStep, {
        id,
        connectionId,
        connectionDoc,
        formSubmission,
        stackId,
      })
        .provide([[call(apiCallWithRetry, args), throwError(error)]])
        .call(apiCallWithRetry, args)
        .not.put(
          actions.integrationApp.installer.completedStepInstall(
            { stepsToUpdate: null },
            id
          )
        )
        .put(actions.integrationApp.installer.updateStep(id, '', 'failed'))
        .put(actions.api.failure(path, 'PUT', error.message, false))
        .run();
    });
  });
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

    test('should make API call when init function present and dispatch action with same form meta if response is null or result is false', () => {
      const step = { type: 'form', form, initFormFunction: 'somefunc' };
      const args = {
        path: `/integrations/${id}/currentStep`,
        timeout: 5 * 60 * 1000,
        opts: {
          method: 'GET',
        },
        hidden: true,
      };
      const expectedOut = {
        result: null,
      };

      return expectSaga(getCurrentStep, { id, step })
        .provide([[call(apiCallWithRetry, args), expectedOut]])
        .call(apiCallWithRetry, args)
        .put(
          actions.integrationApp.installer.updateStep(
            id,
            '',
            'inProgress',
            step.form
          )
        )
        .run();
    });

    test('should make API call when init function present and dispatch action with updated form meta', () => {
      const step = { type: 'form', form, initFormFunction: 'somefunc' };
      const args = {
        path: `/integrations/${id}/currentStep`,
        timeout: 5 * 60 * 1000,
        opts: {
          method: 'GET',
        },
        hidden: true,
      };
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
        .provide([[call(apiCallWithRetry, args), expectedOut]])
        .call(apiCallWithRetry, args)
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
      const args = {
        path: `/integrations/${id}/currentStep`,
        timeout: 5 * 60 * 1000,
        opts: {
          method: 'GET',
        },
        hidden: true,
      };
      const error = { code: 422, message: 'unprocessable entity' };

      return expectSaga(getCurrentStep, { id, step })
        .provide([[call(apiCallWithRetry, args), throwError(error)]])
        .call(apiCallWithRetry, args)
        .put(actions.integrationApp.installer.updateStep(id, '', 'failed'))
        .run();
    });
  });
  describe('addNewStore generator', () => {
    const id = '123';
    const path = `/integrations/${id}/installer/addNewStore`;
    const args = {
      path,
      opts: { body: {}, method: 'PUT' },
      hidden: true,
      message: 'Installing',
    };

    test('if api call is successful without any response, should not dispatch any actions', () => {
      const steps = null;

      return expectSaga(addNewStore, { id })
        .provide([[call(apiCallWithRetry, args), steps]])
        .call(apiCallWithRetry, args)
        .not.put(actions.resource.request('connections'))
        .run();
    });
    test('if api call is successful with response, should dispatch receivedNewStoreSteps', () => {
      const steps = [
        {
          completed: false,
          description: 'Install the bank in CAM',
          imageURL: '/images/company-logos/cashapp.png',
          installerFunction: 'installConnectorComponents',
          name: 'Install Bank',
        },
        {
          completed: false,
          description: 'Install the bundle in NetSuite',
          imageURL: '/images/company-logos/netsuite.png',
          installerFunction: 'installConnectorComponents',
          name: 'Install Bundle in NetSuite',
        },
      ];

      return expectSaga(addNewStore, { id })
        .provide([[call(apiCallWithRetry, args), steps]])
        .call(apiCallWithRetry, args)
        .put(actions.resource.requestCollection('connections'))
        .put(actions.integrationApp.store.receivedNewStoreSteps(id, steps))
        .run();
    });
    test('if api call fails, should dispatch api.failure and failedNewStoreSteps', () => {
      const error = new Error();

      return expectSaga(addNewStore, { id })
        .provide([[call(apiCallWithRetry, args), throwError(error)]])
        .call(apiCallWithRetry, args)
        .put(actions.api.failure(path, 'PUT', error && error.message, false))
        .put(
          actions.integrationApp.store.failedNewStoreSteps(id, error.message)
        )
        .run();
    });
  });
  describe('installStoreStep generator', () => {
    const id = '123';
    const installerFunction = () => {};
    const path = `/integrations/${id}/installer/${installerFunction}`;
    const args = {
      path,
      timeout: 5 * 60 * 1000,
      opts: { body: {}, method: 'PUT' },
      hidden: true,
      message: 'Installing',
    };

    test('if api call is successful without any response, should not dispatch any actions', () => {
      const stepCompleteResponse = null;

      return expectSaga(installStoreStep, { id, installerFunction })
        .provide([[call(apiCallWithRetry, args), stepCompleteResponse]])
        .call(apiCallWithRetry, args)
        .not.put(
          actions.api.failure(
            path,
            'PUT',
            null,
            false
          )
        )
        .run();
    });
    test('if api call is successful but stepCompleteResponse.success is false, should dispatch api.failure', () => {
      const stepCompleteResponse = {
        success: false,
        resBody: {
          dummy: 'dummy',
        },
      };

      return expectSaga(installStoreStep, { id, installerFunction })
        .provide([[call(apiCallWithRetry, args), stepCompleteResponse]])
        .call(apiCallWithRetry, args)
        .put(
          actions.api.failure(
            path,
            'PUT',
            stepCompleteResponse.resBody || stepCompleteResponse.message,
            false
          )
        )
        .run();
    });
    test('if api call is successful with stepCompleteResponse.success true, should dispatch completedStepInstall with stepsToUpdate', () => {
      const stepCompleteResponse = {
        success: true,
        stepsToUpdate: [
          {step1: 'step1 name', installerFunction: 'installerFunction', dummy1: 'value1'},
          {step2: 'step2 name', installerFunction: 'installerFunction2', dummy2: 'value2'},
        ],
      };

      return expectSaga(installStoreStep, { id, installerFunction })
        .provide([
          [call(apiCallWithRetry, args), stepCompleteResponse],
          [call(getResource, { resourceType: 'integrations', id })],
        ])
        .call(apiCallWithRetry, args)
        .call(getResource, { resourceType: 'integrations', id })
        .put(
          actions.integrationApp.store.completedStepInstall(
            id,
            installerFunction,
            stepCompleteResponse.stepsToUpdate
          )
        )
        .run();
    });
    test('if api call fails, should dispatch updateStep with flag as failed', () => {
      const error = new Error();

      return expectSaga(installStoreStep, { id, installerFunction })
        .provide([[call(apiCallWithRetry, args), throwError(error)]])
        .call(apiCallWithRetry, args)
        .put(
          actions.integrationApp.store.updateStep(
            id,
            installerFunction,
            'failed'
          )
        )
        .put(actions.api.failure(path, 'PUT', error, false))
        .run();
    });
  });
  describe('installInitChild generator', () => {
    const id = '123';
    const path = `/integrations/${id}/initChild`;
    const args = {
      path,
      timeout: 5 * 60 * 1000,
      opts: {
        method: 'POST',
      },
      hidden: true,
    };

    test('if api call is successful, should dispatch resource.request and resource.updateChildIntegration', () => {
      const childIntegration = {
        _childIntegrationId: 'dummy',
      };

      return expectSaga(installInitChild, { id })
        .provide([[call(apiCallWithRetry, args), childIntegration]])
        .call(apiCallWithRetry, args)
        .put(
          actions.resource.request(
            'integrations',
            childIntegration._childIntegrationId
          )
        )
        .put(
          actions.resource.updateChildIntegration(
            id,
            childIntegration._childIntegrationId
          )
        )
        .run();
    });
    test('if api call fails, should dispatch api.failure with error message', () => {
      const error = new Error();

      return expectSaga(installInitChild, { id })
        .provide([[call(apiCallWithRetry, args), throwError(error)]])
        .call(apiCallWithRetry, args)
        .put(actions.api.failure(path, 'PUT', error.message, false))
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

    test('should make api call and dispatch receivedGeneratesMetadata if options,generatesMetadata is true', () => {
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
          actions.integrationApp.settings.categoryMappings.receivedGeneratesMetadata(
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
          actions.integrationApp.settings.categoryMappings.receivedUpdatedMappingData(
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
describe('uninstaller saga', () => {
  const childId = 's1';
  const id = '123';

  describe('preUninstall generator', () => {
    const path = `/integrations/${id}/uninstaller/preUninstallFunction`;

    test('should dispatch receivedUninstallSteps on successful api call', () => {
      const uninstallSteps = {};

      return expectSaga(preUninstall, { childId, id})
        .provide([
          [call(apiCallWithRetry, {
            path,
            timeout: 5 * 60 * 1000,
            opts: { body: { storeId: childId }, method: 'PUT' },
            message: 'Loading',
          }), uninstallSteps],
          [call(getResource, { resourceType: 'integrations', id })],
        ])
        .put(
          actions.integrationApp.uninstaller.receivedUninstallSteps(
            uninstallSteps,
            id
          )
        )
        .run();
    });
    test('should dispatch failedUninstallSteps if api call fails', () => {
      const error = { message: 'Failed to fetch Uninstall Steps.' };

      return expectSaga(preUninstall, {childId, id})
        .provide([
          [call(apiCallWithRetry, {
            path,
            timeout: 5 * 60 * 1000,
            opts: { body: { storeId: childId }, method: 'PUT' },
            message: 'Loading',
          }), throwError(error)],
        ])
        .put(actions.api.failure(path, 'PUT', error && error.message, false))
        .put(
          actions.integrationApp.uninstaller.failedUninstallSteps(
            id,
            error.message || 'Failed to fetch Uninstall Steps.'
          )
        )
        .not.put(
          actions.integrationApp.uninstaller.receivedUninstallSteps(
            undefined,
            id
          )
        )
        .run();
    });
  });

  describe('uninstallStep generator', () => {
    const uninstallerFunction = 'uninstallConnectorComponents';
    const path = `/integrations/${id}/uninstaller/${uninstallerFunction}`;

    test('should dispatch uninstaller updateStep and subsequent actions if api call is successful and addOnId is defined', () => {
      const addOnId = 'A123';
      const stepCompleteResponse = {
        success: true,
      };

      return expectSaga(uninstallStepGen, {childId, id, uninstallerFunction, addOnId})
        .provide([
          [call(apiCallWithRetry, {
            path,
            timeout: 5 * 60 * 1000,
            opts: { body: { storeId: childId, addOnId }, method: 'PUT' },
            message: 'Uninstalling',
          }), stepCompleteResponse],
          [call(getResource, {
            resourceType: 'integrations',
            id,
          })],
        ])
        .put(
          actions.integrationApp.uninstaller.updateStep(
            id,
            uninstallerFunction,
            'completed'
          )
        )
        .put(
          actions.integrationApp.settings.requestAddOnLicenseMetadata(id)
        )
        .put(
          actions.integrationApp.isAddonInstallInprogress(false, addOnId)
        )
        .run();
    });
    test('should dispatch uninstaller updateStep only if api call is successful and no addOnId defined', () => {
      const addOnId = undefined;
      const stepCompleteResponse = {
        success: true,
      };

      return expectSaga(uninstallStepGen, {childId, id, uninstallerFunction, addOnId})
        .provide([
          [call(apiCallWithRetry, {
            path,
            timeout: 5 * 60 * 1000,
            opts: { body: { storeId: childId, addOnId }, method: 'PUT' },
            message: 'Uninstalling',
          }), stepCompleteResponse],
          [call(getResource, {
            resourceType: 'integrations',
            id,
          })],
        ])
        .put(
          actions.integrationApp.uninstaller.updateStep(
            id,
            uninstallerFunction,
            'completed'
          )
        )
        .not.put(
          actions.integrationApp.settings.requestAddOnLicenseMetadata(id)
        )
        .not.put(
          actions.integrationApp.isAddonInstallInprogress(false, addOnId)
        )
        .run();
    });
    test('should not dispatch any action if api call is successfull with response failing', () => {
      const addOnId = 'A123';
      const stepCompleteResponse = {
        success: false,
      };

      return expectSaga(uninstallStepGen, {childId, id, uninstallerFunction, addOnId})
        .provide([
          [call(apiCallWithRetry, {
            path,
            timeout: 5 * 60 * 1000,
            opts: { body: { storeId: childId, addOnId }, method: 'PUT' },
            message: 'Uninstalling',
          }), stepCompleteResponse],
        ])
        .not.put(
          actions.integrationApp.uninstaller.updateStep(
            id,
            uninstallerFunction,
            'completed'
          )
        )
        .not.put(
          actions.integrationApp.settings.requestAddOnLicenseMetadata(id)
        )
        .not.put(
          actions.integrationApp.isAddonInstallInprogress(false, addOnId)
        )
        .run();
    });
    test('should dispatch updateStep and update install progress of addOn if api call fails and addOnId is defined', () => {
      const addOnId = 'A123';
      const error = { code: 'dummy', message: 'dummy' };

      return expectSaga(uninstallStepGen, {childId, id, uninstallerFunction, addOnId})
        .provide([
          [call(apiCallWithRetry, {
            path,
            timeout: 5 * 60 * 1000,
            opts: { body: { storeId: childId, addOnId }, method: 'PUT' },
            message: 'Uninstalling',
          }), throwError(error)],
        ])
        .put(
          actions.integrationApp.isAddonInstallInprogress(false, addOnId)
        )
        .put(
          actions.integrationApp.uninstaller.updateStep(
            id,
            uninstallerFunction,
            'failed'
          )
        )
        .run();
    });
    test('should dispatch only updateStep if api call fails and addOnId is not defined', () => {
      const addOnId = undefined;
      const error = { code: 'dummy', message: 'dummy' };

      return expectSaga(uninstallStepGen, {childId, id, uninstallerFunction, addOnId})
        .provide([
          [call(apiCallWithRetry, {
            path,
            timeout: 5 * 60 * 1000,
            opts: { body: { storeId: childId, addOnId }, method: 'PUT' },
            message: 'Uninstalling',
          }), throwError(error)],
        ])
        .not.put(
          actions.integrationApp.isAddonInstallInprogress(false, addOnId)
        )
        .put(
          actions.integrationApp.uninstaller.updateStep(
            id,
            uninstallerFunction,
            'failed'
          )
        )
        .run();
    });
  });
  describe('uninstallIntegration generator', () => {
    const integrationId = 'i1';
    const path = `/integrations/${integrationId}/install`;

    test('Should make an API call and dispatch resource request actions if api call succeeds', () => expectSaga(uninstallIntegration, { integrationId })
      .provide([
        [call(apiCallWithRetry, {
          path,
          timeout: 5 * 60 * 1000,
          opts: { body: {}, method: 'DELETE' },
          message: 'Uninstalling',
        })],
      ])
      .put(actions.resource.requestCollection('integrations'))
      .put(actions.resource.requestCollection('tiles'))
      .put(actions.resource.requestCollection('licenses'))
      .run());
    test('should not put any collection requests if resource call fails', () => {
      const error = { code: 'dummy', message: 'dummy' };

      return expectSaga(uninstallIntegration, { integrationId })
        .provide([
          [call(apiCallWithRetry, {
            path,
            timeout: 5 * 60 * 1000,
            opts: { body: {}, method: 'DELETE' },
            message: 'Uninstalling',
          }), throwError(error)],
        ])
        .not.put(actions.resource.requestCollection('integrations'))
        .not.put(actions.resource.requestCollection('tiles'))
        .not.put(actions.resource.requestCollection('licenses'))
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
    test('should dispatch update action if API call throws error', () => {
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
          actions.integrationApp.uninstaller2.updateStep(
            id,
            'reset'
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
describe('resumeIntegration Saga', () => {
  const integrationId = 'intId';

  test('should make API call and dispatch received steps action', () => expectSaga(resumeIntegration, { integrationId })
    .provide([[matchers.call.fn(apiCallWithRetry), {}]])
    .call.fn(apiCallWithRetry)
    .put(actions.resource.request('integrations', integrationId))
    .put(actions.resource.requestCollection('flows'))
    .put(actions.resource.requestCollection('exports'))
    .put(actions.resource.requestCollection('imports'))
    .run());

  test('should dispatch failed action if API call throws error', () => {
    const error = { message: 'Resume error' };

    return expectSaga(resumeIntegration, { integrationId })
      .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
      .call.fn(apiCallWithRetry)
      .run();
  });
});
