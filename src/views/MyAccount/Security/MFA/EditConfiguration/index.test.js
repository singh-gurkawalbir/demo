
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import EditMFAConfiguration from '.';
import { ConfirmDialogProvider } from '../../../../../components/ConfirmDialog';
import { runServer } from '../../../../../test/api/server';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';

let initialStore;

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

async function initEditMFAConfiguration({defaultAShareIdValue, accountsValue, mfaValues} = {}) {
  mutateStore(initialStore, draft => {
    draft.user.preferences = {defaultAShareId: defaultAShareIdValue};
    draft.user.org = {
      accounts: accountsValue,
    };
    draft.data.mfa = mfaValues;
  });
  const ui = (
    <ConfirmDialogProvider>
      <MemoryRouter
        initialEntries={[{pathname: '/myAccount/security/mfa'}]}
      >
        <Route
          path="/myAccount/security/mfa"
        >
          <EditMFAConfiguration />
        </Route>
      </MemoryRouter>
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('react-qr-code', () => ({
  __esModule: true,
  ...jest.requireActual('react-qr-code'),
  default: () => <div>Testing React QR Code</div>,
}));

describe('Testsuite for Edit MFA Configuration', () => {
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
  test('should test the Reset MFA button', async () => {
    await initEditMFAConfiguration({defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
      }],
      mfaValues: {
        userSettings: {
          trustedDevices: [
            {
              _id: '1234',
              browser: 'Chrome',
              os: 'Mac OS',
            },
          ],
        },
        status: {
          userSettings: 'received',
        },
      },
    });
    expect(screen.getByText(/reset mfa/i)).toBeInTheDocument();
    const resetMFAButton = screen.getByRole('button', {
      name: /reset/i,
    });

    expect(resetMFAButton).toBeInTheDocument();
    await userEvent.click(resetMFAButton);
    expect(screen.getByText('Reset MFA?')).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to reset mfa\? you'll need to re-associate your authenticator app and configure your device in integrator\.io\./i)).toBeInTheDocument();
    const confirmDialogResetButtonNode = screen.getAllByRole('button').find(eachOption => eachOption.getAttribute('data-test') === 'Reset');

    expect(confirmDialogResetButtonNode).toBeInTheDocument();
    const cancelButtonNode = screen.getByRole('button', {name: /cancel/i});

    expect(cancelButtonNode).toBeInTheDocument();
    await userEvent.click(cancelButtonNode);
    await waitFor(() => expect(cancelButtonNode).not.toBeInTheDocument());
    await userEvent.click(resetMFAButton);
    const resetButtonNode = screen.getAllByRole('button').find(eachOption => eachOption.getAttribute('data-test') === 'Reset');

    expect(resetButtonNode).toBeInTheDocument();
    await userEvent.click(resetButtonNode);
    expect(screen.getByText(/re-authenticate your account/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your account password to confirm if you want to reset mfa\./i)).toBeInTheDocument();
    const closeDialogBoxNode = document.querySelector('svg[data-testid="closeModalDialog"]');

    expect(closeDialogBoxNode).toBeInTheDocument();
    await userEvent.click(closeDialogBoxNode);
    await waitFor(() => expect(closeDialogBoxNode).not.toBeInTheDocument());
  });
  test('should test the QR code and click on view code button', async () => {
    await initEditMFAConfiguration({defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
      }],
      mfaValues: {
        userSettings: {
          trustedDevices: [
            {
              _id: '1234',
              browser: 'Chrome',
              os: 'Mac OS',
            },
          ],
        },
        status: {
          userSettings: 'received',
        },
      },
    });
    expect(screen.getByText(/qr code/i)).toBeInTheDocument();
    const viewCodeButtonNode = screen.getByRole('button', {
      name: /view code/i,
    });

    expect(viewCodeButtonNode).toBeInTheDocument();
    await userEvent.click(viewCodeButtonNode);
    expect(screen.getByText(/View QR code/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter your account password to view your QR code./i)).toBeInTheDocument();
    const closeDialogBoxNode = document.querySelector('svg[data-testid="closeModalDialog"]');

    expect(closeDialogBoxNode).toBeInTheDocument();
    await userEvent.click(closeDialogBoxNode);
    await waitFor(() => expect(closeDialogBoxNode).not.toBeInTheDocument());
  });
  test('should test the secret key', async () => {
    await initEditMFAConfiguration({defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
      }],
      mfaValues: {
        userSettings: {
          trustedDevices: [
            {
              _id: '1234',
              browser: 'Chrome',
              os: 'Mac OS',
            },
          ],
        },
        status: {
          userSettings: 'received',
        },
      },
    });
    expect(screen.getByText(/secret key/i)).toBeInTheDocument();
    const viewSecretKeyButtonNode = screen.getAllByRole('button').find(eachOption => eachOption.getAttribute('data-test') === 'showSecretKey');

    expect(viewSecretKeyButtonNode).toBeInTheDocument();
    await userEvent.click(viewSecretKeyButtonNode);
    expect(screen.getByText(/view secret key/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your account password to view your secret key\./i)).toBeInTheDocument();
    const closeDialogBoxNode = document.querySelector('svg[data-testid="closeModalDialog"]');

    expect(closeDialogBoxNode).toBeInTheDocument();
    await userEvent.click(closeDialogBoxNode);
    await waitFor(() => expect(closeDialogBoxNode).not.toBeInTheDocument());
  });
  test('should test the trusted devices and click on manage devices button', async () => {
    await initEditMFAConfiguration({defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
      }],
      mfaValues: {
        userSettings: {
          trustedDevices: [
            {
              _id: '1234',
              browser: 'Chrome',
              os: 'Mac OS',
            },
          ],
        },
        status: {
          userSettings: 'received',
        },
      },
    });
    expect(screen.getByText(/trusted devices/i)).toBeInTheDocument();
    const manageDevicesButton = screen.getByRole('button', {
      name: /manage devices/i,
    });

    expect(manageDevicesButton).toBeInTheDocument();
    await userEvent.click(manageDevicesButton);
    expect(screen.getByRole('heading', { name: /manage devices/i })).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', { name: 'Close' });

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(closeButtonNode).not.toBeInTheDocument();
  });
  test('should test the viewed QR code', async () => {
    mutateStore(initialStore, draft => {
      draft.session.mfa = {
        codes: {
          showQrCode: true,
        },
      };
    });
    await initEditMFAConfiguration({
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
      }],
      mfaValues: {
        userSettings: {
          trustedDevices: [
          ],
        },
        status: {
          userSettings: 'received',
        },
      },
    });
    expect(screen.getByText(/Testing React QR Code/i)).toBeInTheDocument();
  });
  test('should test the Use this account to reset MFA of account type manage', async () => {
    await initEditMFAConfiguration({
      defaultAShareIdValue: '12345',
      accountsValue: [{
        _id: '12345',
        accessLevel: 'manage',
        ownerUser: {
          _id: '21344',
          name: 'Test user',
          company: 'Test company',
        },
      },
      {
        _id: '12346',
        accessLevel: 'manage',
        ownerUser: {
          _id: '21345',
          name: 'Test user 1',
          company: 'Test company 1',
        },
      }],
      mfaValues: {
        userSettings: {
          trustedDevices: [
            {
              _id: '1234',
              browser: 'Chrome',
              os: 'Mac OS',
            },
          ],
          _allowResetByUserId: '21344',
        },
        status: {
          userSettings: 'received',
        },
      },
    });
    expect(screen.getByText(/use this account to reset mfa/i)).toBeInTheDocument();
    const testCompanyDropdownButtonNode = screen.getByRole('button', {
      name: /test company/i,
    });

    expect(testCompanyDropdownButtonNode).toBeInTheDocument();
    const saveButtonNode = screen.getByRole('button', {
      name: /save/i,
    });

    expect(saveButtonNode).toBeInTheDocument();
    expect(saveButtonNode).toBeDisabled();
    await userEvent.click(testCompanyDropdownButtonNode);
    const testCompany1ButtonNode = screen.getByRole('menuitem', {name: 'Test company 1'});

    expect(testCompany1ButtonNode).toBeInTheDocument();
    await userEvent.click(testCompany1ButtonNode);
    await waitFor(() => expect(testCompany1ButtonNode).not.toBeInTheDocument());
    await waitFor(() => expect(saveButtonNode).toBeEnabled());
    await userEvent.click(saveButtonNode);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'MFA_USER_SETTINGS_SETUP',
      mfaConfig: {
        trustedDevices: [
          {
            _id: '1234',
            browser: 'Chrome',
            os: 'Mac OS',
          },
        ],
        _allowResetByUserId: '21345',
        context: 'update',
      },
    }));
  });
});

