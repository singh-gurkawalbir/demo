
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen} from '@testing-library/react';
import VerifyTag from './index';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';

const initialStore = reduxStore;

function initVerifyTag(props = {}) {
  const ui = (
    <VerifyTag {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('verifyTag UI test cases', () => {
  test('should display verifying when status is set to requested', () => {
    mutateStore(initialStore, draft => {
      draft.session.sso = {
        status: 'requested',
      };
    });
    initVerifyTag();
    const progressBar = screen.getByRole('progressbar');

    expect(progressBar).toBeInTheDocument();
    expect(screen.getByText('Verifying...')).toBeInTheDocument();
  });
  test('should display error message when error is provided', () => {
    const data =
    {
      error: 'someerror',
    };

    mutateStore(initialStore, draft => {
      draft.session.sso = {
        status: 'success',
      };
    });
    initVerifyTag(data);
    expect(screen.getByText('someerror')).toBeInTheDocument();
  });
  test('should display verifying when status is set to success', () => {
    mutateStore(initialStore, draft => {
      draft.session.sso = {
        status: 'success',
      };
    });
    initVerifyTag();
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });
});
