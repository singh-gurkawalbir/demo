
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Security from '.';
import { getCreatedStore } from '../../../../store';
import { runServer } from '../../../../test/api/server';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

let initialStore;

async function initSecurity({defaultAShareIdValue, accountsValue} = {}) {
  mutateStore(initialStore, draft => {
    draft.user.preferences = {defaultAShareId: defaultAShareIdValue};
    draft.user.org = {
      accounts: accountsValue,
    };
  });
  const ui = (
    <MemoryRouter>
      <Security />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('./SSOUserSettings', () => ({
  __esModule: true,
  ...jest.requireActual('./SSOUserSettings'),
  default: () => <div>Testing SSO UserSettings</div>,
}));
jest.mock('./SSOAccountSettings', () => ({
  __esModule: true,
  ...jest.requireActual('./SSOAccountSettings'),
  default: () => <div>Testing SSO AccountSettings</div>,
}));

describe('Testsuite for security', () => {
  runServer();
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should able to render SSO Account settings when the account is of type owner', async () => {
    await initSecurity({defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
      }]});
    expect(screen.getByRole('heading', {name: /single sign-on \(sso\)/i})).toBeInTheDocument();
    const infoTextButtonNode = screen.getAllByRole('button').find(eachOption => eachOption.getAttribute('data-test') === 'openPageInfo');

    expect(infoTextButtonNode).toBeInTheDocument();
    await userEvent.click(infoTextButtonNode);
    expect(screen.getByText(/testing sso accountsettings/i)).toBeInTheDocument();
    expect(screen.getByText(/enhanced security for integrator\.io account access is available through single sign-on \(sso\)\. to enable sso for your account, you must configure settings based on the details available in your sso provider\. these details are available after you have created an account with the sso provider\./i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn more/i })).toBeInTheDocument();
  });
  test('should able to render SSO user account settings when the account type is not an owner', async () => {
    await initSecurity({defaultAShareIdValue: '123',
      accountsValue: [{
        _id: '123',
        accessLevel: 'manage',
      }]});
    expect(screen.getByRole('heading', {name: /single sign-on \(sso\)/i})).toBeInTheDocument();
    const infoTextButtonNode = screen.getAllByRole('button').find(eachOption => eachOption.getAttribute('data-test') === 'openPageInfo');

    expect(infoTextButtonNode).toBeInTheDocument();
    await userEvent.click(infoTextButtonNode);
    expect(screen.getByText(/enhanced security for integrator\.io account access is available through single sign-on \(sso\)\. if you are a part of multiple sso-enabled accounts, then you must select one account to use for sso before you authenticate for the first time\. this account is also known as the primary sso account, and you will use it for sso sign in to integrator\.io\./i)).toBeInTheDocument();
    expect(screen.getByText(/Testing SSO UserSettings/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn more/i })).toBeInTheDocument();
  });
});
