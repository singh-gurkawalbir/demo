/* global describe, expect, jest, test */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import { getCreatedStore } from '../../store';
import { ERROR_MANAGEMENT_DOC_URL } from '../../constants';
import { ConfirmDialogProvider } from '../../components/ConfirmDialog';
import { runServer } from '../../test/api/server';
import UpgradeErrorManagement from '.';

const mockReplaceFn = jest.fn();

async function initUpgradeErrorManagement(initialStore, renderFun) {
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <UpgradeErrorManagement />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore, renderFun});
}

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockReplaceFn,
  }),
}));

describe('test suite for UpgradeErrorManagement', () => {
  runServer();

  test('should redirect to Home Page if not an account owner', async () => {
    await initUpgradeErrorManagement();
    expect(mockReplaceFn).toHaveBeenLastCalledWith('/');
  });

  test('should redirect to Home Page if account owner but already in EM2.0', async () => {
    const initialStore = getCreatedStore();

    initialStore.getState().user.org.accounts.push({ accessLevel: 'owner' });
    initialStore.getState().user.profile.useErrMgtTwoDotZero = true;
    await initUpgradeErrorManagement(initialStore);
    expect(mockReplaceFn).toHaveBeenLastCalledWith('/');
  });

  test('should show the consequences of upgrading and the option to upgrade or cancel', async () => {
    const initialStore = getCreatedStore();

    initialStore.getState().user.org.accounts.push({ accessLevel: 'owner' });
    await initUpgradeErrorManagement(initialStore);
    const Title = screen.getByRole('heading', { name: "We've a new and enhanced way to manage errors!" });
    const featureLink = screen.getByRole('link', { name: /features/i});

    expect(Title).toBeInTheDocument();
    expect(featureLink).toHaveAttribute('href', ERROR_MANAGEMENT_DOC_URL);

    const list = screen.getByRole('list');
    const { getAllByRole } = within(list);
    const items = getAllByRole('listitem');

    expect(items.length).toBe(3);

    const upgradeButton = document.querySelector('[data-test="em2.0_upgrade"]');
    const cancelButton = document.querySelector('[data-test="em2.0_later"]');

    expect(upgradeButton).toHaveTextContent('Upgrade');
    expect(cancelButton).toBeEnabled();
  });

  test('should redirect to Home Page on cancelling', async () => {
    const initialStore = getCreatedStore();

    initialStore.getState().user.org.accounts.push({ accessLevel: 'owner' });
    await initUpgradeErrorManagement(initialStore);
    const cancelButton = document.querySelector('[data-test="em2.0_later"]');

    userEvent.click(cancelButton);
    expect(mockReplaceFn).toHaveBeenLastCalledWith('/');
  });

  test('should display a dialog on attempting upgrade', async () => {
    const initialStore = getCreatedStore();

    initialStore.getState().user.org.accounts.push({ accessLevel: 'owner' });
    await initUpgradeErrorManagement(initialStore);
    const upgradeButton = screen.getByRole('button', {name: 'Upgrade'});

    userEvent.click(upgradeButton);

    const dialog = screen.getByRole('dialog');
    const { getByRole, getByText, getByTestId } = within(dialog);

    const dialogTitle = getByText('Confirm upgrade');
    const dialogMessage = getByText("Just as a reminder, you won't be able to switch back to the current error management platform.");
    const confirmUpgrade = getByRole('button', {name: 'Yes, upgrade'});
    const cancelUpgrade = getByRole('button', {name: 'No, cancel'});
    const closeButton = getByTestId('closeModalDialog');

    expect(dialogTitle).toBeInTheDocument();
    expect(dialogMessage).toBeInTheDocument();
    expect(confirmUpgrade).toBeEnabled();
    expect(cancelUpgrade).toBeEnabled();
    expect(closeButton).toBeEnabled();
  });

  test('dialog should disappear on clicking close button', async () => {
    const initialStore = getCreatedStore();

    initialStore.getState().user.org.accounts.push({ accessLevel: 'owner' });
    await initUpgradeErrorManagement(initialStore);
    const upgradeButton = screen.getByRole('button', {name: 'Upgrade'});

    userEvent.click(upgradeButton);

    const dialog = screen.getByRole('dialog');
    const { getByTestId } = within(dialog);
    const closeButton = getByTestId('closeModalDialog');

    expect(closeButton).toBeEnabled();
    userEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('dialog should disappear on clicking "No, Cancel" option', async () => {
    const initialStore = getCreatedStore();

    initialStore.getState().user.org.accounts.push({ accessLevel: 'owner' });
    await initUpgradeErrorManagement(initialStore);
    const upgradeButton = screen.getByRole('button', {name: 'Upgrade'});

    userEvent.click(upgradeButton);

    const dialog = screen.getByRole('dialog');
    const { getByRole } = within(dialog);
    const cancelButton = getByRole('button', {name: 'No, cancel'});

    expect(cancelButton).toBeEnabled();
    userEvent.click(cancelButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('dialog should disappear on clicking "Yes, upgrade" option', async () => {
    const initialStore = getCreatedStore();

    initialStore.getState().user.org.accounts.push({ accessLevel: 'owner' });
    await initUpgradeErrorManagement(initialStore);
    const upgradeButton = document.querySelector('[data-test="em2.0_upgrade"]');

    userEvent.click(upgradeButton);

    const dialog = screen.getByRole('dialog');
    const { getByRole } = within(dialog);
    const confirmButton = getByRole('button', {name: 'Yes, upgrade'});

    expect(confirmButton).toBeEnabled();
    userEvent.click(confirmButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(upgradeButton).toHaveTextContent('Upgrading...');
  });
});
