import { screen } from '@testing-library/react';
import React from 'react';
import * as ReactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import SignUp from '.';
import { getCreatedStore } from '../../../store';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import actions from '../../../actions';

let initialStore;
const mockGetFieldMeta = jest.fn();
const mockUseFormInitWithPermissions = jest.fn();

function initSignUp({acceptInviteData}) {
  mutateStore(initialStore, draft => {
    draft.auth.acceptInvite = acceptInviteData;
  });
  const ui = (
    <MemoryRouter><SignUp /></MemoryRouter>
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
  default: props => mockGetFieldMeta(props),
}));

// Mocking useFormInitWithPermissions as part of unit testing
jest.mock('../../../hooks/useFormInitWithPermissions', () => ({
  __esModule: true,
  ...jest.requireActual('../../../hooks/useFormInitWithPermissions'),
  default: props => mockUseFormInitWithPermissions(props),
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
    mockGetFieldMeta.mockReturnValue('mockGetFieldMeta');
  });
  afterEach(() => {
    useDispatchFn.mockClear();
    mockDispatchFn.mockClear();
    mockGetFieldMeta.mockClear();
    mockUseFormInitWithPermissions.mockClear();
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
    expect(mockGetFieldMeta).toHaveBeenCalledWith({_csrf: 'test_csrf', email: 'testEmail@email.com', skipPassword: true, token: 'test_token'});
    expect(mockUseFormInitWithPermissions).toHaveBeenCalledWith({fieldMeta: 'mockGetFieldMeta', formKey: 'signupForm', remount: 0});

    const signUpButton = screen.getByRole('button', {
      name: 'Sign Up',
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
      name: 'Sign Up',
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
      name: 'Sign Up',
    });

    expect(signUpButton).toBeInTheDocument();
    userEvent.click(signUpButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.acceptInvite.submit('dummy values'));
  });
});
