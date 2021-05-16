/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions, { availableResources } from '../../../actions';

describe('resources reducer', () => {
  availableResources.forEach(resourceType => {
    describe(`${resourceType} received resource action`, () => {
      test('should store the new resource if none exist', () => {
        const resource = { _id: 1, name: 'bob' };
        const state = reducer(
          undefined,
          actions.resource.received(resourceType, resource)
        );

        expect(state[resourceType]).toContainEqual(resource);
      });

      test('should store the new resource if some exist', () => {
        const collection = [{ _id: 1 }, { _id: 3 }];
        const resource = { _id: 2, name: 'bob' };
        let state;

        state = reducer(
          undefined,
          actions.resource.receivedCollection(resourceType, collection)
        );
        state = reducer(
          state,
          actions.resource.received(resourceType, resource)
        );

        expect(state[resourceType]).toEqual([...collection, resource]);
      });

      test('should replace an existing resource if one already exists', () => {
        const collection = [{ _id: 1 }, { _id: 2 }, { _id: 3 }];
        const resource = { _id: 2, name: 'bob' };
        let state;

        state = reducer(
          undefined,
          actions.resource.receivedCollection(resourceType, collection)
        );
        state = reducer(
          state,
          actions.resource.received(resourceType, resource)
        );

        expect(state[resourceType]).toEqual([
          collection[0],
          resource,
          collection[2],
        ]);
      });
    });

    describe(`${resourceType} received resource collection action`, () => {
      test('should store the new collection', () => {
        const data = [{ id: 1, name: 'test data' }];
        const state = reducer(
          undefined,
          actions.resource.receivedCollection(resourceType, data)
        );

        expect(state[resourceType]).toEqual(data);
      });

      test('should replace existing collection with the new colletion', () => {
        const data1 = [{ id: 1, name: 'test data' }];
        const data2 = [{ id: 1, name: 'test data1' }];
        let state;

        state = reducer(
          state,
          actions.resource.receivedCollection(resourceType, data1)
        );
        expect(state[resourceType]).toEqual(data1);

        state = reducer(
          state,
          actions.resource.receivedCollection(resourceType, data2)
        );
        expect(state[resourceType]).toEqual(data2);
      });
    });
    describe(`${resourceType} delete resource action`, () => {
      test('should delete an existing resource', () => {
        const collection = [
          { _id: 'id1', name: 'rob' },
          { _id: 'id2', name: 'bob' },
        ];
        let state = reducer(
          undefined,
          actions.resource.receivedCollection(resourceType, collection)
        );

        state = reducer(state, actions.resource.deleted(resourceType, 'id2'));
        expect(state[resourceType]).toEqual([collection[0]]);
      });
      test('should not delete any resource if there is no resource with given id', () => {
        const collection = [
          { _id: 'id1', name: 'rob' },
          { _id: 'id2', name: 'bob' },
        ];
        let state = reducer(
          undefined,
          actions.resource.receivedCollection(resourceType, collection)
        );

        state = reducer(state, actions.resource.deleted(resourceType, 'id3'));
        expect(state[resourceType]).toEqual(collection);
      });
    });
  });
  describe('Toggle user sharing option', () => {
    test('Should be able to toggle shared stack', () => {
      const userId = '1234';
      const defaultState = {sshares: [{_id: userId, accepted: true, disabled: false, _stackId: '123445'}]};
      const expectedState = [{_id: userId, accepted: true, disabled: true, _stackId: '123445'}];
      const state = reducer(
        defaultState,
        actions.stack.toggledUserStackSharing({ userId })
      );

      expect(state.sshares).toEqual(expectedState);
    });
    test('Should be able to handle empty state', () => {
      const userId = '1234';
      const defaultState = {};
      const state = reducer(
        defaultState,
        actions.stack.toggledUserStackSharing({ userId })
      );

      expect(state).toEqual(defaultState);
    });

    test('Should be able to handle wrong id', () => {
      const userId = '1234';
      const defaultState = {sshares: [{_id: '12345', accepted: true, disabled: false, _stackId: '123445'}]};
      const expectedState = [{_id: '12345', accepted: true, disabled: false, _stackId: '123445'}];
      const state = reducer(
        defaultState,
        actions.stack.toggledUserStackSharing({ userId })
      );

      expect(state.sshares).toEqual(expectedState);
    });
  });
  describe('Toggle trading partner values', () => {
    test('Should be able to update toggle trading partner values', () => {
      const connectionIds = [{_id: '12345'}, {_id: '12346'}];
      const defaultState = {connections: [{_id: '12345', ftp: {tradingPartner: true}}, {_id: '12346', ftp: {tradingPartner: true}}, {_id: '12347', ftp: {tradingPartner: true}}]};
      const expectedState = [{_id: '12345', ftp: {tradingPartner: false}}, {_id: '12346', ftp: {tradingPartner: false}}, {_id: '12347', ftp: {tradingPartner: true}}];
      const state = reducer(
        defaultState,
        actions.connection.completeTradingPartner(connectionIds || [])
      );

      expect(state.connections).toEqual(expectedState);
    });
    test('Should be able to handle empty input', () => {
      const defaultState = {connections: [{_id: '12345', ftp: {tradingPartner: true}}, {_id: '12346', ftp: {tradingPartner: true}}, {_id: '12347', ftp: {tradingPartner: true}}]};
      const expectedState = [{_id: '12345', ftp: {tradingPartner: true}}, {_id: '12346', ftp: {tradingPartner: true}}, {_id: '12347', ftp: {tradingPartner: true}}];
      const state = reducer(
        defaultState,
        actions.connection.completeTradingPartner([])
      );

      expect(state.connections).toEqual(expectedState);
    });

    test('Should be able to handle empty state', () => {
      const defaultState = {};
      const state = reducer(
        defaultState,
        actions.connection.completeTradingPartner([])
      );

      expect(state).toEqual(defaultState);
    });
  });
  describe('Deregister connection', () => {
    test('Should be able to deregister connection', () => {
      const connectionId = '12';
      const integrationId = '12345';
      const defaultState = {integrations: [{_id: '12345', _registeredConnectionIds: ['12', '34']}, {_id: '12346', _registeredConnectionIds: ['56', '78']}]};
      const expectedState = [{_id: '12345', _registeredConnectionIds: ['34']}, {_id: '12346', _registeredConnectionIds: ['56', '78']}];
      const state = reducer(
        defaultState,
        actions.connection.completeDeregister(connectionId, integrationId)
      );

      expect(state.integrations).toEqual(expectedState);
    });
    test('Should be able to handle empty or wrong integration Id', () => {
      const connectionId = '12';
      const integrationId = '';
      const defaultState = {integrations: [{_id: '12345', _registeredConnectionIds: ['12', '34']}, {_id: '12346', _registeredConnectionIds: ['56', '78']}]};
      const state = reducer(
        defaultState,
        actions.connection.completeDeregister(connectionId, integrationId)
      );

      expect(state.integrations).toEqual(defaultState.integrations);
    });
    test('Should be able to handle empty or wrong connection Id', () => {
      const connectionId = '121212';
      const integrationId = '12345';
      const defaultState = {integrations: [{_id: '12345', _registeredConnectionIds: ['12', '34']}, {_id: '12346', _registeredConnectionIds: ['56', '78']}]};
      const state = reducer(
        defaultState,
        actions.connection.completeDeregister(connectionId, integrationId)
      );

      expect(state).toEqual(defaultState);
    });

    test('Should be able to handle empty state', () => {
      const connectionId = '121212';
      const integrationId = '12345';
      const defaultState = {};
      const state = reducer(
        defaultState,
        actions.connection.completeDeregister(connectionId, integrationId)
      );

      expect(state).toEqual(defaultState);
    });
  });
  describe('Register connections', () => {
    test('Should be able to register connections', () => {
      const integrationId = '12345';
      const connectionIds = ['78', '79'];
      const defaultState = {integrations: [{_id: '12345', _registeredConnectionIds: ['12', '34']}, {_id: '12346', _registeredConnectionIds: ['56', '78']}]};
      const expectedState = [{_id: '12345', _registeredConnectionIds: ['12', '34', '78', '79']}, {_id: '12346', _registeredConnectionIds: ['56', '78']}];
      const state = reducer(
        defaultState,
        actions.connection.completeRegister(connectionIds, integrationId)
      );

      expect(state.integrations).toEqual(expectedState);
    });
    test('Should be able to handle empty or wrong integration Id', () => {
      const connectionIds = ['78', '79'];
      const integrationId = '';
      const defaultState = {integrations: [{_id: '12345', _registeredConnectionIds: ['12', '34']}, {_id: '12346', _registeredConnectionIds: ['56', '78']}]};
      const state = reducer(
        defaultState,
        actions.connection.completeRegister(connectionIds, integrationId)
      );

      expect(state).toEqual(defaultState);
    });
    test('Should be able to handle empty state', () => {
      const connectionIds = ['121212'];
      const integrationId = '12345';
      const defaultState = {};
      const state = reducer(
        defaultState,
        actions.connection.completeRegister(connectionIds, integrationId)
      );

      expect(state).toEqual(defaultState);
    });
  });
  describe('Clear collection', () => {
    test('Should be able to clear collection', () => {
      const resourceType = 'connectors/123/licenses';
      const collection = [{ _id: '456' }, { _id: '678' }];
      const prevState = reducer(
        undefined,
        actions.resource.receivedCollection(resourceType, collection)
      );
      const state = reducer(
        prevState,
        actions.resource.clearCollection('connectorLicenses')
      );

      expect(state.connectorLicenses).toEqual([]);
    });

    test('Should be able to handle empty state', () => {
      const resourceType = 'connectors/123/licenses';
      const collection = [];
      const prevState = reducer(
        undefined,
        actions.resource.receivedCollection(resourceType, collection)
      );
      const state = reducer(
        prevState,
        actions.resource.clearCollection('connectorLicenses')
      );

      expect(state.connectorLicenses).toEqual([]);
    });
  });
  describe('Cancelled transfer', () => {
    test('Should be able to update cancelled transfer', () => {
      const resourceType = 'transfers';
      const collection = [{ _id: '456' }, { _id: '678' }];
      const expected = [{ _id: '456', status: 'canceled' }, { _id: '678' }];

      const prevState = reducer(
        undefined,
        actions.resource.receivedCollection(resourceType, collection)
      );
      const state = reducer(
        prevState,
        actions.transfer.canceledTransfer('456')
      );

      expect(state.transfers).toEqual(expected);
    });

    test('Should be able to handle empty state', () => {
      const resourceType = 'transfers';
      const collection = [];

      const prevState = reducer(
        undefined,
        actions.resource.receivedCollection(resourceType, collection)
      );
      const state = reducer(
        prevState,
        actions.transfer.canceledTransfer('456')
      );

      expect(state.transfers).toEqual([]);
    });
  });
  describe('Update connection status', () => {
    test('Should be able to update connection status', () => {
      const connStatus = [{ _id: '456', offline: true, queueSize: 10, name: 'conn1'}, { _id: '678', offline: false, queueSize: 11, name: 'conn2' }];
      const collection = [{ _id: '456', offline: false, queues: [{size: 32}], name: 'conn4'}, { _id: '678', offline: true, queues: [{size: 99}], name: 'conn20' }];

      const expected = [{ _id: '456', offline: false, queueSize: 32, name: 'conn1'}, { _id: '678', offline: true, queueSize: 99, name: 'conn2' }];

      const prevState = reducer(
        undefined,
        actions.resource.receivedCollection('connections', connStatus)
      );
      const state = reducer(
        prevState,
        actions.resource.connections.updateStatus(collection)
      );

      expect(state.connections).toEqual(expected);
    });

    test('Should be able to handle empty state', () => {
      const collection = [];

      const prevState = reducer(
        undefined,
        actions.resource.receivedCollection('connections', collection)
      );
      const state = reducer(
        prevState,
        actions.resource.connections.updateStatus(collection)
      );

      expect(state.connections).toEqual([]);
    });
  });
  describe('Make connection online', () => {
    test('Should be able to make connection online', () => {
      const connectionId = '1234';

      const collection = [{ _id: '456', offlineConnections: ['1234', '1236', '1238'], name: 'tile1'}, { _id: '457', offlineConnections: ['1234', '1239', '1231'], name: 'tile2'}];
      const expected = [{ _id: '456', offlineConnections: ['1236', '1238'], name: 'tile1'}, { _id: '457', offlineConnections: ['1239', '1231'], name: 'tile2'}];

      const prevState = reducer(
        undefined,
        actions.resource.receivedCollection('tiles', collection)
      );
      const state = reducer(
        prevState,
        actions.connection.madeOnline(connectionId)
      );

      expect(state.tiles).toEqual(expected);
    });

    test('Should be able to handle empty state', () => {
      const connectionId = '1234';

      const collection = [];

      const prevState = reducer(
        undefined,
        actions.resource.receivedCollection('tiles', collection)
      );
      const state = reducer(
        prevState,
        actions.connection.madeOnline(connectionId)
      );

      expect(state.tiles).toEqual(collection);
    });
  });
  describe('Access token auto purge', () => {
    test('Should be able to filter out purged tokens', () => {
      const tomorrow = new Date();
      const yesterday = new Date();

      tomorrow.setDate(tomorrow.getDate() + 1);
      yesterday.setDate(yesterday.getDate() - 1);

      const collection = [{ _id: '456', autoPurgeAt: tomorrow, name: 'token1'}, { _id: '678', autoPurgeAt: yesterday, name: 'token2' }];
      const expected = [{ _id: '456', autoPurgeAt: tomorrow, name: 'token1'}];

      const prevState = reducer(
        undefined,
        actions.resource.receivedCollection('accesstokens', collection)
      );
      const state = reducer(
        prevState,
        actions.accessToken.deletePurged()
      );

      expect(state.accesstokens).toEqual(expected);
    });

    test('Should be able to handle empty state', () => {
      const collection = [];
      const expected = [];

      const prevState = reducer(
        undefined,
        actions.resource.receivedCollection('accesstokens', collection)
      );
      const state = reducer(
        prevState,
        actions.accessToken.deletePurged()
      );

      expect(state.accesstokens).toEqual(expected);
    });
  });
});

