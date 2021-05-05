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
  }];

  const expectedSearchCriteria = [
    {
      field: 'type',
      operator: 'is',
      key: expect.any(String),
      searchValue: 'salesorder',
      searchValue2Enabled: false,
    },
    {
      field: 'account',
      operator: 'anyof',
      key: expect.any(String),
      searchValue: '1',
      searchValue2Enabled: false,
    },
    {
      field: 'trandate',
      operator: 'between',
      key: expect.any(String),
      searchValue: '01-01-2020',
      searchValue2: '31-12-2020',
      searchValue2Enabled: true,
    },
  ];

  const defaultState = {
    [id]: {
      searchCriteria: [],
    },
  };

  describe('search criteria reducer', () => {
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

    test('should create new entry in search criteria with patch field action if index does not exist in prev state', () => {
      const state = reducer(
        defaultState,
        actions.searchCriteria.patchField(id, 'field', 0, 'account')
      );

      expect(state).toEqual({
        'searchCriteria-netsuite.restlet.criteria-1': {
          searchCriteria: [{
            field: 'account',
            key: expect.any(String),
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
                key: expect.any(String),
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
            key: expect.any(String),
          }],
        },
      });
    });

    test('should update field, join and increment row identifier if referenced field is selected in criteria', () => {
      const state = reducer(
        {
          [id]: {
            searchCriteria: [
              {
                key: expect.any(String),
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
            key: expect.any(String),
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
                key: expect.any(String),
              },
            ],
          },
        },
        actions.searchCriteria.patchField(id, 'operator', 0, 'within')
      );

      expect(state).toEqual({
        [id]: {
          searchCriteria: [{
            key: expect.any(String),
            operator: 'within',
            searchValue2Enabled: true,
          }],
        },
      });
    });

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
          searchCriteria: [expectedSearchCriteria[0], expectedSearchCriteria[2]],
        },
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
