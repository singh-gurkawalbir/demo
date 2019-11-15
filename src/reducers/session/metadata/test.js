/* global describe, test, expect */
// TODO:(Aditya): Work on test cases for Netsuite and Salesforce.
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
describe('NetSuiteAndSalesforce', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toMatchObject({
      application: {},
      assistants: { http: {}, rest: {} },
    });
  });
  describe('Metadata Request reducer', () => {
    test('should show status as request for resource', () => {
      const requestReducer = reducer(
        undefined,
        actions.metadata.request('1234', 'url')
      );

      expect(requestReducer).toMatchObject({
        application: { '1234': { url: { status: 'requested' } } },
        assistants: { http: {}, rest: {} },
      });
    });
  });
  describe('Metadata Received reducer', () => {
    test('should show data for resource', () => {
      const requestState = reducer(
        undefined,
        actions.metadata.request('1234', 'url')
      );
      const receivedState = reducer(
        requestState,
        actions.metadata.receivedCollection(
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
          '1234',
          'url'
        )
      );

      expect(receivedState).toMatchObject({
        application: {
          '1234': {
            url: {
              status: 'received',
              data: [
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
            },
          },
        },
        assistants: { http: {}, rest: {} },
      });
    });
    test('should update status as refreshed', () => {
      const receivedState = reducer(
        undefined,
        actions.metadata.receivedCollection([], '1234', 'url')
      );
      const refreshReducer = reducer(
        receivedState,
        actions.metadata.refresh('1234', 'url')
      );

      expect(refreshReducer).toMatchObject({
        application: { '1234': { url: { data: [], status: 'refreshed' } } },
        assistants: { http: {}, rest: {} },
      });
    });
  });
});
// Salesforce related testcases
describe('Salesforce', () => {});
