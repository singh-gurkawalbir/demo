import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen, cleanup } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import Signin from '.';
import actions from '../../actions';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;

function store(auth, profile) {
  mutateStore(initialStore, draft => {
    draft.auth = auth;
    draft.user.profile = profile;
  });
}

async function initSignIn() {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/signin'}]} >
      <Route>
        <Signin />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('signin', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'AUTH_REQUEST':
          initialStore.dispatch(action);
          break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    cleanup();
  });

  test('should able to test the signin with google', async () => {
    store({});
    await initSignIn();
    const signInWithGoogle = screen.getByRole('button', {name: 'Sign in with Google'});

    expect(signInWithGoogle).toBeInTheDocument();
  });

  test('should able to test the forgot password link', async () => {
    store({});
    await initSignIn();
    const forgotPasswordLinkNode = screen.getByRole('link', {name: 'Forgot password?'});

    expect(forgotPasswordLinkNode).toBeInTheDocument();
    await userEvent.click(forgotPasswordLinkNode);
    expect(forgotPasswordLinkNode.closest('a')).toHaveAttribute('href', '/request-reset');
  });
  test('should able to test the login form by entering the email and password', async () => {
    store({});
    await initSignIn();
    const titleText = screen.getByText('Celigo Inc.');

    expect(titleText).toBeInTheDocument();
    const signinHeadingNode = screen.getByRole('heading', {name: 'Sign in'});

    expect(signinHeadingNode).toBeInTheDocument();
    const email = screen.getByRole('textbox', {id: 'email'});
    const password = screen.getByPlaceholderText('Password*');

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();

    await userEvent.type(email, 'testuser@test.com');
    await userEvent.type(password, 'xbsbxsxazl223xbsbixi');
    expect(email.value).toBe('testuser@test.com');
    expect(password.value).toBe('xbsbxsxazl223xbsbixi');
    const signinButtonNode = screen.getByRole('button', {name: 'Sign in'});

    expect(signinButtonNode).toBeInTheDocument();
    await userEvent.click(signinButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.request('testuser@test.com', 'xbsbxsxazl223xbsbixi', true));
  });

  //   store({
  //     initialized: true,
  //     commStatus: 'success',
  //     authenticated: true,
  //     authTimestamp: 1661250286856,
  //     defaultAccountSet: true,
  //     mfaRequired: true,
  //   });
  //   await initSignIn();

  //   expect(screen.getByRole('heading', {name: 'Authenticate with one-time passcode'})).toBeInTheDocument();

  //   expect(screen.getByText(/You are signing in from a new device. Enter your passcode to verify your account./i)).toBeInTheDocument();
  //   const oneTimePassword = screen.getByPlaceholderText('One-time passcode*');

  //   expect(oneTimePassword).toBeInTheDocument();
  //   userEvent.type(oneTimePassword, '123456');
  //   const trustedDeviceNode = screen.getByRole('checkbox', {name: 'Trust this device'});

  //   expect(trustedDeviceNode).not.toBeChecked();
  //   await userEvent.click(trustedDeviceNode);
  //   await waitFor(() => expect(trustedDeviceNode).toBeChecked());
  //   const submitButtonNode = screen.getByRole('button', {name: 'Submit'});

  //   expect(submitButtonNode).toBeInTheDocument();
  //   await userEvent.click(submitButtonNode);

  //   expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.mfaVerify.request({ code: '123456', trustDevice: true }));
  // });
  // eslint-disable-next-line jest/no-commented-out-tests
  // test('Should able to test MFA without passcode', async () => {
  //   store({
  //     initialized: true,
  //     commStatus: 'success',
  //     authenticated: true,
  //     authTimestamp: 1661250286856,
  //     defaultAccountSet: true,
  //     mfaRequired: true,
  //   });
  //   await initSignIn();

  //   expect(screen.getByRole('heading', {name: 'Authenticate with one-time passcode'})).toBeInTheDocument();

  //   expect(screen.getByText(/You are signing in from a new device. Enter your passcode to verify your account./i)).toBeInTheDocument();
  //   const oneTimePassword = screen.getByPlaceholderText('One-time passcode*');

  //   expect(oneTimePassword).toBeInTheDocument();
  //   userEvent.type(oneTimePassword, '');
  //   const submitButtonNode = screen.getByRole('button', {name: 'Submit'});

  //   expect(submitButtonNode).toBeInTheDocument();
  //   await userEvent.click(submitButtonNode);
  //   const warningMessageNode = screen.getByText(/One time passcode is required/i);

  //   expect(warningMessageNode).toBeInTheDocument();
  // });
  // eslint-disable-next-line jest/no-commented-out-tests
  // test('Should able to test MFA with an invalid passcode', async () => {
  //   store({
  //     initialized: true,
  //     commStatus: 'success',
  //     authenticated: true,
  //     authTimestamp: 1661250286856,
  //     defaultAccountSet: true,
  //     mfaRequired: true,
  //   });
  //   await initSignIn();
  //   const headingNode = screen.getByRole('heading', {name: 'Authenticate with one-time passcode'});

  //   expect(headingNode).toBeInTheDocument();
  //   const mfaSigninText = screen.getByText(/You are signing in from a new device. Enter your passcode to verify your account./i);

  //   expect(mfaSigninText).toBeInTheDocument();
  //   const oneTimePassword = screen.getByPlaceholderText('One-time passcode*');

  //   expect(oneTimePassword).toBeInTheDocument();
  //   userEvent.type(oneTimePassword, '123');
  //   const submitButtonNode = screen.getByRole('button', {name: 'Submit'});

  //   expect(submitButtonNode).toBeInTheDocument();
  //   await userEvent.click(submitButtonNode);
  //   const warningMessageNode = screen.getByText(/Invalid one time passcode/i);

  //   expect(warningMessageNode).toBeInTheDocument();
  // });
});
