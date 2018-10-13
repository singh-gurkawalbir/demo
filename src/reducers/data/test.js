/* global describe, test, expect */
import reducer, * as selectors from './';
import actions, { availableResources } from '../../actions';

describe('data reducers', () => {
  availableResources.forEach(resource => {
    describe(`${resource} received action`, () => {
      test('should store the new data', () => {
        const data = 'test data';
        const state = reducer(undefined, actions[resource].received(data));

        expect(state[resource]).toEqual(data);
      });

      test('should replace existing data with the new data', () => {
        const data1 = 'test data';
        const data2 = 'new test data';
        let state;

        state = reducer(state, actions[resource].received(data1));
        expect(state[resource]).toEqual(data1);

        state = reducer(state, actions[resource].received(data2));
        expect(state[resource]).toEqual(data2);
      });
    });
  });
});

describe('data selectors', () => {
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
    const state = reducer(undefined, actions.exports.received(testExports));

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

    test('should return only resources matching keyword in connection name.', () => {
      const bobConn = {
        _id: `conn-bob-id`,
        name: 'testName',
        description: `Test description`,
      };
      const newState = reducer(state, actions.connections.received([bobConn]));
      const result = selectors.resourceList(newState, {
        type: 'exports',
        keyword: 'testN',
      });
      const { resources } = result;
      const namesFromResources = resources.map(r => r.name);

      expect(namesFromResources).toEqual(['bob']);
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
      const state = reducer(undefined, actions.exports.received([]));

      expect(selectors.hasData(state, 'imports')).toEqual(false);
    });

    test('should return true when data found for resourceType', () => {
      const state = reducer(undefined, actions.exports.received([]));

      expect(selectors.hasData(state, 'exports')).toEqual(true);
    });
  });
});
