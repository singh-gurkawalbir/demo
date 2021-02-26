/* global describe, expect, test */
import reducer, { selectors } from '.';
import actions from '../actions';
import { FILTER_KEYS } from '../utils/errorManagement';

const flowId = 'flowId-1234';
const resourceId = 'export-1234';

describe('Error Management region selector testcases', () => {
  describe('selectors.flowJobs test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowJobs()).toEqual([]);
    });
  });

  describe('selectors.flowDashboardJobs test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowDashboardJobs()).toEqual({data: [], status: undefined});
    });
  });

  describe('selectors.flowJob test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowJob(false)).toEqual();
    });
  });

  describe('selectors.job test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.job({}, {})).toEqual();
    });
  });

  describe('selectors.allJobs test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.allJobs({}, {})).toEqual();
    });
  });

  describe('selectors.flowJobConnections test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.flowJobConnections();

      expect(selector(undefined, {})).toEqual([]);
    });
    test('should return all the connections used in a flow', () => {
      const conns = [
        {
          _id: 'c1',
          name: 'conn1',
        },
        {
          _id: 'c2',
          name: 'conn2',
        },
        {
          _id: 'c3',
          name: 'conn3',
        },
      ];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('connections', conns)
      );

      const exps = [{
        _id: 'e1',
        _connectionId: 'c1',
      }, {
        _id: 'e2',
        _connectionId: 'c2',
      }];

      state = reducer(
        state,
        actions.resource.receivedCollection('exports', exps)
      );

      const imps = [{
        _id: 'i1',
        _connectionId: 'c3',
      }, {
        _id: 'i2',
        _connectionId: 'c1',
      }];

      state = reducer(
        state,
        actions.resource.receivedCollection('imports', imps)
      );

      const flows = [
        {
          _id: 'f1',
          pageGenerators: [{
            _exportId: 'e1',
          }, {
            _exportId: 'e2',
          }],
          pageProcessors: [
            {
              _importId: 'i1',
            },
          ],
        },
      ];

      state = reducer(state,
        actions.resource.receivedCollection('flows', flows));

      const selector = selectors.flowJobConnections();

      expect(selector(state, 'f1')).toEqual([{
        id: 'c1',
        name: 'conn1',
      }, {
        id: 'c2',
        name: 'conn2',
      }, {
        id: 'c3',
        name: 'conn3',
      }]);
    });

    test('should return all the connections used in a data-loader flow', () => {
      const conns = [
        {
          _id: 'c1',
          name: 'conn1',
        },
      ];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('connections', conns)
      );

      const exps = [{
        _id: 'e1',
        type: 'simple',
      }];

      state = reducer(
        state,
        actions.resource.receivedCollection('exports', exps)
      );

      const imps = [{
        _id: 'i1',
        _connectionId: 'c1',
      }];

      state = reducer(
        state,
        actions.resource.receivedCollection('imports', imps)
      );

      const flows = [
        {
          _id: 'f1',
          _exportId: 'e1',
          _importId: 'i1',
        },
      ];

      state = reducer(state,
        actions.resource.receivedCollection('flows', flows));

      const selector = selectors.flowJobConnections();

      expect(selector(state, 'f1')).toEqual([{
        id: 'c1',
        name: 'conn1',
      }]);
    });

    test('should return all the connections used in a flow where export configured as pp', () => {
      const conns = [
        {
          _id: 'c1',
          name: 'conn1',
        },
        {
          _id: 'c2',
          name: 'conn2',
        },
        {
          _id: 'c3',
          name: 'conn3',
        },
      ];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('connections', conns)
      );

      const exps = [{
        _id: 'e1',
        _connectionId: 'c2',
      }, {
        _id: 'e2',
        _connectionId: 'c3',
      }];

      state = reducer(
        state,
        actions.resource.receivedCollection('exports', exps)
      );

      const imps = [{
        _id: 'i1',
        _connectionId: 'c1',
      }];

      state = reducer(
        state,
        actions.resource.receivedCollection('imports', imps)
      );

      const flows = [
        {
          _id: 'f1',
          pageGenerators: [{
            _exportId: 'e1',
          }],
          pageProcessors: [{
            _exportId: 'e2',
          }, {
            _importId: 'i1',
          }],
        },
      ];

      state = reducer(state,
        actions.resource.receivedCollection('flows', flows));

      const selector = selectors.flowJobConnections();

      expect(selector(state, 'f1')).toEqual([{
        id: 'c1',
        name: 'conn1',
      }, {
        id: 'c2',
        name: 'conn2',
      }, {
        id: 'c3',
        name: 'conn3',
      }]);
    });

    test('should return empty array for invalid flow id', () => {
      const conns = [
        {
          _id: 'c1',
          name: 'conn1',
        },
      ];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('connections', conns)
      );

      const exps = [{
        _id: 'e1',
        _connectionId: 'c2',
      }];

      state = reducer(
        state,
        actions.resource.receivedCollection('exports', exps)
      );

      const imps = [{
        _id: 'i1',
        _connectionId: 'c1',
      }];

      state = reducer(
        state,
        actions.resource.receivedCollection('imports', imps)
      );

      const flows = [
        {
          _id: 'f1',
          pageGenerators: [{
            _exportId: 'e1',
          }],
        },
      ];

      state = reducer(state,
        actions.resource.receivedCollection('flows', flows));

      const selector = selectors.flowJobConnections();

      expect(selector(state, 'invalid-id')).toEqual([]);
    });
  });

  describe('selectors.resourceError test cases', () => {
    const sampleOpenErrors = [
      { errorId: '1234', selected: true },
      { errorId: '1111', selected: true },
      { errorId: '2222' },
    ];
    const sampleResolvedErrors = [
      { errorId: '3333', selected: true },
      { errorId: '4444', selected: true },
      { errorId: '5555' },
    ];
    const sampleErrorState = {
      [flowId]: {
        [resourceId]: {
          open: {
            status: 'received',
            errors: sampleOpenErrors,
          },
          resolved: {
            status: 'received',
            errors: sampleResolvedErrors,
          },
        },
      },
    };
    const sampleState = {
      session: {
        errorManagement: {
          errorDetails: sampleErrorState,
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.resourceError({}, {})).toEqual();
    });
    test('should return undefined if the errorId is not passed / passed error id does not exist', () => {
      expect(selectors.resourceError(sampleState, { flowId, resourceId, options: {}, errorId: 'INVALID_ID'})).toBeUndefined();
      expect(selectors.resourceError(sampleState, { flowId, resourceId, options: { isResolved: true }, errorId: 'INVALID_ID'})).toBeUndefined();
    });
    test('should return matched  error object with the errorId passed for both open/resolved errors', () => {
      expect(selectors.resourceError(sampleState, { flowId, resourceId, options: {}, errorId: '1234'})).toEqual(sampleOpenErrors[0]);
      expect(selectors.resourceError(sampleState, { flowId, resourceId, options: { isResolved: true }, errorId: '3333'})).toEqual(sampleResolvedErrors[0]);
    });
  });

  describe('selectors.selectedRetryIds test cases', () => {
    const sampleOpenErrors = [
      { errorId: '1234', selected: true },
      { errorId: '1111', selected: true },
      { errorId: '2222' },
    ];
    const sampleResolvedErrors = [
      { errorId: '3333', selected: true },
      { errorId: '4444', selected: true },
      { errorId: '5555' },
    ];
    const sampleRetriableOpenErrors = [
      { errorId: '1234', selected: true, retryDataKey: 'retry-123' },
      { errorId: '1111', selected: true, retryDataKey: 'retry-456'},
      { errorId: '2222' },
    ];
    const sampleRetriableResolvedErrors = [
      { errorId: '3333', selected: true, retryDataKey: 'retry-111' },
      { errorId: '4444', selected: true },
      { errorId: '5555' },
    ];
    const sampleErrorState = {
      [flowId]: {
        [resourceId]: {
          open: {
            status: 'received',
            errors: sampleOpenErrors,
          },
          resolved: {
            status: 'received',
            errors: sampleResolvedErrors,
          },
        },
      },
    };
    const sampleRetriableErrorState = {
      [flowId]: {
        [resourceId]: {
          open: {
            status: 'received',
            errors: sampleRetriableOpenErrors,
          },
          resolved: {
            status: 'received',
            errors: sampleRetriableResolvedErrors,
          },
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.selectedRetryIds(undefined, {})).toEqual([]);
    });
    test('should return the retryDataKeys for the errors that are selected and can be retried', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: sampleRetriableErrorState,
          },
        },
      };

      expect(selectors.selectedRetryIds(sampleState, { flowId, resourceId })).toEqual(['retry-123', 'retry-456']);
      expect(selectors.selectedRetryIds(sampleState, { flowId, resourceId, options: { isResolved: true } })).toEqual(['retry-111']);
    });
    test('should return empty list if there are errors selected but not even one of them can be retried', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: sampleErrorState,
          },
        },
      };

      expect(selectors.selectedRetryIds(sampleState, { flowId, resourceId })).toEqual([]);
      expect(selectors.selectedRetryIds(sampleState, { flowId, resourceId, options: { isResolved: true } })).toEqual([]);
    });
  });

  describe('selectors.selectedErrorIds test cases', () => {
    const sampleOpenErrors = [
      { errorId: '1234', selected: true },
      { errorId: '1111', selected: true },
      { errorId: '2222' },
    ];
    const sampleResolvedErrors = [
      { errorId: '3333', selected: true },
      { errorId: '4444', selected: true },
      { errorId: '5555' },
    ];
    const sampleErrorState = {
      [flowId]: {
        [resourceId]: {
          open: {
            status: 'received',
            errors: sampleOpenErrors,
          },
          resolved: {
            status: 'received',
            errors: sampleResolvedErrors,
          },
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.selectedErrorIds({}, {})).toEqual([]);
    });
    test('should return empty list if there are no errors selected', () => {
      const openErrors = [
        { errorId: '1234' },
        { errorId: '1111' },
        { errorId: '2222' },
      ];
      const resolvedErrors = [
        { errorId: '3333' },
        { errorId: '4444' },
        { errorId: '5555' },
      ];
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  open: {
                    status: 'received',
                    errors: openErrors,
                  },
                  resolved: {
                    status: 'received',
                    errors: resolvedErrors,
                  },
                },
              },
            },
          },
        },
      };

      expect(selectors.selectedErrorIds(sampleState, { flowId, resourceId })).toEqual([]);
      expect(selectors.selectedErrorIds(sampleState, { flowId, resourceId, options: { isResolved: true } })).toEqual([]);
    });
    test('should return the errorIds for the errors that are selected', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: sampleErrorState,
          },
        },
      };

      expect(selectors.selectedErrorIds(sampleState, { flowId, resourceId })).toEqual(['1234', '1111']);
      expect(selectors.selectedErrorIds(sampleState, { flowId, resourceId, options: { isResolved: true } })).toEqual(['3333', '4444']);
    });
  });

  describe('selectors.isAllErrorsSelected test cases', () => {
    const sampleOpenErrors = [
      { errorId: '1234', selected: true },
      { errorId: '1111', selected: true },
      { errorId: '2222' },
    ];
    const sampleResolvedErrors = [
      { errorId: '3333', selected: true },
      { errorId: '4444', selected: true },
      { errorId: '5555' },
    ];

    const sampleOpenErrorsAllSelected = [
      { errorId: '1234', selected: true },
      { errorId: '1111', selected: true },
    ];
    const sampleResolvedErrorsAllSelected = [
      { errorId: '3333', selected: true },
      { errorId: '4444', selected: true },
    ];

    const sampleErrorState = {
      [flowId]: {
        [resourceId]: {
          open: {
            status: 'received',
            errors: sampleOpenErrors,
          },
          resolved: {
            status: 'received',
            errors: sampleResolvedErrors,
          },
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isAllErrorsSelected({}, {})).toBeFalsy();
    });
    test('should return false if the error list is empty', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  open: {
                    status: 'received',
                    errors: [],
                  },
                  resolved: {
                    status: 'received',
                    errors: [],
                  },
                },
              },
            },
          },
        },
      };

      expect(selectors.isAllErrorsSelected(sampleState, { flowId, resourceId })).toBeFalsy();
      expect(selectors.isAllErrorsSelected(sampleState, { flowId, resourceId, isResolved: true })).toBeFalsy();
    });
    test('should return false if there is no filter and all errors are not selected', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: sampleErrorState,
          },
        },
      };

      expect(selectors.isAllErrorsSelected(sampleState, { flowId, resourceId })).toBeFalsy();
      expect(selectors.isAllErrorsSelected(sampleState, { flowId, resourceId, isResolved: true })).toBeFalsy();
    });
    test('should return true if there is no filter and all errors are selected', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  open: {
                    status: 'received',
                    errors: sampleOpenErrorsAllSelected,
                  },
                  resolved: {
                    status: 'received',
                    errors: sampleResolvedErrorsAllSelected,
                  },
                },
              },
            },
          },
        },
      };

      expect(selectors.isAllErrorsSelected(sampleState, { flowId, resourceId })).toBeTruthy();
      expect(selectors.isAllErrorsSelected(sampleState, { flowId, resourceId, isResolved: true })).toBeTruthy();
    });
    test('should return false if there is search filter and all the filtered errors are not selected ', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  open: {
                    status: 'received',
                    errors: [
                      { errorId: '9999', message: 'retry failed', selected: true },
                      { errorId: '8888', message: 'invalid hook' },
                      { errorId: '7777', message: 'failed javascript hook', selected: true },
                    ],
                  },
                  resolved: {
                    status: 'received',
                    errors: [
                      { errorId: '1234', message: 'retry failed', selected: true },
                      { errorId: '1111', message: 'invalid transform' },
                      { errorId: '2222', message: 'failed transform', selected: true },
                    ],
                  },
                },
              },
            },
          },
          filters: {
            [FILTER_KEYS.OPEN]: {
              searchBy: ['message'],
              keyword: 'hook',
            },
            [FILTER_KEYS.RESOLVED]: {
              searchBy: ['message'],
              keyword: 'transform',
            },
          },
        },
      };

      expect(selectors.isAllErrorsSelected(sampleState, { flowId, resourceId })).toBeFalsy();
      expect(selectors.isAllErrorsSelected(sampleState, { flowId, resourceId, isResolved: true })).toBeFalsy();
    });
    test('should return true if there is search filter and all the filtered errors are selected ', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  open: {
                    status: 'received',
                    errors: [
                      { errorId: '9999', message: 'retry failed'},
                      { errorId: '8888', message: 'invalid hook', selected: true },
                      { errorId: '7777', message: 'failed javascript hook', selected: true },
                    ],
                  },
                  resolved: {
                    status: 'received',
                    errors: [
                      { errorId: '1234', message: 'retry failed' },
                      { errorId: '1111', message: 'invalid transform', selected: true },
                      { errorId: '2222', message: 'failed transform', selected: true },
                    ],
                  },
                },
              },
            },
          },
          filters: {
            [FILTER_KEYS.OPEN]: {
              searchBy: ['message'],
              keyword: 'hook',
            },
            [FILTER_KEYS.RESOLVED]: {
              searchBy: ['message'],
              keyword: 'transform',
            },
          },
        },
      };

      expect(selectors.isAllErrorsSelected(sampleState, { flowId, resourceId })).toBeTruthy();
      expect(selectors.isAllErrorsSelected(sampleState, { flowId, resourceId, isResolved: true })).toBeTruthy();
    });
  });

  describe('selectors.isAnyErrorActionInProgress test cases', () => {
    const errorDetails = {
      open: {
        status: 'received',
        errors: [
          { errorId: '9999', message: 'retry failed'},
          { errorId: '8888', message: 'invalid hook', selected: true },
          { errorId: '7777', message: 'failed javascript hook', selected: true },
        ],
      },
      resolved: {
        status: 'received',
        errors: [
          { errorId: '1234', message: 'retry failed' },
          { errorId: '1111', message: 'invalid transform', selected: true },
          { errorId: '2222', message: 'failed transform', selected: true },
        ],
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isAnyErrorActionInProgress({}, {})).toBeFalsy();
    });
    test('should return false if the actions does not exist', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  ...errorDetails,
                  actions: {},
                },
              },
            },
          },
        },
      };

      expect(selectors.isAnyErrorActionInProgress(sampleState, { flowId, resourceId })).toBeFalsy();
    });
    test('should return false if neither of retry/resolve actions status is requested', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  ...errorDetails,
                  actions: {
                    retry: {
                      status: 'received',
                      count: 44,
                    },
                    resolve: {
                      status: 'received',
                      count: 50,
                    },
                  },
                },
              },
            },
          },
        },
      };

      expect(selectors.isAnyErrorActionInProgress(sampleState, { flowId, resourceId })).toBeFalsy();
    });
    test('should return true if either of retry/resolve actions status is requested', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  ...errorDetails,
                  actions: {
                    retry: {
                      status: 'requested',
                      count: 44,
                    },
                    resolve: {
                      status: 'received',
                      count: 50,
                    },
                  },
                },
              },
            },
          },
        },
      };

      expect(selectors.isAnyErrorActionInProgress(sampleState, { flowId, resourceId })).toBeTruthy();
    });
  });

  describe('selectors.errorDetails test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.errorDetails({}, {})).toEqual({});
    });
  });

  describe('selectors.makeResourceErrorsSelector test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.makeResourceErrorsSelector();

      expect(selector({}, {})).toEqual({errors: []});
    });
  });

  describe('selectors.integrationErrorsPerSection test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationErrorsPerSection()).toEqual({});
    });
    test('should return integration errors per Section excluding disabled flow', () => {
      const integrations = [
        {
          _id: 'int1',
          settings: {
            sections: [{
              title: 'T1',
              id: 'secId',
              flows: [{
                _id: 'f1',
              }, {
                _id: 'f2',
              }, {
                _id: 'f3',
              }, {
                _id: 'f4',
              }],
            }],
          },
        },
      ];

      let state = reducer(undefined, actions.resource.receivedCollection('integrations', integrations));

      const flows = [
        {
          _id: 'f1',
        },
        {
          _id: 'f2',
        },
        {
          _id: 'f3',
        },
        {
          _id: 'f4',
          disabled: true,
        },
      ];

      state = reducer(state, actions.resource.receivedCollection('flows', flows));

      state = reducer(state, actions.errorManager.integrationErrors.request({ integrationId: 'int1'}));
      state = reducer(state, actions.errorManager.integrationErrors.received({ integrationId: 'int1',
        integrationErrors: [
          {
            _flowId: 'f1',
            numError: 10,
          },
          {
            _flowId: 'f2',
            numError: 20,
          },
          {
            _flowId: 'f3',
            numError: 5,
          },
          {
            _flowId: 'f4',
            numError: 50,
          },
        ],
      }));

      expect(selectors.integrationErrorsPerSection(state, 'int1')).toEqual({
        T1: 35,
      });
    });

    test('should return integration errors per Section if multiple sections exists', () => {
      const integrations = [
        {
          _id: 'int1',
          settings: {
            sections: [{
              title: 'Section1',
              id: 'secId',
              flows: [{
                _id: 'f1',
              }, {
                _id: 'f2',
              }],
            }, {
              title: 'Section2',
              id: 'secId2',
              flows: [{
                _id: 'f3',
              }, {
                _id: 'f4',
              }],
            }],
          },
        },
      ];

      let state = reducer(undefined, actions.resource.receivedCollection('integrations', integrations));

      const flows = [
        {
          _id: 'f1',
        },
        {
          _id: 'f2',
        },
        {
          _id: 'f3',
        },
        {
          _id: 'f4',
        },
      ];

      state = reducer(state, actions.resource.receivedCollection('flows', flows));

      state = reducer(state, actions.errorManager.integrationErrors.request({ integrationId: 'int1'}));
      state = reducer(state, actions.errorManager.integrationErrors.received({ integrationId: 'int1',
        integrationErrors: [
          {
            _flowId: 'f1',
            numError: 10,
          },
          {
            _flowId: 'f2',
            numError: 20,
          },
          {
            _flowId: 'f3',
            numError: 5,
          },
          {
            _flowId: 'f4',
            numError: 50,
          },
        ],
      }));

      expect(selectors.integrationErrorsPerSection(state, 'int1')).toEqual({
        Section1: 30,
        Section2: 55,
      });
    });

    test('should return empty object if integration doesnot exist', () => {
      const integrations = [
        {
          _id: 'int1',
        },
      ];

      const state = reducer(undefined, actions.resource.receivedCollection('integrations', integrations));

      expect(selectors.integrationErrorsPerSection(state, 'int2')).toEqual({});
    });
  });

  describe('selectors.integrationErrorsPerStore test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationErrorsPerStore()).toEqual({});
    });

    test('should return emptyObject if integration doesn\'t support multistore', () => {
      const integrations = [{
        _id: 'intid',
        settings: {
          supportsMultiStore: false,
        },
      }];

      const state = actions.resource.receivedCollection('integrations', integrations);

      expect(selectors.integrationErrorsPerStore(state, 'intid')).toEqual({});
    });
    test('should return integration errors per store if integration supports multiStore', () => {
      const integrations = [{
        _id: 'intid',
        settings: {
          supportsMultiStore: true,
          sections: [{
            title: 'DBA',
            id: 'sec1',
            sections: [{
              title: 'T1',
              id: 'secId',
              flows: [{
                _id: 'f1',
              }, {
                _id: 'f2',
              }],
            }],
          }, {
            title: 'WF',
            id: 'sec2',
            sections: [{
              title: 'T2',
              id: 'secId',
              flows: [{
                _id: 'f3',
              }, {
                _id: 'f4',
              }],
            }],
          }],
        },
      }];

      let state = reducer(undefined,
        actions.resource.receivedCollection('integrations', integrations)
      );
      const flows = [
        {
          _id: 'f1',
        },
        {
          _id: 'f2',
        },
        {
          _id: 'f3',
        },
        {
          _id: 'f4',
          disabled: true,
        },
      ];

      state = reducer(state, actions.resource.receivedCollection('flows', flows));

      state = reducer(state, actions.errorManager.integrationErrors.request({ integrationId: 'intid'}));
      state = reducer(state, actions.errorManager.integrationErrors.received({ integrationId: 'intid',
        integrationErrors: [
          {
            _flowId: 'f1',
            numError: 10,
          },
          {
            _flowId: 'f2',
            numError: 20,
          },
          {
            _flowId: 'f3',
            numError: 5,
          },
          {
            _flowId: 'f4',
            numError: 50,
          },
        ],
      }));

      expect(selectors.integrationErrorsPerStore(state, 'intid')).toEqual({
        sec1: 30,
        sec2: 5,
      });
    });

    test('should return empty object if integration doesn\'t exist', () => {
      const integrations = [
        {
          _id: 'int1',
        },
      ];

      const state = reducer(undefined, actions.resource.receivedCollection('integrations', integrations));

      expect(selectors.integrationErrorsPerStore(state, 'int2')).toEqual({});
    });
  });

  describe('selectors.getIntegrationUserNameById test cases', () => {
    const orgOwnerState = {
      user: {
        preferences: {
          defaultAShareId: 'own',
        },
        profile: {
          _id: '5cadc8b42b10347a2708bf29',
          name: 'Raghuvamsi Owner',
          email: 'raghuvamsi.chandrabhatla@celigo.com',
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
                email: 'raghuvamsi.chandrabhatla+3@celigo.com',
                name: 'Raghuvamsi4 Chandrabhatla',
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
                email: 'raghuvamsi.chandrabhatla+2@celigo.com',
                name: 'Raghuvamsi',
              },
            },
            {
              _id: '5f770d4b96ae3b4bf0fdd8f1',
              accepted: true,
              accessLevel: 'monitor',
              integrationAccessLevel: [],
              sharedWithUser: {
                _id: '5f770d4b96ae3b4bf0fdd8ee',
                email: 'raghuvamsi.chandrabhatla+6@celigo.com',
                name: 'Raghuvamsi C',
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
                  email: 'raghuvamsi.chandrabhatla+3@celigo.com',
                  name: 'Raghuvamsi4 Chandrabhatla',
                },
              },
              {
                _id: '5f72fae75b2e32448373575e',
                accepted: true,
                sharedWithUser: {
                  _id: '5f686ef49daecd32740e2710',
                  email: 'raghuvamsi.chandrabhatla+2@celigo.com',
                  name: 'Raghuvamsi',
                },
                accessLevel: 'monitor',
              },
              {
                _id: '5f770d4b96ae3b4bf0fdd8f1',
                accepted: true,
                accessLevel: 'monitor',
                sharedWithUser: {
                  _id: '5f770d4b96ae3b4bf0fdd8ee',
                  email: 'raghuvamsi.chandrabhatla+6@celigo.com',
                  name: 'Raghuvamsi C',
                },
              },
            ],
          },
        },
        debug: false,
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getIntegrationUserNameById()).toEqual();
    });
    test('should return user name if the userId is logged in user', () => {
      expect(selectors.getIntegrationUserNameById(orgOwnerState, '5f686ef49daecd32740e2710')).toEqual('Raghuvamsi');
    });
    test('should return undefined if the userId is not loggedUser and no flowId is passed', () => {
      const orgUserState = {
        user: {
          preferences: {
            environment: 'production',
            dateFormat: 'MM/DD/YYYY',
          },
          profile: {
            _id: '5cadc8b42b10347a2708bf29',
            name: 'Raghuvamsi Owner',
            email: 'raghuvamsi.chandrabhatla@celigo.com',
            useErrMgtTwoDotZero: true,
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
                  email: 'raghuvamsi.chandrabhatla+3@celigo.com',
                  name: 'Raghuvamsi4 Chandrabhatla',
                },
              },
            ],
            accounts: [
              {
                _id: 'own',
                accessLevel: 'owner',
                ownerUser: {
                  licenses: [],
                },
              },
            ],
          },
          debug: false,
        },
      };

      expect(selectors.getIntegrationUserNameById(orgUserState, '5f6882679daecd32740e2c38')).toBeUndefined();
    });
    test('should return undefined if passed userId does not exist', () => {
      expect(selectors.getIntegrationUserNameById(orgOwnerState, 'INVALID_USER_ID')).toBeUndefined();
    });
    test('should return user name from the integration usersList if valid userId and flowId are passed', () => {
      const userId = '5f6882679daecd32740e2c38';
      const flowId = 'flow-123';

      expect(selectors.getIntegrationUserNameById(orgOwnerState, userId, flowId)).toBe('Raghuvamsi4 Chandrabhatla');
    });
  });
});

