import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorControls from './ErrorControls';
import { mutateStore, renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import actions from '../../../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = getCreatedStore();

mutateStore(initialStore, draft => {
  draft.session.filters = {
    openErrors: {
      activeErrorId: '5556857034',
    },
  };
  draft.session.errorManagement = {
    openErrors: {
      '63234cd2514d5b0bf7b3c2f9': {
        status: 'received',
      },
      '63234cd2514d5b0bf7b3c3gh': {
        status: 'requested',
      },
    },
    errorDetails: {
      '63234cd2514d5b0bf7b3c2f9': {
        '63234d05514d5b0bf7b3c315': {
          open: {
            status: 'received',
            errors: [
              {
                errorId: '5646501091',
                _flowJobId: '63ab70dfbc20f510012c6b9d',
              },
              {
                errorId: '5556857034',
                _flowJobId: '63a0e6894c1d6d062af90b9c',
              },
              {
                errorId: '5556824990',
                _flowJobId: '639f80023d732c393149668d',
              }],
          }}},
      '63234cd2514d5b0bf7b3c3gh': {
        '63234d05514d5b0bf7b3c420': {
          open: {
            status: 'requested',
            errors: [
              {
                errorId: '5646501091',
                _flowJobId: '63ab70dfbc20f510012c6b9d',
              },
              {
                errorId: '5556857034',
                _flowJobId: '63a0e6894c1d6d062af90b9c',
              },
              {
                errorId: '5556824990',
                _flowJobId: '639f80023d732c393149668d',
              }],
          },
        },
      },
    },
  };
});

describe('ErrorControls UI test cases', () => {
  test('should make a dispatch call when clicked on previous error button', async () => {
    const props = {
      errorsInPage: [{errorId: '5646501091'}, {errorId: '5556857034'}, {errorId: '5556824990'}, {errorId: '5666371243'}],
      activeErrorId: '5556857034',
      flowId: '63234cd2514d5b0bf7b3c2f9',
      isResolved: false,
      resourceId: '63234d05514d5b0bf7b3c315',
      handlePrev: jest.fn(),
      handleNext: jest.fn(),
    };

    renderWithProviders(<ErrorControls {...props} />, {initialStore});
    await userEvent.click(screen.getByRole('button', {name: 'Previous'}));
    expect(mockDispatch).toHaveBeenCalledWith(actions.patchFilter('openErrors', {
      activeErrorId: '5646501091',
    }));
  });

  test('should make a dispatch call when clicked on next error button', async () => {
    const props = {
      errorsInPage: [{errorId: '5646501091'}, {errorId: '5556857034'}, {errorId: '5556824990'}, {errorId: '5666371243'}],
      activeErrorId: '5556857034',
      flowId: '63234cd2514d5b0bf7b3c2f9',
      isResolved: false,
      resourceId: '63234d05514d5b0bf7b3c315',
      handlePrev: jest.fn(),
      handleNext: jest.fn(),
    };

    renderWithProviders(<ErrorControls {...props} />, {initialStore});
    await userEvent.click(screen.getByRole('button', {name: 'Next'}));
    expect(mockDispatch).toHaveBeenCalledWith(actions.patchFilter('openErrors', {
      activeErrorId: '5556824990',
    }));
  });
  test('should test the spinner when errors status is requested', () => {
    const props = {
      errorsInPage: [{errorId: '5646501091'}, {errorId: '5556857034'}, {errorId: '5556824990'}, {errorId: '5666371243'}],
      activeErrorId: '5556857034',
      flowId: '63234cd2514d5b0bf7b3c3gh',
      resourceId: '63234d05514d5b0bf7b3c420',
    };

    renderWithProviders(<ErrorControls {...props} />, {initialStore});
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
