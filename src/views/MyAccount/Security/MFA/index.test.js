
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import MFA from '.';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import { runServer } from '../../../../test/api/server';
import { getCreatedStore } from '../../../../store';

let initialStore;

async function initMFA({ mfaValues = {}, defaultAShareIdValue, accountsValue, mfaSessionInfo } = {}) {
  mutateStore(initialStore, draft => {
    draft.data.mfa = mfaValues;
    draft.user.preferences = {defaultAShareId: defaultAShareIdValue};
    draft.user.org = {
      accounts: accountsValue,
    };
    draft.session.mfa.sessionInfo = mfaSessionInfo;
  });
  const ui = (
    <MemoryRouter>
      <MFA />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('./AccountSettings', () => ({
  __esModule: true,
  ...jest.requireActual('./AccountSettings'),
  default: () => <div>Testing Account Settings</div>,
}));
jest.mock('./Setup', () => ({
  __esModule: true,
  ...jest.requireActual('./Setup'),
  default: () => <div>Testing MFA Setup</div>,
}));
jest.mock('./EditConfiguration', () => ({
  __esModule: true,
  ...jest.requireActual('./EditConfiguration'),
  default: () => <div>Testing EditConfiguration</div>,
}));

describe('Testsuite for MFA', () => {
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
  test('should test the spinner when MFA setup is incomplete and when the user settings are not loaded', async () => {
    await initMFA({
      mfaValues: {
        status: {
          userSettings: 'inProgress',
        },
      },
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
      }],
      mfaSessionInfo: {
        data: {
          mfaRequired: false,
          mfaSetupRequired: false,
          mfaVerified: false,
        },
      },
    });

    expect(screen.getByRole('heading', { name: /multifactor authentication \(mfa\)/i })).toBeInTheDocument();
    expect(screen.getByText(/my user/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText(/Testing Account Settings/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'MFA_USER_SETTINGS_REQUEST' });
  });
  test('should test the MFA when setup is not completed and user settings are not loaded and test the link of warning sign', async () => {
    await initMFA({
      mfaValues: {
        status: {
          userSettings: 'inProgress',
        },
      },
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
      }],
      mfaSessionInfo: {
        data: {
          mfaRequired: true,
          mfaSetupRequired: true,
          mfaVerified: false,
        },
      },
    });

    expect(document.querySelector('#client-snackbar')).toBeInTheDocument();
    expect(screen.getByText(/you are required to enable mfa before you can continue in this account\./i)).toBeInTheDocument();
    const linkNode = screen.getByRole('link', {name: 'Learn more'});

    expect(linkNode.getAttribute('href')).toBe('https://docs.celigo.com/hc/en-us/articles/7127009384987-Set-up-multifactor-authentication-MFA-for-your-account');
  });
  test('should the toggle button be disabled when MFA setup is not completed and user settings are loaded', async () => {
    await initMFA({
      mfaValues: {
        status: {
          enabled: false,
          userSettings: 'received',
        },
      },
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
      }],
      mfaSessionInfo: {
        data: {
          mfaRequired: true,
          mfaSetupRequired: true,
          mfaVerified: false,
        },
      },
    });

    expect(screen.getByText('Enable MFA')).toBeInTheDocument();
    waitFor(async () => {
      const checkBoxNode = screen.getAllByRole('checkbox').find(eachOption => eachOption.getAttribute('data-test') === 'mfa-switch-button');

      expect(checkBoxNode).toBeInTheDocument();
      expect(checkBoxNode).toBeDisabled();
      await userEvent.click(checkBoxNode);
      expect(checkBoxNode).not.toBeEnabled();
      expect(screen.getByText(/Testing MFA Setup/i)).toBeInTheDocument();
    });
  });
  test('should test the MFA when setup is not completed and user settings are loaded and test the MFA setup text', async () => {
    const { utils } = await initMFA({
      mfaValues: {
        userSettings: {
          enabled: false,
          setupComplete: false,
        },
        status: {
          userSettings: 'received',
        },
      },
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
      }],
      mfaSessionInfo: {
        data: {
          mfaRequired: false,
          mfaSetupRequired: false,
          mfaVerified: true,
        },
      },
    });

    expect(screen.getByText('Enable MFA')).toBeInTheDocument();
    waitFor(async () => {
      const checkBoxNode = screen.getAllByRole('checkbox').find(eachOption => eachOption.getAttribute('data-test') === 'mfa-switch-button');

      expect(checkBoxNode).toBeInTheDocument();
      expect(utils.container.querySelector('div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div > div > div > div > span > button > span > div').className).toEqual(expect.stringContaining('makeStyles-customSwitch-'));
      await userEvent.click(checkBoxNode);
      expect(utils.container.querySelector('div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div > div > div > div > span > button > span > div').className).toEqual(expect.stringContaining('react-toggle--checked'));
      expect(screen.getByText(/Testing MFA Setup/i)).toBeInTheDocument();
    });
  });
  test('should test the MFA when setup is completed and user settings are loaded and test the MFA edit configuration page', async () => {
    const { utils } = await initMFA({
      mfaValues: {
        userSettings: {
          enabled: true,
          setupComplete: true,
        },
        status: {
          userSettings: 'received',
        },
      },
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
      }],
      mfaSessionInfo: {
        data: {
          mfaRequired: true,
          mfaSetupRequired: false,
          mfaVerified: true,
        },
      },
    });

    expect(screen.getByText('Enable MFA')).toBeInTheDocument();
    waitFor(async () => {
      const checkBoxNode = screen.getAllByRole('checkbox').find(eachOption => eachOption.getAttribute('data-test') === 'mfa-switch-button');

      expect(checkBoxNode).toBeInTheDocument();
      expect(utils.container.querySelector('div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div > div > div > div > span > button > span > div').className).toEqual(expect.stringContaining('react-toggle--checked'));
      expect(screen.getByText(/Testing EditConfiguration/i)).toBeInTheDocument();
      await userEvent.click(checkBoxNode);
      expect(mockDispatchFn).toHaveBeenCalledWith({
        type: 'MFA_USER_SETTINGS_SETUP',
        mfaConfig: { enabled: false, setupComplete: true, context: 'switch' },
      });
    });
  });
});
