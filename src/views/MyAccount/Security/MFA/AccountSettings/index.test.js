
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import AccountSettings from '.';
import { getCreatedStore } from '../../../../../store';
import { runServer } from '../../../../../test/api/server';
import { renderWithProviders } from '../../../../../test/test-utils';

let initialStore;
const asycTaskkey = 'MFA_ACCOUNT_SETTINGS_ASYNC_KEY';

async function initAccountSettings({asyncStatus, accountSettingsStatus = 'received'} = {}) {
  initialStore.getState().data.mfa = {
    status: {
      accountSettings: accountSettingsStatus,
    },
  };
  if (asyncStatus) {
    initialStore.getState().session.asyncTask[asycTaskkey] = {status: asyncStatus};
  }
  const ui = (
    <MemoryRouter>
      <AccountSettings />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for AccountSettings', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should able to update account settings on clicking save button by checking Do not allow trusted devices', async () => {
    await initAccountSettings({asyncStatus: 'complete'});
    expect(screen.getByRole('button', {name: /account settings/i})).toBeInTheDocument();

    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'ASYNC_TASK_CLEAR', key: 'MFA_ACCOUNT_SETTINGS_ASYNC_KEY' }));
    expect(screen.getByText(/Number of days until MFA is required again for trusted devices/i)).toBeInTheDocument();
    const trustedDeviceNode = screen.getByRole('checkbox', {name: /do not allow trusted devices/i});

    expect(trustedDeviceNode).toBeInTheDocument();
    expect(trustedDeviceNode).not.toBeChecked();
    await userEvent.click(trustedDeviceNode);
    expect(trustedDeviceNode).toBeChecked();
    expect(screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('name') === 'trustDeviceForPeriod')).toBeDisabled();
    const saveButtonNode = screen.getByRole('button', { name: /save/i });

    expect(saveButtonNode).toBeInTheDocument();
    await userEvent.click(saveButtonNode);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'MFA_ACCOUNT_SETTINGS_UPDATE',
      accountSettings: { dontAllowTrustedDevices: true, trustDeviceForPeriod: undefined },
    }));
    expect(screen.getByText(/MFA account settings saved successfully./i)).toBeInTheDocument();
    const snackbarCloseButton = screen.getByRole('button', { name: /close/i });

    expect(snackbarCloseButton).toBeInTheDocument();
    await userEvent.click(snackbarCloseButton);
    await waitFor(() => expect(snackbarCloseButton).not.toBeInTheDocument());
  }, 10000);
  test('should able to click on save by entering no of days in account settings', async () => {
    await initAccountSettings({asyncStatus: 'complete'});
    expect(screen.getByText(/Number of days until MFA is required again for trusted devices/i)).toBeInTheDocument();
    const inputNode = screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('name') === 'trustDeviceForPeriod');

    expect(inputNode).toBeInTheDocument();
    await userEvent.type(inputNode, '10');
    expect(inputNode).toHaveValue('10');
    const saveButtonNode = screen.getByRole('button', { name: /save/i });

    expect(saveButtonNode).toBeInTheDocument();
    await userEvent.click(saveButtonNode);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'MFA_ACCOUNT_SETTINGS_UPDATE',
      accountSettings: { dontAllowTrustedDevices: undefined, trustDeviceForPeriod: '10' },
    }));
  }, 10000);
  test('should able to load spinner when the account settings status is pending', async () => {
    await initAccountSettings({asyncStatus: 'pending', accountSettingsStatus: 'pending'});
    expect(document.querySelector('circle[class="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate"]')).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'MFA_ACCOUNT_SETTINGS_REQUEST' });
  }, 10000);
});
