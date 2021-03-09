/* global describe, test, expect */
// TODO:(Aditya): Work on test cases for Netsuite and Salesforce.
import reducer, { selectors } from '.';
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
  describe('metadata reducer testcases', () => {
    describe('tests for actions request, refresh, received', () => {
      test('should set status as requested for request action', () => {
        const requestReducer = reducer(
          undefined,
          actions.metadata.request('1234', 'url')
        );

        expect(requestReducer).toMatchObject({
          application: { 1234: { url: { status: 'requested' } } },
          assistants: { http: {}, rest: {} },
        });
      });
      test('should update status as refreshed for refresh action', () => {
        const receivedState = reducer(
          {
            application:
            { 123: { 'salesforce/metadata/123/recordTypes': {
              status: 'error',
              data: ['account', 'opportunity'],
              errorMessage: 'Request limit exceeded',
            } } },
            preview: {},
            assistants: { rest: {}, http: {} },
          },
          actions.metadata.receivedCollection([], '1234', 'url')
        );
        const refreshReducer = reducer(
          receivedState,
          actions.metadata.refresh('1234', 'url')
        );

        expect(refreshReducer).toMatchObject({
          application: {
            1234: {
              url: {
                data: [],
                status: 'refreshed',
              },
            },
            123: {
              'salesforce/metadata/123/recordTypes': {
                status: 'error',
                data: ['account', 'opportunity'],
                errorMessage: 'Request limit exceeded',
              },
            },
          },
          preview: {},
          assistants: { http: {}, rest: {} },
        });
      });
      test('should set metadata for application for provided path when called received action', () => {
        const requestState = reducer(
          {
            application:
            { 123: { 'salesforce/metadata/123/recordTypes': {
              status: 'error',
              data: ['account', 'opportunity'],
              errorMessage: 'Request limit exceeded',
            } } },
            preview: {},
            assistants: { rest: {}, http: {} },
          },
          actions.metadata.request('connId', 'recordTypes')
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
            'connId',
            'recordTypes'
          )
        );

        expect(receivedState).toMatchObject({
          application: {
            connId: {
              recordTypes: {
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
            123: {
              'salesforce/metadata/123/recordTypes': {
                status: 'error',
                data: [
                  'account',
                  'opportunity',
                ],
                errorMessage: 'Request limit exceeded',
              },
            },
          },
          preview: {},
          assistants: { http: {}, rest: {} },
        });
      });
    });
    describe('tests for action received error', () => {
      test('should update metadata path with error received', () => {
        const connId = '123';
        const state = reducer(
          undefined,
          actions.metadata.receivedError(
            'Request limit exceeded',
            connId,
            `salesforce/metadata/${connId}/recordTypes`,
          )
        );

        expect(state).toEqual(
          {
            application:
            { 123: { 'salesforce/metadata/123/recordTypes': {
              status: 'error',
              data: [],
              errorMessage: 'Request limit exceeded',
            } } },
            preview: {},
            assistants: { rest: {}, http: {} } }
        );
      });

      test('should update metadata path with error message and metadata shouldn\'t be changed if status is refreshed', () => {
        const connId = '123';
        const state = reducer({
          application:
            { 123: { 'salesforce/metadata/123/recordTypes': {
              status: 'refreshed',
              data: ['account', 'opportunity'],

            } } },
          preview: {},
          assistants: { rest: {}, http: {} } },
        actions.metadata.receivedError(
          'Request limit exceeded',
          connId,
          `salesforce/metadata/${connId}/recordTypes`,
        )
        );

        expect(state).toEqual(
          {
            application:
            { 123: { 'salesforce/metadata/123/recordTypes': {
              status: 'error',
              data: ['account', 'opportunity'],
              errorMessage: 'Request limit exceeded',
            } } },
            preview: {},
            assistants: { rest: {}, http: {} } }
        );
      });

      test('should update metadata path with error message and metadata should be reset if status is not refreshed', () => {
        const connId = '123';
        const state = reducer({
          application:
            { 123: { 'salesforce/metadata/123/recordTypes': {
              status: 'requested',
              data: ['account', 'opportunity'],

            } } },
          preview: {},
          assistants: { rest: {}, http: {} } },
        actions.metadata.receivedError(
          'Request limit exceeded',
          connId,
          `salesforce/metadata/${connId}/recordTypes`,
        )
        );

        expect(state).toEqual(
          {
            application:
            { 123: { 'salesforce/metadata/123/recordTypes': {
              status: 'error',
              data: [],
              errorMessage: 'Request limit exceeded',
            } } },
            preview: {},
            assistants: { rest: {}, http: {} } }
        );
      });
    });
    describe('tests for action received validation error', () => {
      test('should update metadata path with validation message and metadata should be reset if status is not refreshed', () => {
        const connId = '123';
        const state = reducer({
          application:
            { 123: { 'salesforce/metadata/123/recordTypes': {
              status: 'requested',
              data: ['account', 'opportunity'],

            } } },
          preview: {},
          assistants: { rest: {}, http: {} } },
        actions.metadata.validationError(
          'Bundle not installed.',
          connId,
          `salesforce/metadata/${connId}/recordTypes`,
        )
        );

        expect(state).toEqual(
          {
            application:
            { 123: { 'salesforce/metadata/123/recordTypes': {
              status: 'error',
              data: [],
              validationError: 'Bundle not installed.',
            } } },
            preview: {},
            assistants: { rest: {}, http: {} } }
        );
      });

      test('should update metadata path with validation message and metadata should not be modified if status is refreshed', () => {
        const connId = '123';
        const state = reducer({
          application:
            { 123: { 'salesforce/metadata/123/recordTypes': {
              status: 'refreshed',
              data: ['account', 'opportunity'],

            } } },
          preview: {},
          assistants: { rest: {}, http: {} } },
        actions.metadata.validationError(
          'Bundle not installed.',
          connId,
          `salesforce/metadata/${connId}/recordTypes`,
        )
        );

        expect(state).toEqual(
          {
            application:
            { 123: { 'salesforce/metadata/123/recordTypes': {
              status: 'error',
              data: ['account', 'opportunity'],
              validationError: 'Bundle not installed.',
            } } },
            preview: {},
            assistants: { rest: {}, http: {} } }
        );
      });
    });
  });
  describe('assistant preview reducer tests', () => {
    test('should update status as requested for assistant preview request action', () => {
      const state = reducer(
        undefined,
        actions.metadata.requestAssistantImportPreview('123')
      );

      expect(state).toMatchObject({
        application: {},
        assistants: {
          rest: {},
          http: {},
        },
        preview: {
          123: {
            status: 'requested',
          },
        },
      });
    });

    test('should update status as error for assistant preview failed action', () => {
      const state = reducer(
        undefined,
        actions.metadata.failedAssistantImportPreview('123')
      );

      expect(state).toEqual({
        application: {},
        assistants: {
          rest: {},
          http: {},
        },
        preview: {
          123: {
            status: 'error',
          },
        },
      });
    });

    test('should remove assistant preview data for resource on reset action', () => {
      const state = reducer(
        {
          preview: {
            123: {
              status: 'received',
              data: {
                id: '123',
                name: 'Account',
              },
            },
          },
        },
        actions.metadata.resetAssistantImportPreview('123')
      );

      expect(state).toEqual({
        preview: {},
      });
    });

    test('should update assistant metadata and status with received action', () => {
      let state = reducer(
        {
          assistants: {
            http: {},
            rest: {},
          },
          preview: {},
        },
        actions.assistantMetadata.received({
          adaptorType: 'rest',
          assistant: 'gainsight',
          metadata: {
            recordType: 'order',
          }})
      );

      state = reducer(
        state,
        actions.metadata.receivedAssistantImportPreview('123', {
          id: '123',
          name: 'Account',
        })
      );

      expect(state).toEqual({
        assistants: {
          http: {},
          rest: {
            gainsight: {
              recordType: 'order',
            },
          },
        },
        preview: {
          123: {
            status: 'received',
            data: {
              id: '123',
              name: 'Account',
            },
          },
        },
      });
    });
  });
});

