/* global describe, test, expect, jest, beforeEach, afterEach */

import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, cleanup } from '@testing-library/react';
import * as reactRedux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import SignInSSOForm from './SignInSSOForm';
import actions from '../../actions';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;

function store(auth, profile) {
  initialStore.getState().auth = auth;
  initialStore.getState().user.profile = profile;
}

async function initSignInSSOForm(props) {
  const ui = (
    <MemoryRouter>
      <Route>
        <SignInSSOForm {...props} />
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
    window.signInError = jest.fn();
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    window.signInError.mockClear();
    cleanup();
  });

  test('Should able to test SSO page', async () => {
    const auth = {
      showAuthError: true,
      failure: 'Authentication Failure',
    };

    const profile = {
      email: 'testuser@test.com',
      auth_type_google: { id: 'testuser@test.com' },
    };

    store(auth, profile);
    await initSignInSSOForm();
    const ssoButtonNode = screen.getByRole('button', {name: 'Sign in with SSO'});

    expect(ssoButtonNode).toBeInTheDocument();
    const emailNode = document.querySelector('input[id="email"]');

    expect(emailNode).toBeDisabled();
    userEvent.click(ssoButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.reSignInWithSSO());
  });
  test('Should able to test SSO page when authentication is set to true', async () => {
    const auth = {
      commStatus: 'loading',
      authenticated: false,
    };
    const profile = {
      email: 'testuser@test.com',
      auth_type_google: { id: 'testuser@test.com' },
    };

    store(auth, profile);
    await initSignInSSOForm();
    const progressBar = document.querySelector('div[role="progressbar"]');

    expect(progressBar).toBeInTheDocument();
  });
});
