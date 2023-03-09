
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import ConnectDevice from '.';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import { runServer } from '../../../../../test/api/server';
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

async function initConnectDevice({defaultAShareIdValue, accountsValue} = {}) {
  mutateStore(initialStore, draft => {
    draft.user.preferences = {defaultAShareId: defaultAShareIdValue};
    draft.user.org = {
      accounts: accountsValue,
    };
    draft.session.mfa = {
      codes: {
        mobileCode: {
          status: 'success',
        },
      },
    };
  });
  const ui = (
    <MemoryRouter>
      <ConnectDevice />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for Connect device', () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
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
  test('should test the connect device when account is of type owner', async () => {
    await initConnectDevice({defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
      }]});
    expect(screen.getByText(/4/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name: /trust this device you've used to sign into integrator\.io/i,
    })).toBeInTheDocument();
    let trustDeviceCheckboxNode;

    waitFor(async () => {
      trustDeviceCheckboxNode = screen.getByRole('checkbox', {
        name: /trust device/i,
      });

      expect(trustDeviceCheckboxNode).toBeInTheDocument();
      expect(trustDeviceCheckboxNode).not.toBeChecked();
      await userEvent.click(trustDeviceCheckboxNode);
      expect(trustDeviceCheckboxNode).toBeChecked();
    });
    expect(screen.getByText(/connect your mobile device \*/i)).toBeInTheDocument();
    let connectButtonNode;

    waitFor(async () => {
      connectButtonNode = screen.getByRole('button', { name: /connect/i});

      expect(connectButtonNode).toBeInTheDocument();
      await userEvent.click(connectButtonNode);
      expect(mockDispatchFn).toHaveBeenCalledWith({
        type: 'MFA_USER_SETTINGS_SETUP',
        mfaConfig: { trustDevice: true, enabled: true, context: 'setup' },
      });
    });
  });
  test('should test the connect device when account is not of type owner', async () => {
    await initConnectDevice({defaultAShareIdValue: '12345',
      accountsValue: [{
        _id: '12345',
        accessLevel: 'manage',
        ownerUser: {
          _id: '21344',
          name: 'Test user',
          company: 'Test company',
        },
      }]});
    expect(screen.getByText(/choose primary account to reset mfa/i)).toBeInTheDocument();
    waitFor(async () => {
      const pleaseSelectButtonNode = screen.getByRole('button', {
        name: /please select/i,
      });

      expect(pleaseSelectButtonNode).toBeInTheDocument();
      await userEvent.click(pleaseSelectButtonNode);
      const menuItemsOptionNode = screen.getByRole('menuitem', { name: /test company/i });

      expect(menuItemsOptionNode).toBeInTheDocument();
      await userEvent.click(menuItemsOptionNode);
      await waitFor(() => expect(menuItemsOptionNode).not.toBeInTheDocument());
      expect(screen.getByRole('heading', {
        name: /trust this device you've used to sign into integrator\.io/i,
      })).toBeInTheDocument();
    });
    waitFor(async () => {
      const trustDeviceCheckboxNode = screen.getByRole('checkbox', {
        name: /trust device/i,
      });

      expect(trustDeviceCheckboxNode).toBeInTheDocument();
      await userEvent.click(trustDeviceCheckboxNode);
      expect(screen.getByRole('heading', {
        name: /connect your mobile device \*/i,
      })).toBeInTheDocument();
    });
    waitFor(async () => {
      const connectButtonNode = screen.getByRole('button', { name: /connect/i});

      expect(connectButtonNode).toBeInTheDocument();
      await userEvent.click(connectButtonNode);
      expect(mockDispatchFn).toHaveBeenCalledWith({
        type: 'MFA_USER_SETTINGS_SETUP',
        mfaConfig: {
          _allowResetByUserId: '21344',
          trustDevice: true,
          enabled: true,
          context: 'setup',
        },
      });
    });
  });
  test('should test the connect device when account is not of type of owner and by not selecting any account', async () => {
    await initConnectDevice({defaultAShareIdValue: '12345',
      accountsValue: [{
        _id: '12345',
        accessLevel: 'manage',
        ownerUser: {
          _id: '21344',
          name: 'Test user',
          company: 'Test company',
        },
      },
      ],
    });

    expect(screen.getByRole('button', { name: /please select/i })).toBeInTheDocument();
    let connectButtonNode;

    waitFor(async () => {
      connectButtonNode = screen.getByRole('button', { name: /connect/i});

      expect(connectButtonNode).toBeInTheDocument();
      await userEvent.click(connectButtonNode);
      expect(screen.getByText(/A value must be provided/i)).toBeInTheDocument();
    });
  });
});
