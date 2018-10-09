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
    test('should return empty array on bad state.', () => {
      const resourceList = selectors.resourceList(undefined, {
        name: 'exports',
      });

      expect(resourceList).toEqual([]);
    });

    test('should return empty array on empty state.', () => {
      const resourceList = selectors.resourceList(
        {},
        {
          name: 'exports',
        }
      );

      expect(resourceList).toEqual([]);
    });

    // #region tests share this data:
    const names = ['bob', 'bill', 'will', 'bing'];
    const testExports = names.map(n => ({
      _Id: `${n}id`,
      name: n,
      description: `${n} description`,
    }));
    const state = reducer(undefined, actions.exports.received(testExports));

    test('should return all resources when name matches resource type.', () => {
      const resourceList = selectors.resourceList(state, {
        name: 'exports',
      });
      const namesFromResources = resourceList.map(r => r.name);

      expect(namesFromResources).toEqual(names);
    });

    test('should return only resources matching keyword in name.', () => {
      const resourceList = selectors.resourceList(state, {
        name: 'exports',
        keyword: 'bi',
      });
      const namesFromResources = resourceList.map(r => r.name);

      expect(namesFromResources).toEqual(['bill', 'bing']);
    });

    test('should return resources limited by take .', () => {
      const take = 3;
      const resourceList = selectors.resourceList(state, {
        name: 'exports',
        take,
      });
      const namesFromResources = resourceList.map(r => r.name);

      expect(namesFromResources).toEqual(names.slice(0, take));
    });

    // #endregion
  });
});
