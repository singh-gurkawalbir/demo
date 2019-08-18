/* global describe, test, expect */

import reducer from './';
import actions from '../../../actions';

/*
 * Actions to test :
 * actionTypes.METADATA.REQUEST, actionTypes.METADATA.REFRESH,
 * actionTypes.METADATA.RECEIVED_NETSUITE, actionTypes.METADATA.RECEIVED_ERROR
 * After each action verify updated state using optionsFromMetadata Fn
 * Different fields to consider :
 * Record types , Saved searches, Date field and Boolean field
 * Different metadata modes to  consider:
 * Suitescript and  Websearches
 */
describe('Netsuite', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toMatchObject({
      netsuite: { webservices: {}, suitescript: {} },
      salesforce: {},
    });
  });
  describe('Metadata Request reducer in Suitescript Mode', () => {
    test('should show status as request for suitescript Record Types', () => {
      const requestReducer = reducer(
        undefined,
        actions.metadata.request('1234', 'recordTypes', 'suitescript')
      );

      expect(requestReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: { 1234: { recordTypes: { status: 'requested' } } },
        },
        salesforce: {},
      });
    });
    test('should show status as request for suitescript Saved Searches', () => {
      const requestReducer = reducer(
        undefined,
        actions.metadata.request('1234', 'savedSearches', 'suitescript')
      );

      expect(requestReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: { 1234: { savedSearches: { status: 'requested' } } },
        },
        salesforce: {},
      });
    });
    test('should show status as request for suitescript Sublists', () => {
      const requestReducer = reducer(
        undefined,
        actions.metadata.request('1234', 'sublists', 'suitescript')
      );

      expect(requestReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: { 1234: { sublists: { status: 'requested' } } },
        },
        salesforce: {},
      });
    });
    test('should show status as request for suitescript Date Field', () => {
      const requestReducer = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchFilters',
          'suitescript',
          'dateField'
        )
      );

      expect(requestReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: { '/searchFilters-dateField': { status: 'requested' } },
          },
        },
        salesforce: {},
      });
    });
    test('should show status as request for suitescript Boolean Field', () => {
      const requestReducer = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchFilters',
          'suitescript',
          'booleanField'
        )
      );

      expect(requestReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: { '/searchFilters-booleanField': { status: 'requested' } },
          },
        },
        salesforce: {},
      });
    });
  });
  describe('Metadata Received reducer in Suitescript Mode', () => {
    test('should show data for suitescript Record Types', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request('1234', 'recordTypes', 'suitescript')
      );
      const receivedState = reducer(
        requestState,
        actions.metadata.netsuite.receivedCollection(
          [
            {
              id: 'account1',
              name: 'Account1',
              permissionId: 'LIST_ACCOUNT',
              scriptId: 'account1',
              scriptable: true,
              url: '/app/accounting/account/account.nl',
              userPermission: '4',
            },
            {
              id: 'account2',
              name: 'Account2',
              permissionId: 'LIST_ACCOUNT',
              scriptId: 'account2',
              scriptable: true,
              url: '/app/accounting/account/account.nl',
              userPermission: '4',
            },
          ],
          'recordTypes',
          '1234',
          'suitescript'
        )
      );

      expect(receivedState).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              recordTypes: {
                status: 'received',
                data: [
                  { label: 'Account1', value: 'account1' },
                  { label: 'Account2', value: 'account2' },
                ],
              },
            },
          },
        },
        salesforce: {},
      });
    });
    test('should show data for suitescript Saved searches', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request('1234', 'savedSearches', 'suitescript')
      );
      const receivedState = reducer(
        requestState,
        actions.metadata.netsuite.receivedCollection(
          [{ id: '2615', name: '2mb data' }, { id: '2616', name: '1mb data' }],
          'savedSearches',
          '1234',
          'suitescript'
        )
      );

      expect(receivedState).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              savedSearches: {
                status: 'received',
                data: [
                  { label: '2mb data', value: '2615' },
                  { label: '1mb data', value: '2616' },
                ],
              },
            },
          },
        },
        salesforce: {},
      });
    });
    test('should show data for suitescript Sublists', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request('1234', 'sublists', 'suitescript')
      );
      const receivedState = reducer(
        requestState,
        actions.metadata.netsuite.receivedCollection(
          [{ id: '2615', name: '2mb data' }, { id: '2616', name: '1mb data' }],
          'sublists',
          '1234',
          'suitescript'
        )
      );

      expect(receivedState).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              sublists: {
                status: 'received',
                data: [
                  { label: '2mb data', value: '2615' },
                  { label: '1mb data', value: '2616' },
                ],
              },
            },
          },
        },
        salesforce: {},
      });
    });
    test('should show data for suitescript Date Field', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchFilters',
          'suitescript',
          'dateField'
        )
      );
      const receivedState = reducer(
        requestState,
        actions.metadata.netsuite.receivedCollection(
          [
            { id: '2615', name: '2mb data', type: 'datetime' },
            { id: '2616', name: '1mb data', type: 'datetimetz' },
            { id: '2617', name: '3mb data', type: 'checkbox' },
          ],
          '/searchFilters',
          '1234',
          'suitescript',
          'dateField'
        )
      );

      expect(receivedState).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              '/searchFilters-dateField': {
                status: 'received',
                data: [
                  { label: '2mb data', value: '2615' },
                  { label: '1mb data', value: '2616' },
                ],
              },
            },
          },
        },
        salesforce: {},
      });
    });
    test('should show empty data for suitescript Boolean Field', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchFilters',
          'suitescript',
          'booleanField'
        )
      );
      const receivedState = reducer(
        requestState,
        actions.metadata.netsuite.receivedCollection(
          [
            { id: '2615', name: '2mb data', type: 'datetime' },
            { id: '2616', name: '1mb data', type: 'datetimetz' },
            { id: 'custevent2617', name: '3mb data', type: 'checkbox' },
          ],
          '/searchFilters',
          '1234',
          'suitescript',
          'booleanField'
        )
      );

      expect(receivedState).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              '/searchFilters-booleanField': {
                status: 'received',
                data: [{ label: '3mb data', value: 'custevent2617' }],
              },
            },
          },
        },
        salesforce: {},
      });
    });
  });
  describe('Metadata Received Error reducer in Suitescript Mode', () => {
    test('should update status as default error when there is no error supplied', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request('1234', 'recordTypes', 'suitescript')
      );
      const errorReducer = reducer(
        requestState,
        actions.metadata.netsuite.receivedError(
          undefined,
          'recordTypes',
          '1234',
          'suitescript'
        )
      );

      expect(errorReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              recordTypes: {
                status: 'error',
                data: [],
                errorMessage: 'Error occured',
              },
            },
          },
        },
        salesforce: {},
      });
    });
    test('should update status as error for suitescript Record Types', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request('1234', 'recordTypes', 'suitescript')
      );
      const errorReducer = reducer(
        requestState,
        actions.metadata.netsuite.receivedError(
          'Netsuite record type error',
          'recordTypes',
          '1234',
          'suitescript'
        )
      );

      expect(errorReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              recordTypes: {
                status: 'error',
                data: [],
                errorMessage: 'Netsuite record type error',
              },
            },
          },
        },
        salesforce: {},
      });
    });
    test('should update status as error for suitescript Saved Searches', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request('1234', 'savedSearches', 'suitescript')
      );
      const errorReducer = reducer(
        requestState,
        actions.metadata.netsuite.receivedError(
          'Netsuite record type error',
          'savedSearches',
          '1234',
          'suitescript'
        )
      );

      expect(errorReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              savedSearches: {
                status: 'error',
                data: [],
                errorMessage: 'Netsuite record type error',
              },
            },
          },
        },
        salesforce: {},
      });
    });
    test('should update status as error for suitescript Sublists', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request('1234', 'sublists', 'suitescript')
      );
      const errorReducer = reducer(
        requestState,
        actions.metadata.netsuite.receivedError(
          'Netsuite record type error',
          'sublists',
          '1234',
          'suitescript'
        )
      );

      expect(errorReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              sublists: {
                status: 'error',
                data: [],
                errorMessage: 'Netsuite record type error',
              },
            },
          },
        },
        salesforce: {},
      });
    });
    test('should update status as error for suitescript Date Field', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchFilters',
          'suitescript',
          'dateField'
        )
      );
      const errorReducer = reducer(
        requestState,
        actions.metadata.netsuite.receivedError(
          'Netsuite record type error',
          '/searchFilters',
          '1234',
          'suitescript',
          'dateField'
        )
      );

      expect(errorReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              '/searchFilters-dateField': {
                status: 'error',
                data: [],
                errorMessage: 'Netsuite record type error',
              },
            },
          },
        },
        salesforce: {},
      });
    });
    test('should update status as error for suitescript Boolean Field', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchFilters',
          'suitescript',
          'booleanField'
        )
      );
      const errorReducer = reducer(
        requestState,
        actions.metadata.netsuite.receivedError(
          'Netsuite record type error',
          '/searchFilters',
          '1234',
          'suitescript',
          'booleanField'
        )
      );

      expect(errorReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              '/searchFilters-booleanField': {
                status: 'error',
                data: [],
                errorMessage: 'Netsuite record type error',
              },
            },
          },
        },
        salesforce: {},
      });
    });
  });
  describe('Metadata Refresh reducer in Suitescript Mode', () => {
    test('should update status as refreshed for suitescript Record Types', () => {
      const receivedState = reducer(
        undefined,
        actions.metadata.netsuite.receivedCollection(
          [],
          'recordTypes',
          '1234',
          'suitescript'
        )
      );
      const refreshReducer = reducer(
        receivedState,
        actions.metadata.refresh('1234', 'recordTypes', 'suitescript')
      );

      expect(refreshReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: { recordTypes: { status: 'refreshed', data: [] } },
          },
        },
        salesforce: {},
      });
    });
    test('should update status as refreshed for suitescript Saved Searches', () => {
      const receivedState = reducer(
        undefined,
        actions.metadata.netsuite.receivedCollection(
          [],
          'savedSearches',
          '1234',
          'suitescript'
        )
      );
      const refreshReducer = reducer(
        receivedState,
        actions.metadata.refresh('1234', 'savedSearches', 'suitescript')
      );

      expect(refreshReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: { savedSearches: { status: 'refreshed', data: [] } },
          },
        },
        salesforce: {},
      });
    });
    test('should update status as refreshed for suitescript Sublists', () => {
      const receivedState = reducer(
        undefined,
        actions.metadata.netsuite.receivedCollection(
          [],
          'sublists',
          '1234',
          'suitescript'
        )
      );
      const refreshReducer = reducer(
        receivedState,
        actions.metadata.refresh('1234', 'sublists', 'suitescript')
      );

      expect(refreshReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: { sublists: { status: 'refreshed', data: [] } },
          },
        },
        salesforce: {},
      });
    });
    test('should update status as refreshed for suitescript Date Field', () => {
      const receivedState = reducer(
        undefined,
        actions.metadata.netsuite.receivedCollection(
          [],
          '/searchFilters',
          '1234',
          'suitescript',
          'dateField'
        )
      );
      const refreshReducer = reducer(
        receivedState,
        actions.metadata.refresh(
          '1234',
          '/searchFilters',
          'suitescript',
          'dateField'
        )
      );

      expect(refreshReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              '/searchFilters-dateField': { status: 'refreshed', data: [] },
            },
          },
        },
        salesforce: {},
      });
    });
    test('should update status as refreshed for suitescript Boolean Field', () => {
      const receivedState = reducer(
        undefined,
        actions.metadata.netsuite.receivedCollection(
          [],
          '/searchFilters',
          '1234',
          'suitescript',
          'booleanField'
        )
      );
      const refreshReducer = reducer(
        receivedState,
        actions.metadata.refresh(
          '1234',
          '/searchFilters',
          'suitescript',
          'booleanField'
        )
      );

      expect(refreshReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              '/searchFilters-booleanField': { status: 'refreshed', data: [] },
            },
          },
        },
        salesforce: {},
      });
    });
  });
  describe('Metadata Request reducer in Websearches Mode', () => {
    test('should show status as request for Websearches Record Types', () => {
      const requestReducer = reducer(
        undefined,
        actions.metadata.request('1234', 'recordTypes', 'webservices')
      );

      expect(requestReducer).toMatchObject({
        netsuite: {
          webservices: { 1234: { recordTypes: { status: 'requested' } } },
          suitescript: {},
        },
        salesforce: {},
      });
    });
    test('should show status as request for Websearches Saved Searches', () => {
      const requestReducer = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchMetadata',
          'webservices',
          'savedSearches'
        )
      );

      expect(requestReducer).toMatchObject({
        netsuite: {
          webservices: {
            1234: { '/searchMetadata-savedSearches': { status: 'requested' } },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
    test('should show status as request for Websearches Sublists', () => {
      const requestReducer = reducer(
        undefined,
        actions.metadata.request('1234', 'sublists', 'webservices')
      );

      expect(requestReducer).toMatchObject({
        netsuite: {
          webservices: { 1234: { sublists: { status: 'requested' } } },
          suitescript: {},
        },
        salesforce: {},
      });
    });
    test('should show status as request for Websearches Date Field', () => {
      const requestReducer = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchFilters',
          'webservices',
          'dateField'
        )
      );

      expect(requestReducer).toMatchObject({
        netsuite: {
          webservices: {
            1234: { '/searchFilters-dateField': { status: 'requested' } },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
    test('should show status as request for Websearches Boolean Field', () => {
      const requestReducer = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchFilters',
          'webservices',
          'booleanField'
        )
      );

      expect(requestReducer).toMatchObject({
        netsuite: {
          webservices: {
            1234: { '/searchFilters-booleanField': { status: 'requested' } },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
  });
  describe('Metadata Received reducer in Websearches Mode', () => {
    test('should show empty data for Websearches Record Types', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request('1234', 'recordTypes', 'webservices')
      );
      const receivedState = reducer(
        requestState,
        actions.metadata.netsuite.receivedCollection(
          [
            { internalId: 'account1', label: 'Account1' },
            { internalId: 'account2', label: 'Account2' },
          ],
          'recordTypes',
          '1234',
          'webservices'
        )
      );

      expect(receivedState).toMatchObject({
        netsuite: {
          webservices: {
            1234: {
              recordTypes: {
                status: 'received',
                data: [
                  { label: 'Account1', value: 'account1' },
                  { label: 'Account2', value: 'account2' },
                ],
              },
            },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
    test('should show empty data for Websearches Saved searches', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchMetadata',
          'webservices',
          'savedSearches'
        )
      );
      const receivedState = reducer(
        requestState,
        actions.metadata.netsuite.receivedCollection(
          [
            {
              internalId: '794',
              name: 'New Account Search1',
              scriptId: 'customsearch794',
            },
            {
              internalId: '795',
              name: 'New Account Search2',
              scriptId: 'customsearch795',
            },
          ],
          '/searchMetadata',
          '1234',
          'webservices',
          'savedSearches'
        )
      );

      expect(receivedState).toMatchObject({
        netsuite: {
          webservices: {
            1234: {
              '/searchMetadata-savedSearches': {
                status: 'received',
                data: [
                  { label: 'New Account Search1', value: '794' },
                  { label: 'New Account Search2', value: '795' },
                ],
              },
            },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
    test('should show empty data for Websearches Date Field', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchMetadata',
          'webservices',
          'dateField'
        )
      );
      const receivedState = reducer(
        requestState,
        actions.metadata.netsuite.receivedCollection(
          {
            fields: [
              { fieldId: 'tranDate1', type: 'date', label: 'TranDate1' },
              { fieldId: 'tranDate2', type: 'date', label: 'TranDate2' },
              {
                fieldId: 'custevent_check1',
                type: '_checkBox',
                label: 'Check1',
              },
              {
                fieldId: 'custevent_check2',
                type: '_checkBox',
                label: 'Check2',
              },
            ],
          },
          '/searchMetadata',
          '1234',
          'webservices',
          'dateField'
        )
      );

      expect(receivedState).toMatchObject({
        netsuite: {
          webservices: {
            1234: {
              '/searchMetadata-dateField': {
                status: 'received',
                data: [
                  { label: 'TranDate1', value: 'tranDate1' },
                  { label: 'TranDate2', value: 'tranDate2' },
                ],
              },
            },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
    test('should show empty data for Websearches Boolean Field', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchMetadata',
          'webservices',
          'booleanField'
        )
      );
      const receivedState = reducer(
        requestState,
        actions.metadata.netsuite.receivedCollection(
          {
            fields: [
              { fieldId: 'tranDate1', type: 'date', label: 'TranDate1' },
              { fieldId: 'tranDate2', type: 'date', label: 'TranDate2' },
              {
                fieldId: 'custevent_check1',
                type: '_checkBox',
                label: 'Check1',
              },
              {
                fieldId: 'custevent_check2',
                type: '_checkBox',
                label: 'Check2',
              },
            ],
          },
          '/searchMetadata',
          '1234',
          'webservices',
          'booleanField'
        )
      );

      expect(receivedState).toMatchObject({
        netsuite: {
          webservices: {
            1234: {
              '/searchMetadata-booleanField': {
                status: 'received',
                data: [
                  { label: 'Check1', value: 'custevent_check1' },
                  { label: 'Check2', value: 'custevent_check2' },
                ],
              },
            },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
  });
  describe('Metadata Received Error reducer in Websearches Mode', () => {
    test('should update status as error for Websearches Record Types', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request('1234', 'recordTypes', 'webservices')
      );
      const errorReducer = reducer(
        requestState,
        actions.metadata.netsuite.receivedError(
          'Netsuite record type error',
          'recordTypes',
          '1234',
          'webservices'
        )
      );

      expect(errorReducer).toMatchObject({
        netsuite: {
          webservices: {
            1234: {
              recordTypes: {
                status: 'error',
                data: [],
                errorMessage: 'Netsuite record type error',
              },
            },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
    test('should update status as error for Websearches Saved Searches', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchMetadata',
          'webservices',
          'savedSearches'
        )
      );
      const errorReducer = reducer(
        requestState,
        actions.metadata.netsuite.receivedError(
          'Netsuite record type error',
          '/searchMetadata',
          '1234',
          'webservices',
          'savedSearches'
        )
      );

      expect(errorReducer).toMatchObject({
        netsuite: {
          webservices: {
            1234: {
              '/searchMetadata-savedSearches': {
                status: 'error',
                data: [],
                errorMessage: 'Netsuite record type error',
              },
            },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
    test('should update status as error for Websearches Date Field', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchMetadata',
          'webservices',
          'dateField'
        )
      );
      const errorReducer = reducer(
        requestState,
        actions.metadata.netsuite.receivedError(
          'Netsuite record type error',
          '/searchMetadata',
          '1234',
          'webservices',
          'dateField'
        )
      );

      expect(errorReducer).toMatchObject({
        netsuite: {
          webservices: {
            1234: {
              '/searchMetadata-dateField': {
                status: 'error',
                data: [],
                errorMessage: 'Netsuite record type error',
              },
            },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
    test('should update status as error for Websearches Boolean Field', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request(
          '1234',
          '/searchFilters',
          'suitescript',
          'booleanField'
        )
      );
      const errorReducer = reducer(
        requestState,
        actions.metadata.netsuite.receivedError(
          'Netsuite record type error',
          '/searchFilters',
          '1234',
          'suitescript',
          'booleanField'
        )
      );

      expect(errorReducer).toMatchObject({
        netsuite: {
          webservices: {},
          suitescript: {
            1234: {
              '/searchFilters-booleanField': {
                status: 'error',
                data: [],
                errorMessage: 'Netsuite record type error',
              },
            },
          },
        },
        salesforce: {},
      });
    });
  });
  describe('Metadata Refresh reducer in Websearches Mode', () => {
    test('should update status as refreshed for Websearches Record Types', () => {
      const receivedState = reducer(
        undefined,
        actions.metadata.netsuite.receivedCollection(
          [],
          'recordTypes',
          '1234',
          'webservices'
        )
      );
      const refreshReducer = reducer(
        receivedState,
        actions.metadata.refresh('1234', 'recordTypes', 'webservices')
      );

      expect(refreshReducer).toMatchObject({
        netsuite: {
          webservices: {
            1234: { recordTypes: { status: 'refreshed', data: [] } },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
    test('should update status as refreshed for Websearches Saved Searches', () => {
      const receivedState = reducer(
        undefined,
        actions.metadata.netsuite.receivedCollection(
          [],
          '/searchMetadata',
          '1234',
          'webservices',
          'savedSearches'
        )
      );
      const refreshReducer = reducer(
        receivedState,
        actions.metadata.refresh(
          '1234',
          '/searchMetadata',
          'webservices',
          'savedSearches'
        )
      );

      expect(refreshReducer).toMatchObject({
        netsuite: {
          webservices: {
            1234: {
              '/searchMetadata-savedSearches': {
                status: 'refreshed',
                data: [],
              },
            },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
    test('should update status as refreshed for Websearches Date Field', () => {
      const receivedState = reducer(
        undefined,
        actions.metadata.netsuite.receivedCollection(
          [],
          '/searchMetadata',
          '1234',
          'webservices',
          'dateField'
        )
      );
      const refreshReducer = reducer(
        receivedState,
        actions.metadata.refresh(
          '1234',
          '/searchMetadata',
          'webservices',
          'dateField'
        )
      );

      expect(refreshReducer).toMatchObject({
        netsuite: {
          webservices: {
            1234: {
              '/searchMetadata-dateField': { status: 'refreshed', data: [] },
            },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
    test('should update status as refreshed for Websearches Boolean Field', () => {
      const receivedState = reducer(
        undefined,
        actions.metadata.netsuite.receivedCollection(
          [],
          '/searchMetadata',
          '1234',
          'webservices',
          'booleanField'
        )
      );
      const refreshReducer = reducer(
        receivedState,
        actions.metadata.refresh(
          '1234',
          '/searchMetadata',
          'webservices',
          'booleanField'
        )
      );

      expect(refreshReducer).toMatchObject({
        netsuite: {
          webservices: {
            1234: {
              '/searchMetadata-booleanField': { status: 'refreshed', data: [] },
            },
          },
          suitescript: {},
        },
        salesforce: {},
      });
    });
  });
});
// Salesforce related testcases
describe('Salesforce', () => {});
