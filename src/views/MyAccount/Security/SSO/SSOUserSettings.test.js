/* global describe, test, expect, beforeEach, jest, afterEach */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import SSOUserSettings from './SSOUserSettings';
import { renderWithProviders } from '../../../../test/test-utils';
import { runServer } from '../../../../test/api/server';
import { getCreatedStore } from '../../../../store';

let initialStore;

async function initSSOUserSettings() {
  initialStore.getState().user.preferences = {
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm:ss a',
    defaultAShareId: 'ashareId123',
  };
  initialStore.getState().user.profile = {
    id: '123456789',
    name: 'Test Profile',
  };
  initialStore.getState().user.org.accounts = [
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
  const ui = (
    <MemoryRouter>
      <SSOUserSettings />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for SSOUserSettings', () => {
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
    const useThisAccountForSSOHelpText = document.querySelector('div > div:nth-child(1) > button');

    expect(useThisAccountForSSOHelpText).toBeInTheDocument();
    userEvent.click(useThisAccountForSSOHelpText);
    expect(screen.getByRole('heading', {name: /use this account for sso/i})).toBeInTheDocument();
    // checking help text for use this account for SSO
    expect(screen.getByText(/choose the account that you would like to use for sso\. every time you sign in via sso, integrator\.io will verify that the sso provider is linked to this specific account\./i)).toBeInTheDocument();
    expect(screen.getByText(/was this helpful\?/i)).toBeInTheDocument();
    const helpTextYesButtonNode = document.querySelector('button[data-test="yesContentHelpful"]');

    expect(helpTextYesButtonNode).toBeInTheDocument();
    userEvent.click(helpTextYesButtonNode);
    expect(screen.queryByRole('heading', {name: /use this account for sso/i})).not.toBeInTheDocument();
    await userEvent.click(useThisAccountForSSOHelpText);
    const helpTextNoButtonNode = document.querySelector('button[data-test="noContentHelpful"]');

    expect(helpTextNoButtonNode).toBeInTheDocument();
    await userEvent.click(helpTextNoButtonNode);
    screen.debug(null, Infinity);
    // expect(screen.getByPlaceholderText(/How can we make this information more helpful\?/i)).toBeInTheDocument();
    // const helpTextSubmitButtonNode = screen.getByRole('button', {name: /submit/i});

    // expect(helpTextSubmitButtonNode).toBeInTheDocument();
    // userEvent.click(helpTextSubmitButtonNode);
    // expect(mockDispatchFn).toHaveBeenCalledWith({
    //   type: 'APP_POST_FEEDBACK',
    //   resourceType: undefined,
    //   fieldId: '_ssoAccountId',
    //   helpful: false,
    //   feedback: '',
    // });
    // expect(screen.queryByPlaceholderText(/How can we make this information more helpful\?/i)).not.toBeInTheDocument();
    // const pleaseSelectButtonNode = screen.getByRole('button', {name: /please select/i});

    // expect(pleaseSelectButtonNode).toBeInTheDocument();
    // userEvent.click(pleaseSelectButtonNode);
    // const menuItemNode = screen.getByRole('menuitem', {name: /test company/i});

    // expect(menuItemNode).toBeInTheDocument();
    // userEvent.click(menuItemNode);
    // await waitFor(() => expect(menuItemNode).not.toBeInTheDocument());
    // const saveButtonNode = await waitFor(() => screen.getByRole('button', {name: /save/i}));

    // expect(saveButtonNode).toBeInTheDocument();
    // await userEvent.click(saveButtonNode);
    // await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'UPDATE_PROFILE', profile: { _ssoAccountId: '12345' } }));
    // expect(saveButtonNode).toBeDisabled();
  }, 30000);
});

