import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import RequestResetWrapper from '.';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;

function store(session) {
  mutateStore(initialStore, draft => {
    draft.session = session;
  });
}

async function initResetPassword() {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/reset-password/345DeE'}]} >
      <Route
        path="/reset-password/:token"
        params={{token: '345DeE'}}
      >
        <RequestResetWrapper />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('resetPassword', () => {
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

  test('should able to test save button', async () => {
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
    await initResetPassword();
    const SaveButton = screen.getByRole('button', {name: 'Save'});

    expect(SaveButton).toBeInTheDocument();
  });

  test('should able to test the cancel button', async () => {
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
    await initResetPassword();
    const cancelButton = screen.getByRole('link', {name: 'Cancel'});

    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/signin');
  });
  test('should able to test the SetPassword form by entering the password', async () => {
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
    await initResetPassword();
    const titleText = screen.getByText('Celigo Inc.');

    expect(titleText).toBeInTheDocument();
    const setpasswordHeadingNode = screen.getByRole('heading', {name: 'Reset password'});

    expect(setpasswordHeadingNode).toBeInTheDocument();
    const password = screen.getByPlaceholderText('Enter new password*');

    expect(password).toBeInTheDocument();

    fireEvent.change(password, {target: {value: 'xbsbxsxazl223xbsbixi'}});

    expect(password.value).toBe('xbsbxsxazl223xbsbixi');
    const setpasswordButtonNode = screen.getByRole('button', {name: 'Save'});

    expect(setpasswordButtonNode).toBeInTheDocument();
    await userEvent.click(setpasswordButtonNode);
  });
});
