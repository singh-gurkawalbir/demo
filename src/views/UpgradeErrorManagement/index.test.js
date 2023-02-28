import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import { getCreatedStore } from '../../store';
import actions from '../../actions';
import { ERROR_MANAGEMENT_DOC_URL } from '../../constants';
import { ConfirmDialogProvider } from '../../components/ConfirmDialog';
import { runServer } from '../../test/api/server';
import UpgradeErrorManagement from '.';

let initialStore;

const mockReplaceFn = jest.fn();
const mockDispatchFn = jest.fn(action => {
  switch (action.type) {
    default: initialStore.dispatch(action);
  }
});

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

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

describe('test suite for UpgradeErrorManagement', () => {
  runServer();

  beforeEach(() => {
    initialStore = getCreatedStore();
    // jest.useFakeTimers();
    jest.advanceTimersByTime(1000);
  });

  afterEach(() => {
    jest.clearAllTimers();
    mockDispatchFn.mockClear();
  });

  test('should redirect to Home Page if not an account owner', async () => {
    await initUpgradeErrorManagement();
    expect(mockReplaceFn).toHaveBeenLastCalledWith('/');
  });

  test('should redirect to Home Page if account owner but already in EM2.0', async () => {
    mutateStore(initialStore, draft => {
      draft.user.org.accounts.push({ accessLevel: 'owner' });
      draft.user.profile.useErrMgtTwoDotZero = true;
    });
    await initUpgradeErrorManagement(initialStore);
    expect(mockReplaceFn).toHaveBeenLastCalledWith('/');
  });

  test('should show the consequences of upgrading and the option to upgrade or cancel', async () => {
    mutateStore(initialStore, draft => {
      draft.user.org.accounts.push({ accessLevel: 'owner' });
    });
    await initUpgradeErrorManagement(initialStore);
    const Title = screen.getByRole('heading', { name: "We've a new and enhanced way to manage errors!" });
    const featureLink = screen.getByRole('link', { name: /features/i});

    expect(Title).toBeInTheDocument();
    expect(featureLink).toHaveAttribute('href', ERROR_MANAGEMENT_DOC_URL);

    const list = screen.getByRole('list');
    const { getAllByRole } = within(list);
    const items = getAllByRole('listitem');

    expect(items).toHaveLength(3);

    const upgradeButton = document.querySelector('[data-test="em2.0_upgrade"]');
    const cancelButton = document.querySelector('[data-test="em2.0_later"]');

    expect(upgradeButton).toHaveTextContent('Upgrade');
    expect(cancelButton).toBeEnabled();
  });

  test('should redirect to Home Page on cancelling', async () => {
    mutateStore(initialStore, draft => {
      draft.user.org.accounts.push({ accessLevel: 'owner' });
    });
    await initUpgradeErrorManagement(initialStore);
    const cancelButton = document.querySelector('[data-test="em2.0_later"]');

    await userEvent.click(cancelButton);
    expect(mockReplaceFn).toHaveBeenLastCalledWith('/');
  });

  test('should display a dialog on attempting upgrade', async () => {
    mutateStore(initialStore, draft => {
      draft.user.org.accounts.push({ accessLevel: 'owner' });
    });
    await initUpgradeErrorManagement(initialStore);
    const upgradeButton = screen.getByRole('button', {name: 'Upgrade'});

    await userEvent.click(upgradeButton);

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
    mutateStore(initialStore, draft => {
      draft.user.org.accounts.push({ accessLevel: 'owner' });
    });
    await initUpgradeErrorManagement(initialStore);
    const upgradeButton = screen.getByRole('button', {name: 'Upgrade'});

    await userEvent.click(upgradeButton);

    const dialog = screen.getByRole('dialog');
    const { getByTestId } = within(dialog);
    const closeButton = getByTestId('closeModalDialog');

    expect(closeButton).toBeEnabled();
    await userEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('dialog should disappear on clicking "No, Cancel" option', async () => {
    mutateStore(initialStore, draft => {
      draft.user.org.accounts.push({ accessLevel: 'owner' });
    });
    await initUpgradeErrorManagement(initialStore);
    const upgradeButton = screen.getByRole('button', {name: 'Upgrade'});

    await userEvent.click(upgradeButton);

    const dialog = screen.getByRole('dialog');
    const { getByRole } = within(dialog);
    const cancelButton = getByRole('button', {name: 'No, cancel'});

    expect(cancelButton).toBeEnabled();
    await userEvent.click(cancelButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('dialog should disappear on clicking "Yes, upgrade" option', async () => {
    const userId = '626qwerty';

    mutateStore(initialStore, draft => {
      draft.user.preferences.defaultAShareId = userId;
      draft.user.org.accounts.push({
        _id: userId,
        accessLevel: 'owner',
      });
    });
    await initUpgradeErrorManagement(initialStore);
    const upgradeButton = document.querySelector('[data-test="em2.0_upgrade"]');

    await userEvent.click(upgradeButton);

    const dialog = screen.getByRole('dialog');
    const { getByRole } = within(dialog);
    const confirmButton = getByRole('button', {name: 'Yes, upgrade'});

    expect(confirmButton).toBeEnabled();
    await userEvent.click(confirmButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(upgradeButton).toHaveTextContent('Upgrading...');
    await waitFor(() => expect(upgradeButton).toHaveTextContent('Upgrading...'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.user.profile.update({ useErrMgtTwoDotZero: true }));
  });
});