describe('resources reducer for special cases', () => {
  describe('received collection action', () => {
    test('connector licenses should be stored successfully', () => {
      const resourceType = 'connectors/123/licenses';
      const collection = [{ _id: '456' }, { _id: '678' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection(resourceType, collection)
      );
      const resultantCollection = [
        { _id: '456', _connectorId: '123' },
        { _id: '678', _connectorId: '123' },
      ];

      expect(state.connectorLicenses).toEqual(resultantCollection);
    });
    test('connector licenses should be updated successfully', () => {
      const resourceType = 'connectors/123/licenses';
      const state = {};

      state.connectorLicenses = [
        { _id: '456', _connectorId: '123' },
        { _id: '555', _connectorId: '654' },
      ];
      const updatedCollection = [{ _id: '666' }, { _id: '777' }];
      const newState = reducer(
        state,
        actions.resource.receivedCollection(resourceType, updatedCollection)
      );
      const resultantCollection = [
        { _id: '666', _connectorId: '123' },
        { _id: '777', _connectorId: '123' },
      ];

      expect(newState.connectorLicenses).toEqual(resultantCollection);
    });
    test('connector installBase should be stored successfully', () => {
      const resourceType = 'connectors/123/installBase';
      const collection = [{ _id: '456' }, { _id: '678' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection(resourceType, collection)
      );
      const resultantCollection = [
        { _id: '456', _connectorId: '123' },
        { _id: '678', _connectorId: '123' },
      ];

      expect(state.connectorInstallBase).toEqual(resultantCollection);
    });
    test('connector installBase should be updated successfully', () => {
      const resourceType = 'connectors/123/installBase';
      const state = {};

      state.connectorInstallBase = [
        { _id: '456', _connectorId: '123' },
        { _id: '555', _connectorId: '654' },
      ];
      const updatedCollection = [{ _id: '666' }, { _id: '777' }];
      const newState = reducer(
        state,
        actions.resource.receivedCollection(resourceType, updatedCollection)
      );
      const resultantCollection = [
        { _id: '666', _connectorId: '123' },
        { _id: '777', _connectorId: '123' },
      ];

      expect(newState.connectorInstallBase).toEqual(resultantCollection);
    });
  });
  describe('deleted collection action for licenses', () => {
    test('should delete successfully for valid id', () => {
      const resourceType = 'connectors/123/licenses';
      const state = {};

      state.connectorLicenses = [
        { _id: '456', _connectorId: '123' },
        { _id: '678', _connectorId: '44' },
      ];

      const newState = reducer(
        state,
        actions.resource.deleted(resourceType, '456')
      );
      const resultantCollection = [{ _id: '678', _connectorId: '44' }];

      expect(newState.connectorLicenses).toEqual(resultantCollection);
    });
    test('should not update state for invalid id', () => {
      const resourceType = 'connectors/123/licenses';
      const state = {};

      state.connectorLicenses = [
        { _id: '456', _connectorId: '123' },
        { _id: '678', _connectorId: '44' },
      ];

      const newState = reducer(
        state,
        actions.resource.deleted(resourceType, '888')
      );

      expect(newState.connectorLicenses).toEqual(state.connectorLicenses);
    });
  });
});

describe('integrationAppSettings reducer', () => {
  const integrations = [
    {
      _id: 'integrationId',
      name: 'integration Name',
      _connectorId: 'connectorId',
      settings: {
        sections: [
          {
            id: 'store1',
            sections: [
              {
                id: 'sectionTitle',
                flows: [
                  {
                    _id: 'flowId',
                  },
                ],
              },
            ],
          },
        ],
        supportsMultiStore: true,
      },
    },
    {
      _id: 'integrationId2',
      name: 'integration2 Name',
      _connectorId: 'connectorId1',
      settings: {
        sections: [
          {
            id: 'sectionTitle',
            flows: [
              {
                _id: 'flowId',
              },
            ],
          },
        ],
      },
    },
  ];

  test('should not throw error for bad params', () => {
    const integrationAppSettings = selectors.mkIntegrationAppSettings();

    expect(integrationAppSettings({}, 'integrationId')).toEqual(null);
    expect(integrationAppSettings(undefined, undefined)).toEqual(
      null
    );
    expect(
      integrationAppSettings(undefined, undefined, undefined)
    ).toEqual(null);
    expect(integrationAppSettings()).toEqual(null);
  });

  test('should return correct integration App settings for multistore integrationApp', () => {
    const state = reducer(
      {
        data: {
          resources: {
            integrations,
          },
        },
      },
      'some_action'
    );
    const integrationAppSettings = selectors.mkIntegrationAppSettings();

    expect(
      integrationAppSettings(state, 'integrationId', 'store1')
    ).toEqual({
      _id: 'integrationId',
      _connectorId: 'connectorId',
      name: 'integration Name',
      settings: {
        sections: [
          {
            id: 'store1',
            sections: [{ flows: [{ _id: 'flowId' }], id: 'sectionTitle' }],
          },
        ],
        supportsMultiStore: true,
      },
      stores: [
        { hidden: false, label: undefined, mode: 'settings', value: 'store1' },
      ],
    });

    expect(integrationAppSettings(state, 'integrationId')).toEqual({
      _connectorId: 'connectorId',
      _id: 'integrationId',
      name: 'integration Name',
      settings: {
        sections: [
          {
            id: 'store1',
            sections: [{ flows: [{ _id: 'flowId' }], id: 'sectionTitle' }],
          },
        ],
        supportsMultiStore: true,
      },
      stores: [
        { hidden: false, label: undefined, mode: 'settings', value: 'store1' },
      ],
    });
  });
  test('should return correct integration App settings for single store integrationApp', () => {
    const state = reducer(
      {
        data: {
          resources: {
            integrations,
          },
        },
      },
      'some_action'
    );
    const integrationAppSettings = selectors.mkIntegrationAppSettings();

    expect(integrationAppSettings(state, 'integrationId2')).toEqual({
      _id: 'integrationId2',
      _connectorId: 'connectorId1',
      name: 'integration2 Name',
      settings: {
        sections: [{ flows: [{ _id: 'flowId' }], id: 'sectionTitle' }],
      },
    });
  });
});

describe('integrationApps installer reducer', () => {
  describe('integrationApps received installer install_inProgress action', () => {
    test('should find the integration with id and find the installation step with passed installerFunction and set isTriggered flag to true', () => {
      let state;
      const collection = [
        {
          _id: 1,
          name: 'bob',
          install: [
            { a: 1, installerFunction: 'installerFunction' },
            { a: 2, installerFunction: 'install2' },
          ],
        },
        {
          _id: 2,
          name: 'bob2',
          install: [{ a: 2, installerFunction: 'install2' }],
        },
      ];

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', collection)
      );
      state = reducer(
        state,
        actions.integrationApp.installer.updateStep(
          1,
          'installerFunction',
          'inProgress'
        )
      );
      const installStepsAfterAction = selectors.integrationInstallSteps(
        state,
        1
      );

      expect(installStepsAfterAction).toEqual([
        {
          a: 1,
          installerFunction: 'installerFunction',
          isCurrentStep: true,
        },
        {
          a: 2,
          installerFunction: 'install2',
        },
      ]);
    });

    test('should find the integration with id and update it but should not affect any other integration in the collection', () => {
      let state;
      const integrationId = 1;
      const collection = [
        {
          _id: 1,
          name: 'bob',
          install: [
            { a: 1, installerFunction: 'installerFunction' },
            { a: 2, installerFunction: 'install2' },
          ],
        },
        {
          _id: 2,
          name: 'bob2',
          install: [{ a: 2, installerFunction: 'install2' }],
        },
        {
          _id: 3,
          name: 'bob3',
          install: [{ a: 3, installerFunction: 'install3' }],
        },
      ];

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', collection)
      );
      state = reducer(
        state,
        actions.integrationApp.installer.updateStep(
          integrationId,
          'installerFunction',
          'inProgress'
        )
      );

      const collectionAfterAction = selectors.resourceList(state, {
        type: 'integrations',
      });

      expect(
        collectionAfterAction.resources.filter(i => i._id !== integrationId)
      ).toEqual(collection.filter(i => i._id !== integrationId));
    });
    test('should not throw any exception when wrong/incorrect/deleted integrationid is passed', () => {
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', [])
      );
      state = reducer(
        state,
        actions.integrationApp.installer.updateStep(
          123,
          'installerFunction',
          'inProgress'
        )
      );
      const installStepsAfterAction = selectors.integrationInstallSteps(
        state,
        1
      );

      expect(installStepsAfterAction).toEqual([]);
    });
    test('should not throw any exception when wrong/incorrect/deleted installerFunction is passed', () => {
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', [{ _id: 1 }])
      );
      state = reducer(
        state,
        actions.integrationApp.installer.updateStep(
          1,
          'installerFunction',
          'inProgress'
        )
      );
      const installStepsAfterAction = selectors.integrationInstallSteps(
        state,
        1
      );

      expect(installStepsAfterAction).toEqual([]);
    });
  });
  describe('integrationApps received installer install_failure action', () => {
    test('should find the integration with id and find the installation step with passed installerFunction and set isTriggered flag to false', () => {
      let state;
      const collection = [
        {
          _id: 1,
          name: 'bob',
          install: [
            {
              a: 1,
              installerFunction: 'installerFunction',
            },
          ],
        },
      ];

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', collection)
      );
      state = reducer(
        state,
        actions.integrationApp.installer.updateStep(
          1,
          'installerFunction',
          'failed'
        )
      );
      const installStepsAfterAction = selectors.integrationInstallSteps(
        state,
        1
      );

      expect(installStepsAfterAction).toEqual([
        {
          a: 1,
          installerFunction: 'installerFunction',
          isCurrentStep: true,
        },
      ]);
    });

    test('should find the integration with id and update it but should not affect any other integration in the collection', () => {
      let state;
      const integrationId = 1;
      const collection = [
        {
          _id: 1,
          name: 'bob',
          install: [
            { a: 1, installerFunction: 'installerFunction' },
            { a: 2, installerFunction: 'install2' },
          ],
        },
        {
          _id: 2,
          name: 'bob2',
          install: [{ a: 2, installerFunction: 'install2' }],
        },
        {
          _id: 3,
          name: 'bob3',
          install: [{ a: 3, installerFunction: 'install3' }],
        },
      ];

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', collection)
      );
      state = reducer(
        state,
        actions.integrationApp.installer.updateStep(
          integrationId,
          'installerFunction',
          'failed'
        )
      );

      const collectionAfterAction = selectors.resourceList(state, {
        type: 'integrations',
      });

      expect(
        collectionAfterAction.resources.filter(i => i._id !== integrationId)
      ).toEqual(collection.filter(i => i._id !== integrationId));
    });
    test('should not throw any exception when wrong/incorrect/deleted integrationid is passed', () => {
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', [])
      );
      state = reducer(
        state,
        actions.integrationApp.installer.updateStep(
          123,
          'installerFunction',
          'failed'
        )
      );
      const installStepsAfterAction = selectors.integrationInstallSteps(
        state,
        1
      );

      expect(installStepsAfterAction).toEqual([]);
    });
    test('should not throw any exception when wrong/incorrect/deleted installerFunction is passed', () => {
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', [{ _id: 1 }])
      );
      state = reducer(
        state,
        actions.integrationApp.installer.updateStep(
          1,
          'installerFunction',
          'failed'
        )
      );
      const installStepsAfterAction = selectors.integrationInstallSteps(
        state,
        1
      );

      expect(installStepsAfterAction).toEqual([]);
    });
  });
  describe('integrationApps received installer install_complete action', () => {
    test('should find the integration with id and replace all the install steps with stepsToUpdate', () => {
      let state;
      const stepsToUpdate = [{ a: 1, b: 2 }, { a: 2, b: 1 }];
      const collection = [
        {
          _id: 1,
          name: 'bob',
          installSteps: [],
          install: [
            {
              a: 1,
              installerFunction: 'installerFunction',
            },
          ],
        },
      ];

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', collection)
      );
      state = reducer(
        state,
        actions.integrationApp.installer.completedStepInstall(
          { stepsToUpdate },
          1,
          'installerFunction'
        )
      );
      const installStepsAfterAction = selectors.resource(
        state,
        'integrations',
        1
      ).install;

      expect(installStepsAfterAction).toEqual([
        { a: 1, installerFunction: 'installerFunction' },
      ]);
    });
    test('should not throw any exception when wrong/incorrect/deleted integrationid is passed', () => {
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', [])
      );
      state = reducer(
        state,
        actions.integrationApp.installer.completedStepInstall(
          [],
          123,
          'installerFunction'
        )
      );
      const installStepsAfterAction = selectors.integrationInstallSteps(
        state,
        1
      );

      expect(installStepsAfterAction).toEqual([]);
    });
    test('should not throw any exception when wrong/incorrect/deleted installerFunction is passed', () => {
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', [{ _id: 1 }])
      );
      state = reducer(
        state,
        actions.integrationApp.installer.completedStepInstall(
          [],
          1,
          'installerFunction'
        )
      );
      const installStepsAfterAction = selectors.integrationInstallSteps(
        state,
        1
      );

      expect(installStepsAfterAction).toEqual([]);
    });
  });
  describe('integrationApps received installer install_verify action', () => {
    test('should find the integration with id and find the install step by installerFunction and set verifying flag to true', () => {
      let state;
      const collection = [
        {
          _id: 1,
          name: 'bob',
          installSteps: [],
          install: [
            {
              a: 1,
              installerFunction: 'installerFunction',
            },
          ],
        },
      ];

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', collection)
      );
      state = reducer(
        state,
        actions.integrationApp.installer.updateStep(
          1,
          'installerFunction',
          'verify'
        )
      );
      const installStepsAfterAction = selectors.resource(
        state,
        'integrations',
        1
      ).install;

      expect(installStepsAfterAction).toEqual([
        {
          a: 1,
          installerFunction: 'installerFunction',
        },
      ]);
    });
    test('should not throw any exception when wrong/incorrect/deleted integrationid is passed', () => {
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', [])
      );
      state = reducer(
        state,
        actions.integrationApp.installer.updateStep(
          123,
          'installerFunction',
          'verify'
        )
      );
      const installStepsAfterAction = selectors.integrationInstallSteps(
        state,
        1
      );

      expect(installStepsAfterAction).toEqual([]);
    });
    test('should not throw any exception when wrong/incorrect/deleted installerFunction is passed', () => {
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', [{ _id: 1 }])
      );
      state = reducer(
        state,
        actions.integrationApp.installer.updateStep(
          1,
          'installerFunction',
          'verify'
        )
      );
      const installStepsAfterAction = selectors.integrationInstallSteps(
        state,
        1
      );

      expect(installStepsAfterAction).toEqual([]);
    });
  });
});

