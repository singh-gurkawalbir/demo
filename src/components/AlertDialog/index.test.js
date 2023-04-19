import React from 'react';
import {
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import AlertDialog from '.';
import { ConfirmDialogProvider } from '../ConfirmDialog';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import actions from '../../actions';
import customCloneDeep from '../../utils/customCloneDeep';

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

async function initActionButton({
  defaultAShareId = 'own',
  accountSSORequired = false,
  sessionExpired = false,
  warning = false,
  userLoggedInDifferentTab = false,
  userAcceptedAccountTransfer = false,
  authTimestamp = Date.now(),
  initVersion = 'release-v8.6.1.0.10-06-13-52',
  authenticated = true,
  initialStore = reduxStore,
} = {}) {
  /* eslint no-param-reassign: "error" */
  mutateStore(initialStore, draft => {
    draft.app = {
      initVersion,
      version: 'release-v8.6.1.0.10-06-13-52',
      userAcceptedAccountTransfer,
    };
    draft.auth = {
      authenticated,
      commStatus: 'error',
      authTimestamp, // timestamp
      sessionExpired, // true, false
      warning,
      userLoggedInDifferentTab,
    };
    draft.user = {
      preferences: {
        defaultAShareId,
      },
      profile: {
        authTypeSSO: {
          _ssoClientId: 'sso_client_id',
        },
      },
      notifications: {

      },
      org: {
        accounts: [{
          _id: 'not_own',
          accessLevel: 'manage',
          accountSSORequired,
          ownerUser: {
            _ssoClientId: 'sso_client_id',
          },
        }, {
          _id: 'own',
          accessLevel: 'owner',
        }],
      },
    };
  });
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <AlertDialog />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../../views/SignIn/SigninForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../views/SignIn/SigninForm'),
  default: () => (
    <>
      <div>Mocking Signin Form</div>
      <button type="button">Mock Sign in</button>
    </>
  ),
}));
describe('alertDialog component', () => {
  runServer();
  let initialStore;
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = customCloneDeep(reduxStore);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'RESOURCE_REQUEST_COLLECTION':
          mutateStore(initialStore, draft => {
            draft.session.loadResources.ssoclients = 'received';
            draft.data.resources.ssoclients = [];
            draft.comms.networkComms['GET:/ssoclients'] = {
              status: 'success',
              hidden: false,
              refresh: false,
              method: 'GET',
            };
          });
          break;
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });

  describe('alertDialog component related sessions', () => {
    test('should pass the render with session expires true', async () => {
      await initActionButton({sessionExpired: true, initialStore});
      expect(screen.queryByText('Your session has expired')).toBeInTheDocument();
      const buttonRef = screen.getByRole('button', {name: 'Mock Sign in'});

      expect(buttonRef).toBeInTheDocument();
    });

    test('should pass the render with session expires true onclose', async () => {
      await initActionButton({sessionExpired: true, initialStore});
      expect(screen.queryByText('Your session has expired')).toBeInTheDocument();
      const buttonRef = screen.getByTestId('closeModalDialog');

      expect(buttonRef).toBeInTheDocument();
      await userEvent.click(buttonRef);
      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.logout());
    });
  });

  describe('alertDialog component related warning sessions', () => {
    let SignMeIn;
    let signMeOut;

    beforeEach(async () => {
      await initActionButton({warning: true, authenticated: false, initialStore});

      SignMeIn = screen.getByRole('button', {name: 'Yes, keep me signed in'});
      signMeOut = screen.getByRole('button', {name: 'No, sign me out'});
    });
    test('should pass the render with sign me in button', async () => {
      await waitFor(() => expect(screen.queryByText('Session expiring')).toBeInTheDocument());
      await waitFor(() => expect(SignMeIn).toBeInTheDocument());
      await userEvent.click(SignMeIn);
      await expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.auth.logout());
      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.user.profile.request('Refreshing session'));
    });

    test('should pass the render with sign me out button', async () => {
      await waitFor(() => expect(screen.queryByText('Session expiring')).toBeInTheDocument());
      await waitFor(() => expect(signMeOut).toBeInTheDocument());
      await userEvent.click(signMeOut);
      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.logout());
      await expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.user.profile.request('Refreshing session'));
    });
  });

  describe('alertDialog component related react versions', () => {
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
      await initActionButton({initVersion: 'release-v8.6.1.0.10-06-13-55', initialStore});

      await waitFor(async () => {
        expect(screen.queryByText('Reload page')).toBeInTheDocument();
        const buttonRef = screen.getByRole('button', {name: 'Reload'});

        expect(buttonRef).toBeInTheDocument();
        await userEvent.click(buttonRef);
      });

      await waitFor(() => {
        expect(window.location.reload).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('alertDialog component related user account transfer', () => {
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
      await initActionButton({userAcceptedAccountTransfer: true, authenticated: false, initialStore});

      await waitFor(async () => {
        expect(screen.queryByText('Success!')).toBeInTheDocument();
        const buttonRef = screen.getByRole('button', {name: 'Reload'});

        expect(buttonRef).toBeInTheDocument();
        await userEvent.click(buttonRef);
      });
      await waitFor(() => {
        expect(window.location.reload).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('alertDialog component related user login in different tab', () => {
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
      await initActionButton({userLoggedInDifferentTab: true, initialStore});

      await waitFor(async () => {
        expect(screen.queryByText('Please click the following button to resume working')).toBeInTheDocument();
        const buttonRef = screen.getByRole('button', {name: 'Sign In'});

        expect(buttonRef).toBeInTheDocument();
        await userEvent.click(buttonRef);
      });
      await waitFor(() => {
        expect(window.location.replace).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('alertDialog component related SSO sign in', () => {
    test('should pass the render with SSO signIn', async () => {
      await initActionButton({defaultAShareId: 'not_own', sessionExpired: true, initialStore, accountSSORequired: true});

      await waitFor(() => {
        expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
        const buttonRef = screen.getByRole('button', {name: 'Sign in with SSO'});

        expect(buttonRef).toBeInTheDocument();
      });
    });
  });
});
