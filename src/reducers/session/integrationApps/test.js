/* global describe, test, expect */
import reducer from '.';
import actions from '../../../actions';

describe('integrationApps reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({
      installer: {},
      addon: {},
      clone: {},
      uninstaller: {},
      addStore: {},
      settings: {},
      uninstaller2: {},
    });
  });
  describe('intetgrationApps installer reducer', () => {
    describe('integrationApps received installer install_inProgress action', () => {
      test('should find the integration with id and set isTriggered flag to true', () => {
        const state = reducer(
          {},
          actions.integrationApp.installer.updateStep(
            1,
            'installerFunction',
            'inProgress'
          )
        );

        expect(state).toEqual({
          installer: { 1: { isTriggered: true } },
          addon: {},
          clone: {},
          uninstaller: {},
          settings: {},
          addStore: {},
          uninstaller2: {},
        });
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {
          installer: {
            1: { verifying: true },
            2: { isTriggered: true },
          },
        };
        const state = reducer(
          initialState,
          actions.integrationApp.installer.updateStep(
            integrationId,
            'installerFunction',
            'inProgress'
          )
        );

        expect(state).toEqual({
          installer: {
            1: { isTriggered: true, verifying: true },
            2: { isTriggered: true },
          },
          uninstaller: {},
          settings: {},
          addStore: {},
          addon: {},
          clone: {},
          uninstaller2: {},
        });
      });
    });

    describe('integrationApps installer install_verify action', () => {
      test('should find the integration with id and set isTriggered and verifying flag to true', () => {
        const state = reducer(
          {},
          actions.integrationApp.installer.updateStep(
            1,
            'installerFunction',
            'verify'
          )
        );

        expect(state).toEqual({
          installer: { 1: { isTriggered: true, verifying: true } },
          uninstaller: {},
          settings: {},
          addStore: {},
          addon: {},
          clone: {},
          uninstaller2: {},
        });
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {
          installer: {
            1: {},
            2: { isTriggered: true },
          },
        };
        const state = reducer(
          initialState,
          actions.integrationApp.installer.updateStep(
            integrationId,
            'installerFunction',
            'verify'
          )
        );

        expect(state).toEqual({
          installer: {
            1: { isTriggered: true, verifying: true },
            2: { isTriggered: true },
          },
          uninstaller: {},
          settings: {},
          addStore: {},
          addon: {},
          clone: {},
          uninstaller2: {},
        });
      });
    });

    describe('integrationApps installer install_failed action', () => {
      test('should find the integration with id and set isTriggered flag to true', () => {
        const state = reducer(
          {
            installer: { 1: { isTriggered: true } },
          },
          actions.integrationApp.installer.updateStep(
            1,
            'installerFunction',
            'failed'
          )
        );

        expect(state).toEqual({
          installer: { 1: { isTriggered: false, verifying: false } },
          uninstaller: {},
          settings: {},
          addStore: {},
          addon: {},
          clone: {},
          uninstaller2: {},
        });
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {
          installer: {
            1: { verifying: true },
            2: { isTriggered: true },
          },
        };
        const state = reducer(
          initialState,
          actions.integrationApp.installer.updateStep(
            integrationId,
            'installerFunction',
            'failed'
          )
        );

        expect(state).toEqual({
          installer: {
            1: { isTriggered: false, verifying: false },
            2: { isTriggered: true },
          },
          uninstaller: {},
          settings: {},
          addStore: {},
          addon: {},
          clone: {},
          uninstaller2: {},
        });
      });
    });

    describe('integrationApps installer install_complete action', () => {
      test('should find the integration with id and reset the value', () => {
        const state = reducer(
          {
            installer: { 1: { isTriggered: true } },
          },
          actions.integrationApp.installer.completedStepInstall(
            { response: 's' },
            1,
            'installerFunction'
          )
        );

        expect(state).toEqual({
          installer: { 1: {} },
          uninstaller: {},
          settings: {},
          addStore: {},
          addon: {},
          clone: {},
          uninstaller2: {},
        });
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {
          installer: {
            1: { verifying: true },
            2: { isTriggered: true },
          },
        };
        const state = reducer(
          initialState,
          actions.integrationApp.installer.completedStepInstall(
            {},
            integrationId
          )
        );

        expect(state).toEqual({
          installer: {
            1: {},
            2: { isTriggered: true },
          },
          uninstaller: {},
          settings: {},
          addStore: {},
          addon: {},
          clone: {},
          uninstaller2: {},
        });
      });
    });
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

        expect(state).toEqual({
          installer: {},
          uninstaller: { integrationId: {} },
          addStore: {},
          settings: {},
          addon: {},
          clone: {},
          uninstaller2: {},
        });
      });
      test('should try to find the integrationId reference inside uninstaller reducer state and reset it if any data present', () => {
        const state = reducer(
          { uninstaller: { integrationId: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.preUninstall(
            'storeId',
            'integrationId'
          )
        );

        expect(state).toEqual({
          installer: {},
          uninstaller: { integrationId: {} },
          addStore: {},
          settings: {},
          addon: {},
          clone: {},
          uninstaller2: {},
        });
      });
    });
    describe('integrationApps uninstaller install_inProgress action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { uninstaller: { 1: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'INCORRECT_FUNCTION_NAME',
            'inProgress'
          )
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          settings: {},
          installer: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and set isTriggered flag to true', () => {
        const state = reducer(
          { uninstaller: { 1: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'uninstallConnectorComponents',
            'inProgress'
          )
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          settings: {},
          installer: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {
          uninstaller: {
            1: { steps: uninstallSteps },
            2: { steps: uninstallSteps },
          },
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
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps uninstaller uninstall step verify action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { uninstaller: { 1: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'INCORRECT_FUNCTION_NAME',
            'verify'
          )
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and set verifying flag to true', () => {
        const state = reducer(
          { uninstaller: { 1: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'uninstallConnectorComponents',
            'verify'
          )
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {
          uninstaller: {
            1: { steps: uninstallSteps },
            2: { steps: uninstallSteps },
          },
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
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps uninstaller uninstall_step failed action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { uninstaller: { 1: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'INCORRECT_FUNCTION_NAME',
            'failed'
          )
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and reset all flags', () => {
        const state = reducer(
          { uninstaller: { 1: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'uninstallConnectorComponents',
            'failed'
          )
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {
          uninstaller: {
            1: { steps: uninstallSteps },
            2: { steps: uninstallSteps },
          },
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
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps uninstaller uninstall_step completed action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { uninstaller: { 1: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'INCORRECT_FUNCTION_NAME',
            'completed'
          )
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and reset all flags', () => {
        const state = reducer(
          { uninstaller: { 1: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'uninstallConnectorComponents',
            'completed'
          )
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {
          uninstaller: {
            1: { steps: uninstallSteps },
            2: { steps: uninstallSteps },
          },
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
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
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
            'STOREID',
            2
          )
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect other integrations when new integration uninstall steps are received', () => {
        const state = reducer(
          { uninstaller: { 1: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.receivedUninstallSteps(
            uninstallSteps,
            'STOREID',
            2
          )
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect the state new integration uninstall steps are received and no integrationId is passed', () => {
        const state = reducer(
          { uninstaller: { 1: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.receivedUninstallSteps(
            uninstallSteps,
            'STOREID',
            undefined
          )
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect the state new integration uninstall steps are received and no integrationId is passed', () => {
        const state = reducer(
          { uninstaller: { 1: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.receivedUninstallSteps(
            undefined,
            'STOREID',
            2
          )
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });
    describe('integrationApps uninstaller - clear steps reducer', () => {
      test('should update the uninstaller state and remove the integrationId if found', () => {
        const state = reducer(
          undefined,
          actions.integrationApp.uninstaller.clearSteps(2)
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          settings: {},
          installer: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });

      test('should update the uninstaller state and remove the integrationId if found', () => {
        const state = reducer(
          { uninstaller: { 1: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.clearSteps(1)
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          settings: {},
          installer: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect other integrations when clearSteps is called on one integration', () => {
        const state = reducer(
          {
            uninstaller: {
              1: { steps: uninstallSteps },
              2: { steps: uninstallSteps },
            },
          },
          actions.integrationApp.uninstaller.clearSteps(2)
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect the state when clearSteps is called and no integrationId is passed', () => {
        const state = reducer(
          { uninstaller: { 1: { steps: uninstallSteps } } },
          actions.integrationApp.uninstaller.clearSteps()
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          settings: {},
          installer: {},
          uninstaller: {
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
          },
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });
  });

  describe('intetgrationApps addNewStore reducer', () => {
    const addNewStoreSteps = [
      {
        name: 'Install Bank',
        description: 'Install the bank in CAM',
        imageURL: '/images/company-logos/cashapp.png',
        completed: false,
        installerFunction: 'installConnectorComponents',
      },
      {
        name: 'Install Bundle in NetSuite',
        description: 'Install the bundle in NetSuite',
        imageURL: '/images/company-logos/netsuite.png',
        completed: false,
        installerFunction: 'installConnectorComponents',
      },
    ];

    describe('integrationApps addNewStore install_inProgress action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { addStore: { 1: addNewStoreSteps } },
          actions.integrationApp.store.updateStep(
            1,
            'INCORRECT_FUNCTION_NAME',
            'inProgress'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: [
              {
                completed: false,
                description: 'Install the bank in CAM',
                imageURL: '/images/company-logos/cashapp.png',
                name: 'Install Bank',
                installerFunction: 'installConnectorComponents',
              },
              {
                completed: false,
                description: 'Install the bundle in NetSuite',
                imageURL: '/images/company-logos/netsuite.png',
                name: 'Install Bundle in NetSuite',
                installerFunction: 'installConnectorComponents',
              },
            ],
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and set isTriggered flag to true', () => {
        const state = reducer(
          { addStore: { 1: { steps: addNewStoreSteps } } },
          actions.integrationApp.store.updateStep(
            1,
            'installConnectorComponents',
            'inProgress'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
                {
                  completed: false,
                  description: 'Install the bank in CAM',
                  imageURL: '/images/company-logos/cashapp.png',
                  installerFunction: 'installConnectorComponents',
                  isTriggered: true,
                  name: 'Install Bank',
                },
                {
                  completed: false,
                  description: 'Install the bundle in NetSuite',
                  imageURL: '/images/company-logos/netsuite.png',
                  installerFunction: 'installConnectorComponents',
                  name: 'Install Bundle in NetSuite',
                },
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {
          addStore: {
            1: { steps: addNewStoreSteps },
            2: { steps: addNewStoreSteps },
          },
        };
        const state = reducer(
          initialState,
          actions.integrationApp.store.updateStep(
            integrationId,
            'installConnectorComponents',
            'inProgress'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
                {
                  completed: false,
                  description: 'Install the bank in CAM',
                  imageURL: '/images/company-logos/cashapp.png',
                  installerFunction: 'installConnectorComponents',
                  isTriggered: true,
                  name: 'Install Bank',
                },
                {
                  completed: false,
                  description: 'Install the bundle in NetSuite',
                  imageURL: '/images/company-logos/netsuite.png',
                  installerFunction: 'installConnectorComponents',
                  name: 'Install Bundle in NetSuite',
                },
              ],
            },
            2: {
              steps: [
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
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps addNewStore install step verify action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { addStore: { 1: { steps: addNewStoreSteps } } },
          actions.integrationApp.store.updateStep(
            1,
            'INCORRECT_FUNCTION_NAME',
            'verify'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
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
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and set verifying flag to true', () => {
        const state = reducer(
          { addStore: { 1: { steps: addNewStoreSteps } } },
          actions.integrationApp.store.updateStep(
            1,
            'installConnectorComponents',
            'verify'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
                {
                  completed: false,
                  description: 'Install the bank in CAM',
                  imageURL: '/images/company-logos/cashapp.png',
                  installerFunction: 'installConnectorComponents',
                  isTriggered: true,
                  name: 'Install Bank',
                  verifying: true,
                },
                {
                  completed: false,
                  description: 'Install the bundle in NetSuite',
                  imageURL: '/images/company-logos/netsuite.png',
                  installerFunction: 'installConnectorComponents',
                  name: 'Install Bundle in NetSuite',
                },
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {
          addStore: {
            1: { steps: addNewStoreSteps },
            2: { steps: addNewStoreSteps },
          },
        };
        const state = reducer(
          initialState,
          actions.integrationApp.store.updateStep(
            integrationId,
            'installConnectorComponents',
            'verify'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
                {
                  completed: false,
                  description: 'Install the bank in CAM',
                  imageURL: '/images/company-logos/cashapp.png',
                  installerFunction: 'installConnectorComponents',
                  isTriggered: true,
                  name: 'Install Bank',
                  verifying: true,
                },
                {
                  completed: false,
                  description: 'Install the bundle in NetSuite',
                  imageURL: '/images/company-logos/netsuite.png',
                  installerFunction: 'installConnectorComponents',
                  name: 'Install Bundle in NetSuite',
                },
              ],
            },
            2: {
              steps: [
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
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps addNewStore install_step failed action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { addStore: { 1: { steps: addNewStoreSteps } } },
          actions.integrationApp.store.updateStep(
            1,
            'INCORRECT_FUNCTION_NAME',
            'failed'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
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
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and reset all flags', () => {
        const state = reducer(
          { addStore: { 1: { steps: addNewStoreSteps } } },
          actions.integrationApp.store.updateStep(
            1,
            'installConnectorComponents',
            'failed'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
                {
                  completed: false,
                  description: 'Install the bank in CAM',
                  imageURL: '/images/company-logos/cashapp.png',
                  installerFunction: 'installConnectorComponents',
                  isTriggered: false,
                  name: 'Install Bank',
                  verifying: false,
                },
                {
                  completed: false,
                  description: 'Install the bundle in NetSuite',
                  imageURL: '/images/company-logos/netsuite.png',
                  installerFunction: 'installConnectorComponents',
                  name: 'Install Bundle in NetSuite',
                },
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {
          addStore: {
            1: addNewStoreSteps,
            2: addNewStoreSteps,
          },
        };
        const state = reducer(
          initialState,
          actions.integrationApp.store.updateStep(
            integrationId,
            'installConnectorComponents',
            'failed'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: [
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
            ],
            2: [
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
            ],
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps addNewStore install step completed action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { addStore: { 1: { steps: addNewStoreSteps } } },
          actions.integrationApp.store.updateStep(
            1,
            'INCORRECT_FUNCTION_NAME',
            'completed'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
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
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and reset all flags', () => {
        const state = reducer(
          { addStore: { 1: { steps: addNewStoreSteps } } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'installConnectorComponents',
            'completed'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
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
              ],
            },
          },
          installer: {},
          uninstaller: {},
          settings: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {
          addStore: {
            1: { steps: addNewStoreSteps },
            2: { steps: addNewStoreSteps },
          },
        };
        const state = reducer(
          initialState,
          actions.integrationApp.store.updateStep(
            integrationId,
            'installConnectorComponents',
            'completed'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
                {
                  completed: true,
                  description: 'Install the bank in CAM',
                  imageURL: '/images/company-logos/cashapp.png',
                  installerFunction: 'installConnectorComponents',
                  isTriggered: false,
                  name: 'Install Bank',
                  verifying: false,
                },
                {
                  completed: false,
                  description: 'Install the bundle in NetSuite',
                  imageURL: '/images/company-logos/netsuite.png',
                  installerFunction: 'installConnectorComponents',
                  name: 'Install Bundle in NetSuite',
                },
              ],
            },
            2: {
              steps: [
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
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps addNewStore - received install steps reducer', () => {
      test('should update the addStore state to include the step received', () => {
        const state = reducer(
          undefined,
          actions.integrationApp.store.receivedNewStoreSteps(
            2,
            addNewStoreSteps
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            2: {
              steps: [
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
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect other integrations when new store steps are received', () => {
        const state = reducer(
          { addStore: { 1: { steps: addNewStoreSteps } } },
          actions.integrationApp.store.receivedNewStoreSteps(
            2,
            addNewStoreSteps
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
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
              ],
            },
            2: {
              steps: [
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
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect the state when new integration store steps are received and no integrationId is passed', () => {
        const state = reducer(
          { addStore: { 1: { steps: addNewStoreSteps } } },
          actions.integrationApp.store.receivedNewStoreSteps(
            undefined,
            addNewStoreSteps
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
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
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect the state new integration store steps are received and no integrationId is passed', () => {
        const state = reducer(
          { addStore: { 1: { steps: addNewStoreSteps } } },
          actions.integrationApp.store.receivedNewStoreSteps(
            undefined,
            addNewStoreSteps
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
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
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });
    describe('integrationApps addNewStore - clear steps reducer', () => {
      test('should initialise the addStore state and remove the integrationId if found', () => {
        const state = reducer(
          undefined,
          actions.integrationApp.store.clearSteps(2)
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });

      test('should update the addStore state and remove the integrationId if found', () => {
        const state = reducer(
          { addStore: { 1: { steps: addNewStoreSteps } } },
          actions.integrationApp.store.clearSteps(1)
        );
        const expectedValue = {
          addStore: {},
          addon: {},
          clone: {},
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect other integrations when new clearSteps are called on one integration', () => {
        const state = reducer(
          {
            addStore: {
              1: { steps: addNewStoreSteps },
              2: { steps: addNewStoreSteps },
            },
          },
          actions.integrationApp.store.clearSteps(2)
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
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
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect the state when clearSteps is called and no integrationId is passed', () => {
        const state = reducer(
          { addStore: { 1: { steps: addNewStoreSteps } } },
          actions.integrationApp.store.clearSteps()
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {
            1: {
              steps: [
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
              ],
            },
          },
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });
  });

  describe('intetgrationApps settings reducer', () => {
    describe('integrationApps settings update action', () => {
      test('should not affect the existing state when  update function  is called', () => {
        const state = reducer(
          { settings: { '1-2': { submitComplete: true } } },
          actions.integrationApp.settings.update(
            'integrationId',
            'flowId',
            'storeId',
            null,
            'INCORRECT_FUNCTION_NAME'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {},
          installer: {},
          settings: {
            '1-2': { submitComplete: true },
            'integrationId-flowId': { submitComplete: false },
          },
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the key by integrationId and flowId passed and set submitComplete flag to false', () => {
        const state = reducer(
          { settings: { 'integrationId-flowId': { submitComplete: true } } },
          actions.integrationApp.settings.update(
            'integrationId',
            'flowId',
            'storeId',
            null,
            'INCORRECT_FUNCTION_NAME'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {},
          installer: {},
          settings: {
            'integrationId-flowId': { submitComplete: false },
          },
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps settings submitComplete action', () => {
      test('should not affect the existing state when  update function  is called', () => {
        const state = reducer(
          { settings: { '1-2': { submitComplete: false } } },
          actions.integrationApp.settings.submitComplete({
            integrationId: 'integrationId',
            flowId: 'flowId',
          })
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {},
          installer: {},
          settings: {
            '1-2': { submitComplete: false },
            'integrationId-flowId': { submitComplete: true },
          },
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the key by integrationId and flowId passed and set submitComplete flag to true', () => {
        const state = reducer(
          { settings: { 'integrationId-flowId': { submitComplete: false } } },
          actions.integrationApp.settings.submitComplete({
            integrationId: 'integrationId',
            flowId: 'flowId',
          })
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {},
          installer: {},
          settings: {
            'integrationId-flowId': { submitComplete: true },
          },
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps settings clear action', () => {
      test('should not affect the existing state when  update function  is called', () => {
        const state = reducer(
          {
            settings: {
              '1-2': { submitComplete: true },
              'integrationId-flowId': { submitComplete: true },
            },
          },
          actions.integrationApp.settings.clear('integrationId', 'flowId')
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {},
          installer: {},
          settings: {
            '1-2': { submitComplete: true },
          },
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the key by integrationId and flowId passed and remove that key from store', () => {
        const state = reducer(
          { settings: { 'integrationId-flowId': { submitComplete: true } } },
          actions.integrationApp.settings.clear('integrationId', 'flowId')
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {},
          installer: {},
          settings: {},
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });

      test('should not throw error if the key is not found', () => {
        const state = reducer(
          { settings: { 'integrationId-flowId': { submitComplete: true } } },
          actions.integrationApp.settings.clear(
            'incorrect_integrationId',
            'flowId'
          )
        );
        const expectedValue = {
          addon: {},
          clone: {},
          addStore: {},
          installer: {},
          settings: { 'integrationId-flowId': { submitComplete: true } },
          uninstaller: {},
          uninstaller2: {},
        };

        expect(state).toEqual(expectedValue);
      });
    });
  });
});
