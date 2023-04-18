import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import SSOAccountSettings from './SSOAccountSettings';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import { runServer } from '../../../../test/api/server';
import { getCreatedStore } from '../../../../store';
import * as dynaSubmitMock from '../../../../components/DynaForm/DynaSubmit';
import { ConfirmDialogProvider } from '../../../../components/ConfirmDialog';

let initialStore;

async function initSSOAccountSettings({defaultAShareIdValue, accountsValue, ssoClientsValues, commsURL, commsStatus} = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.ssoclients = ssoClientsValues;
    draft.user.preferences = {defaultAShareId: defaultAShareIdValue};
    draft.user.org = {
      accounts: accountsValue,
    };
    draft.comms.networkComms[commsURL] = commsStatus;
  });
  const ui = (
    <ConfirmDialogProvider>
      <MemoryRouter>
        <SSOAccountSettings />
      </MemoryRouter>
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, { initialStore });
}
const mockHandleSubmit = jest.fn().mockReturnValue({
  formVal: {
    orgId: 'testorg',
    oidc: {
      issuerURL: 'https://test.com',
      clientId: 'sampleClientId',
      clientSecret: '******',
    },
  },
});

jest.mock('../../../../utils/resource', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../utils/resource'),
  generateNewId: () => 'new-fakeid',
}));
jest.mock('../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/LoadResources'),
  default: props => (
    props.children
  ),
}));
jest.mock('../../../../components/DynaForm/DynaSubmit', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/DynaForm/DynaSubmit'),
  default: props => {
    const { formVal } = mockHandleSubmit();
    const handleClick = () => {
      props.onClick(formVal);
    };

    return (
      <>
        <button type="button" onClick={handleClick} data-testid="text_button_1">
          Save
        </button>
      </>
    );
  },
}));
describe('testsuite for SSO Account Settings', () => {
  // eslint-disable-next-line jest/prefer-spy-on
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

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
  test('should test the SSO when OIDC-based is disabled and click on switch button to enable', async () => {
    await initSSOAccountSettings({
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
        ownerUser: {
          licenses: [{
            _id: '65477',
            type: 'endpoint',
            tier: 'premium',
            expires: '2023-12-31T00:00:00.000Z',
            trialEndDate: '2019-09-13T11:22:55.872Z',
            supportTier: 'preferred',
            sandbox: true,
            resumable: false,
            sso: true,
          }],
        },
      }],
      ssoClientsValues: [
        {
          type: 'oidc',
          disabled: true,
        },
      ],
      commsURL: 'PATCH:/ssoclients/new-fakeid',
      commsStatus: {
        status: 'success',
      },
    });
    expect(screen.getByRole('button', {name: /account settings/i})).toBeInTheDocument();
    expect(screen.getByText(/enable oidc-based sso/i)).toBeInTheDocument();
    const switchButtonNode = document.querySelector('div > div > div > div:nth-child(2) > div > div > div > div > div > div > div');

    expect(switchButtonNode).toHaveAttribute('class', expect.stringContaining('react-toggle'));
    await userEvent.click(switchButtonNode);
    expect(switchButtonNode).toHaveAttribute('class', expect.stringContaining('react-toggle react-toggle--checked react-toggle--focus'));
  });
  test('should test the SSO when OIDC-based is enabled and should test the loading spinner when isEnableSSOSwitchInProgress is true', async () => {
    await initSSOAccountSettings({
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
        ownerUser: {
          licenses: [{
            _id: '65477',
            type: 'endpoint',
            tier: 'premium',
            expires: '2023-12-31T00:00:00.000Z',
            trialEndDate: '2019-09-13T11:22:55.872Z',
            supportTier: 'preferred',
            sandbox: true,
            resumable: false,
            sso: true,
          }],
        },
      }],
      ssoClientsValues: [{type: 'oidc'}],
      commsURL: 'PATCH:/ssoclients/new-fakeid',
      commsStatus: {
        status: 'loading',
      },
    });
    expect(document.querySelector('circle').getAttribute('class')).toEqual(expect.stringContaining('MuiCircularProgress-'));
  });
  test('should test the SSO and enable OIDC-based switch and should test the form', async () => {
    await initSSOAccountSettings({
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
        ownerUser: {
          licenses: [{
            _id: '65477',
            type: 'endpoint',
            tier: 'premium',
            expires: '2023-12-31T00:00:00.000Z',
            trialEndDate: '2019-09-13T11:22:55.872Z',
            supportTier: 'preferred',
            sandbox: true,
            resumable: false,
            sso: true,
          }],
        },
      }],
      ssoClientsValues: [{
        _id: '12345',
        type: 'oidc',
        orgId: 'testorg',
        oidc: {
          issuerURL: 'https://test.com',
          clientId: 'sampleClientId',
          clientSecret: '******',
        },
      }],
      commsURL: 'PATCH:/ssoclients/12345',
      commsStatus: {
        status: 'success',
      },
    });
    const switchButtonNode = document.querySelector('div > div > div > div:nth-child(2) > div > div > div > div > div > div > div');

    expect(switchButtonNode).toHaveAttribute('class', expect.stringContaining('react-toggle react-toggle--checked'));
    await userEvent.click(switchButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'RESOURCE_PATCH',
      resourceType: 'ssoclients',
      id: '12345',
      patchSet: [{ op: 'add', path: '/disabled', value: true }],
      asyncKey: undefined,
    });
  });
  test('should test the SSO when OIDC-based is enabled and should test the form', async () => {
    await initSSOAccountSettings({
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
        ownerUser: {
          licenses: [{
            _id: '65477',
            type: 'endpoint',
            tier: 'premium',
            expires: '2023-12-31T00:00:00.000Z',
            trialEndDate: '2019-09-13T11:22:55.872Z',
            supportTier: 'preferred',
            sandbox: true,
            resumable: false,
            sso: true,
          }],
        },
      }],
      ssoClientsValues: [{type: 'oidc'}],
    });
    expect(screen.getByText(/issuer url/i)).toBeInTheDocument();
    expect(screen.getByText(/client id/i)).toBeInTheDocument();
    expect(screen.getByText(/client secret/i)).toBeInTheDocument();
    expect(screen.getByText(/organization id/i)).toBeInTheDocument();
    const issueURLInputNode = document.querySelector('#issuerURL > div > div > div:nth-child(2) > div > input');

    expect(issueURLInputNode).toBeInTheDocument();
    await userEvent.type(issueURLInputNode, 'https://test.com');
    const clientIdInputNode = document.querySelector('#clientId > div > div > div:nth-child(2) > div > input');

    expect(clientIdInputNode).toBeInTheDocument();
    await userEvent.type(clientIdInputNode, 'sampleClientId');

    const clientSecretInputNode = document.querySelector('#clientSecret > div > div > div:nth-child(2) > div > input');

    expect(clientSecretInputNode).toBeInTheDocument();
    await userEvent.type(clientSecretInputNode, '12345');

    const orgIdInputNode = document.querySelector('#orgId > div > div > div > div:nth-child(2) > div > input');

    expect(orgIdInputNode).toBeInTheDocument();
    await userEvent.type(orgIdInputNode, 'testorg');
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'SSO_ORG_ID_VALIDATION_REQUEST', orgId: 'testorg' }));
  });
  test('should test the SSO Account settings page by clicking switch button', async () => {
    await initSSOAccountSettings({
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
        ownerUser: {
          licenses: [{
            _id: '65477',
            type: 'endpoint',
            tier: 'premium',
            expires: '2023-12-31T00:00:00.000Z',
            trialEndDate: '2019-09-13T11:22:55.872Z',
            supportTier: 'preferred',
            sandbox: true,
            resumable: false,
            sso: true,
          }],
        },
      }],
      ssoClientsValues: [{
        _id: '12345',
        type: 'oidc',
        orgId: 'testorg',
        disabled: true,
        oidc: {
          issuerURL: 'https://test.com',
          clientId: 'sampleClientId',
          clientSecret: '******',
        },
      }],
    });
    expect(screen.getByText(/account settings/i)).toBeInTheDocument();
    expect(screen.getByText(/enable oidc-based sso/i)).toBeInTheDocument();
    const switchButtonNode = document.querySelector('div > div > div > div:nth-child(2) > div > div > div > div > div > div > div');

    expect(switchButtonNode).toBeInTheDocument();
    await userEvent.click(switchButtonNode);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'RESOURCE_PATCH',
      resourceType: 'ssoclients',
      id: '12345',
      patchSet: [{ op: 'remove', path: '/disabled' }],
      asyncKey: undefined,
    }));
  });
  test('should test the existing SSO Account settings by clicking on save button', async () => {
    await initSSOAccountSettings({
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
        ownerUser: {
          licenses: [{
            _id: '65477',
            type: 'endpoint',
            tier: 'premium',
            expires: '2023-12-31T00:00:00.000Z',
            trialEndDate: '2019-09-13T11:22:55.872Z',
            supportTier: 'preferred',
            sandbox: true,
            resumable: false,
            sso: true,
          }],
        },
      }],
      ssoClientsValues: [{
        _id: '12345',
        type: 'oidc',
        orgId: 'testorg',
        disable: false,
        oidc: {
          issuerURL: 'https://test.com',
          clientId: 'sampleClientId',
          clientSecret: '******',
        },
      }],
    });
    expect(screen.getByText(/account settings/i)).toBeInTheDocument();
    expect(screen.getByText(/enable oidc-based sso/i)).toBeInTheDocument();
    const saveButtonNode = screen.getByRole('button', {name: 'Save'});

    expect(saveButtonNode).toBeInTheDocument();
    await userEvent.click(saveButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'RESOURCE_STAGE_PATCH_AND_COMMIT',
      resourceType: 'ssoclients',
      id: '12345',
      patch: [
        { op: 'replace', path: '/orgId', value: 'testorg' },
        { op: 'replace', path: '/oidc/issuerURL', value: undefined },
        { op: 'replace', path: '/oidc/clientId', value: undefined },
        { op: 'replace', path: '/oidc/clientSecret', value: undefined },
      ],
      options: undefined,
      context: undefined,
      parentContext: undefined,
      asyncKey: undefined,
    });
  });
  test('should test the new SSO Account settings by clicking on save button', async () => {
    const mockHandleSubmit1 = jest.fn().mockReturnValue({
      formVal: {
        orgId: 'testorg',
        issuerURL: 'https://test.com',
        clientId: 'sampleClientId',
        clientSecret: '******',
      },
    });

    jest.spyOn(dynaSubmitMock, 'default').mockImplementation(props => {
      const { formVal } = mockHandleSubmit1();
      const handleClick = () => {
        props.onClick(formVal);
      };

      return (
        <>
          <button type="button" onClick={handleClick} data-testid="text_button_1">
            Save
          </button>
        </>
      );
    });
    await initSSOAccountSettings({
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
        ownerUser: {
          licenses: [{
            _id: '65477',
            type: 'endpoint',
            tier: 'premium',
            expires: '2023-12-31T00:00:00.000Z',
            trialEndDate: '2019-09-13T11:22:55.872Z',
            supportTier: 'preferred',
            sandbox: true,
            resumable: false,
            sso: true,
          }],
        },
      }],
      ssoClientsValues: [{
        type: 'oidc',
        disable: false,
      }],
    });
    expect(screen.getByText(/account settings/i)).toBeInTheDocument();
    expect(screen.getByText(/enable oidc-based sso/i)).toBeInTheDocument();
    const saveButtonNode = screen.getByRole('button', {name: 'Save'});

    expect(saveButtonNode).toBeInTheDocument();
    await userEvent.click(saveButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'RESOURCE_STAGE_PATCH_AND_COMMIT',
      resourceType: 'ssoclients',
      id: 'new-fakeid',
      patch: [
        { op: 'add', path: '/orgId', value: 'testorg' },
        { op: 'add', path: '/oidc', value: {} },
        { op: 'add', path: '/type', value: 'oidc' },
        { op: 'add', path: '/oidc/issuerURL', value: 'https://test.com' },
        { op: 'add', path: '/oidc/clientId', value: 'sampleClientId' },
        { op: 'add', path: '/oidc/clientSecret', value: '******' },
      ],
      options: undefined,
      context: undefined,
      parentContext: undefined,
      asyncKey: undefined,
    });
  });
  test('should test the SSO page when there is no license and click on request upgrade', async () => {
    mutateStore(initialStore, draft => {
      draft.session.resource = {
        ssoLicenseUpgradeRequested: false,
      };
    });
    await initSSOAccountSettings({
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
        ownerUser: {
          licenses: [{}],
        },
      }],
    });
    expect(screen.getByText(/account settings/i)).toBeInTheDocument();
    expect(screen.getByText(/single sign-on is a premium feature that is not included in your account’s current subscription plan\./i)).toBeInTheDocument();
    expect(screen.getByText(/Upgrade your account to make signing in easier and more secure./i)).toBeInTheDocument();
    const requestUpgradeButton = screen.getByRole('button', {name: /request upgrade/i});

    expect(requestUpgradeButton).toBeInTheDocument();
    await userEvent.click(requestUpgradeButton);
    await waitFor(() => expect(screen.getByText(/we will contact you to discuss your business needs and recommend an ideal subscription plan\./i)).toBeInTheDocument());
    const cancelButtonNode = screen.getAllByRole('button').find(eachOption => eachOption.getAttribute('data-test') === 'Cancel');

    expect(cancelButtonNode).toBeInTheDocument();
    await userEvent.click(cancelButtonNode);
    await waitFor(() => expect(cancelButtonNode).not.toBeInTheDocument());
    await userEvent.click(requestUpgradeButton);
    const submitRequestButtonNode = screen.getAllByRole('button').find(eachOption => eachOption.getAttribute('data-test') === 'Submit request');

    expect(submitRequestButtonNode).toBeInTheDocument();
    await userEvent.click(submitRequestButtonNode);
    await waitFor(() => expect(screen.getByText(/upgrade requested/i)).toBeInTheDocument());
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'LICENSE_UPDATE_REQUEST',
      actionType: 'upgrade',
      connectorId: undefined,
      licenseId: undefined,
      feature: 'SSO',
    });
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'SSO_LICENSE_UPGRADE_REQUESTED' });
  });
  test('should test the SSO page when licence is requested', async () => {
    mutateStore(initialStore, draft => {
      draft.session.resource = {
        platformLicenseActionMessage: 'Thanks for your request! We will be in touch soon.',
        ssoLicenseUpgradeRequested: true,
      };
    });
    await initSSOAccountSettings({
      defaultAShareIdValue: 'own',
      accountsValue: [{
        _id: 'own',
        accessLevel: 'owner',
        ownerUser: {
          licenses: [{}],
        },
      }],
    });
    expect(screen.getByText(/thanks for your request! we will be in touch soon\./i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {name: /close/i});

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    await waitFor(() => expect(closeButtonNode).not.toBeInTheDocument());
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'LICENSE_CLEAR_ACTION_MESSAGE' });
  });
});
