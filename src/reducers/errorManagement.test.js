/* global describe, expect, test */
import { selectors } from '.';
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
      expect(selectors.resourceError(sampleState, { flowId, resourceId, errorId: 'INVALID_ID'})).toBeUndefined();
      expect(selectors.resourceError(sampleState, { flowId, resourceId, isResolved: true, errorId: 'INVALID_ID'})).toBeUndefined();
    });
    test('should return matched  error object with the errorId passed for both open/resolved errors', () => {
      expect(selectors.resourceError(sampleState, { flowId, resourceId, errorId: '1234'})).toEqual(sampleOpenErrors[0]);
      expect(selectors.resourceError(sampleState, { flowId, resourceId, isResolved: true, errorId: '3333'})).toEqual(sampleResolvedErrors[0]);
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
      expect(selectors.selectedRetryIds(sampleState, { flowId, resourceId, isResolved: true })).toEqual(['retry-111']);
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
      expect(selectors.selectedRetryIds(sampleState, { flowId, resourceId, isResolved: true })).toEqual([]);
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
      expect(selectors.selectedErrorIds(sampleState, { flowId, resourceId, isResolved: true })).toEqual([]);
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
      expect(selectors.selectedErrorIds(sampleState, { flowId, resourceId, isResolved: true})).toEqual(['3333', '4444']);
    });
  });

  describe('selectors.isAllErrorsSelectedInCurrPage test cases', () => {
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
      expect(selectors.isAllErrorsSelectedInCurrPage({}, {})).toBeFalsy();
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

      expect(selectors.isAllErrorsSelectedInCurrPage(sampleState, { flowId, resourceId })).toBeFalsy();
      expect(selectors.isAllErrorsSelectedInCurrPage(sampleState, { flowId, resourceId, isResolved: true })).toBeFalsy();
    });
    test('should return false if there is no filter and all errors are not selected', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: sampleErrorState,
          },
        },
      };

      expect(selectors.isAllErrorsSelectedInCurrPage(sampleState, { flowId, resourceId })).toBeFalsy();
      expect(selectors.isAllErrorsSelectedInCurrPage(sampleState, { flowId, resourceId, isResolved: true })).toBeFalsy();
    });
    test('should return true if there is no filter and all errors are selected in the first page', () => {
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

      expect(selectors.isAllErrorsSelectedInCurrPage(sampleState, { flowId, resourceId })).toBeTruthy();
      expect(selectors.isAllErrorsSelectedInCurrPage(sampleState, { flowId, resourceId, isResolved: true })).toBeTruthy();
    });
    test('should return false if there is search filter and all the filtered errors in the current page are not selected ', () => {
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

      expect(selectors.isAllErrorsSelectedInCurrPage(sampleState, { flowId, resourceId })).toBeFalsy();
      expect(selectors.isAllErrorsSelectedInCurrPage(sampleState, { flowId, resourceId, isResolved: true })).toBeFalsy();
    });
    test('should return true if there is search filter and all the filtered errors in the current page are selected ', () => {
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

      expect(selectors.isAllErrorsSelectedInCurrPage(sampleState, { flowId, resourceId })).toBeTruthy();
      expect(selectors.isAllErrorsSelectedInCurrPage(sampleState, { flowId, resourceId, isResolved: true })).toBeTruthy();
    });
    test('should return false if the current page errors are all not selected', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  open: {
                    status: 'received',
                    errors: [
                      // page 1 when searched with failed
                      { errorId: '9999', message: 'retry failed', selected: true },
                      { errorId: '5555', message: 'failed presavepage hook', selected: true },
                      // page 2 when searched with failed with one error as un selected
                      { errorId: '7777', message: 'failed javascript hook' },
                      { errorId: '4444', message: 'failed transformation', selected: true },
                      // other errors
                      { errorId: '6666', message: 'invalid javascript hook', selected: true },
                      { errorId: '8888', message: 'invalid hook' },
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
              keyword: 'failed',
              paging: {
                currPage: 1,
                rowsPerPage: 2,
              },
            },
            [FILTER_KEYS.RESOLVED]: {
              searchBy: ['message'],
              keyword: 'transform',
            },
          },
        },
      };

      expect(selectors.isAllErrorsSelectedInCurrPage(sampleState, { flowId, resourceId })).toBeFalsy();
    });
    test('should return true if the current page errors are all selected', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  open: {
                    status: 'received',
                    errors: [
                      // page 0 when searched with failed with both selected
                      { errorId: '9999', message: 'retry failed', selected: true },
                      { errorId: '5555', message: 'failed presavepage hook', selected: true },
                      // page 1 when searched with failed with one error as un selected
                      { errorId: '7777', message: 'failed javascript hook' },
                      { errorId: '4444', message: 'failed transformation', selected: true },
                      // other errors
                      { errorId: '6666', message: 'invalid javascript hook', selected: true },
                      { errorId: '8888', message: 'invalid hook' },
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
              keyword: 'failed',
              paging: {
                currPage: 0,
                rowsPerPage: 2,
              },
            },
            [FILTER_KEYS.RESOLVED]: {
              searchBy: ['message'],
              keyword: 'transform',
            },
          },
        },
      };

      expect(selectors.isAllErrorsSelectedInCurrPage(sampleState, { flowId, resourceId })).toBeTruthy();
    });
  });

  describe('selectors.resourceFilteredErrorsInCurrPage test cases', () => {
    test('should return empty array incase of no errors', () => {
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
        },
      };

      expect(selectors.resourceFilteredErrorsInCurrPage(sampleState, { flowId, resourceId })).toEqual([]);
    });
    test('should return empty array incase of no errors in the current page - page that exceeds error count', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  open: {
                    status: 'received',
                    errors: [
                      // page 0
                      { errorId: '9999', message: 'retry failed', selected: true },
                      { errorId: '5555', message: 'failed presavepage hook', selected: true },
                      // page 1
                      { errorId: '7777', message: 'failed javascript hook' },
                      { errorId: '4444', message: 'failed transformation', selected: true },
                      // page 2
                      { errorId: '6666', message: 'invalid javascript hook', selected: true },
                      { errorId: '8888', message: 'invalid hook' },
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
              keyword: '',
              paging: {
                currPage: 4, // invalid current page
                rowsPerPage: 2,
              },
            },
            [FILTER_KEYS.RESOLVED]: {
              searchBy: ['message'],
              keyword: '',
            },
          },
        },
      };

      expect(selectors.resourceFilteredErrorsInCurrPage(sampleState, { flowId, resourceId })).toEqual([]);
    });
    test('should return expected list of errors in the current page', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  open: {
                    status: 'received',
                    errors: [
                      // page 0
                      { errorId: '9999', message: 'retry failed', selected: true },
                      { errorId: '8888', message: 'invalid hook' },
                      // page 1
                      { errorId: '5555', message: 'failed presavepage hook', selected: true },
                      { errorId: '7777', message: 'failed javascript hook' },
                      // page 2
                      { errorId: '4444', message: 'failed transformation', selected: true },
                      { errorId: '6666', message: 'invalid javascript hook', selected: true },
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
              keyword: '',
              paging: {
                currPage: 1, // invalid current page
                rowsPerPage: 2,
              },
            },
            [FILTER_KEYS.RESOLVED]: {
              searchBy: ['message'],
              keyword: '',
            },
          },
        },
      };
      const expectedErrorsInCurrPage = [
        { errorId: '5555', message: 'failed presavepage hook', selected: true },
        { errorId: '7777', message: 'failed javascript hook' },
      ];

      expect(selectors.resourceFilteredErrorsInCurrPage(sampleState, { flowId, resourceId })).toEqual(expectedErrorsInCurrPage);
    });
    test('should return expected list of errors filtered by search criteria in the current page', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  open: {
                    status: 'received',
                    errors: [
                      // page 0 when searched with failed
                      { errorId: '9999', message: 'retry failed' },
                      { errorId: '5555', message: 'failed presavepage hook' },
                      // page 1 when searched with failed
                      { errorId: '7777', message: 'failed javascript hook' },
                      { errorId: '4444', message: 'failed transformation' },
                      // other errors
                      { errorId: '6666', message: 'invalid javascript hook' },
                      { errorId: '8888', message: 'invalid hook' },
                    ],
                  },
                  resolved: {
                    status: 'received',
                    errors: [
                      { errorId: '1234', message: 'retry failed' },
                      { errorId: '1111', message: 'invalid transform' },
                      { errorId: '2222', message: 'failed transform' },
                    ],
                  },
                },
              },
            },
          },
          filters: {
            [FILTER_KEYS.OPEN]: {
              searchBy: ['message'],
              keyword: 'failed',
              paging: {
                currPage: 1,
                rowsPerPage: 2,
              },
            },
            [FILTER_KEYS.RESOLVED]: {
              searchBy: ['message'],
              keyword: 'transform',
            },
          },
        },
      };

      const expectedFilteredErrorsInCurrPage = [
        { errorId: '7777', message: 'failed javascript hook' },
        { errorId: '4444', message: 'failed transformation' },
      ];

      expect(selectors.resourceFilteredErrorsInCurrPage(sampleState, { flowId, resourceId })).toEqual(expectedFilteredErrorsInCurrPage);
    });
    test('should return expected list of resolved errors filtered by search criteria in the current page', () => {
      const sampleState = {
        session: {
          errorManagement: {
            errorDetails: {
              [flowId]: {
                [resourceId]: {
                  open: {
                    status: 'received',
                    errors: [
                      { errorId: '1234', message: 'retry failed' },
                      { errorId: '1111', message: 'invalid transform' },
                      { errorId: '2222', message: 'failed transform' },
                    ],
                  },
                  resolved: {
                    status: 'received',
                    errors: [
                      // page 0 when searched with error
                      { errorId: '9999', message: 'retry error' },
                      { errorId: '5555', message: 'invalid hook error' },
                      // page 1 when searched with error
                      { errorId: '7777', message: 'error in javascript hook' },
                      { errorId: '4444', message: 'error in transformation' },
                      // other errors
                      { errorId: '6666', message: 'invalid javascript hook' },
                      { errorId: '8888', message: 'invalid hook' },
                    ],
                  },
                },
              },
            },
          },
          filters: {
            [FILTER_KEYS.OPEN]: {
              searchBy: ['message'],
              keyword: 'failed',
            },
            [FILTER_KEYS.RESOLVED]: {
              searchBy: ['message'],
              keyword: 'error',
              paging: {
                currPage: 1,
                rowsPerPage: 2,
              },
            },
          },
        },
      };

      const expectedFilteredResolvedErrorsInCurrPage = [
        { errorId: '7777', message: 'error in javascript hook' },
        { errorId: '4444', message: 'error in transformation' },
      ];

      expect(selectors.resourceFilteredErrorsInCurrPage(sampleState, { flowId, resourceId, isResolved: true })).toEqual(expectedFilteredResolvedErrorsInCurrPage);
    });
  });

  describe('selectors.mkResourceFilteredErrorDetailsSelector test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkResourceFilteredErrorDetailsSelector();

      expect(selector({}, {})).toEqual({errors: []});
    });
  });

  describe('selectors.integrationErrorsPerSection test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationErrorsPerSection()).toEqual({});
    });
  });

  describe('selectors.integrationErrorsPerStore test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationErrorsPerStore()).toEqual({});
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

