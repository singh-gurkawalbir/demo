/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import {
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AlertDialog from '.';
import { ConfirmDialogProvider } from '../ConfirmDialog';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore } from '../../test/test-utils';

async function initActionButton({
  defaultAShareId = 'own',
  sessionExpired = false,
  warning = false,
  userLoggedInDifferentTab = false,
  userAcceptedAccountTransfer = false,
  authTimestamp = Date.now(),
  initVersion = 'release-v8.6.1.0.10-06-13-52',
  authenticated = true,
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().app = {
    initVersion,
    version: 'release-v8.6.1.0.10-06-13-52',
    userAcceptedAccountTransfer,
  };
  initialStore.getState().auth = {
    authenticated,
    commStatus: 'error',
    authTimestamp, // timestamp
    sessionExpired, // true, false
    warning,
    userLoggedInDifferentTab,
  };
  initialStore.getState().user = {
    profile: {
      authTypeSSO: {
        _ssoClientId: 'sso_client_id',
      },
    },
    org: {
      accounts: [{
        _id: 'not_own',
        accessLevel: 'manage',
        accountSSORequired: true,
        ownerUser: {
          _ssoClientId: 'sso_client_id',
        },
      }],
    },
    preferences: {
      defaultAShareId,
    },
  };
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <AlertDialog />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('AlertDialog component related sessions', () => {
  runServer();
  test('should pass the render with session expires true', async () => {
    await initActionButton({sessionExpired: true});

    await waitFor(() => {
      expect(screen.queryByText('Your session has expired')).toBeInTheDocument();
      const buttonRef = screen.getByRole('button', {name: 'Sign in'});

      expect(buttonRef).toBeInTheDocument();
    });
  });
});

describe('AlertDialog component related warning sessions', () => {
  let SignMeIn;
  let signMeOut;

  beforeEach(async () => {
    await initActionButton({warning: true, authenticated: false});

    await waitFor(() => expect(screen.queryByText('Session expiring')).toBeInTheDocument());
    SignMeIn = screen.getByRole('button', {name: 'Yes, keep me signed in'});
    signMeOut = screen.getByRole('button', {name: 'No, sign me out'});
  });
  test('should pass the render with sign me in button', async () => {
    await waitFor(() => expect(SignMeIn).toBeInTheDocument());
    // handle onclick
  });

  test('should pass the render with sign me out button', async () => {
    await waitFor(() => expect(signMeOut).toBeInTheDocument());
    // handle onclick
  });
});

describe('AlertDialog component related react versions', () => {
  const { reload } = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: jest.fn() },
    });
  });

  afterEach(() => {
    window.location.reload = reload;
  });

  test('should pass the render with different react version', async () => {
    await initActionButton({initVersion: 'release-v8.6.1.0.10-06-13-55'});

    await waitFor(() => {
      expect(screen.queryByText('Reload page')).toBeInTheDocument();
      const buttonRef = screen.getByRole('button', {name: 'Reload'});

      expect(buttonRef).toBeInTheDocument();
      userEvent.click(buttonRef);
    });

    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});

describe('AlertDialog component related user account transfer', () => {
  const { reload } = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: jest.fn() },
    });
  });

  afterEach(() => {
    window.location.reload = reload;
  });
  test('should pass the render with account trasfered', async () => {
    await initActionButton({userAcceptedAccountTransfer: true, authenticated: false});

    await waitFor(() => {
      expect(screen.queryByText('Success!')).toBeInTheDocument();
      const buttonRef = screen.getByRole('button', {name: 'Reload'});

      expect(buttonRef).toBeInTheDocument();
      userEvent.click(buttonRef);
    });
    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});

describe('AlertDialog component related user login in different tab', () => {
  const { replace } = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { replace: jest.fn() },
    });
  });

  afterEach(() => {
    window.location.replace = replace;
  });
  test('should pass the render with account trasfered', async () => {
    await initActionButton({userLoggedInDifferentTab: true});

    await waitFor(() => {
      expect(screen.queryByText('Please click the following button to resume working')).toBeInTheDocument();
      const buttonRef = screen.getByRole('button', {name: 'Sign In'});

      expect(buttonRef).toBeInTheDocument();
      userEvent.click(buttonRef);
    });
    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalled();
    });
  });
});

describe('AlertDialog component related SSO sign in', () => {
  test('should pass the render with SSO signIn', async () => {
    await initActionButton({defaultAShareId: 'not_own', sessionExpired: true});

    await waitFor(() => {
      expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
      const buttonRef = screen.getByRole('button', {name: 'Sign in with SSO'});

      expect(buttonRef).toBeInTheDocument();
    });
  });
});
