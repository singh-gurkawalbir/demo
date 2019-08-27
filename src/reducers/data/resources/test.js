/* global describe, test, expect */
import reducer, * as selectors from './';
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

        expect(state[resourceType]).toContain(resource);
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
        const data = 'test data';
        const state = reducer(
          undefined,
          actions.resource.receivedCollection(resourceType, data)
        );

        expect(state[resourceType]).toEqual(data);
      });

      test('should replace existing collection with the new colletion', () => {
        const data1 = 'test data';
        const data2 = 'new test data';
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
});
describe(`configure debugger action`, () => {
  test('should update connection debug date value', () => {
    const onClose = () => {};
    const collection = [{ _id: 'id1', name: 'rob', debugDate: '123' }];
    let state = reducer(
      undefined,
      actions.resource.receivedCollection('connections', collection)
    );

    state = reducer(
      state,
      actions.resource.connections.updateConnection('id1', '456', onClose)
    );
    const resCollection = [{ _id: 'id1', name: 'rob', debugDate: '456' }];

    expect(state.connections).toEqual([resCollection[0]]);
  });
  test('should not update connection debug date value if there is no connection exists with given id', () => {
    const onClose = () => {};
    const collection = [{ _id: 'id1', name: 'rob', debugDate: '123' }];
    let state = reducer(
      undefined,
      actions.resource.receivedCollection('connections', collection)
    );

    state = reducer(
      state,
      actions.resource.connections.updateConnection('id2', '456', onClose)
    );
    expect(state.connections).toEqual(collection);
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
});

describe('resourceDetailsMap selector', () => {
  test('should return {} when the state is undefined', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.resourceDetailsMap(state)).toEqual({});
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
describe('isAgentOnline selector', () => {
  test('should return false when no data in store', () => {
    expect(selectors.isAgentOnline(undefined, 123)).toEqual(false);
    expect(selectors.isAgentOnline({}, 456)).toEqual(false);
  });
  test('should return false when there is no matching agent', () => {
    const testAgents = [{ _id: 234, name: 'A' }, { _id: 567, name: 'B' }];
    const state = reducer(
      undefined,
      actions.resource.receivedCollection('agents', testAgents)
    );

    expect(selectors.isAgentOnline(state, 123)).toEqual(false);
  });
  test('should return false when there is no lastHeartbeatAt for matching agent', () => {
    const currentDate = new Date();
    const testAgents = [
      { _id: 234, name: 'A', lastHeartbeatAt: currentDate },
      { _id: 567, name: 'B' },
    ];
    const state = reducer(
      undefined,
      actions.resource.receivedCollection('agents', testAgents)
    );

    expect(selectors.isAgentOnline(state, 567)).toEqual(false);
  });
  test('should return true when diff b/w current and lastHeartbeatAt is less than 10 minutes', () => {
    process.env.AGENT_STATUS_INTERVAL = 600000;
    const currentDate = new Date();
    const testAgents = [
      { _id: 234, name: 'A', lastHeartbeatAt: currentDate },
      { _id: 567, name: 'B' },
    ];
    const state = reducer(
      undefined,
      actions.resource.receivedCollection('agents', testAgents)
    );

    expect(selectors.isAgentOnline(state, 234)).toEqual(true);
  });
});