describe('resources selectors', () => {
  describe('resource', () => {
    test('should return null on bad/empty state.', () => {
      expect(selectors.resource(undefined, 'exports', 123)).toBeNull();
      expect(selectors.resource({}, 'exports', 123)).toBeNull();
    });

    test('should return null on bad/empty arguments.', () => {
      const testExports = [{ _id: 234, name: 'A' }, { _id: 567, name: 'B' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', testExports)
      );

      expect(selectors.resource(state, 'junk', 123)).toBeNull();
      expect(selectors.resource(state, 'exports')).toBeNull();
      expect(selectors.resource(state)).toBeNull();
    });

    test('should return matching resource if one exists.', () => {
      const testExports = [{ _id: 234, name: 'A' }, { _id: 567, name: 'B' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', testExports)
      );

      expect(selectors.resource(state, 'exports', 234)).toEqual(testExports[0]);
    });
  });

  describe('resourceList', () => {
    const emptyResult = {
      resources: [],
      total: 0,
      filtered: 0,
      count: 0,
    };

    test('should return empty result on bad state.', () => {
      let result = selectors.resourceList(undefined, {
        type: 'exports',
      });

      expect(result).toEqual({ ...emptyResult, type: 'exports' });

      result = selectors.resourceList({}, {});
      expect(result).toEqual(emptyResult);

      result = selectors.resourceList({}, { type: 123 });
      expect(result).toEqual({ ...emptyResult, type: 123 });
    });

    test('should return empty result on empty state.', () => {
      const result = selectors.resourceList(
        {},
        {
          type: 'exports',
        }
      );

      expect(result).toEqual({ ...emptyResult, type: 'exports' });
    });

    // #region -> Tests within this code region use the context below:
    const names = ['bob', 'bill', 'will', 'bing'];
    const testExports = names.map(n => ({
      _Id: `${n}id`,
      _connectionId: `conn-${n}-id`,
      name: n,
      description: `${n} description`,
    }));
    const state = reducer(
      undefined,
      actions.resource.receivedCollection('exports', testExports)
    );

    test('should return all resources when name matches resource type.', () => {
      const result = selectors.resourceList(state, {
        type: 'exports',
      });
      const { resources } = result;
      const namesFromResources = resources.map(r => r.name);

      expect(namesFromResources).toEqual(names);
    });

    test('should return only resources matching keyword in name.', () => {
      const result = selectors.resourceList(state, {
        type: 'exports',
        keyword: 'bi',
      });
      const { resources } = result;
      const namesFromResources = resources.map(r => r.name);

      expect(namesFromResources).toEqual(['bill', 'bing']);
    });

    test('should return resources limited in count by take.', () => {
      const take = 3;
      const result = selectors.resourceList(state, {
        type: 'exports',
        take,
      });
      const { resources } = result;
      const namesFromResources = resources.map(r => r.name);

      expect(namesFromResources).toEqual(names.slice(0, take));
    });

    test('should ignore invalid take argument.', () => {
      let result = selectors.resourceList(state, {
        type: 'exports',
        take: -1,
      });

      expect(result.count).toEqual(names.length);

      result = selectors.resourceList(state, {
        type: 'exports',
        take: 0,
      });

      expect(result.count).toEqual(names.length);

      result = selectors.resourceList(state, {
        type: 'exports',
        take: 'not a number',
      });

      expect(result.count).toEqual(names.length);
    });
    // #endregion
  });

  describe('hasData', () => {
    test('should return false when no data in store for any resource', () => {
      expect(selectors.hasData(undefined, 'exports')).toEqual(false);
      expect(selectors.hasData({}, 'exports')).toEqual(false);
    });

    test('should return false when no data found for resourceType', () => {
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', [])
      );

      expect(selectors.hasData(state, 'imports')).toEqual(false);
    });

    test('should return true when data found for resourceType', () => {
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', [])
      );

      expect(selectors.hasData(state, 'exports')).toEqual(true);
    });
  });
  describe('integrationInstallSteps', () => {
    test('should return empty array when no data in store for any resource', () => {
      expect(selectors.integrationInstallSteps(undefined, 'dummy')).toEqual([]);
      expect(selectors.integrationInstallSteps({}, 'dummyId')).toEqual([]);
    });

    test('should return empty array when no data found for integrations', () => {
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', [])
      );

      expect(selectors.integrationInstallSteps(state, 'id')).toEqual([]);
    });

    test('should return installSteps when integration is found', () => {
      const integrations = [
        { _id: 'int1', name: 'int_One', install: [{ aa: 2, b: 'something' }] },
        {
          _id: 'int2',
          name: 'int_Two',
          _connectorId: 'connector2',
          install: [{ aa: 1 }],
          something: 'something',
        },
      ];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', integrations)
      );

      expect(selectors.integrationInstallSteps(state, 'int2')).toEqual([
        { aa: 1, isCurrentStep: true },
      ]);
    });

    test('should return installSteps with isCurrentStep set to true when integration is found', () => {
      const integrations = [
        { _id: 'int1', name: 'int_One', install: [{ aa: 2, b: 'something' }] },
        {
          _id: 'int2',
          name: 'int_Two',
          _connectorId: 'connector2',
          install: [{ aa: 1 }, { aa: 2 }],
          something: 'something',
        },
      ];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', integrations)
      );

      expect(selectors.integrationInstallSteps(state, 'int2')).toEqual([
        { aa: 1, isCurrentStep: true },
        { aa: 2 },
      ]);
    });

    test('should return installSteps with isCurrentStep set to true only for the first uncomplete step when integration is found', () => {
      const integrations = [
        {
          _id: 'int2',
          name: 'int_Two',
          _connectorId: 'connector2',
          install: [{ aa: 1, completed: true }, { aa: 2 }, { aa: 3 }],
          something: 'something',
        },
      ];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', integrations)
      );

      expect(selectors.integrationInstallSteps(state, 'int2')).toEqual([
        { aa: 1, completed: true },
        { aa: 2, isCurrentStep: true },
        { aa: 3 },
      ]);
    });
  });

  describe('hasSettingsForm', () => {
    test('should return false on bad/empty state.', () => {
      expect(selectors.hasSettingsForm(undefined, 'exports', 123)).toBeFalsy();
      expect(selectors.hasSettingsForm({}, 'exports', 123)).toBeFalsy();
    });

    test('should return false on bad/empty arguments.', () => {
      const testExports = [{ _id: 234, name: 'A' }, { _id: 567, name: 'B' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', testExports)
      );

      expect(selectors.hasSettingsForm(state, 'junk', 123)).toBeFalsy();
      expect(selectors.hasSettingsForm(state, 'exports')).toBeFalsy();
      expect(selectors.hasSettingsForm(state)).toBeFalsy();
    });

    test('should return false if settings form is invalid on the resource', () => {
      const testExports = [
        { _id: 123, name: 'A' },
        { _id: 567, name: 'B', settingsForm: {} },
      ];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', testExports)
      );

      expect(selectors.hasSettingsForm(state, 'exports', 123)).toBeFalsy();
      expect(selectors.hasSettingsForm(state, 'exports', 567)).toBeFalsy();
    });

    test('should return true if settings form is valid on the resource', () => {
      const testExports = [
        { _id: 123, name: 'A', settingsForm: { form: { fieldMap: {} } } },
        { _id: 567, name: 'B', settingsForm: { init: { _scriptId: '123' } } },
        {
          _id: 890,
          name: 'C',
          settingsForm: { form: { fieldMap: {} }, init: { _scriptId: '123' } },
        },
      ];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', testExports)
      );

      expect(selectors.hasSettingsForm(state, 'exports', 123)).toBeTruthy();
      expect(selectors.hasSettingsForm(state, 'exports', 567)).toBeTruthy();
      expect(selectors.hasSettingsForm(state, 'exports', 890)).toBeTruthy();
    });
  });
});

