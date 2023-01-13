
import { selectors } from '.';

describe('Form fields state validation test cases', () => {
  const formKey = 'new-abcd';

  describe('httpPagingValidationError test cases', () => {
    const pagingFieldsToValidate = ['http.relativeURI', 'http.body', 'http.paging.relativeURI', 'http.paging.body'];
    const pagingMethodsToValidate = {
      page: /.*{{.*export\.http\.paging\.page.*}}/,
      skip: /.*{{.*export\.http\.paging\.skip.*}}/,
      token: /.*{{.*export\.http\.paging\.token.*}}/,
    };
    let state;

    beforeEach(() => {
      state = {
        session: {
          form: {
            [formKey]: {
              fields: {
                'http.paging.method': {value: 'skip'},
                'http.relativeURI': {value: '/orders'},
                'http.body': {value: {}},
              },
            },
          },
        },
      };
    });
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.httpPagingValidationError()).toBeUndefined();
      expect(selectors.httpPagingValidationError()).toBeUndefined();
      expect(selectors.httpPagingValidationError(state, formKey)).toBeUndefined();
    });
    test('should return undefined if the validation criteria is correctly met for skip method', () => {
      state.session.form[formKey].fields['http.relativeURI'].value = '/orders?skip={{export.http.paging.skip}}';
      expect(selectors.httpPagingValidationError(state, formKey, pagingMethodsToValidate, pagingFieldsToValidate)).toBeUndefined();
    });
    test('should return undefined if the validation criteria is correctly met for token method', () => {
      state.session.form[formKey].fields['http.paging.method'].value = 'token';
      state.session.form[formKey].fields['http.body'].value = '{abc: {{substring export.http.paging.token}}}';
      expect(selectors.httpPagingValidationError(state, formKey, pagingMethodsToValidate, pagingFieldsToValidate)).toBeUndefined();
    });
    test('should return the error message for passed paging method if validation criteria fails', () => {
      expect(selectors.httpPagingValidationError(state, formKey, pagingMethodsToValidate, pagingFieldsToValidate)).toBe('The paging method selected must use {{export.http.paging.skip}} in either the relative URI or HTTP request body.');
    });
  });

  describe('httpDeltaValidationError test cases', () => {
    const deltaFieldsToValidate = ['http.relativeURI', 'http.body'];
    let state;

    beforeEach(() => {
      state = {
        session: {
          form: {
            [formKey]: {
              fields: {
                type: {value: 'delta'},
                'http.relativeURI': {value: '/orders'},
                'http.body': {value: {}},
              },
            },
          },
        },
      };
    });
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.httpDeltaValidationError()).toBeUndefined();
      expect(selectors.httpDeltaValidationError(state, formKey)).toBeUndefined();
    });
    test('should return undefined if export type is not delta', () => {
      state.session.form[formKey].fields.type.value = 'once';
      expect(selectors.httpDeltaValidationError(state, formKey, deltaFieldsToValidate)).toBeUndefined();
    });
    test('should return undefined if validation criteria is met for delta export type', () => {
      state.session.form[formKey].fields['http.body'].value = '{send: {{dateFormat lastExportDateTime}}}';
      expect(selectors.httpDeltaValidationError(state, formKey, deltaFieldsToValidate)).toBeUndefined();
    });
    test('should return the error message if validation criteria is not met', () => {
      expect(selectors.httpDeltaValidationError(state, formKey, deltaFieldsToValidate)).toBe('Delta exports must use {{lastExportDateTime}} in either the relative URI or HTTP request body.');
    });
  });
  describe('retryUsersList test cases', () => {
    let state;
    const orgOwnerState = {
      session: {
        errorManagement: {
          retries: {
            'flow-123': {
              'res-123': {
                status: 'received',
                data: [
                  {
                    _id: 'jobId1',
                    triggeredBy: '5f6882679daecd32740e2c38',
                  },
                  {
                    _id: 'jobId2',
                    triggeredBy: '5f6882679daecd32740e2c38',
                  },
                  {
                    _id: 'jobId3',
                    triggeredBy: '5f686ef49daecd32740e2710',
                  },
                  {
                    _id: 'jobId3',
                    triggeredBy: 'auto',
                  },
                ],
              },
            },
          },
        },
      },
      user: {
        preferences: {
          defaultAShareId: 'own',
        },
        profile: {
          _id: '5cadc8b42b10347a2708bf29',
          name: 'Owner name',
          email: 'owner@celigo.com',
        },
        org: {
          users: [
            {
              _id: '5f7011605b2e3244837309f9',
              accepted: true,
              accessLevel: 'monitor',
              integrationAccessLevel: [
                {
                  _integrationId: '5e44efa28015c9464272256f',
                  accessLevel: 'manage',
                },
              ],
              sharedWithUser: {
                _id: '5f6882679daecd32740e2c38',
                email: 'sharedUser1@celigo.com',
                name: 'Shared user 1',
              },
            },
            {
              _id: '5f72fae75b2e32448373575e',
              accepted: true,
              accessLevel: 'monitor',
              integrationAccessLevel: [
                {
                  _integrationId: '5e44ee816fb284424f693b43',
                  accessLevel: 'manage',
                },
              ],
              sharedWithUser: {
                _id: '5f686ef49daecd32740e2710',
                email: 'shareduser2@celigo.com',
                name: 'Shared user 2',
              },
            },
            {
              _id: '5f770d4b96ae3b4bf0fdd8f1',
              accepted: true,
              accessLevel: 'monitor',
              integrationAccessLevel: [],
              sharedWithUser: {
                _id: '5f770d4b96ae3b4bf0fdd8ee',
                email: 'shareduser3@celigo.com',
                name: 'Shared user 3',
              },
            },
          ],
          accounts: [
            {
              _id: 'own',
              accessLevel: 'owner',
            },
          ],
        },
        data: {
          resources: {
            flows: [{
              _id: 'flow-123',
              _integrationId: '5e44ee816fb284424f693b43',
              name: 'test flow',
            }],
          },
          integrationAShares: {
            '5e44ee816fb284424f693b43': [
              {
                _id: '5f7011605b2e3244837309f9',
                accepted: true,
                accessLevel: 'monitor',
                sharedWithUser: {
                  _id: '5f6882679daecd32740e2c38',
                  email: 'sharedUser1@celigo.com',
                  name: 'Shared user 1',
                },
              },
              {
                _id: '5f72fae75b2e32448373575e',
                accepted: true,
                sharedWithUser: {
                  _id: '5f686ef49daecd32740e2710',
                  email: 'shareduser2@celigo.com',
                  name: 'Shared user 2',
                },
                accessLevel: 'monitor',
              },
              {
                _id: '5f770d4b96ae3b4bf0fdd8f1',
                accepted: true,
                accessLevel: 'monitor',
                sharedWithUser: {
                  _id: '5f770d4b96ae3b4bf0fdd8ee',
                  email: 'shareduser3@celigo.com',
                  name: 'Shared user 3',
                },
              },
            ],
          },
        },
        debug: false,
      },
    };

    beforeEach(() => {
      state = {
        ...orgOwnerState,
      };
    });
    const integrationId = '5e44ee816fb284424f693b43';
    const flowId = 'flow-123';
    const resourceId = 'res-123';

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.retryUsersList()).toEqual([{ _id: 'all', name: 'All users'}]);
      expect(selectors.retryUsersList(state)).toEqual([{ _id: 'all', name: 'All users'}]);
      expect(selectors.retryUsersList(state, 'none')).toEqual([{ _id: 'all', name: 'All users'}]);
    });
    test('should return default user list if resource has no retry jobs', () => {
      expect(selectors.retryUsersList(state, integrationId, 'flowId', 'resId')).toEqual([{ _id: 'all', name: 'All users'}]);
    });
    test('should return correct user list if resource has retry jobs', () => {
      expect(selectors.retryUsersList(state, integrationId, flowId, resourceId)).toEqual([
        { _id: 'all', name: 'All users'},
        { _id: '5f6882679daecd32740e2c38', name: 'Shared user 1' },
        { _id: '5f686ef49daecd32740e2710', name: 'Shared user 2' },
        { _id: 'auto', name: 'Auto-retried' },
      ]);
    });
  });
  describe('selectors.mkFlowResourcesRetryStatus test cases', () => {
    let state;
    const flows = [
      {
        _id: 'f1',
        _exportId: 'e1',
        _importId: 'i1',
        p1: 1,
        p2: 2,
        _integrationId: 'i1',
      },
      {
        _id: 'f2',
        pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
        _integrationId: 'i1',
      },
      {
        _id: 'f3',
        pageProcessors: [
          { _exportId: 'e1', type: 'export' },
          { _importId: 'i1', type: 'import' },
          { _exportId: 'e2', type: 'export' },
        ],
        _integrationId: 'i1',
      },
      {
        _id: 'f4',
        pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
        pageProcessors: [
          { _exportId: 'e3', type: 'export' },
          { _importId: 'i1', type: 'import' },
          { _exportId: 'e4', type: 'export' },
          { _importId: 'i2', type: 'import' },
        ],
        _integrationId: 'i1',
      },
    ];
    const exports = [{
      _id: 'e1',
      name: 'e1',
      _connectionId: 'c1',
    },
    {
      _id: 'e2',
      name: 'e2',
      _connectionId: 'c2',
    }, {
      _id: 'e3',
      name: 'e3',
      _connectionId: 'c3',
    }];
    const imports = [{
      _id: 'i1',
      name: 'i1',
      _connectionId: 'c1',
    }, {
      _id: 'i2',
      name: 'i2',
      _connectionId: 'c4',
    }];

    const retryDataStatus = {
      f1: {},
      f2: {
        e1: 'inProgress',
        e2: 'requested',
      },
      f3: {
        e1: 'inProgress',
        i1: 'completed',
      },
      f4: {
        e1: 'completed',
        i1: 'completed',
      },
    };

    beforeEach(() => {
      state = {
        session: {
          errorManagement: {
            retryData: {
              retryStatus: retryDataStatus,
            },
          },
        },
        data: {
          resources: {
            flows,
            exports,
            imports,
          },
        },
      };
    });

    const selector = selectors.mkFlowResourcesRetryStatus();

    test('should not throw any exception for invalid arguments', () => {
      expect(selector()).toEqual({
        isAnyRetryInProgress: false,
        resourcesWithRetryCompleted: [],
      });
      expect(selector(state)).toEqual({
        isAnyRetryInProgress: false,
        resourcesWithRetryCompleted: [],
      });
    });
    test('should return correct status no retry is requested for any resource in the flow', () => {
      expect(selector(state, 'f1')).toEqual({
        isAnyRetryInProgress: false,
        resourcesWithRetryCompleted: [],
      });
    });
    test('should return correct status if a retry is in progress for a resource in the flow', () => {
      expect(selector(state, 'f2')).toEqual({
        isAnyRetryInProgress: true,
        resourcesWithRetryCompleted: [],
      });
    });
    test('should return correct status if a retry is in progress for a resource and is completed for other resource in the flow', () => {
      expect(selector(state, 'f3')).toEqual({
        isAnyRetryInProgress: true,
        resourcesWithRetryCompleted: [{
          _id: 'i1',
          name: 'i1',
          type: 'imports',
        }],
      });
    });
    test('should return correct status if a no retry is in progress and is completed for other resources in the flow', () => {
      expect(selector(state, 'f4')).toEqual({
        isAnyRetryInProgress: false,
        resourcesWithRetryCompleted: [
          {
            _id: 'e1',
            name: 'e1',
            type: 'exports',
          },
          {
            _id: 'i1',
            name: 'i1',
            type: 'imports',
          },
        ],
      });
    });
  });
});
