import { screen } from '@testing-library/react';
import React from 'react';
import Signin from '.';
import { getCreatedStore } from '../../../store';
import { renderWithProviders, mutateStore } from '../../../test/test-utils';
import { SIGN_UP_SUCCESS } from '../../../constants';

let initialStore;

function initConcurSignIn(props, {authData}) {
  const mutateState = draft => {
    draft.auth = authData;
  };

  mutateStore(initialStore, mutateState);
  const ui = (
    <Signin {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}

// Mocking Signin Form as part of unit testing
jest.mock('./SignInForm', () => ({
  __esModule: true,
  ...jest.requireActual('./SignInForm'),
  default: props => (
    <>
      <div>Mock Signin Form</div>
      <div>dialogOpen = {props.dialogOpen}</div>
      <div>className = {props.className}</div>
      <div>props = {props.test}</div>
    </>
  ),
}));

// Mocking getImageUrl as part of unit testing
jest.mock('../../../utils/image', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/image'),
  default: props => props,
}));

// Mocking messageStore as part of unit testing
jest.mock('../../../utils/messageStore', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/messageStore'),
  // eslint-disable-next-line no-unused-vars
  default: (a, b) => `${a}`,
}));

describe('Testsuite for Concur SignIn', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should test the concur signin when the signin state is success and when mfa is not required', () => {
    initConcurSignIn({test: 'test1'}, {
      authData: {
        signup: {
          status: 'done',
        },
        mfaRequired: false,
      },
    });
    expect(screen.getByRole('img', {
      name: /sapconcur/i,
    })).toHaveAttribute('src', '/images/celigo-sapconcur.png');
    expect(screen.getByRole('heading', {
      name: /link your celigo account with sap concur/i,
    })).toBeInTheDocument();
    expect(screen.getByText(SIGN_UP_SUCCESS)).toBeInTheDocument();
    expect(screen.getByText(
      /USER_SIGN_IN.NEW_USER_IO/i)).toBeInTheDocument();
    expect(screen.getByText(/dialogopen =/i)).toBeInTheDocument();
    expect(screen.getByText(/props = test1/i)).toBeInTheDocument();
    expect(screen.getByRole('link', {
      name: /privacy/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/privacy/');
    expect(screen.getByRole('link', {
      name: /terms of service/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/terms-of-service/');
    expect(screen.getByRole('link', {
      name: /support/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/support/');
  });
  test('should test the concur signin when the signin state is not success and when mfa is required and is a account user and has noOfDays', () => {
    initConcurSignIn({test: 'test1'}, {
      authData: {
        signup: {
          status: 'incomplete',
        },
        mfaRequired: true,
        mfaAuthInfo: {
          isAccountUser: true,
          noOfDays: '1',
        },
      },
    });
    expect(screen.getByRole('img', {
      name: /sapconcur/i,
    })).toHaveAttribute('src', '/images/celigo-sapconcur.png');
    expect(screen.getByRole('heading', {
      name: /authenticate with one-time passcode/i,
    })).toBeInTheDocument();
    expect(screen.getByText(/mfa\.user_otp_info_for_trusted_number_of_days/i)).toBeInTheDocument();
    expect(screen.getByText(/user_sign_in\.new_user_io/i)).toBeInTheDocument();
    expect(screen.getByText(/mock signin form/i)).toBeInTheDocument();
    expect(screen.getByText(/dialogopen =/i)).toBeInTheDocument();
    expect(screen.getByText(/props = test1/i)).toBeInTheDocument();
    expect(screen.getByRole('link', {
      name: /privacy/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/privacy/');
    expect(screen.getByRole('link', {
      name: /terms of service/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/terms-of-service/');
    expect(screen.getByRole('link', {
      name: /support/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/support/');
  });
  test('should test the concur signin when the signin state is not success and when mfa is required and is a account user and has no noOfDays', () => {
    initConcurSignIn({test: 'test1'}, {
      authData: {
        signup: {
          status: 'incomplete',
        },
        mfaRequired: true,
        mfaAuthInfo: {
          isAccountUser: true,
          noOfDays: undefined,
        },
      },
    });
    expect(screen.getByRole('img', {
      name: /sapconcur/i,
    })).toHaveAttribute('src', '/images/celigo-sapconcur.png');
    expect(screen.getByRole('heading', {
      name: /authenticate with one-time passcode/i,
    })).toBeInTheDocument();
    expect(screen.getByText(
      /your account owner or admin has required you to sign in using multifactor authentication \(mfa\)\. enter your passcode to verify your account\./i
    )).toBeInTheDocument();
    expect(screen.getByText(/user_sign_in\.new_user_io/i)).toBeInTheDocument();
    expect(screen.getByText(/mock signin form/i)).toBeInTheDocument();
    expect(screen.getByText(/dialogopen =/i)).toBeInTheDocument();
    expect(screen.getByText(/props = test1/i)).toBeInTheDocument();
    expect(screen.getByRole('link', {
      name: /privacy/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/privacy/');
    expect(screen.getByRole('link', {
      name: /terms of service/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/terms-of-service/');
    expect(screen.getByRole('link', {
      name: /support/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/support/');
  });
  test('should test the concur signin when the signin state is not success and when mfa is required and is not a account user', () => {
    initConcurSignIn({test: 'test1'}, {
      authData: {
        signup: {
          status: 'incomplete',
        },
        mfaRequired: true,
        mfaAuthInfo: {
          isAccountUser: false,
          noOfDays: undefined,
        },
      },
    });
    expect(screen.getByRole('img', {
      name: /sapconcur/i,
    })).toHaveAttribute('src', '/images/celigo-sapconcur.png');
    expect(screen.getByRole('heading', {
      name: /authenticate with one-time passcode/i,
    })).toBeInTheDocument();
    expect(screen.getByText(
      /you are signing in from a new device\. enter your passcode to verify your account\./i
    )).toBeInTheDocument();
    expect(screen.getByText(/user_sign_in\.new_user_io/i)).toBeInTheDocument();
    expect(screen.getByText(/mock signin form/i)).toBeInTheDocument();
    expect(screen.getByText(/dialogopen =/i)).toBeInTheDocument();
    expect(screen.getByText(/props = test1/i)).toBeInTheDocument();
    expect(screen.getByRole('link', {
      name: /privacy/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/privacy/');
    expect(screen.getByRole('link', {
      name: /terms of service/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/terms-of-service/');
    expect(screen.getByRole('link', {
      name: /support/i,
    })).toHaveAttribute('href', 'https://www.celigo.com/support/');
  });
});
