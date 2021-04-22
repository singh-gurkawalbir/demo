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
      rowIdentifier: 0,
      searchValue: 'salesorder',
      searchValue2Enabled: false,
    },
    {
      field: 'account',
      operator: 'anyof',
      rowIdentifier: 0,
      searchValue: '1',
      searchValue2Enabled: false,
    },
    {
      field: 'trandate',
      operator: 'between',
      rowIdentifier: 0,
      searchValue: '01-01-2020',
      searchValue2: '31-12-2020',
      searchValue2Enabled: true,
    },
  ];

  const defaultState = {
    [id]: {
      searchCriteria: [],
      initChangeIdentifier: 0,
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
          initChangeIdentifier: 1,
          searchCriteria: expectedSearchCriteria,
        },
      });
    });

    test('should update entry with init action if entry exists in prev state', () => {
      const state = reducer({
        'searchCriteria-netsuite.restlet.criteria-1': {
          initChangeIdentifier: 3,
          searchCriteria: [],
        },
      },
      actions.searchCriteria.init(id, value)
      );

      expect(state).toEqual({
        'searchCriteria-netsuite.restlet.criteria-1': {
          initChangeIdentifier: 4,
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
          initChangeIdentifier: 0,
          searchCriteria: [{
            rowIdentifier: 0,
            field: 'account',
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
          initChangeIdentifier: 0,
          searchCriteria: [{
            rowIdentifier: 0,
            field: 'name',
            join: 'customer',
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
          initChangeIdentifier: 0,
          searchCriteria: [{
            rowIdentifier: 0,
            operator: 'between',
            searchValue2Enabled: true,
          }],
        },
      });
    });

    test('should update field and increment row identifier if field changed in criteria', () => {
      const state = reducer(
        {
          [id]: {
            searchCriteria: [
              {
                rowIdentifier: 0,
                field: 'Account',
              },
            ],
            initChangeIdentifier: 0,
          },
        },
        actions.searchCriteria.patchField(id, 'field', 0, 'Account2')
      );

      expect(state).toEqual({
        'searchCriteria-netsuite.restlet.criteria-1': {
          initChangeIdentifier: 0,
          searchCriteria: [{
            rowIdentifier: 1,
            field: 'Account2',
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
                rowIdentifier: 0,
                field: 'Account',
              },
            ],
            initChangeIdentifier: 0,
          },
        },
        actions.searchCriteria.patchField(id, 'field', 0, 'customer.firstname')
      );

      expect(state).toEqual({
        'searchCriteria-netsuite.restlet.criteria-1': {
          initChangeIdentifier: 0,
          searchCriteria: [{
            rowIdentifier: 1,
            field: 'firstname',
            join: 'customer',
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
                rowIdentifier: 0,
                operator: 'is',
              },
            ],
            initChangeIdentifier: 0,
          },
        },
        actions.searchCriteria.patchField(id, 'operator', 0, 'within')
      );

      expect(state).toEqual({
        'searchCriteria-netsuite.restlet.criteria-1': {
          initChangeIdentifier: 0,
          searchCriteria: [{
            rowIdentifier: 1,
            operator: 'within',
            searchValue2Enabled: true,
          }],
        },
      });
    });

    test('should update initChangeIdentifier and should not throw error when delete action called on empty criteria', () => {
      const state = reducer(
        defaultState,
        actions.searchCriteria.delete(id, 0)
      );

      expect(state).toEqual({
        [id]: {
          initChangeIdentifier: 1,
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
        'searchCriteria-netsuite.restlet.criteria-1': {
          initChangeIdentifier: 2,
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
        initChangeIdentifier: 1,
        searchCriteria: expectedSearchCriteria,
      });
    });
  });
});
