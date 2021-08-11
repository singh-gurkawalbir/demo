/* global describe, test, expect, beforeAll */
// import { advanceBy, advanceTo, clear } from 'jest-date-mock';
import { createSelector } from 'reselect';
import reducer, { selectors } from '.';
import actions from '../actions';

import { COMM_STATES } from './comms/networkComms';
import { genSelectors } from './util';

describe('Reducers in the root reducer', () => {
  test('should wipe out the redux store except for app and auth properties in a user logout action', () => {
    const someInitialState = {
      user: { profile: { email: 'sds' } },
    };
    const state = reducer(someInitialState, actions.auth.clearStore());

    expect(state).toEqual({
      app: {
        appErrored: false,
        bannerOpened: true,
        count: 1,
      },
      auth: {
        commStatus: COMM_STATES.LOADING,
        initialized: false,
        loggedOut: true,
      },
    });
  });
  test('should delete just the data part of the redux state', () => {
    const someInitialState = {
      user: { profile: { email: 'sds' } },
    };
    const state = reducer(someInitialState, actions.app.deleteDataState());

    expect(state.app).toEqual({
      appErrored: false,
      bannerOpened: true,
      count: 1,
    });
    expect(state.data).toEqual(undefined);
  });
});

const exportGen = name => ({
  _Id: `${name}id`,
  _connectionId: `conn-${name}-id`,
  name,
  description: `${name} description`,
});

describe('makeResourceList selector reselect implementation', () => {
  const names = ['bob', 'bill', 'will', 'bing'];
  const testExports = names.map(exportGen);

  describe('caching behavior', () => {
    let state;
    let bobSelector;
    let billSelector;

    beforeAll(() => {
      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', testExports)
      );
      bobSelector = selectors.makeResourceListSelector();
      billSelector = selectors.makeResourceListSelector();
    });

    test('should return the correct result sets for both selectors', () => {
      const bobResource = bobSelector(state, {
        type: 'exports',
        keyword: 'bob',
      }).resources;
      const billResource = billSelector(state, {
        type: 'exports',
        keyword: 'bill',
      }).resources;

      expect(bobResource).toEqual([exportGen('bob')]);
      expect(billResource).toEqual([exportGen('bill')]);
    });

    test('should return the same cached result', () => {
      const bobQuery = {
        type: 'exports',
        keyword: 'bob',
      };
      const billQuery = {
        type: 'exports',
        keyword: 'bill',
      };
      const bobResource = bobSelector(state, bobQuery).resources;
      const billResource = billSelector(state, billQuery).resources;
      const bobResourceCached = bobSelector(state, bobQuery).resources;
      const billResourceCached = billSelector(state, billQuery).resources;

      expect(bobResource).toBe(bobResourceCached);
      expect(billResource).toBe(billResourceCached);
    });
    test('bobSelector should return a different result for a different query, billSelector should continue to return its cached result', () => {
      const bingQuery = {
        type: 'exports',
        keyword: 'bing',
      };
      const billQuery = {
        type: 'exports',
        keyword: 'bill',
      };
      const billResource = billSelector(state, billQuery).resources;
      const bingResource = bobSelector(state, bingQuery).resources;
      const billResourceCached = billSelector(state, billQuery).resources;

      expect(bingResource).toEqual([exportGen('bing')]);
      expect(billResource).toBe(billResourceCached);
    });
  });
});

describe('utils', () => {
  describe('sub selector generator', () => {
    test('should work', () => {
      const state = {
        sub1: {
          m1: 42,
        },
        sub2: {
          m1: 43,
        },
      };
      const to = {};
      const fr = {
        sub1: {
          method1: s => s.m1,
        },
        sub2: {
          method2: s => s.m1,
        },
      };

      genSelectors(to, fr);
      expect(to.method1(state)).toEqual(42);
      expect(to.method2(state)).toEqual(43);
    });

    test('should work for reselectors', () => {
      const state = {
        sub1: {
          m1: 42,
        },
        sub2: {
          m1: 43,
        },
      };
      const to = {};
      const fr = {
        sub1: {
          mkMethod1: () => createSelector(
            s => s.m1,
            v => ({
              val: v * 2,
            })
          ),
          mkMethodSimpleProxy: a => {
            // eslint-disable-next-line no-param-reassign
            a += 1;

            return createSelector(
              s => s.m1,
              v => ({
                a,
                val: v * 2,
              }),
            );
          },
        },
        sub2: {
          makeMethod2: () => createSelector(
            s => s.m1,
            v => ({
              val: v * 2,
            })
          ),
          makeMethodSimpleProxy: a => {
            // eslint-disable-next-line no-param-reassign
            a += 1;

            return createSelector(
              s => s.m1,
              v => ({
                a,
                val: v * 2,
              })
            );
          },
        },
      };

      genSelectors(to, fr);
      expect(to.mkMethodSimpleProxy).not.toBeUndefined();
      expect(to.makeMethodSimpleProxy).not.toBeUndefined();
      const sel1 = to.mkMethod1();
      const sel2 = to.mkMethod1();

      expect(sel1(state)).toBe(sel1(state));
      expect(sel2(state)).toBe(sel2(state));
      expect(sel1(state)).not.toBe(sel2(state));
      const sel3 = to.makeMethod2();
      const sel4 = to.makeMethod2();

      expect(sel3(state)).toBe(sel3(state));
      expect(sel4(state)).toBe(sel4(state));
      expect(sel3(state)).not.toBe(sel4(state));
    });

    test('should ignore default', () => {
      const state = {
        sub1: {
          m1: 42,
        },
        sub2: {
          m1: 43,
        },
      };
      const to = {};
      const fr = {
        sub1: {
          default: s => s.m1,
        },
        sub2: {
          method2: s => s.m1,
        },
      };

      genSelectors(to, fr);
      expect(to.method1).toBeUndefined();
      expect(to.method2(state)).toEqual(43);
    });

    test('should throw error on duplication', () => {
      const to = {};
      const fr = {
        sub1: {
          method1: s => s.m1,
        },
        sub2: {
          method1: s => s.m1,
        },
      };

      expect(() => genSelectors(to, fr)).toThrow(new Error('duplicate selector name method1 from sub2!'));
    });
  });
  describe('exportData reducer and selector', () => {
    test('should set and return exportData', () => {
      const state = reducer(
        {
          session: {
            exportData: {
              aaaa: {
                data: [1, 2, 3],
              },
            },
          },
        },
        'some_action'
      );

      expect(selectors.exportData(state, 'bbbb').data).toBeUndefined();
      expect(selectors.exportData(state, 'aaaa').data).toEqual([1, 2, 3]);
    });
  });
});