describe('resourceDetailsMap selector', () => {
  test('should return {} when the state is undefined', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.resourceDetailsMap(state)).toEqual({});
  });

  test('should return {} and not throw any exceptions when the state has invalid collections', () => {
    const state = reducer(
      { invalid: 'string', invalid2: '<html></html>', invalid3: {test: '123'}, '': '<html />' },
      'some action'
    );

    expect(selectors.resourceDetailsMap(state)).toEqual({
      invalid: {},
      invalid2: {},
      invalid3: {},
      '': {},
    });
  });

  test('should return correct resource details', () => {
    const integrations = [
      { _id: 'int1', name: 'int_One', something: 'something' },
      {
        _id: 'int2',
        name: 'int_Two',
        _connectorId: 'connector2',
        something: 'something',
      },
    ];
    const flows = [
      { _id: 'flow1', name: 'flow_One', something: 'something' },
      {
        _id: 'flow2',
        name: 'flow_Two',
        _integrationId: 'int2',
        something: 'something',
      },
      {
        _id: 'flow3',
        name: 'flow_Three',
        _integrationId: 'int3',
        _connectorId: 'connector3',
        something: 'something',
      },
      {
        _id: 'flow4',
        name: 'flow_Four',
        _connectorId: 'connector4',
        something: 'something',
      },
      {
        _id: 'flow5',
        name: 'flow_Five',
        pageProcessors: [
          {
            _importId: 'i1',
          },
        ],
      },
      {
        _id: 'flow6',
        name: 'flow_Six',
        _connectorId: 'connector4',
        pageProcessors: [
          {
            _importId: 'i1',
          },
          {
            _importId: 'i2',
          },
        ],
      },
    ];
    const published = [
      { _id: 'pub1', name: 'pub 1' },
      { _id: 'pub2', name: 'pub 2' },
    ];
    const tiles = [
      { _integrationId: 'int1', name: 'int 1' },
      { _integrationId: 'int2', name: 'int 2' },
    ];
    const state = reducer(
      { published, tiles, integrations, flows },
      'some action'
    );

    expect(selectors.resourceDetailsMap(state)).toEqual({
      integrations: {
        int1: { name: 'int_One' },
        int2: { name: 'int_Two', _connectorId: 'connector2' },
      },
      flows: {
        flow1: { name: 'flow_One', numImports: 1 },
        flow2: { name: 'flow_Two', _integrationId: 'int2', numImports: 1 },
        flow3: {
          name: 'flow_Three',
          _integrationId: 'int3',
          _connectorId: 'connector3',
          numImports: 1,
        },
        flow4: { name: 'flow_Four', _connectorId: 'connector4', numImports: 1 },
        flow5: { name: 'flow_Five', numImports: 1 },
        flow6: { name: 'flow_Six', _connectorId: 'connector4', numImports: 2 },
      },
    });
  });
});
describe('Connection has as2 routing selector', () => {
  const connections = [
    { _id: '1234',
      as2: {contentBasedFlowRouter: {_scriptId: '1234'}},
      name: 'conn1',
    },
    { _id: '1235',
      as2: {},
      name: 'conn2',
    },
    { _id: '12357',
      file: {csv: {}},
      name: 'conn2',
    },
  ];

  test('should return false when the state is undefined', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.connectionHasAs2Routing(state)).toEqual(false);
  });
  test('should return true if connection has as2 routing', () => {
    const state = reducer(
      undefined,
      actions.resource.receivedCollection('connections', connections)
    );

    expect(selectors.connectionHasAs2Routing(state, '1234')).toEqual(true);
  });
  test('should return false if connection does not have as2 routing', () => {
    const state = reducer(
      undefined,
      actions.resource.receivedCollection('connections', connections)
    );

    expect(selectors.connectionHasAs2Routing(state, '12357')).toEqual(false);
  });
});
describe('Export needs routing selector', () => {
  const exports = [
    { _id: '1234',
      adaptorType: 'AS2Export',
      _connectionId: 'conn1',
      name: 'exp1',
    },
    { _id: '1235',
      adaptorType: 'AS2Export',
      _connectionId: 'conn1',
      name: 'exp2',
    },
    { _id: '12357',
      adaptorType: 'AS2Export',
      _connectionId: 'conn2',
      name: 'exp3',
    },
    { _id: '12358',
      adaptorType: 'FTPExport',
      _connectionId: 'conn2',
      name: 'exp4',
    },
  ];

  test('should return false when the state is undefined', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.exportNeedsRouting(state)).toEqual(false);
  });
  test('should return true if export needs routing', () => {
    const state = reducer(
      undefined,
      actions.resource.receivedCollection('exports', exports)
    );

    expect(selectors.exportNeedsRouting(state, '1234')).toEqual(true);
  });
  test('should return false if export does not need routing', () => {
    const state = reducer(
      undefined,
      actions.resource.receivedCollection('exports', exports)
    );

    expect(selectors.exportNeedsRouting(state, '12358')).toEqual(false);
  });
});

