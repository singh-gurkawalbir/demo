
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import DynaMFASecretKey from '.';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaMFASecretKey(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.mfa = {
      codes: {
        mobileCode: {
          status: props.status,
        },
        showSecretCode: props.showcode,
        secretCode: {
          secret: props.code,
        },
      },
    };
  });

  return renderWithProviders(<DynaMFASecretKey {...props} />, {initialStore});
}

describe('dynaMFASecretKey UI tests', () => {
  test('should render field with the secret key hidden initially', () => {
    initDynaMFASecretKey({label: 'form label', code: '5186Nb'});
    expect(screen.getByText('form label')).toBeInTheDocument();
    const codefield = screen.getByRole('textbox');

    expect(codefield).toHaveValue('xxxxxxxxx');
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('should display the ReAuth Modal when clicked on "View secret key" button and showSecretCode is false', async () => {
    initDynaMFASecretKey({label: 'form label'});
    const viewSecretKeyButton = screen.getByRole('button');

    expect(viewSecretKeyButton).toBeInTheDocument();
    await userEvent.click(viewSecretKeyButton);
    expect(screen.getByText('View secret key')).toBeInTheDocument();
    expect(screen.getByText('Enter your account password to view your secret key.')).toBeInTheDocument();
    expect(screen.getByText('View secret key')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    const passwordField = document.querySelector('[name="password"]');

    expect(passwordField).toBeInTheDocument();
    expect(screen.getByText('View key')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('closeModalDialog'));
    expect(screen.queryByText('View key')).toBeNull();       // indicates the closing of modal when clicked on close icon //
  });
  test('should display the secret code when clicked on "View secret key" button and showsecretcode is true in the state', async () => {
    initDynaMFASecretKey({label: 'form label', showcode: true, code: '5186Nb'});

    const viewSecretKeyButton = screen.getByRole('button');

    expect(viewSecretKeyButton).toBeInTheDocument();

    await userEvent.click(viewSecretKeyButton);
    const secretcode = screen.getByRole('textbox');

    await waitFor(() => expect(secretcode).toHaveValue('5186Nb'));
  });
  test('should display the field with hidden code back again when hide secretKey Button is clicked', async () => {
    initDynaMFASecretKey({label: 'form label', showcode: true, code: '5186Nb'});

    const viewSecretKeyButton = screen.getByRole('button');

    expect(viewSecretKeyButton).toBeInTheDocument();

    await userEvent.click(viewSecretKeyButton);
    const secretcode = screen.getByRole('textbox');

    await waitFor(() => expect(secretcode).toHaveValue('5186Nb'));

    await userEvent.click(screen.getByRole('button'));
    const hiddencode = screen.getByRole('textbox');

    await waitFor(() => expect(hiddencode).toHaveValue('xxxxxxxxx'));
  });
});
