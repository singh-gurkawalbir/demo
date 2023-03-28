
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { getCreatedStore } from '../../../../store';
import { runServer } from '../../../../test/api/server';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import useNotifySetupSuccess from './useNotifySetupSuccess';
import * as mockEnqueSnackbar from '../../../../hooks/enqueueSnackbar';

const initialStore = getCreatedStore();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));
const asyncTaskKey = 'MFA_SETUP_ASYNC_KEY';
const enqueueSnackbar = jest.fn();

function SomeComponent() {
  const notify = useNotifySetupSuccess();

  return <div>{notify}</div>;
}

async function initUseNotifySetupSuccess(context) {
  mutateStore(initialStore, draft => {
    draft.session.asyncTask[asyncTaskKey] = {
      status: 'complete',
    };
    draft.data.mfa = {userSettings: {enabled: false}};
    draft.session.mfa = context;
  });
  const ui = (
    <MemoryRouter>
      <SomeComponent />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for useNotificationSetupSuccess', () => {
  runServer();
  beforeEach(() => {
    jest.spyOn(mockEnqueSnackbar, 'default').mockReturnValue([enqueueSnackbar]);
  });
  afterEach(() => {
    enqueueSnackbar.mockClear();
  });
  test('should test the snackbar for context setup', async () => {
    initUseNotifySetupSuccess({context: 'setup'});
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: 'MFA enabled and device connected successfully.', variant: 'success'});
  });
  test('should test the snackbar for context update', async () => {
    initUseNotifySetupSuccess({context: 'update'});
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: 'Primary account to reset updated successfully', variant: 'success'});
  });
  test('should test the snackbar for context switch', async () => {
    initUseNotifySetupSuccess({context: 'switch'});
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: 'MFA disabled successfully.', variant: 'success'});
  });
});