describe('Default store id selector', () => {
  const integrations = [
    { _id: 'int1',
      _connectorId: 'connector3',
      settings: {supportsMultiStore: true, sections: [{title: 'store1', id: '123'}, {title: 'store2', id: '143'}]},
      name: 'int_One',
      something: 'something' },
    {
      _id: 'int2',
      name: 'int_Two',
      settings: {supportsMultiStore: true, sections: [{title: 'store1', id: '1234'}]},
      _connectorId: 'connector2',
      something: 'something',
    },
  ];

  test('should return undefined when the state is undefined', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.defaultStoreId(state)).toEqual(undefined);
  });
  test('should return default store id', () => {
    const state = reducer(
      undefined,
      actions.resource.receivedCollection('integrations', integrations)
    );

    expect(selectors.defaultStoreId(state, 'int1')).toEqual('123');
  });
  test('should return correct store id', () => {
    const state = reducer(
      undefined,
      actions.resource.receivedCollection('integrations', integrations)
    );

    expect(selectors.defaultStoreId(state, 'int1', '143')).toEqual('143');
  });
  test('should return undefined for invalid integration Id', () => {
    const state = reducer(
      undefined,
      actions.resource.receivedCollection('integrations', integrations)
    );

    expect(selectors.defaultStoreId(state, 'int11234', '143')).toEqual(undefined);
  });
});

