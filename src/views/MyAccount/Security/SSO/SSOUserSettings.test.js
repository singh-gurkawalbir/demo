import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import SSOUserSettings from './SSOUserSettings';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import { runServer } from '../../../../test/api/server';
import { getCreatedStore } from '../../../../store';

let initialStore;

async function initSSOUserSettings() {
  mutateStore(initialStore, draft => {
    draft.user.preferences = {
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm:ss a',
      defaultAShareId: 'ashareId123',
    };
    draft.user.profile = {
      id: '123456789',
      name: 'Test Profile',
    };
    draft.user.org.accounts = [
      {
        _id: 'ashareId123',
        accessLevel: 'administrator',
        accountSSORequired: false,
        ownerUser: {
          _id: '12345',
          _ssoClientId: 'client123',
          company: 'Test Company',
        },
      },
    ];
  });
  const ui = (
    <MemoryRouter>
      <SSOUserSettings />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

describe('testsuite for SSOUserSettings', () => {
  runServer();

  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should able to test the user setting by selecting an SSO account and save the settings', async () => {
    await initSSOUserSettings();
    expect(screen.getByText(/my user/i)).toBeInTheDocument();
    expect(screen.getByText(/use this account for sso/i)).toBeInTheDocument();
    let useThisAccountForSSOHelpText;

    waitFor(async () => {
      useThisAccountForSSOHelpText = document.querySelector('div > div:nth-child(1) > button');

      expect(useThisAccountForSSOHelpText).toBeInTheDocument();
      await userEvent.click(useThisAccountForSSOHelpText);
      expect(screen.getByRole('heading', {name: /use this account for sso/i})).toBeInTheDocument();
      // checking help text for use this account for SSO
      expect(screen.getByText(/choose the account that you would like to use for sso\. every time you sign in via sso, integrator\.io will verify that the sso provider is linked to this specific account\./i)).toBeInTheDocument();
      expect(screen.getByText(/was this helpful\?/i)).toBeInTheDocument();
    });
    waitFor(async () => {
      const helpTextYesButtonNode = document.querySelector('button[data-test="yesContentHelpful"] *');

      expect(helpTextYesButtonNode).toBeInTheDocument();

      await userEvent.click(helpTextYesButtonNode);
      expect(screen.queryByRole('heading', {name: /use this account for sso/i})).not.toBeInTheDocument();
      await userEvent.click(useThisAccountForSSOHelpText);
    });
    waitFor(async () => {
      const helpTextNoButtonNode = document.querySelector('button[data-test="noContentHelpful"]');

      expect(helpTextNoButtonNode).toBeInTheDocument();
      await userEvent.click(helpTextNoButtonNode);
    });
  });
});

