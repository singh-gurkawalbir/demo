/* global describe, test, expect */
import reducer, * as selectors from '.';
import actions from '../../../actions';
import { SUITESCRIPT_CONNECTORS } from '../../../utils/constants';

describe('suiteScript reducers test cases', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({
      resourceForm: {},
      flows: {},
      installer: {},
      account: {},
    });
  });
  describe('suiteScript installer reducer', () => {
    describe('INIT_STEPS action', () => {
      test('should return empty steps if connector not found', () => {
        const newState = reducer(
          undefined,
          actions.suiteScript.installer.initSteps(
            'dummy_connector_id'
          )
        );
        const expectedState = {dummy_connector_id: {}};
        expect(newState.installer).toEqual(expectedState);
      });
      test('should set the install steps if connector is found', () => {
        const newState = reducer(
          undefined,
          actions.suiteScript.installer.initSteps(
            'suitescript-salesforce-netsuite'
          )
        );
        const expectedState = {'suitescript-salesforce-netsuite': {steps: SUITESCRIPT_CONNECTORS[0].installSteps}};
        expect(newState.installer).toEqual(expectedState);
      });
      test('should not affect any other connector state', () => {
        const state = {installer: {some_other_id: {steps: [{id: 1}, {id: 2}]}}};
        const newState = reducer(
          state,
          actions.suiteScript.installer.initSteps(
            'suitescript-salesforce-netsuite'
          )
        );
        const expectedState = {some_other_id: {steps: [{id: 1}, {id: 2}]}, 'suitescript-salesforce-netsuite': {steps: SUITESCRIPT_CONNECTORS[0].installSteps}};
        expect(newState.installer).toEqual(expectedState);
      });
    });

    describe('FAILED action', () => {
      test('should save error in state object', () => {
        const newState = reducer(
          undefined,
          actions.suiteScript.installer.failed(
            'suitescript-salesforce-netsuite',
            'some error msg'
          )
        );
        const expectedState = {'suitescript-salesforce-netsuite': {error: 'some error msg'}};
        expect(newState.installer).toEqual(expectedState);
      });
      test('should not affect any other connector state', () => {
        const state = {installer: {some_other_id: {steps: [{id: 1}, {id: 2}]}}};
        const newState = reducer(
          state,
          actions.suiteScript.installer.failed(
            'suitescript-salesforce-netsuite',
            'some error msg'
          )
        );
        const expectedState = {some_other_id: {steps: [{id: 1}, {id: 2}]}, 'suitescript-salesforce-netsuite': {error: 'some error msg'}};
        expect(newState.installer).toEqual(expectedState);
      });
    });

    describe('CLEAR_STEPS action', () => {
      test('should delete the connector state', () => {
        const state = {installer: {'suitescript-salesforce-netsuite': {error: 'some error msg'}}};
        const newState = reducer(
          state,
          actions.suiteScript.installer.clearSteps(
            'suitescript-salesforce-netsuite',
          )
        );
        expect(newState.installer).toEqual({});
      });
      test('should not affect any other connector state', () => {
        const state = {installer: {some_other_id: {steps: [{id: 1}, {id: 2}]}}, 'suitescript-salesforce-netsuite': {steps: []}};
        const newState = reducer(
          state,
          actions.suiteScript.installer.clearSteps(
            'suitescript-salesforce-netsuite',
          )
        );
        const expectedState = {some_other_id: {steps: [{id: 1}, {id: 2}]}};
        expect(newState.installer).toEqual(expectedState);
      });
    });

    describe('UPDATE LINKED_CONNECTION action', () => {
      test('should save ss linked connection id in the state', () => {
        const newState = reducer(
          undefined,
          actions.suiteScript.installer.updateSSLinkedConnectionId(
            'suitescript-salesforce-netsuite',
            '123'
          )
        );
        const expectedState = {'suitescript-salesforce-netsuite': {ssLinkedConnectionId: '123'}};
        expect(newState.installer).toEqual(expectedState);
      });
      test('should not affect any other connector state', () => {
        const state = {installer: {some_other_id: {steps: [{id: 1}, {id: 2}]}, 'suitescript-salesforce-netsuite': {steps: []}}};
        const newState = reducer(
          state,
          actions.suiteScript.installer.updateSSLinkedConnectionId(
            'suitescript-salesforce-netsuite',
            '123'
          )
        );
        const expectedState = {some_other_id: {steps: [{id: 1}, {id: 2}]}, 'suitescript-salesforce-netsuite': {steps: [], ssLinkedConnectionId: '123'}};
        expect(newState.installer).toEqual(expectedState);
      });
    });

    describe('UPDATE SS_INTEGRATION_ID action', () => {
      test('should save ss integration id in the state', () => {
        const newState = reducer(
          undefined,
          actions.suiteScript.installer.updateSSIntegrationId(
            'suitescript-salesforce-netsuite',
            '123'
          )
        );
        const expectedState = {'suitescript-salesforce-netsuite': {ssIntegrationId: '123'}};
        expect(newState.installer).toEqual(expectedState);
      });
      test('should not affect any other connector state', () => {
        const state = {installer: {some_other_id: {steps: [{id: 1}, {id: 2}]}, 'suitescript-salesforce-netsuite': {steps: []}}};
        const newState = reducer(
          state,
          actions.suiteScript.installer.updateSSIntegrationId(
            'suitescript-salesforce-netsuite',
            '123'
          )
        );
        const expectedState = {some_other_id: {steps: [{id: 1}, {id: 2}]}, 'suitescript-salesforce-netsuite': {steps: [], ssIntegrationId: '123'}};
        expect(newState.installer).toEqual(expectedState);
      });
    });

    describe('UPDATE SS_CONNECTION action', () => {
      test('should save ss connection doc in the state', () => {
        const newState = reducer(
          undefined,
          actions.suiteScript.installer.updateSSConnection(
            'suitescript-salesforce-netsuite',
            'connection_id',
            {type: 'netsuite'}
          )
        );
        const expectedState = {'suitescript-salesforce-netsuite': {connection_id: {type: 'netsuite'}}};
        expect(newState.installer).toEqual(expectedState);
      });
      test('should not affect any other connector state', () => {
        const state = {installer: {some_other_id: {steps: [{id: 1}, {id: 2}]}, 'suitescript-salesforce-netsuite': {steps: [], ssLinkedConnectionId: '123'}}};
        const newState = reducer(
          state,
          actions.suiteScript.installer.updateSSConnection(
            'suitescript-salesforce-netsuite',
            'connection_id',
            {type: 'netsuite'}
          )
        );
        const expectedState = {some_other_id: {steps: [{id: 1}, {id: 2}]}, 'suitescript-salesforce-netsuite': {steps: [], ssLinkedConnectionId: '123', connection_id: {type: 'netsuite'}}};
        expect(newState.installer).toEqual(expectedState);
      });
    });

    describe('UPDATE PACKAGE action', () => {
      test('should do nothing if package step not found', () => {
        const state = {installer: {'suitescript-salesforce-netsuite': {steps: [{
          name: 'NetSuite Connection',
          type: 'connection'
        }]}}};

        const newState = reducer(
          state,
          actions.suiteScript.installer.updatePackage(
            'suitescript-salesforce-netsuite',
            'verifyIntegratorPackage',
            'https://someurl'
          )
        );
        expect(newState.installer).toEqual(state.installer);
      });
      test('should update the package url in the step', () => {
        const state = {installer: {'suitescript-salesforce-netsuite': {steps: [{
          name: 'Integrator package',
          type: 'package',
          installURL: 'https://login.salesforce.com/oldUrl',
          installerFunction: 'verifyIntegratorPackage',
          description: 'Install integrator package in Salesforce.',
          imageURL: '/images/company-logos/salesforce.png',
          completed: false,
          __index: 6
        }]}}};

        const newState = reducer(
          state,
          actions.suiteScript.installer.updatePackage(
            'suitescript-salesforce-netsuite',
            'verifyIntegratorPackage',
            'https://login.salesforce.com/newUrl'
          )
        );

        const expectedState = {'suitescript-salesforce-netsuite': {steps: [{
          name: 'Integrator package',
          type: 'package',
          installURL: 'https://login.salesforce.com/newUrl',
          installerFunction: 'verifyIntegratorPackage',
          description: 'Install integrator package in Salesforce.',
          imageURL: '/images/company-logos/salesforce.png',
          completed: false,
          __index: 6
        }]}};

        expect(newState.installer).toEqual(expectedState);
      });
      test('should not affect any other connector state', () => {
        const state = {installer: {some_other_id: {steps: [{id: 1}, {id: 2}]},
          'suitescript-salesforce-netsuite': {steps: [{
            name: 'Integrator package',
            type: 'package',
            installURL: 'https://login.salesforce.com/oldUrl',
            installerFunction: 'verifyIntegratorPackage',
            description: 'Install integrator package in Salesforce.',
            imageURL: '/images/company-logos/salesforce.png',
            completed: false,
            __index: 6
          }],
          ssLinkedConnectionId: '123'}}};

        const newState = reducer(
          state,
          actions.suiteScript.installer.updatePackage(
            'suitescript-salesforce-netsuite',
            'verifyIntegratorPackage',
            'https://login.salesforce.com/newUrl'
          )
        );

        const expectedState = {some_other_id: {steps: [{id: 1}, {id: 2}]},
          'suitescript-salesforce-netsuite': {steps: [{name: 'Integrator package',
            type: 'package',
            installURL: 'https://login.salesforce.com/newUrl',
            installerFunction: 'verifyIntegratorPackage',
            description: 'Install integrator package in Salesforce.',
            imageURL: '/images/company-logos/salesforce.png',
            completed: false,
            __index: 6
          }],
          ssLinkedConnectionId: '123'}};

        expect(newState.installer).toEqual(expectedState);
      });
    });

    describe('UPDATE STEP action', () => {
      test('should update the state with the uncompleted step status', () => {
        const state = {installer: {'suitescript-salesforce-netsuite': {steps: [{
          name: 'NetSuite Connection',
          type: 'connection',
          completed: false
        }]}}};

        const newState = reducer(
          state,
          actions.suiteScript.installer.updateStep(
            'suitescript-salesforce-netsuite',
            'inProgress'
          )
        );

        const expectedState = {'suitescript-salesforce-netsuite': {steps: [{
          name: 'NetSuite Connection',
          type: 'connection',
          completed: false,
          isTriggered: true,
          verifying: false
        }]}};
        expect(newState.installer).toEqual(expectedState);
      });
      test('should not modify already completed steps', () => {
        const state = {installer: {'suitescript-salesforce-netsuite': {steps: [{
          name: 'NetSuite Connection',
          type: 'connection',
          completed: true
        }, {
          name: 'Salesforce Connection',
          type: 'connection',
          completed: false
        }]}}};

        const newState = reducer(
          state,
          actions.suiteScript.installer.updateStep(
            'suitescript-salesforce-netsuite',
            'completed'
          )
        );

        const expectedState = {'suitescript-salesforce-netsuite': {steps: [{
          name: 'NetSuite Connection',
          type: 'connection',
          completed: true
        }, {
          name: 'Salesforce Connection',
          type: 'connection',
          completed: true,
          isTriggered: false,
          verifying: false
        }]}};
        expect(newState.installer).toEqual(expectedState);
      });
      test('should do nothing if all steps are completed', () => {
        const state = {installer: {'suitescript-salesforce-netsuite': {steps: [{
          name: 'NetSuite Connection',
          type: 'connection',
          completed: true
        }, {
          name: 'Salesforce Connection',
          type: 'connection',
          completed: true
        }]}}};

        const newState = reducer(
          state,
          actions.suiteScript.installer.updateStep(
            'suitescript-salesforce-netsuite',
            'reset'
          )
        );

        expect(newState.installer).toEqual(state.installer);
      });
    });
  });
});

describe('suiteScript selectors test cases', () => {
  describe('suiteScript installer selectors', () => {
    describe('installerData', () => {
      test('should return empty state when no match found.', () => {
        expect(selectors.installerData(undefined, 'dummy')).toEqual(
          {}
        );
        expect(selectors.installerData({}, 'dummy')).toEqual({});
      });

      test('should return correct state data when a match is found.', () => {
        const newState = reducer(
          undefined,
          actions.suiteScript.installer.initSteps(
            'suitescript-salesforce-netsuite'
          )
        );
        const expectedData = {steps: SUITESCRIPT_CONNECTORS[0].installSteps};
        expect(selectors.installerData(newState, 'suitescript-salesforce-netsuite')).toEqual(expectedData);
      });
    });
  });
});