describe('mkFlowGroupingsSections', () => {
  const groupingsSelector = selectors.mkFlowGroupingsSections();

  const state = {
    integrations: [
      {_id: '1',
        flowGroupings: [
          {name: 'Grouping1 name', _id: 'grouping1Id'},
          {name: 'Grouping2 name', _id: 'grouping2Id'},
        ]},
    ],

  };

  test('should get groupings translated', () => {
    expect(groupingsSelector(state, '1')).toEqual(
      [
        {title: 'Grouping1 name', sectionId: 'grouping1Id'},
        {title: 'Grouping2 name', sectionId: 'grouping2Id'},
      ]
    );
  });
  test('should get null for non existent integration id', () => {
    expect(groupingsSelector(state, '2')).toEqual(
      null
    );
  });
});
const settingsForm = {
  fieldMap: {},
  layout: {},
};
const settings = {
  val1: 'something',
};

describe('mkGetAllCustomFormsForAResource ', () => {
  const customFormsSelector = selectors.mkGetAllCustomFormsForAResource();

  test('should return null for a non existent resource', () => {
    const state = {
      exports: [
        {_id: '1',
          settingsForm,
          settings,
        },
      ],

    };
    const received = customFormsSelector(state, 'exports', 'someotherResource');

    expect(received).toEqual(null);
  });

  test('should just get the root custom form for any non integration as a collection', () => {
    const state = {
      exports: [
        {_id: '1',
          settingsForm,
          settings,
        },
      ],

    };
    const received = customFormsSelector(state, 'exports', '1');
    const expected = {allSections: [
      { title: 'General',
        sectionId: 'general',
        settings,
        settingsForm,
      },
    ],
    hasFlowGroupings: false,
    };

    expect(received).toEqual(expected);
  });

  describe('integrations resources', () => {
    test('should consolidate all custom form for an integration with flowgroupings as a collection', () => {
      const state = {
        integrations: [
          {_id: '1',
            settingsForm,
            settings,
            flowGroupings: [
              {
                name: 'Group1',
                _id: 'groupId1',
                settingsForm,
                settings,
              },
              {
                name: 'Group2',
                _id: 'groupId2',
                settingsForm,
                settings,
              },
            ],
          },
        ],

      };
      const received = customFormsSelector(state, 'integrations', '1');
      const expected = {allSections: [
        { title: 'General',
          sectionId: 'general',
          settings,
          settingsForm,
        },
        { title: 'Group1',
          sectionId: 'groupId1',
          settings,
          settingsForm,
        },
        { title: 'Group2',
          sectionId: 'groupId2',
          settings,
          settingsForm,
        },
      ],
      hasFlowGroupings: true,
      };

      expect(received).toEqual(expected);
    });
    test('should consolidate all custom form for an integration without flowgroupings as a collection', () => {
      const state = {
        integrations: [
          {_id: '1',
            settingsForm,
            settings,
          },
        ],

      };
      const received = customFormsSelector(state, 'integrations', '1');
      const expected = {allSections: [
        { title: 'General',
          sectionId: 'general',
          settings,
          settingsForm,
        }],
      hasFlowGroupings: false,
      };

      expect(received).toEqual(expected);
    });
  });
});

