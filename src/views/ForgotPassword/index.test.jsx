import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen, cleanup } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import ForgotPasswordWrapper from '.';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;

function store(auth) {
  mutateStore(initialStore, draft => {
    draft.auth = auth;
  });
}

async function initForgotPassword() {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/request-reset'}]} >
      <Route>
        <ForgotPasswordWrapper />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('ForgotPasswordWrapper', () => {
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

  test('Should able to test save button', async () => {
    store({});
    await initForgotPassword();
    const SubmitButton = screen.getByRole('button', {name: 'Submit'});

    expect(SubmitButton).toBeInTheDocument();
  });

  test('Should able to test the cancel button', async () => {
    store({});
    await initForgotPassword();
    const cancelButton = screen.getByRole('link', {name: 'Cancel'});

    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/signin');
  });
  test('Should able to test the ForgotPassword form by entering the email', async () => {
    store({});
    await initForgotPassword();
    const titleText = screen.getByText('Celigo Inc.');

    expect(titleText).toBeInTheDocument();
    const forgotpasswordHeadingNode = screen.getByRole('heading', {name: 'Forgot your password?'});

    expect(forgotpasswordHeadingNode).toBeInTheDocument();
    const email = screen.getByPlaceholderText('Email*');

    expect(email).toBeInTheDocument();

    await userEvent.type(email, 'test@celigo.com');

    expect(email.value).toBe('test@celigo.com');
    const forgotpasswordButtonNode = screen.getByRole('button', {name: 'Submit'});

    expect(forgotpasswordButtonNode).toBeInTheDocument();
    await userEvent.click(forgotpasswordButtonNode);
  });
  test('Should able to test the ForgotPassword success view', async () => {
    store({
      initialized: true,
      commStatus: 'success',
      authenticated: true,
      authTimestamp: 1661250286856,
      defaultAccountSet: true,
      mfaRequired: false,
      requestResetStatus: 'success',
      resetRequestLoader: false,
    });
    await initForgotPassword();
    const titleText = screen.getByText('Celigo Inc.');

    expect(titleText).toBeInTheDocument();
    const forgotpasswordHeadingNode = screen.getByRole('heading', {name: 'Forgot your password?'});

    expect(forgotpasswordHeadingNode).toBeInTheDocument();
    const SigninButton = screen.getByRole('link', {name: 'Sign in'});

    expect(SigninButton).toBeInTheDocument();

    await userEvent.click(SigninButton);

    expect(SigninButton.closest('a')).toHaveAttribute('href', '/signin');
  });
});
