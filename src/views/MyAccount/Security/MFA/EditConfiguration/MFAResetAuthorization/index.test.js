/* global describe, test, expect, beforeEach, jest, afterEach */
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import ResetAuthorizationModal from '.';
import { ConfirmDialogProvider } from '../../../../../../components/ConfirmDialog';
import { getCreatedStore } from '../../../../../../store';
import { runServer } from '../../../../../../test/api/server';
import { renderWithProviders } from '../../../../../../test/test-utils';

let initialStore;
const asyncTaskKey = 'MFA_RESET_ASYNC_KEY';

async function initMFAResetAuthorization({onClose = '', asyncStatus} = {}) {
  initialStore.getState().session.asyncTask[asyncTaskKey] =
    {
      status: asyncStatus,
    };
  const ui = (
    <ConfirmDialogProvider>
      <MemoryRouter>
        <ResetAuthorizationModal onClose={onClose} />
      </MemoryRouter>
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for MFA Reset Authorization', () => {
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
  test('should test the MFA Reset authorization by entering password and by clicking on Reset MFA button', async () => {
    const mockCloseButtonFunction = jest.fn();

    await initMFAResetAuthorization({asyncStatus: 'failed', onClose: mockCloseButtonFunction});

    expect(screen.getByText(/re-authenticate your account/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your account password to confirm if you want to reset mfa\./i)).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    const passwordTextBoxNode = document.querySelector('input[name="password"]');

    expect(passwordTextBoxNode).toBeInTheDocument();
    userEvent.type(passwordTextBoxNode, 'testpassword');
    const cancelButtonNode = screen.getByRole('button', { name: 'Cancel' });

    expect(cancelButtonNode).toBeInTheDocument();
    userEvent.click(cancelButtonNode);
    expect(mockCloseButtonFunction).toHaveBeenCalledTimes(1);
    const resetMFAButtonNode = screen.getByRole('button', {name: 'Reset MFA'});

    expect(resetMFAButtonNode).toBeInTheDocument();
    userEvent.click(resetMFAButtonNode);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'MFA_RESET', aShareId: undefined, password: 'testpassword' }));
  });
  test('should test the MFA Reset authorization by entering password and by clicking on Reset MFA button', async () => {
    await initMFAResetAuthorization({asyncStatus: 'complete', onClose: jest.fn()});
    expect(screen.getByText(/your mfa has been reset successfully and a new key has been regenerated\. to use the new key with your account\./i)).toBeInTheDocument();
  });
});