describe('mkGetCustomFormPerSectionId', () => {
  const customFormSelectorPerSectionId = selectors.mkGetCustomFormPerSectionId();

  test('should return null for a non existent resourceId id', () => {
    const state = {
      exports: [
        {_id: '1',
          settingsForm,
          settings,
        },
      ],

    };

    const received = customFormSelectorPerSectionId(state, 'exports', 'someId', 'someSectionId');

    expect(received).toEqual(null);
  });

  test('should return the root level settings form when sectionId is general', () => {
    const state = {
      exports: [
        {_id: '1',
          settingsForm,
          settings,
        },
      ],

    };

    const received = customFormSelectorPerSectionId(state, 'exports', '1', 'general');

    const expected = {
      sectionId: 'general',
      title: 'General',
      settingsForm,
      settings,
    };

    expect(received).toEqual(expected);
  });

  test('should return the flowGroupSettings form when the integration does have flowGroupings', () => {
    const state = {
      integrations: [
        {_id: '1',
          settingsForm,
          settings,
          flowGroupings: [
            {
              name: 'Group1',
              _id: 'groupId1',
              settingsForm,
              settings,
            },
            {
              name: 'Group2',
              _id: 'groupId2',
              settingsForm,
              settings,
            },
          ],
        },
      ],
    };
    // no sectionId has been provided
    const received = customFormSelectorPerSectionId(state, 'integrations', '1', 'groupId1');

    const expected = {
      sectionId: 'groupId1',
      title: 'Group1',
      settingsForm,
      settings,
    };

    expect(received).toEqual(expected);
  });
});

describe('isAnyReportRunningOrQueued', () => {
  test('should return false when no eventreports are loaded', () => {
    const state = {};

    expect(selectors.isAnyReportRunningOrQueued(state, 'eventreports')).toBe(false);
  });
  test('should return true since an eventReport is queued', () => {
    const state = {
      eventreports: [
        {_id: '1',
          status: 'queued',
        },
        {_id: '2',
          status: 'completed',
        },
      ],
    };

    expect(selectors.isAnyReportRunningOrQueued(state, 'eventreports')).toBe(true);
  });

  test('should return true since an eventReport is running', () => {
    const state = {
      eventreports: [
        {_id: '1',
          status: 'running',
        },
        {_id: '2',
          status: 'completed',
        },
      ],
    };

    expect(selectors.isAnyReportRunningOrQueued(state, 'eventreports')).toBe(true);
  });
  test('should return false when there are completed reports', () => {
    const state = {
      eventreports: [
        {_id: '1',
          status: 'failed',
        },
        {_id: '2',
          status: 'completed',
        },
      ],
    };

    expect(selectors.isAnyReportRunningOrQueued(state, 'eventreports')).toBe(false);
  });
});
