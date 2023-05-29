import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import Signin from '.';
import actions from '../../../actions';
import { getCreatedStore } from '../../../store';
import * as useQuery from '../../../hooks/useQuery';

let initialStore = reduxStore;

const mockDispatch = jest.fn(action => {
  initialStore.dispatch(action);
});

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useLocation: () => ({state: 'someState'}),
}));

jest.mock('../../../components/icons/ShowContentIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/icons/ShowContentIcon'),
  default: props => (
    <div onClick={props.onClick} onMouseDown={props.onMouseDown}>ShowContentIcon</div>
  ),
}));

jest.mock('../../../components/icons/HideContentIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/icons/HideContentIcon'),
  default: props => (
    <div onClick={props.onClick}>HideContentIcon</div>
  ),
}));

function initfunction(initialStore, dialogOpen = false) {
  renderWithProviders(<MemoryRouter><Signin dialogOpen={dialogOpen} /></MemoryRouter>, {initialStore});
}

describe('SigninForm UI testcases', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  test('should show sign in page form and click on Sign in with google', async () => {
    initialStore = getCreatedStore();

    initfunction(initialStore);
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Sign in with Google'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.auth.signInWithGoogle('/')
    );
  });
  test('should enter the the value for the form and click the unhide icon to show password', async () => {
    initialStore = getCreatedStore();

    initfunction(initialStore);

    const email = screen.getByRole('textbox', {id: 'email'});
    const password = screen.getByPlaceholderText('Password*');

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();

    await userEvent.type(email, 'testuser@test.com');
    await userEvent.type(password, 'xbsbxsxazl223xbsbixi');

    await userEvent.click(screen.getByText('HideContentIcon'));

    const showContent = screen.getByText('ShowContentIcon');

    expect(showContent).toBeInTheDocument();
    let type = password.getAttribute('type');

    expect(type).toBe('text');

    fireEvent.click(showContent);

    type = password.getAttribute('type');
    expect(type).toBe('password');
  });
  test('should fill the email, password and click on sign in button', async () => {
    initialStore = getCreatedStore();

    initfunction(initialStore);

    const email = screen.getByRole('textbox', {id: 'email'});
    const password = screen.getByPlaceholderText('Password*');

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();

    await userEvent.type(email, 'testuser@test.com');
    await userEvent.type(password, 'xbsbxsxazl223xbsbixi');

    const signinButtonNode = screen.getByRole('button', {name: 'Sign in'});

    expect(signinButtonNode).toBeInTheDocument();
    await waitFor(async () => {
      await userEvent.click(signinButtonNode);

      expect(mockDispatch).toHaveBeenCalledWith(
        actions.auth.request('testuser@test.com', 'xbsbxsxazl223xbsbixi', true)
      );
    });
  });
  test('should redirect to mfa  verify URL when mfa is required in the account', () => {
    initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.auth = {mfaRequired: true};
    });

    initfunction(initialStore);
    expect(mockHistoryPush).toHaveBeenCalledWith('/mfa/verify', 'someState');
  });
  test('should show the error query when goole authenticaion shows any error', () => {
    jest.spyOn(useQuery, 'default').mockReturnValue({get: () => 'errorquery'});
    initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.auth = {showAuthError: false};
    });

    initfunction(initialStore);

    expect(screen.getByText('errorquery')).toBeInTheDocument();
  });
  test('should show sign in fail error when Authentication is failed', () => {
    initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.auth = {showAuthError: true, failure: 'Authentication Failure'};
    });

    initfunction(initialStore);

    expect(screen.getByText('Sign in failed. Please try again.')).toBeInTheDocument();
  });
  test('should show the required error message when error message is other then Authentication Failure', () => {
    initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.auth = {showAuthError: true, failure: 'error message'};
    });

    initfunction(initialStore);

    expect(screen.getByText('error message')).toBeInTheDocument();
  });
  test('should show the option for SSO sign and google sign in in when account has ssoclients and user has google authentication available', async () => {
    initialStore = getCreatedStore();
    mutateStore(initialStore, draft => {
      draft.user.preferences = {defaultAShareId: 'own'};
      draft.data.resources = {ssoclients: [{type: 'oidc', disabled: false}]};
      draft.user.profile = {email: 'userEmail', auth_type_google: {id: 'someID'}};
    });

    initfunction(initialStore, true);

    expect(screen.getByText('Sign in with SSO')).toBeInTheDocument();
    const googleSignIn = screen.getByText('Sign in with Google');

    expect(googleSignIn).toBeInTheDocument();

    await userEvent.click(googleSignIn);

    expect(mockDispatch).toHaveBeenCalledWith(
      actions.auth.reSignInWithGoogle('userEmail')
    );
  });
  test('should not show the option for google sign in when user doesnot has goog authentication avialable', async () => {
    initialStore = getCreatedStore();
    mutateStore(initialStore, draft => {
      draft.user.preferences = {defaultAShareId: 'own'};
      draft.data.resources = {ssoclients: [{type: 'oidc', disabled: false}]};
    });

    initfunction(initialStore, true);

    expect(screen.getByText('Sign in with SSO')).toBeInTheDocument();
    expect(screen.queryByText('Sign in with Google')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Sign in with SSO'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.auth.reSignInWithSSO()
    );
  });

  test('should disable the email field when SignInForm is opened in dialog', () => {
    initialStore = getCreatedStore();
    mutateStore(initialStore, draft => {
      draft.user.preferences = {defaultAShareId: 'own'};
      draft.data.resources = {ssoclients: [{type: 'oidc', disabled: false}]};
      draft.user.profile = {email: 'userEmail', auth_type_google: {id: 'someID'}};
    });

    initfunction(initialStore, true);
    const email = screen.getByRole('textbox', {id: 'email'});

    expect(email).toHaveValue('userEmail');
    expect(email).toBeDisabled();
  });
  test('should not show the option for sing in with google when domain is eu.inetgrator.io', () => {
    global.ALLOW_GOOGLE_SIGNIN = 'false';
    initialStore = getCreatedStore();

    initfunction(initialStore);
    expect(screen.queryByText('Sign in with Google')).not.toBeInTheDocument();
  });
  test('should redirect to mfa vrification page when verification is not complete', () => {
    initialStore = getCreatedStore();
    mutateStore(initialStore, draft => {
      draft.user.preferences = {defaultAShareId: 'own'};
      draft.data.resources = {ssoclients: [{type: 'oidc', disabled: false}]};
      draft.session.mfa.sessionInfo = {data: {
        authenticated: true,
        mfaRequired: true,
        mfaSetupRequired: false,
        mfaVerified: false,
      },
      status: 'received'};
    });

    initfunction(initialStore, true);

    expect(mockHistoryPush).toHaveBeenCalledWith('/mfa/verify', 'someState');
  });
});
