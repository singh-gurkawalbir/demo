/* global describe, test, expect, jest, beforeEach, afterEach */

import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, cleanup } from '@testing-library/react';
import * as reactRedux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import SetPassword from '.';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;

function store(session) {
  initialStore.getState().session = session;
}

async function initSetPassword(props) {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: props.pathname}]} >
      <Route
        path="/set-initial-password/:token"
        params={{token: props.match.params.token}}
      >
        <SetPassword />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('SetPassword', () => {
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
    cleanup();
  });

  test('Should able to test save button', async () => {
    store({mfa: {
      sessionInfo: {
        data: {
          authenticated: false,
          mfaRequired: false,
          mfaSetupRequired: false,
          mfaVerified: false,
        },
        status: 'received',
      }},
    });
    const props = {
      match: {
        params: {
          token: '5fc5e0e66cfe5b44bb95de70',
        },
      },
      pathname: '/set-initial-password/5fc5e0e66cfe5b44bb95de70',
      history: {
        push: jest.fn(),
      },
    };

    await initSetPassword(props);
    const SaveButton = screen.getByRole('button', {name: 'Save and sign in'});

    expect(SaveButton).toBeInTheDocument();
  });

  test('Should able to test the cancel button', async () => {
    store({mfa: {
      sessionInfo: {
        data: {
          authenticated: false,
          mfaRequired: false,
          mfaSetupRequired: false,
          mfaVerified: false,
        },
        status: 'received',
      }},
    });
    const props = {
      match: {
        params: {
          token: '5fc5e0e66cfe5b44bb95de70',
        },
      },
      pathname: '/set-initial-password/5fc5e0e66cfe5b44bb95de70',
      history: {
        push: jest.fn(),
      },
    };

    await initSetPassword(props);
    const cancelButton = screen.getByRole('link', {name: 'Cancel'});

    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/signin');
  });
  test('Should able to test the SetPassword form by entering the password', async () => {
    store({mfa: {
      sessionInfo: {
        data: {
          authenticated: false,
          mfaRequired: false,
          mfaSetupRequired: false,
          mfaVerified: false,
        },
        status: 'received',
      }},
    });
    const props = {
      match: {
        params: {
          token: '5fc5e0e66cfe5b44bb95de70',
        },
      },
      pathname: '/set-initial-password/5fc5e0e66cfe5b44bb95de70',
      history: {
        push: jest.fn(),
      },
    };

    await initSetPassword(props);
    const titleText = screen.getByText('Celigo Inc.');

    expect(titleText).toBeInTheDocument();
    const setpasswordHeadingNode = screen.getByRole('heading', {name: 'Create your password'});

    expect(setpasswordHeadingNode).toBeInTheDocument();
    const password = screen.getByPlaceholderText('Password');

    expect(password).toBeInTheDocument();

    await userEvent.type(password, 'xbsbxsxazl223xbsbixi');

    expect(password.value).toBe('xbsbxsxazl223xbsbixi');
    const setpasswordButtonNode = screen.getByRole('button', {name: 'Save and sign in'});

    expect(setpasswordButtonNode).toBeInTheDocument();
    userEvent.click(setpasswordButtonNode);
  });
});
