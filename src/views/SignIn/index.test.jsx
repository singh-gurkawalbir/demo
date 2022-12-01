/* global describe, test, expect, jest, beforeEach, afterEach */

import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, cleanup } from '@testing-library/react';
import * as reactRedux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import Signin from '.';
import actions from '../../actions';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;

function store(auth, profile) {
  initialStore.getState().auth = auth;
  initialStore.getState().user.profile = profile;
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

describe('Signin', () => {
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

  test('Should able to test the signin with google', async () => {
    store({});
    await initSignIn();
    const signInWithGoogle = screen.getByRole('button', {name: 'Sign in with Google'});

    expect(signInWithGoogle).toBeInTheDocument();
  });

  test('Should able to test the forgot password link', async () => {
    store({});
    await initSignIn();
    const forgotPasswordLinkNode = screen.getByRole('link', {name: 'Forgot password?'});

    expect(forgotPasswordLinkNode).toBeInTheDocument();
    await userEvent.click(forgotPasswordLinkNode);
    expect(forgotPasswordLinkNode.closest('a')).toHaveAttribute('href', '/request-reset');
  });
  test('Should able to test the login form by entering the email and password', async () => {
    store({});
    await initSignIn();
    const titleText = screen.getByText('Celigo Inc.');

    expect(titleText).toBeInTheDocument();
    const signinHeadingNode = screen.getByRole('heading', {name: 'Sign in'});

    expect(signinHeadingNode).toBeInTheDocument();
    const email = screen.getByRole('textbox', {id: 'email'});
    const password = screen.getByPlaceholderText('Password');

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();

    await userEvent.type(email, 'testuser@test.com');
    await userEvent.type(password, 'xbsbxsxazl223xbsbixi');
    expect(email.value).toBe('testuser@test.com');
    expect(password.value).toBe('xbsbxsxazl223xbsbixi');
    const signinButtonNode = screen.getByRole('button', {name: 'Sign in'});

    expect(signinButtonNode).toBeInTheDocument();
    userEvent.click(signinButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.request('testuser@test.com', 'xbsbxsxazl223xbsbixi', true));
  });
  test('Should able to test the signup link', async () => {
    store({});
    await initSignIn();
    const dontHaveAnAccountTextNode = screen.getByText("Don't have an account?");

    expect(dontHaveAnAccountTextNode).toBeInTheDocument();
    const signUpLinkNode = screen.getByRole('button', {name: 'Sign up'});

    expect(signUpLinkNode).toBeInTheDocument();
    await userEvent.click(signUpLinkNode);
    expect(signUpLinkNode.closest('a')).toHaveAttribute('href', '/signup');
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
  //   userEvent.click(trustedDeviceNode);
  //   await waitFor(() => expect(trustedDeviceNode).toBeChecked());
  //   const submitButtonNode = screen.getByRole('button', {name: 'Submit'});

  //   expect(submitButtonNode).toBeInTheDocument();
  //   userEvent.click(submitButtonNode);

  //   expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.mfaVerify.request({ code: '123456', trustDevice: true }));
  // });
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
  //   userEvent.click(submitButtonNode);
  //   const warningMessageNode = screen.getByText(/One time passcode is required/i);

  //   expect(warningMessageNode).toBeInTheDocument();
  // });
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
  //   userEvent.click(submitButtonNode);
  //   const warningMessageNode = screen.getByText(/Invalid one time passcode/i);

  //   expect(warningMessageNode).toBeInTheDocument();
  // });
});
