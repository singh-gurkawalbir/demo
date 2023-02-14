import { screen } from '@testing-library/react';
import React from 'react';
import * as ReactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import SignUp from '.';
import { getCreatedStore } from '../../../store';
import { renderWithProviders } from '../../../test/test-utils';
import actions from '../../../actions';

let initialStore;

function initSignUp({acceptInviteData}) {
  initialStore.getState().auth.acceptInvite = acceptInviteData;
  const ui = (
    <SignUp />
  );

  return renderWithProviders(ui, {initialStore});
}

// Mocking DynaForm as part of unit testing
jest.mock('../../../components/DynaForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/DynaForm'),
  default: props => (
    <>
      <div>Mocking DynaForm</div>
      <div>formKey = {props.formKey}</div>
    </>
  ),
}));

// Mocking Dyna Submit as part of unit testing
jest.mock('../../../components/DynaForm/DynaSubmit', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/DynaForm/DynaSubmit'),
  default: props => (
    <>
      <div>Mocking Dyna Submit</div>
      <div>formKey = {props.formKey}</div>
      <div>ignoreFormTouchedCheck = {props.ignoreFormTouchedCheck}</div>
      <button type="button" onClick={() => props.onClick('dummy values')}>Sign Up</button>
    </>
  ),
}));

// Mocking getFieldMeta as part of unit testing
jest.mock('./metadata', () => ({
  __esModule: true,
  ...jest.requireActual('./metadata'),
  default: jest.fn().mockReturnValue('mockFieldMeta'),
}));

// Mocking useFormInitWithPermissions as part of unit testing
jest.mock('../../../hooks/useFormInitWithPermissions', () => ({
  __esModule: true,
  ...jest.requireActual('../../../hooks/useFormInitWithPermissions'),
  default: jest.fn().mockReturnValue('mockUseFormInitWithPermissions'),
}));

describe('Testsuite for SignUp', () => {
  let useDispatchFn;
  let mockDispatchFn;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchFn = jest.spyOn(ReactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.types) {
        default:
      }
    });
    useDispatchFn.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchFn.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should render signup and should test the signup button when there are values in store', () => {
    initSignUp({
      acceptInviteData: {
        email: 'testEmail@email.com',
        token: 'test_token',
        _csrf: 'test_csrf',
        skipPassword: true,
      },
    });
    expect(screen.getByText(/mocking dynaform/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking dyna submit/i)).toBeInTheDocument();
    expect(screen.getByText(/ignoreformtouchedcheck =/i)).toBeInTheDocument();

    const signUpButton = screen.getByRole('button', {
      name: /sign up/i,
    });

    expect(signUpButton).toBeInTheDocument();
    userEvent.click(signUpButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.acceptInvite.submit('dummy values'));
  });
  test('should render signup and should test the signup button when there are no values in store', () => {
    initSignUp({
      acceptInviteData: undefined,
    });
    expect(screen.getByText(/mocking dynaform/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking dyna submit/i)).toBeInTheDocument();
    expect(screen.getByText(/ignoreformtouchedcheck =/i)).toBeInTheDocument();

    const signUpButton = screen.getByRole('button', {
      name: /sign up/i,
    });

    expect(signUpButton).toBeInTheDocument();
    userEvent.click(signUpButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.acceptInvite.submit('dummy values'));
  });
  test('should render signup and should test the signup button when there is no email and no token', () => {
    initSignUp({
      acceptInviteData: {
        email: '',
        token: '',
        _csrf: 'test_csrf',
        skipPassword: true,
      },
    });
    expect(screen.getByText(/mocking dynaform/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking dyna submit/i)).toBeInTheDocument();
    expect(screen.getByText(/ignoreformtouchedcheck =/i)).toBeInTheDocument();

    const signUpButton = screen.getByRole('button', {
      name: /sign up/i,
    });

    expect(signUpButton).toBeInTheDocument();
    userEvent.click(signUpButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.acceptInvite.submit('dummy values'));
  });
});
