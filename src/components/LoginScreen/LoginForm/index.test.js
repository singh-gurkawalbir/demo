/* eslint-disable jest/expect-expect */
/* eslint-disable jest/no-standalone-expect */

import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';

async function initLoginForm() {
  const ui = (
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('loginForm component', () => {
  runServer();

  beforeEach(async () => {
    await initLoginForm();
    expect(screen.getByRole('heading', {name: 'Sign in'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Sign in'})).toBeInTheDocument();
    expect(screen.queryByText('Don\'t have an account?')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Forgot password?'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Sign in with Google'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Sign up'})).toBeInTheDocument();
  });
  test('should pass the initial render', () => {
    expect(screen.getByRole('link', {name: 'Sign up'})).toBeInTheDocument();
  });

  test('should pass the render with sign in with google onclick', async () => {
    const signInGoole = screen.getByRole('button', {name: 'Sign in with Google'});

    await userEvent.click(signInGoole);
    // await waitFor();
  });

  test('should pass the render with sign in onclick', async () => {
    const signIn = screen.getByRole('button', {name: 'Sign in'});

    await userEvent.click(signIn);
    // await waitFor();
  });
});
