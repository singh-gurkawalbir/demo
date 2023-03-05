import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import * as ReactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import ForgotPassword from './ForgotPasswordForm';
import { renderWithProviders, mutateStore } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';

let initialStore;
const setShowError = jest.fn();

function initForgotPassword({
  setShowError,
  email,
  className,
  authState,
}) {
  const mutateState = draft => {
    draft.auth = authState;
  };

  mutateStore(initialStore, mutateState);

  const ui = (
    <ForgotPassword
      setShowError={setShowError}
      email={email}
      className={className}
    />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for Concur Forgot Password', () => {
  let useDispatchSpy;
  let mockDispatchFn;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(ReactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(
      actions => {
        switch (actions.types) {
          default:
        }
      }
    );
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    mockDispatchFn.mockClear();
    useDispatchSpy.mockClear();
    setShowError.mockClear();
  });
  test('should test concur forgot password when the resetRequestStatus is set to success and test the request password reset', async () => {
    initForgotPassword(
      {
        setShowError,
        email: 'testemail@email.com',
        className: 'test_email',
        authState: {
          requestResetStatus: 'success',
        },
      }
    );
    const emailTextBoxNode = screen.getByRole('textbox');

    expect(emailTextBoxNode).toBeInTheDocument();
    expect(emailTextBoxNode).toHaveValue('testemail@email.com');
    // await userEvent.clear(emailTextBoxNode);
    await fireEvent.change(emailTextBoxNode, {target: {value: ''}});
    await userEvent.type(emailTextBoxNode, 'test1@email.com');
    expect(emailTextBoxNode).not.toHaveValue('testemail@email.com');
    expect(emailTextBoxNode).toHaveValue('test1@email.com');
    const requestResetPassword = screen.getByRole('button', {
      name: /request password reset/i,
    });

    expect(requestResetPassword).toBeInTheDocument();
    await userEvent.click(requestResetPassword);
    expect(setShowError).toHaveBeenCalledWith(false);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.resetRequest('test1@email.com'));
  });
  test('should test concur forgot password when the resetRequestStatus is not set to success', async () => {
    initForgotPassword(
      {
        setShowError,
        email: 'testemail@email.com',
        className: 'test_email',
        authState: {
          requestResetStatus: 'fail',
        },
      }
    );
    waitFor(async () => {
      const emailTextBoxNode = screen.getByRole('textbox');

      expect(emailTextBoxNode).toBeInTheDocument();
      expect(emailTextBoxNode).toHaveValue('testemail@email.com');
      // await userEvent.clear(emailTextBoxNode);
      await fireEvent.change(emailTextBoxNode, {target: {value: ''}});
      await userEvent.type(emailTextBoxNode, 'test1@email.com');
      waitFor(() => { expect(emailTextBoxNode).not.toHaveValue('testemail@email.com'); });
      expect(emailTextBoxNode).toHaveValue('test1@email.com');
    });
    let requestResetPassword;

    waitFor(async () => {
      requestResetPassword = screen.getByRole('button', {
        name: /request password reset/i,
      });

      expect(requestResetPassword).toBeInTheDocument();
      await userEvent.click(requestResetPassword);
      expect(setShowError).toHaveBeenCalledWith(true);
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.resetRequest('test1@email.com'));
    });
  });
  test('should test concur forgot password when the resetRequestStatus is not set to success and when there is no default email', async () => {
    initForgotPassword(
      {
        setShowError,
        email: undefined,
        className: 'test_email',
        authState: {
          requestResetStatus: 'fail',
        },
      }
    );
    let emailTextBoxNode;

    waitFor(async () => {
      emailTextBoxNode = screen.getByRole('textbox');

      expect(emailTextBoxNode).toBeInTheDocument();
      expect(emailTextBoxNode).toHaveValue('');
      // await userEvent.clear(emailTextBoxNode);
      await fireEvent.change(emailTextBoxNode, {target: {value: ''}});
      await userEvent.type(emailTextBoxNode, 'test1@email.com');
      expect(emailTextBoxNode).not.toHaveValue('testemail@email.com');
      expect(emailTextBoxNode).toHaveValue('test1@email.com');
    });
    let requestResetPassword;

    waitFor(async () => {
      requestResetPassword = screen.getByRole('button', {
        name: /request password reset/i,
      });

      expect(requestResetPassword).toBeInTheDocument();
      await userEvent.click(requestResetPassword);
      expect(setShowError).toHaveBeenCalledWith(true);
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.resetRequest('test1@email.com'));
    });
  });
});
