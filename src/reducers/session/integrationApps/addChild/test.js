/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('integrationApps reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    expect(reducer(undefined, { type: 'RANDOM_ACTION' })).toEqual({});
    expect(reducer(null, { type: 'RANDOM_ACTION' })).toEqual(null);
    expect(reducer('string', { type: 'RANDOM_ACTION' })).toEqual('string');
    expect(reducer(undefined, { type: null})).toEqual({});
    expect(reducer(undefined, { type: undefined })).toEqual({});
    expect(reducer(123, { type: 123 })).toEqual(123);
  });
  describe('integrationApps addNewChild reducer', () => {
    const addNewChildSteps = [
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

    describe('integrationApps addNewChild install_inProgress action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { 1: addNewChildSteps },
          actions.integrationApp.child.updateStep(
            1,
            'INCORRECT_FUNCTION_NAME',
            'inProgress'
          )
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and set isTriggered flag to true', () => {
        const state = reducer(
          { 1: { steps: addNewChildSteps } },
          actions.integrationApp.child.updateStep(
            1,
            'installConnectorComponents',
            'inProgress'
          )
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {

          1: { steps: addNewChildSteps },
          2: { steps: addNewChildSteps },

        };
        const state = reducer(
          initialState,
          actions.integrationApp.child.updateStep(
            integrationId,
            'installConnectorComponents',
            'inProgress'
          )
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps addNewChild install step verify action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { 1: { steps: addNewChildSteps } },
          actions.integrationApp.child.updateStep(
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

        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and set verifying flag to true', () => {
        const state = reducer(
          { 1: { steps: addNewChildSteps } },
          actions.integrationApp.child.updateStep(
            1,
            'installConnectorComponents',
            'verify'
          )
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {

          1: { steps: addNewChildSteps },
          2: { steps: addNewChildSteps },

        };
        const state = reducer(
          initialState,
          actions.integrationApp.child.updateStep(
            integrationId,
            'installConnectorComponents',
            'verify'
          )
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps addNewChild install_step failed action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { 1: { steps: addNewChildSteps } },
          actions.integrationApp.child.updateStep(
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

        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and reset all flags', () => {
        const state = reducer(
          { 1: { steps: addNewChildSteps } },
          actions.integrationApp.child.updateStep(
            1,
            'installConnectorComponents',
            'failed'
          )
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {

          1: addNewChildSteps,
          2: addNewChildSteps,

        };
        const state = reducer(
          initialState,
          actions.integrationApp.child.updateStep(
            integrationId,
            'installConnectorComponents',
            'failed'
          )
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps addNewChild install step completed action', () => {
      test('should not affect the existing state when incorrect function name is passed', () => {
        const state = reducer(
          { 1: { steps: addNewChildSteps } },
          actions.integrationApp.child.updateStep(
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

        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the integration with id and reset all flags', () => {
        const state = reducer(
          { 1: { steps: addNewChildSteps } },
          actions.integrationApp.uninstaller.updateStep(
            1,
            'installConnectorComponents',
            'completed'
          )
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {

          1: { steps: addNewChildSteps },
          2: { steps: addNewChildSteps },

        };
        const state = reducer(
          initialState,
          actions.integrationApp.child.updateStep(
            integrationId,
            'installConnectorComponents',
            'completed'
          )
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps addNewChild - received install steps reducer', () => {
      test('should update the addChild state to include the step received', () => {
        const state = reducer(
          undefined,
          actions.integrationApp.child.receivedNewChildSteps(
            2,
            addNewChildSteps
          )
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect other integrations when new child steps are received', () => {
        const state = reducer(
          { 1: { steps: addNewChildSteps } },
          actions.integrationApp.child.receivedNewChildSteps(
            2,
            addNewChildSteps
          )
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect the state when new integration child steps are received and no integrationId is passed', () => {
        const state = reducer(
          { 1: { steps: addNewChildSteps } },
          actions.integrationApp.child.receivedNewChildSteps(
            undefined,
            addNewChildSteps
          )
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect the state new integration child steps are received and no integrationId is passed', () => {
        const state = reducer(
          { 1: { steps: addNewChildSteps } },
          actions.integrationApp.child.receivedNewChildSteps(
            undefined,
            addNewChildSteps
          )
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps addNewChild - step installation complete reducer', () => {
      test('should find and update failed flag on integrationId if found', () => {
        const state = reducer(
          {
            1: {
              steps: [{
                name: 'step1',
              }],
            },
          },
          actions.integrationApp.child.completedStepInstall(
            2,
            'installerFunction',
            [{step1: 'step1 name'}]
          )
        );

        expect(state).toEqual({
          1: {
            steps: [{
              name: 'step1',
            }],
          },
        });
      });

      test('should find the step by installerFunction and update it as completed', () => {
        const state = reducer(
          {
            1: {
              steps: [{
                name: 'step1',
              }],
            },
            2: {
              steps: [{
                name: 'step1',
                installerFunction: 'installerFunction',
              }, {
                name: 'step2',
                installerFunction: 'installerFunction2',
              }],
            },
          },
          actions.integrationApp.child.completedStepInstall(
            2,
            null,
            [
              {step1: 'step1 name', installerFunction: 'installerFunction', dummy1: 'value1'},
              {step2: 'step2 name', installerFunction: 'installerFunction2', dummy2: 'value2'},
            ]
          )
        );
        const expectedValue = {
          1: {
            steps: [{
              name: 'step1',
            }],
          },
          2: {
            steps: [{
              name: 'step1',
              step1: 'step1 name',
              installerFunction: 'installerFunction',
              dummy1: 'value1',
            }, {
              name: 'step2',
              step2: 'step2 name',
              dummy2: 'value2',
              installerFunction: 'installerFunction2',
            }],
          },
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps addNewChild - failed reducer', () => {
      test('should find and update failed flag on integrationId if found', () => {
        const state = reducer(
          {
            1: {
              steps: [{
                name: 'step1',
              }],
            },
          },
          actions.integrationApp.child.failedNewChildSteps(
            2,
            'failed to fetch data'
          )
        );
        const expectedValue = {
          1: {
            steps: [{
              name: 'step1',
            }],
          },
          2: {error: 'failed to fetch data'},
        };

        expect(state).toEqual(expectedValue);
      });

      test('should not affect the state when clearSteps is called and no integrationId is passed', () => {
        const state = reducer(
          { 1: { steps: addNewChildSteps } },
          actions.integrationApp.child.failedNewChildSteps()
        );
        const expectedValue = {

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
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps addNewChild - clear steps reducer', () => {
      test('should initialise the addChild state and remove the integrationId if found', () => {
        const state = reducer(
          undefined,
          actions.integrationApp.child.clearSteps(2)
        );
        const expectedValue = {};

        expect(state).toEqual(expectedValue);
      });

      test('should update the addChild state and remove the integrationId if found', () => {
        const state = reducer(
          { 1: { steps: addNewChildSteps } },
          actions.integrationApp.child.clearSteps(1)
        );
        const expectedValue = {};

        expect(state).toEqual(expectedValue);
      });
      test('should not affect other integrations when new clearSteps are called on one integration', () => {
        const state = reducer(
          {
            1: { steps: addNewChildSteps },
            2: { steps: addNewChildSteps },
          },
          actions.integrationApp.child.clearSteps(2)
        );
        const expectedValue = {

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

        };

        expect(state).toEqual(expectedValue);
      });
      test('should not affect the state when clearSteps is called and no integrationId is passed', () => {
        const state = reducer(
          { 1: { steps: addNewChildSteps } },
          actions.integrationApp.child.clearSteps()
        );
        const expectedValue = {

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
        };

        expect(state).toEqual(expectedValue);
      });
    });
  });
});

describe('integrationApps addChild selectors test cases', () => {
  describe('addNewChildSteps', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.addNewChildSteps(undefined, 'dummy')).toEqual({});
      expect(selectors.addNewChildSteps({}, 'dummy')).toEqual({});
      expect(selectors.addNewChildSteps(null, 'dummy')).toEqual({});
      expect(selectors.addNewChildSteps(123, 'dummy')).toEqual({});
      expect(selectors.addNewChildSteps(undefined)).toEqual({});
      expect(selectors.addNewChildSteps({}, null)).toEqual({});
    });

    test('should return correct state data when a match is found.', () => {
      const expectedData = { steps: [{type: 'form'}, {type: 'url'}] };
      const newState = reducer(
        undefined,
        actions.integrationApp.child.receivedNewChildSteps(
          '123',
          [{type: 'form'}, {type: 'url'}]
        )
      );

      expect(selectors.addNewChildSteps(newState, '123')).toEqual(expectedData);
    });
  });
});
