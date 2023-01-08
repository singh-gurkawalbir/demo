
import React from 'react';
import FetchErrorsHook from './useFetchErrors';
import { renderWithProviders } from '../../../../test/test-utils';
import actions from '../../../../actions';
import { getCreatedStore } from '../../../../store';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = getCreatedStore();

describe('useFetchErrors UI tests', () => {
  test('should make respective dispatch calls when error status is set to received', () => {
    initialStore.getState().session.filters = {
      '63ab65842009e066e35e8af3-someflowjobid-63ab657ebc20f510012c130e': {
        name: 'somename',
      },
      somefilterkey: {
        paging: {
          rowsPerPage: 50,
        },
      },
      openErrors: {
        activeErrorId: '5666371243',
        name: 'somename',
      },
    };

    initialStore.getState().session.errorManagement = {
      openErrors: {
        '63ab65842009e066e35e8af3': {
          data: {
            '63ab657ebc20f510012c130e': {
              _expOrImpId: '63ab657ebc20f510012c130e',
              numError: 1,
              lastErrorAt: '2022-12-28T06:39:54.065Z',
            },
          },
        },
      },
      errorDetails: {
        '63ab65842009e066e35e8af3': {
          '63ab657ebc20f510012c130e': {
            resolved: {
              status: 'received',
              outdated: 'somevalue',
              nextPageURL: 'someurl',
              errors: [],
            },
          },
        },
      },
      retryData: {
        retryObjects: {
          '24e6afe09f6e41f19e6871482c52407d': {
            status: 'received',
            userData: {
              id: 1,
              data: 'sometext',
            },
            data: {
              data: {
                orderid: 1,
                customerid: 100,
              },
            },
          },
        },
      },
    };
    renderWithProviders(<FetchErrorsHook
      filterKey="somefilterkey"
      flowId="63ab65842009e066e35e8af3"
      resourceId="63ab657ebc20f510012c130e"
      isResolved
      flowJobId="someflowjobid" />, { initialStore });
    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.flowErrorDetails.request({
      flowId: '63ab65842009e066e35e8af3',
      flowJobId: 'someflowjobid',
      resourceId: '63ab657ebc20f510012c130e',
      isResolved: true,
      loadMore: true,
    }));
  });
  test('should make the respective dispatch calls when error status is not available in the store and errors are not resolved', () => {
    initialStore.getState().session.filters = {
      '63ab65842009e066e35e8af3-someflowjobid-63ab657ebc20f510012c130e': {
        name: 'somename',
        parentStartedAt: '2022-12-01T05:49:01.624Z',
        endedAt: '2023-01-01T06:47:06.194Z',
      },

      openErrors: {
        activeErrorId: '5666371243',
        name: 'somename',
      },
    };

    initialStore.getState().session.errorManagement = {
      openErrors: {
        '63ab65842009e066e35e8af3': {
          data: {
            '63ab657ebc20f510012c130e': {
              _expOrImpId: '63ab657ebc20f510012c130e',
              numError: 1,
              lastErrorAt: '2022-12-28T06:39:54.065Z',
            },
          },
        },
      },
      errorDetails: {
        '63ab65842009e066e35e8af3': {
          '63ab657ebc20f510012c130e': {
            resolved: {

              outdated: 'somevalue',
              nextPageURL: 'someurl',
              errors: [],
            },
          },
        },
      },
      retryData: {
        retryObjects: {
          '24e6afe09f6e41f19e6871482c52407d': {
            userData: {
              id: 1,
              data: 'sometext',
            },
            data: {
              data: {
                orderid: 1,
                customerid: 100,
              },
            },
          },
        },
      },
    };
    renderWithProviders(<FetchErrorsHook
      filterKey="somefilterkey"
      flowId="63ab65842009e066e35e8af3"
      resourceId="63ab657ebc20f510012c130e"
      isResolved={false}
      flowJobId="someflowjobid" />, { initialStore });
    expect(mockDispatch).toHaveBeenCalledWith(actions.clearFilter('somefilterkey'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.patchFilter('somefilterkey', {
      searchBy: [
        'message',
        'source',
        'classification',
        'code',
        'occurredAt',
        'traceKey',
        'errorId',
      ],
      occuredAt: {
        startDate: '2022-12-01T05:49:01.624Z',
        endDate: '2023-01-01T06:47:06.194Z',
        preset: 'custom',
      },
      flowJobId: 'someflowjobid',
    }));
    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.flowErrorDetails.request({
      flowId: '63ab65842009e066e35e8af3',
      flowJobId: 'someflowjobid',
      resourceId: '63ab657ebc20f510012c130e',
      isResolved: false,
      loadMore: undefined,
    }));
  });
  test('should make the respective dispatch calls when error status is not available in the store and errors are resolved', () => {
    initialStore.getState().session.filters = {
      '63ab65842009e066e35e8af3-someflowjobid-63ab657ebc20f510012c130e': {
        name: 'somename',
        parentStartedAt: '2022-12-01T05:49:01.624Z',
        endedAt: '2023-01-01T06:47:06.194Z',
      },

      openErrors: {
        activeErrorId: '5666371243',
        name: 'somename',
      },
    };

    initialStore.getState().session.errorManagement = {
      openErrors: {
        '63ab65842009e066e35e8af3': {
          data: {
            '63ab657ebc20f510012c130e': {
              _expOrImpId: '63ab657ebc20f510012c130e',
              numError: 1,
              lastErrorAt: '2022-12-28T06:39:54.065Z',
            },
          },
        },
      },
      errorDetails: {
        '63ab65842009e066e35e8af3': {
          '63ab657ebc20f510012c130e': {
            resolved: {

              outdated: 'somevalue',
              nextPageURL: 'someurl',
              errors: [],
            },
          },
        },
      },
      retryData: {
        retryObjects: {
          '24e6afe09f6e41f19e6871482c52407d': {
            userData: {
              id: 1,
              data: 'sometext',
            },
            data: {
              data: {
                orderid: 1,
                customerid: 100,
              },
            },
          },
        },
      },
    };
    renderWithProviders(<FetchErrorsHook
      filterKey="somefilterkey"
      flowId="63ab65842009e066e35e8af3"
      resourceId="63ab657ebc20f510012c130e"
      isResolved
      flowJobId="someflowjobid" />, { initialStore });
    expect(mockDispatch).toHaveBeenCalledWith(actions.clearFilter('somefilterkey'));
  });
});
