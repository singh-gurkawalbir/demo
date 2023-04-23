import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import {screen} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import Signup from '.';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const initialStore = getCreatedStore();

describe('Sign up form test cases', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'AUTH_SIGNUP': break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should verify the various field needed in sign up form', () => {
    renderWithProviders(<MemoryRouter><Signup /></MemoryRouter>, {initialStore});
    expect(screen.getByPlaceholderText('Name*')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Business email*')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Company')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Role')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Sign up with Google'})).toBeInTheDocument();
  });
  test('should click the Sign up with Google button', () => {
    renderWithProviders(<MemoryRouter><Signup /></MemoryRouter>, {initialStore});
    userEvent.click(screen.getByRole('button', {name: 'Sign up with Google'}));
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.auth.signUpWithGoogle('/', {})
    );
  });
  test('should fill the sign up form and click on sign up button', () => {
    renderWithProviders(<MemoryRouter><Signup /></MemoryRouter>, {initialStore});
    const nameTextBox = screen.getByPlaceholderText('Name*');
    const emailTextBox = screen.getByPlaceholderText('Business email*');

    userEvent.type(nameTextBox, 'first second');
    userEvent.type(emailTextBox, 'abc@celigo.com');

    userEvent.click(screen.getByRole('checkbox'));

    const signupButton = screen.getByRole('button', {name: 'Sign up'});

    userEvent.click(signupButton);

    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.auth.signup(
        {
          name: 'first second',
          email: 'abc@celigo.com',
          company: undefined,
          role: undefined,
          phone: undefined,
          agreeTOSAndPP: true,
        }
      )
    );
  });
  test('should click the sign up button when search param is present in URL', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={[{pathname: '/signup', search: 'utm_source=google'}]}>
        <Route path="/signup" >
          <Signup />
        </Route>
      </MemoryRouter>, {initialStore}
    );
    const nameTextBox = screen.getByPlaceholderText('Name*');
    const emailTextBox = screen.getByPlaceholderText('Business email*');

    userEvent.type(nameTextBox, 'first second');
    userEvent.type(emailTextBox, 'abc@celigo.com');

    userEvent.click(screen.getByRole('checkbox'));

    const signupButton = screen.getByRole('button', {name: 'Sign up'});

    userEvent.click(signupButton);

    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.auth.signup({
        name: 'first second',
        email: 'abc@celigo.com',
        company: undefined,
        role: undefined,
        phone: undefined,
        agreeTOSAndPP: true,
        utm_source: 'google',
      })
    );

    expect(signupButton).toBeDisabled();
  });
  test('should click the sign up button when unknown search param is present in URL', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={[{pathname: '/signup', search: 'source=google'}]}>
        <Route path="/signup" >
          <Signup />
        </Route>
      </MemoryRouter>, {initialStore}
    );
    const nameTextBox = screen.getByPlaceholderText('Name*');
    const emailTextBox = screen.getByPlaceholderText('Business email*');

    userEvent.type(nameTextBox, 'first second');
    userEvent.type(emailTextBox, 'abc@celigo.com');

    userEvent.click(screen.getByRole('checkbox'));

    const signupButton = screen.getByRole('button', {name: 'Sign up'});

    userEvent.click(signupButton);

    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.auth.signup({
        name: 'first second',
        email: 'abc@celigo.com',
        company: undefined,
        role: undefined,
        phone: undefined,
        agreeTOSAndPP: true,
      })
    );
  });
  test('should show error message when sign in fails', () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.auth.signup = {status: 'failed', message: 'error message' };
    });
    renderWithProviders(<MemoryRouter><Signup /></MemoryRouter>, {initialStore});

    expect(screen.getByText('error message')).toBeInTheDocument();
  });
  test('should not show form fields when sign up is done', () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.auth.signup = {status: 'done', message: 'success message' };
    });
    const {utils} = renderWithProviders(<MemoryRouter><Signup /></MemoryRouter>, {initialStore});

    expect(utils.container.textContent).toBe('');
  });
});
