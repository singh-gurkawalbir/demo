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
