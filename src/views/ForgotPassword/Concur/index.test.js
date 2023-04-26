import { screen, within, waitFor } from '@testing-library/react';
import React from 'react';
import * as ReactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ConcurForgotPassword from '.';
import { getCreatedStore } from '../../../store';
import { renderWithProviders, mutateStore } from '../../../test/test-utils';
import actions from '../../../actions';

let initialStore;

function initConcurForgotPassword(props, {authState}) {
  const mutateState = draft => {
    draft.auth = authState;
  };

  mutateStore(initialStore, mutateState);
  const ui = (
    <MemoryRouter>
      <ConcurForgotPassword props={props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

// Mocking ForgotPasswordForm as part of unit testing
jest.mock('./ForgotPasswordForm', () => ({
  __esModule: true,
  ...jest.requireActual('./ForgotPasswordForm'),
  default: props => (
    <>
      <div>Mock Forgot Password Form</div>
      <div>dialogOpen = {props.dialogOpen}</div>
      <div>email = {props.email}</div>
      <div>className = {props.className}</div>
      <button type="button" onClick={() => props.setShowError(true)}>setShowError</button>
    </>
  ),
}));

// Mocking message store as part of unit testing
jest.mock('../../../utils/messageStore', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/messageStore'),
  default: () => 'Mocking user sign in forgot password user exist',
}));

// Mocking getImageURL as part of unit testing
jest.mock('../../../utils/image', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/image'),
  default: () => 'Mocking Image URL',
}));

// Mocking Text Button as part of unit testing
jest.mock('../../../components/Buttons', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/Buttons'),
  default: props => {
    const dataTest = 'data-test';

    return (
      <>
        <div>Mock Text Buttons</div>
        <button
          type="button"
          data-test={props[dataTest]}
          color={props.color}
          className={props.className}
          onClick={() => props.onClick}
        >
          {props.children}
        </button>
        <div>component = {props.component}</div>
        <div>to = {props.to}</div>
      </>
    );
  },
}));

// Mocking React Router DOM as part of unit testing
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '?email=testQueryParam',
  }),
}));

describe('Testsuite for Concur Forgot Password', () => {
  let useDispatchSpy;
  let mockDispatchFn;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(ReactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(
      actions => {
        switch (actions.type) {
          default:
        }
      }
    );
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should test the concur forgot password when the password reset request status is not equal to success', () => {
    initConcurForgotPassword({test: 'test1'}, {
      authState: {
        requestResetStatus: 'fail',
        requestResetEmail: 'testemail@email.com',
      },
    });
    expect(screen.getByRole('img', {
      name: /sapconcur/i,
    })).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name: /forgot your password\?/i,
    })).toBeInTheDocument();
    expect(screen.getByText(
      /please note that after you reset your password, you have to go back to the concur app center and connect again to the celigo app\./i
    )).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name: /testemail@email\.com/i,
    })).toBeInTheDocument();
    expect(screen.getByText(/mock forgot password form/i)).toBeInTheDocument();
    expect(screen.getByText(/dialogopen =/i)).toBeInTheDocument();
    expect(screen.getByText(/email = testqueryparam/i)).toBeInTheDocument();
    expect(screen.getByRole('link', {
      name: /privacy/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/privacy/');
    expect(screen.getByRole('link', {
      name: /Terms of Service/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/terms-of-service/');
    expect(screen.getByRole('link', {
      name: /support/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/support/');
  });
  test('should test the concur forgot password when the password reset request status is success', () => {
    initConcurForgotPassword({test: 'test1'}, {
      authState: {
        requestResetStatus: 'success',
        requestResetEmail: 'testemail@email.com',
      },
    });
    expect(screen.getByRole('img', {
      name: /sapconcur/i,
    })).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name: /forgot your password\?/i,
    })).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name: /testemail@email\.com/i,
    })).toBeInTheDocument();
    expect(screen.getByText(/mocking user sign in forgot password user exist/i)).toBeInTheDocument();
    expect(screen.getByText(/back to/i)).toBeInTheDocument();
    waitFor(() => {
      const button = screen.getByRole('button', {
        name: /sign in/i,
      });

      within(button).getByText(/sign in/i);
      expect(button).toHaveAttribute('href', '/signin?application=concur');
      userEvent.click(button);
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.resetRequestSent());
      expect(screen.getByRole('link', {
        name: /privacy/i,
      })).toHaveAttribute('href', 'https://www.celigo.com/privacy/');
      expect(screen.getByRole('link', {
        name: /Terms of Service/i,
      })).toHaveAttribute('href', 'https://www.celigo.com/terms-of-service/');
      expect(screen.getByRole('link', {
        name: /Support/i,
      })).toHaveAttribute('href', 'https://www.celigo.com/support/');
    });
  });
  test('should test the consur forgot password when there is an error message by setting showError as true', async () => {
    initConcurForgotPassword({test: 'test1'}, {
      authState: {
        requestResetStatus: 'fail',
        requestResetEmail: 'testemail@email.com',
        requestResetError: 'test error',
      },
    });
    expect(screen.queryByText(/test error/i)).not.toBeInTheDocument();
    waitFor(async () => {
      const setShowErrorButtonNode = screen.getByRole('button', {
        name: /setshowerror/i,
      });

      expect(setShowErrorButtonNode).toBeInTheDocument();
      await userEvent.click(setShowErrorButtonNode);
      expect(screen.queryByText(/test error/i)).toBeInTheDocument();
    });
  });
});
