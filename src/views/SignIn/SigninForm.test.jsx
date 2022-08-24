/* global describe, test, expect, jest, beforeEach, afterEach */

import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, cleanup } from '@testing-library/react';
import * as reactRedux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import SignIn from './SigninForm';
import actions from '../../actions';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;

function store(auth, profile, ssoclients, accounts, preferences) {
  initialStore.getState().auth = auth;
  initialStore.getState().user.profile = profile;
  initialStore.getState().data.resources.ssoclients = ssoclients;
  initialStore.getState().user.org.accounts = accounts;
  initialStore.getState().user.preferences = preferences;
}

async function initSignIn(props) {
  const ui = (
    <MemoryRouter>
      <Route>
        <SignIn {...props} />
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

  test('Should able to test Re-Signin using google', async () => {
    const auth = {
    };
    const props = { dialogOpen: true };
    const profile = {
      email: 'testuser@test.com',
      auth_type_google: { id: 'testuser@test.com' },
    };

    store(auth, profile);
    await initSignIn(props);
    const signInWithGoogleNode = screen.getByRole('button', { name: 'Sign in with Google' });

    expect(signInWithGoogleNode).toBeInTheDocument();
    userEvent.click(signInWithGoogleNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.reSignInWithGoogle('testuser@test.com'));
  });
  test('Should able to test Re-Signin using SSO', async () => {
    const auth = {
    };
    const profile = {};
    const props = { dialogOpen: true };
    const accounts = [{
      _id: 'own',
      accessLevel: 'owner',
    }];
    const ssoclients = [{
      _id: '6097fdaf86c0c5190bb3babc',
      type: 'oidc',
      orgId: 'celigo1235',
      disabled: false,
      oidc: {
        issuerURL: 'https://celigo547.okta.com',
        clientId: 'sampleClientId',
        clientSecret: '******',
      },
    }];
    const preferences = {
      defaultAShareId: 'own',
    };

    store(auth, profile, ssoclients, accounts, preferences);
    await initSignIn(props);
    const signInWithSSONode = screen.getByRole('button', {name: 'Sign in with SSO'});

    expect(signInWithSSONode).toBeInTheDocument();
    userEvent.click(signInWithSSONode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.reSignInWithSSO());
  });
  test('Should able to test error messages on signin form', async () => {
    const auth = {
      showAuthError: true,
      failure: 'Authentication Failure',
    };
    const props = { dialogOpen: false };

    store(auth);
    await initSignIn(props);
    const signinErrorMessage = screen.getByText(/Sign in failed. Please try again./i);

    expect(signinErrorMessage).toBeInTheDocument();
  });
});