describe('selector testcases for metadata', () => {
  test('should return metadata from state based on metapath', () => {
    const connId = '1234';

    const accountMetadata = [
      {
        fields: [{
          id: 'name',
          label: 'Name',
          type: 'string',
        }, {
          id: 'recordid',
          label: 'Record Id',
          type: 'id',
        }, {
          id: 'createddate',
          label: 'Created Date',
          type: 'datetime',
        }],
      },
    ];

    const opportunityMetadata = [
      {
        fields: [{
          id: 'opportunityname',
          label: 'Opportunity Name',
          type: 'string',
        }, {
          id: 'oppid',
          label: 'Opportunity Id',
          type: 'id',
        }, {
          id: 'createddate',
          label: 'Created Date',
          type: 'datetime',
        }],
      },
    ];
    const requestState = reducer(
      undefined,
      actions.metadata.request(connId, `/salesforce/metadata/${connId}/sobjects/account`)
    );
    let receivedState = reducer(
      requestState,
      actions.metadata.receivedCollection(
        accountMetadata,
        connId,
        `/salesforce/metadata/${connId}/sobjects/account`
      )
    );

    receivedState = reducer(
      receivedState,
      actions.metadata.receivedCollection(
        opportunityMetadata,
        connId,
        `/salesforce/metadata/${connId}/sobjects/opportunity`
      )
    );

    expect(selectors.optionsFromMetadata(receivedState,
      connId,
      `/salesforce/metadata/${connId}/sobjects/account`,
      'salesforce-sObject-layout',
    ).data).toEqual(accountMetadata);

    expect(selectors.optionsFromMetadata(receivedState,
      connId,
      `/salesforce/metadata/${connId}/sobjects/opportunity`,
      'salesforce-sObject-layout',
    ).data).toEqual(opportunityMetadata);
  });

  test('should return metadata from state based on metapath for cached selector', () => {
    const connId = '1234';

    const accountMetadata = [
      {
        fields: [{
          id: 'name',
          label: 'Name',
          type: 'string',
        }, {
          id: 'recordid',
          label: 'Record Id',
          type: 'id',
        }, {
          id: 'createddate',
          label: 'Created Date',
          type: 'datetime',
        }],
      },
    ];

    const opportunityMetadata = [
      {
        fields: [{
          id: 'opportunityname',
          label: 'Opportunity Name',
          type: 'string',
        }, {
          id: 'oppid',
          label: 'Opportunity Id',
          type: 'id',
        }, {
          id: 'createddate',
          label: 'Created Date',
          type: 'datetime',
        }],
      },
    ];
    const requestState = reducer(
      undefined,
      actions.metadata.request(connId, `/salesforce/metadata/${connId}/sobjects/account`)
    );
    let receivedState = reducer(
      requestState,
      actions.metadata.receivedCollection(
        accountMetadata,
        connId,
        `/salesforce/metadata/${connId}/sobjects/account`
      )
    );

    receivedState = reducer(
      receivedState,
      actions.metadata.receivedCollection(
        opportunityMetadata,
        connId,
        `/salesforce/metadata/${connId}/sobjects/opportunity`
      )
    );

    const cachedSelector = selectors.makeOptionsFromMetadata();

    expect(cachedSelector(
      receivedState,
      connId,
      `/salesforce/metadata/${connId}/sobjects/account`,
      'salesforce-sObject-layout',
    ).data).toEqual(accountMetadata);

    expect(cachedSelector(receivedState,
      connId,
      `/salesforce/metadata/${connId}/sobjects/opportunity`,
      'salesforce-sObject-layout',
    ).data).toEqual(opportunityMetadata);
  });

  test('should return assistantData from state', () => {
    const state = reducer(
      {
        assistants: {
          http: {},
          rest: {},
        },
      },
      actions.assistantMetadata.received({
        adaptorType: 'rest',
        assistant: 'gainsight',
        metadata: {
          recordType: 'order',
        }})
    );

    expect(selectors.assistantData(state, {adaptorType: 'rest', assistant: 'gainsight'})).toEqual({
      recordType: 'order',
    });
  });

  test('should return assistant preview data from state', () => {
    const state = reducer(
      undefined,
      actions.metadata.receivedAssistantImportPreview('123', {
        id: '123',
        name: 'Account',
      })
    );

    expect(selectors.assistantPreviewData(state, '123').data).toEqual({
      id: '123',
      name: 'Account',
    });
  });
});

