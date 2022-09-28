/* global describe, test, expect, jest */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { getCreatedStore } from '../../../../store';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders } from '../../../../test/test-utils';
import useNotifySetupSuccess from './useNotifySetupSuccess';
import * as mockEnqueSnackbar from '../../../../hooks/enqueueSnackbar';

const initialStore = getCreatedStore();
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
const asyncTaskKey = 'MFA_SETUP_ASYNC_KEY';
const enqueueSnackbar = jest.fn();

function SomeComponent() {
  const notify = useNotifySetupSuccess();

  return <div>{notify}</div>;
}

async function initUseNotifySetupSuccess(context) {
  initialStore.getState().session.asyncTask[asyncTaskKey] = {
    status: 'complete',
  };
  initialStore.getState().data.mfa = {userSettings: {enabled: false}};
  initialStore.getState().session.mfa = context;
  const ui = (
    <MemoryRouter>
      <SomeComponent />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for useNotificationSetupSuccess', () => {
  runServer();
  test('should test the snackbar for context setup', async () => {
    jest.spyOn(mockEnqueSnackbar, 'default').mockReturnValue([enqueueSnackbar]);
    initUseNotifySetupSuccess({context: 'setup'});
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: 'MFA enabled and device connected successfully.', variant: 'success'});
  });
  test('should test the snackbar for context update', async () => {
    jest.spyOn(mockEnqueSnackbar, 'default').mockReturnValue([enqueueSnackbar]);
    initUseNotifySetupSuccess({context: 'update'});
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: 'Primary account to reset updated successfully', variant: 'success'});
  });
  test('should test the snackbar for context switch', async () => {
    jest.spyOn(mockEnqueSnackbar, 'default').mockReturnValue([enqueueSnackbar]);
    initUseNotifySetupSuccess({context: 'switch'});
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: 'MFA disabled successfully.', variant: 'success'});
  });
});
