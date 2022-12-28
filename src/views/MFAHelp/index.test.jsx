import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen, cleanup} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import MfaHelp from '.';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;

function store(auth) {
  initialStore.getState().auth = auth;
}

async function initMFAHelp() {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/mfa/help'}]} >
      <Route>
        <MfaHelp />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('MFAHelp', () => {
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
  test('Should able to test MFA help', async () => {
    store();
    await initMFAHelp();
    const titleText = screen.getByText('Celigo Inc.');

    expect(titleText).toBeInTheDocument();
    const mfaHelpHeadingNode = screen.getByRole('heading', {name: 'Need help authenticating?'});

    expect(mfaHelpHeadingNode).toBeInTheDocument();
  });
  test('Should able to test the signup link', async () => {
    store();
    await initMFAHelp();
    const dontHaveAnAccountTextNode = screen.getByText("Don't have an account?");

    expect(dontHaveAnAccountTextNode).toBeInTheDocument();
    const signUpLinkNode = screen.getByRole('button', {name: 'Sign up'});

    expect(signUpLinkNode).toBeInTheDocument();
    await userEvent.click(signUpLinkNode);
    expect(signUpLinkNode.closest('a')).toHaveAttribute('href', '/signup');
    expect(screen.getByText('contact Celigo support via call.')).toBeInTheDocument();
  });
});
