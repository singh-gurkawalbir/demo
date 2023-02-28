import React from 'react';
import {useEditRetryConfirmDialog } from './useEditRetryConfirmDialog';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import actions from '../../../../actions';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();
let mockSave;
let mockDiscard;

jest.mock('../../../ConfirmDialog', () => ({
  __esModule: true,
  ...jest.requireActual('../../../Buttons/TextButton'),
  default: () => ({
    saveDiscardDialog: ({ onSave, onDiscard }) => {
      mockSave = onSave;
      mockDiscard = onDiscard;
    },
  }),
}));

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

mutateStore(initialStore, draft => {
  draft.session.filters = {
    openErrors: {
      activeErrorId: '5666371243',
    },
  };
  draft.session.errorManagement = {
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
            errors: [
              {
                resolvedBy: 'auto',
                oIndex: '1',
                errorId: '5666371243',
                retryDataKey: '24e6afe09f6e41f19e6871482c52407d',
              },
            ],
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
});
async function inituseEditRetryConfirmDialog(props = {}) {
  let returnData;
  const DummyComponent = () => {
    returnData = useEditRetryConfirmDialog(props);

    return (
      <div>
        ConfirmDialog
      </div>
    );
  };

  renderWithProviders(<DummyComponent />, {initialStore});

  return returnData;
}

describe('useEditRetryConfirmDialog UI tests', () => {
  beforeEach(() => {
    mockSave = undefined;
    mockDiscard = undefined;
  });
  test('should execute showRetryDataChangedConfirmDialog', async () => {
    const onDiscard = jest.fn();
    const isSave = jest.fn();
    const handleCancelClick = await inituseEditRetryConfirmDialog({ flowId: '63ab65842009e066e35e8af3', resourceId: '63ab657ebc20f510012c130e', isResolved: true, onDiscard, isSave});

    expect(mockSave).toBeUndefined();
    expect(mockDiscard).toBeUndefined();

    handleCancelClick();

    expect(typeof mockSave).toBe('function');
    expect(typeof mockDiscard).toBe('function');
    expect(onDiscard).not.toBeCalled();
    expect(isSave).not.toBeCalled();

    mockSave();
    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.retryData.updateRequest({flowId: '63ab65842009e066e35e8af3', resourceId: '63ab657ebc20f510012c130e', retryId: '24e6afe09f6e41f19e6871482c52407d', retryData: {id: 1, data: 'sometext'}}));

    mockDiscard();

    expect(mockDispatch).toHaveBeenCalledWith(actions.errorManager.retryData.updateUserRetryData({retryId: '24e6afe09f6e41f19e6871482c52407d'}));
  });
});
