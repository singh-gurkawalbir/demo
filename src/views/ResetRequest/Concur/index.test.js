import { screen } from '@testing-library/react';
import React from 'react';
import ResetPassword from '.';
import { renderWithProviders } from '../../../test/test-utils';

function initResetPassword(props) {
  const ui = (
    <ResetPassword {...props} />
  );

  return renderWithProviders(ui);
}

// Mocking Reset Password Form as part of unit testing
jest.mock('./ResetPasswordForm', () => ({
  __esModule: true,
  ...jest.requireActual('./ResetPasswordForm'),
  default: props => (
    <>
      <div>Mock Reset Password Form</div>
      <div>dialogOpen = {props.dialogOpen}</div>
      <div>className = {props.className}</div>
      <div>props = {props?.test ? props.test : ''}</div>
    </>
  ),
}));

describe('Testsuite for Concure Reset Password', () => {
  test('should render reset password when props passed', () => {
    initResetPassword({test: 'test1'});
    expect(screen.getByRole('heading', {
      name: /reset password/i,
    })).toBeInTheDocument();
    expect(screen.getByText(/mock reset password form/i)).toBeInTheDocument();
    expect(screen.getByText(/dialogopen =/i)).toBeInTheDocument();
    expect(screen.getByText(/props = test1/i)).toBeInTheDocument();
  });
  test('should render reset password when props are not passed', () => {
    initResetPassword();
    expect(screen.getByRole('heading', {
      name: /reset password/i,
    })).toBeInTheDocument();
    expect(screen.getByText(/mock reset password form/i)).toBeInTheDocument();
    expect(screen.getByText(/dialogopen =/i)).toBeInTheDocument();
    expect(screen.getByText(/props =/i)).toBeInTheDocument();
  });
});
