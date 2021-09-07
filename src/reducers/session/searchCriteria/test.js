/* global describe, test, expect */

import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('search criteria tests', () => {
  const id = 'searchCriteria-netsuite.restlet.criteria-1';
  const value = [{
    field: 'type',
    operator: 'is',
    searchValue: 'salesorder',
  }, {
    field: 'account',
    operator: 'anyof',
    searchValue: '1',
  }, {
    field: 'trandate',
    operator: 'between',
    searchValue: '01-01-2020',
    searchValue2: '31-12-2020',
  },
  {
    field: 'formuladate',
    operator: 'between',
    formula: 'sample-formula',
    searchValue: '01-01-2020',
    searchValue2: '31-12-2020',
  }];

  const expectedSearchCriteria = [
    {
      field: 'type',
      operator: 'is',
      key: expect.any(String),
      searchValue: 'salesorder',
      searchValue2Enabled: false,
      showFormulaField: false,
    },
    {
      field: 'account',
      operator: 'anyof',
      key: expect.any(String),
      searchValue: '1',
      searchValue2Enabled: false,
      showFormulaField: false,
    },
    {
      field: 'trandate',
      operator: 'between',
      key: expect.any(String),
      searchValue: '01-01-2020',
      searchValue2: '31-12-2020',
      searchValue2Enabled: true,
      showFormulaField: false,
    },
    {
      field: 'formuladate',
      operator: 'between',
      key: expect.any(String),
      searchValue: '01-01-2020',
      searchValue2: '31-12-2020',
      searchValue2Enabled: true,
      formula: 'sample-formula',
      showFormulaField: true,
    },
  ];

  const defaultState = {
    [id]: {
      searchCriteria: [],
    },
  };

  describe('search criteria reducer', () => {
    describe('search criteria init action', () => {
      test('should create entry in search criteria reducer with init action when prevState is empty', () => {
        const state = reducer(
          undefined,
          actions.searchCriteria.init(id, value)
        );

        expect(state).toEqual({
          [id]: {
            searchCriteria: expectedSearchCriteria,
          },
        });
      });

      test('should update entry with init action if entry exists in prev state', () => {
        const state = reducer({
          'searchCriteria-netsuite.restlet.criteria-1': {
            searchCriteria: [],
          },
        },
        actions.searchCriteria.init(id, value)
        );

        expect(state).toEqual({
          'searchCriteria-netsuite.restlet.criteria-1': {
            searchCriteria: expectedSearchCriteria,
          },
        });
      });
    });

    describe('search criteria patch field action', () => {
      test('should create new entry in search criteria with patch field action if index does not exist in prev state', () => {
        const state = reducer(
          defaultState,
          actions.searchCriteria.patchField(id, 'field', 0, 'account')
        );
        const stateWithFormulaField = reducer(
          defaultState,
          actions.searchCriteria.patchField(id, 'field', 0, 'formuladate')
        );

        expect(state).toEqual({
          [id]: {
            searchCriteria: [{
              field: 'account',
              key: expect.any(String),
              showFormulaField: false,
            }],
          },
        });
        expect(stateWithFormulaField).toEqual({
          [id]: {
            searchCriteria: [{
              field: 'formuladate',
              key: expect.any(String),
              showFormulaField: true,
            }],
          },
        });
      });

      test('should split if reference field is selected in criteria when prev state does not exist', () => {
        const state = reducer(
          defaultState,
          actions.searchCriteria.patchField(id, 'field', 0, 'customer.name')
        );

        expect(state).toEqual({
          'searchCriteria-netsuite.restlet.criteria-1': {
            searchCriteria: [{
              field: 'name',
              join: 'customer',
              key: expect.any(String),
              showFormulaField: false,
            }],
          },
        });
      });

      test('should add searchValue2Enabled as true if selected operator supports searchValue2', () => {
        const state = reducer(
          defaultState,
          actions.searchCriteria.patchField(id, 'operator', 0, 'between')
        );

        expect(state).toEqual({
          'searchCriteria-netsuite.restlet.criteria-1': {
            searchCriteria: [{
              operator: 'between',
              searchValue2Enabled: true,
              key: expect.any(String),
            }],
          },
        });
      });

      test('should update field if field changed in criteria', () => {
        const state = reducer(
          {
            [id]: {
              searchCriteria: [
                {
                  field: 'Account',
                  key: 'k1',
                },
              ],
            },
          },
          actions.searchCriteria.patchField(id, 'field', 0, 'Account2')
        );

        expect(state).toEqual({
          [id]: {
            searchCriteria: [{
              field: 'Account2',
              key: 'k1',
              showFormulaField: false,
            }],
          },
        });
      });

      test('should update field, join if referenced field is selected in criteria', () => {
        const state = reducer(
          {
            [id]: {
              searchCriteria: [
                {
                  key: 'k1',
                  field: 'Account',
                },
              ],
            },
          },
          actions.searchCriteria.patchField(id, 'field', 0, 'customer.firstname')
        );

        expect(state).toEqual({
          'searchCriteria-netsuite.restlet.criteria-1': {
            searchCriteria: [{
              field: 'firstname',
              join: 'customer',
              key: 'k1',
              showFormulaField: false,
            }],
          },
        });
      });

      test('should set searchValue2Enabled as true if selected operation now supports searchvalue2', () => {
        const state = reducer(
          {
            [id]: {
              searchCriteria: [
                {
                  operator: 'is',
                  key: 'k1',
                },
              ],
            },
          },
          actions.searchCriteria.patchField(id, 'operator', 0, 'within')
        );

        expect(state).toEqual({
          [id]: {
            searchCriteria: [{
              key: 'k1',
              operator: 'within',
              searchValue2Enabled: true,
            }],
          },
        });
      });
    });

    describe('search criteria delete action', () => {
      test('should not throw error when delete action called on empty criteria', () => {
        const state = reducer(
          defaultState,
          actions.searchCriteria.delete(id, 0)
        );

        expect(state).toEqual({
          [id]: {
            searchCriteria: [],
          },
        });
      });

      test('should delete the specified filter from the search criteria if state is not empty', () => {
        let state = reducer(
          undefined,
          actions.searchCriteria.init(id, value)
        );

        state = reducer(
          state,
          actions.searchCriteria.delete(id, 1)
        );

        expect(state).toEqual({
          [id]: {
            searchCriteria: [expectedSearchCriteria[0], expectedSearchCriteria[2], expectedSearchCriteria[3]],
          },
        });
      });
    });
  });

  describe('search criteria selector', () => {
    test('should return empty set if prev state is undefined', () => {
      expect(selectors.searchCriteria()).toEqual([]);
    });

    test('should return corresponding criteria for the specified id if state is not empty', () => {
      const state = reducer(
        undefined,
        actions.searchCriteria.init(id, value)
      );

      expect(selectors.searchCriteria(state, id)).toEqual({
        searchCriteria: expectedSearchCriteria,
      });
    });
  });
});
