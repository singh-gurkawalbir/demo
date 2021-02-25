/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('integrationApps uninstaller reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    expect(reducer(undefined, { type: 'RANDOM_ACTION' })).toEqual({});
    expect(reducer(null, { type: 'RANDOM_ACTION' })).toEqual(null);
    expect(reducer(123, { type: 'RANDOM_ACTION' })).toEqual(123);
    expect(reducer('string', { type: 'RANDOM_ACTION' })).toEqual('string');
    expect(reducer(undefined, { type: null })).toEqual({});
    expect(reducer(undefined, { type: undefined })).toEqual({});
    expect(reducer(undefined, { type: 123 })).toEqual({});
  });
  describe('intetgrationApps uninstaller reducer', () => {
    const uninstallSteps = [
      {
        name: 'Uninstall Bank',
        description: 'Delete the bank in CAM',
        imageURL: '/images/company-logos/cashapp.png',
        completed: false,
        uninstallerFunction: 'uninstallConnectorComponents',
      },
      {
        name: 'Uninstall Bundle in NetSuite',
        description: 'Delete the bundle in NetSuite',
        imageURL: '/images/company-logos/netsuite.png',
        completed: false,
        uninstallerFunction: 'uninstallConnectorComponents',
      },
    ];

    describe('integrationApps preUninstall steps', () => {
      test('should create an integrationId reference inside uninstaller state object', () => {
        const state = reducer(
          undefined,
          actions.integrationApp.uninstaller.preUninstall(
            'storeId',
            'integrationId'
          )
        );

        expect(state).toEqual({integrationId: {}});
      });
      test('should try to find the integrationId reference inside uninstaller reducer state and reset it if any data present', () => {
        const state = reducer(
          { integrationId: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.preUninstall(
            'storeId',
            'integrationId'
          )
        );

        expect(state).toEqual({integrationId: {}});
      });
    });
    describe('integrationApps uninstaller install_inProgress action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { 1: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'INCORRECT_FUNCTION_NAME',
            'inProgress'
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and set isTriggered flag to true', () => {
        const state = reducer(
          { 1: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'uninstallConnectorComponents',
            'inProgress'
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                isTriggered: true,
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {

          1: { steps: uninstallSteps },
          2: { steps: uninstallSteps },

        };
        const state = reducer(
          initialState,
          actions.integrationApp.uninstaller.updateStep(
            integrationId,
            'uninstallConnectorComponents',
            'inProgress'
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                isTriggered: true,
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },
          2: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps uninstaller uninstall step verify action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          {1: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'INCORRECT_FUNCTION_NAME',
            'verify'
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and set verifying flag to true', () => {
        const state = reducer(
          { 1: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'uninstallConnectorComponents',
            'verify'
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                verifying: true,
                isTriggered: true,
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {

          1: { steps: uninstallSteps },
          2: { steps: uninstallSteps },

        };
        const state = reducer(
          initialState,
          actions.integrationApp.uninstaller.updateStep(
            integrationId,
            'uninstallConnectorComponents',
            'verify'
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                verifying: true,
                isTriggered: true,
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },
          2: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps uninstaller uninstall_step failed action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { 1: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'INCORRECT_FUNCTION_NAME',
            'failed'
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and reset all flags', () => {
        const state = reducer(
          { 1: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'uninstallConnectorComponents',
            'failed'
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                verifying: false,
                isTriggered: false,
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {

          1: { steps: uninstallSteps },
          2: { steps: uninstallSteps },

        };
        const state = reducer(
          initialState,
          actions.integrationApp.uninstaller.updateStep(
            integrationId,
            'uninstallConnectorComponents',
            'failed'
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                verifying: false,
                isTriggered: false,
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },
          2: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps uninstaller uninstall_step completed action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { 1: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'INCORRECT_FUNCTION_NAME',
            'completed'
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and reset all flags', () => {
        const state = reducer(
          { 1: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'uninstallConnectorComponents',
            'completed'
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: true,
                isTriggered: false,
                verifying: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {

          1: { steps: uninstallSteps },
          2: { steps: uninstallSteps },

        };
        const state = reducer(
          initialState,
          actions.integrationApp.uninstaller.updateStep(
            integrationId,
            'uninstallConnectorComponents',
            'completed'
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: true,
                description: 'Delete the bank in CAM',
                isTriggered: false,
                verifying: false,
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },
          2: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps uninstaller - received uninstaller steps reducer', () => {
      test('should update the uninstaller state to include the step received', () => {
        const state = reducer(
          undefined,
          actions.integrationApp.uninstaller.receivedUninstallSteps(
            uninstallSteps,
            2
          )
        );
        const expectedValue = {

          2: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect other integrations when new integration uninstall steps are received', () => {
        const state = reducer(
          { 1: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.receivedUninstallSteps(
            uninstallSteps,
            2
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },
          2: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect the state new integration uninstall steps are received and no integrationId is passed', () => {
        const state = reducer(
          { 1: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.receivedUninstallSteps(
            uninstallSteps,
            undefined
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect the state new integration uninstall steps are received and no integrationId is passed', () => {
        const state = reducer(
          { 1: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.receivedUninstallSteps(
            undefined,
            2
          )
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },
          2: {
            steps: undefined,
          },

        };

        expect(state).toEqual(expectedValue);
      });
    });
    describe('integrationApps uninstaller - failedInstall steps reducer', () => {
      test('should not throw any exception when invalid arguments are passed', () => {
        const dummyState = {
          2: {
            prop1: 'value1',
          },
        };
        let state = reducer(
          dummyState,
          actions.integrationApp.uninstaller.failedUninstallSteps()
        );

        expect(state).toEqual(dummyState);
        state = reducer(dummyState, actions.integrationApp.uninstaller.failedUninstallSteps(null, null, null));
        expect(state).toEqual(dummyState);
      });
      test('should update the error message on appropriate integration and should not affect other integrations data', () => {
        const state = reducer(
          {
            2: {
              prop1: 'value1',
            },
          },
          actions.integrationApp.uninstaller.failedUninstallSteps(1, 'Error_Message', '123')
        );

        expect(state).toEqual({ 1: { error: 'Error_Message' }, 2: { prop1: 'value1'} });
      });
    });
    describe('integrationApps uninstaller - clear steps reducer', () => {
      test('should update the uninstaller state and remove the integrationId if found', () => {
        const state = reducer(
          undefined,
          actions.integrationApp.uninstaller.clearSteps(2)
        );
        const expectedValue = {};

        expect(state).toEqual(expectedValue);
      });

      test('should update the uninstaller state and remove the integrationId if found', () => {
        const state = reducer(
          { 1: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.clearSteps(1)
        );
        const expectedValue = {};

        expect(state).toEqual(expectedValue);
      });
      test('should not affect other integrations when clearSteps is called on one integration', () => {
        const state = reducer(
          {

            1: { steps: uninstallSteps },
            2: { steps: uninstallSteps },

          },
          actions.integrationApp.uninstaller.clearSteps(2)
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect the state when clearSteps is called and no integrationId is passed', () => {
        const state = reducer(
          { 1: { steps: uninstallSteps } },
          actions.integrationApp.uninstaller.clearSteps()
        );
        const expectedValue = {

          1: {
            steps: [
              {
                completed: false,
                description: 'Delete the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Uninstall Bank',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
              {
                completed: false,
                description: 'Delete the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Uninstall Bundle in NetSuite',
                uninstallerFunction: 'uninstallConnectorComponents',
              },
            ],
          },

        };

        expect(state).toEqual(expectedValue);
      });
    });
  });
});

describe('integrationApps selectors test cases', () => {
  describe('uninstallData', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.uninstallData(undefined, 'dummy')).toEqual({});
      expect(selectors.uninstallData({}, 'dummy')).toEqual({});
      expect(selectors.uninstallData(null, 'dummy')).toEqual({});
      expect(selectors.uninstallData(null, null)).toEqual({});
      expect(selectors.uninstallData(123, null)).toEqual({});
      expect(selectors.uninstallData('string', null)).toEqual({});
      expect(selectors.uninstallData()).toEqual({});
    });

    test('should return correct state data when a match is found.', () => {
      const expectedData = { steps: [{step1: 'step1'}, {step2: 'step2'}] };
      const newState = reducer(
        {},
        actions.integrationApp.uninstaller.receivedUninstallSteps(
          [{step1: 'step1'}, {step2: 'step2'}],
          'integrationId'
        )
      );

      expect(selectors.uninstallData(newState, 'integrationId')).toEqual(expectedData);
    });
  });
  describe('uninstallSteps', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.uninstallSteps(undefined, 'dummy')).toEqual([]);
      expect(selectors.uninstallSteps({}, 'dummy')).toEqual([]);
      expect(selectors.uninstallSteps(null, 'dummy')).toEqual([]);
      expect(selectors.uninstallSteps(null, null)).toEqual([]);
      expect(selectors.uninstallSteps(123, null)).toEqual([]);
      expect(selectors.uninstallSteps('null', null)).toEqual([]);
      expect(selectors.uninstallSteps()).toEqual([]);
    });

    test('should return correct state data when a match is found.', () => {
      const expectedData = [{step1: 'step1'}, {step2: 'step2'}];
      const newState = reducer(
        {},
        actions.integrationApp.uninstaller.receivedUninstallSteps(
          [{step1: 'step1'}, {step2: 'step2'}],
          'integrationId'
        )
      );

      expect(selectors.uninstallSteps(newState, 'integrationId')).toEqual(expectedData);
    });
  });
});

