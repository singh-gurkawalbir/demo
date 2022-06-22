/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import actions from '../../../actions';
import { renderWithProviders } from '../../../test/test-utils';
import TileNotification from '.';
import { ConfirmDialogProvider } from '../../ConfirmDialog';
import { runServer } from '../../../test/api/server';

const props = {
  content: 'Your subscription expired on 03/31/2022. Contact sales to renew your subscription.',
  showTrialLicenseMessage: false,
  expired: true,
  connectorId: '57c8199e8489cc1a298cc6ea',
  trialExpired: false,
  licenseId: '5cdd11eec6cf5f2ec5ca74b4',
  tileStatus: 'success',
  isIntegrationV2: false,
  integrationId: '5e7474a85fede957b6e1ff27',
  resumable: false,
  accessLevel: 'manage',
};

const props1 = {
  content: 'Your subscription has been renewed. Click Reactivate to continue.',
  showTrialLicenseMessage: false,
  expired: false,
  connectorId: '57c8199e8489cc1a298cc6ea',
  trialExpired: false,
  licenseId: '5bceb6b51de6a24df7642d46',
  tileStatus: 'success',
  isIntegrationV2: false,
  integrationId: '5e982de03a5827019768ac89',
  mode: 'settings',
  name: 'Cash Application Manager for NetSuite',
  _connectorId: '57c8199e8489cc1a298cc6ea',
  resumable: true,
  accessLevel: 'manage',
};
const props3 = {
  content: 'Buy the Integration',
  showTrialLicenseMessage: true,
  expired: false,
  connectorId: '57c8199e8489cc1a298cc6ea',
  trialExpired: false,
  licenseId: '5f5f3541c819d4674ae24404',
  tileStatus: 'is_pending_setup',
  isIntegrationV2: true,
  integrationId: '5f5f35863a46da41054e8d55',
  mode: 'settings',
  name: 'Cash Application Manager for NetSuite',
  _connectorId: '57c8199e8489cc1a298cc6ea',
  resumable: true,
  accessLevel: 'manage',
};

const props4 = {
  content: 'Request to buy the Integration or cancel',
  showTrialLicenseMessage: true,
  expired: false,
  connectorId: '57c8199e8489cc1a298cc6ea',
  trialExpired: true,
  licenseId: '5f5f3541c819d4674ae24404',
  tileStatus: 'success',
  isIntegrationV2: false,
  integrationId: '5f5f35863a46da41054e8d55',
  mode: 'settings',
  name: 'Cash Application Manager for NetSuite',
  _connectorId: '57c8199e8489cc1a298cc6ea',
  resumable: true,
  accessLevel: 'administrator',
};

const props5 = {
  content: 'Request to renew Integration',
  showTrialLicenseMessage: false,
  expired: false,
  connectorId: '57c8199e8489cc1a298cc6ea',
  trialExpired: false,
  licenseId: '5f5f3541c819d4674ae24404',
  tileStatus: 'is_pending_setup',
  isIntegrationV2: false,
  integrationId: '5f5f35863a46da41054e8d55',
  mode: 'settings',
  name: 'Cash Application Manager for NetSuite',
  _connectorId: '57c8199e8489cc1a298cc6ea',
  resumable: false,
  accessLevel: 'manage',
};

const props6 = {
  content: 'Buy the Integration and will send the request',
  showTrialLicenseMessage: true,
  expired: false,
  connectorId: '57c8199e8489cc1a298cc6ea',
  trialExpired: true,
  licenseId: '5f5f3541c819d4674ae24404',
  tileStatus: 'success',
  isIntegrationV2: false,
  integrationId: '5f5f35863a46da41054e8d55',
  mode: 'settings',
  name: 'Cash Application Manager for NetSuite',
  _connectorId: '57c8199e8489cc1a298cc6ea',
  resumable: false,
  accessLevel: 'manage',
};

describe('Testing Tile Notification Component', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'LICENSE_UPDATE_REQUEST':
        //   initialStore.getState().session.loadResources.ssoclients = 'received';
        //   initialStore.getState().data.resources.ssoclients = [];
        //   initialStore.getState().comms.networkComms['GET:/ssoclients'] = {
        //     status: 'success',
        //     hidden: false,
        //     refresh: false,
        //     method: 'GET',
        //   };
          break;
        case 'INTEGRATION_APPS_LICENSE_RESUME':
        //   initialStore.getState().session.loadResources.ssoclients = 'received';
        //   initialStore.getState().data.resources.ssoclients = [];
        //   initialStore.getState().comms.networkComms['GET:/ssoclients'] = {
        //     status: 'success',
        //     hidden: false,
        //     refresh: false,
        //     method: 'GET',
        //   };
          break;

        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('Should render the data provided', async () => {
    renderWithProviders(<ConfirmDialogProvider><MemoryRouter> <TileNotification {...props} /></MemoryRouter></ConfirmDialogProvider>);
    const subscription = screen.getByText('Your subscription expired on 03/31/2022. Contact sales to renew your subscription.');

    expect(subscription).toBeInTheDocument();
    const renew = screen.getByText('Request to renew');

    expect(renew).toBeInTheDocument();
    const uninstall = screen.getByText('Uninstall');

    expect(uninstall).toBeInTheDocument();
    userEvent.click(renew);
    const submit = screen.getByText('Submit request');

    expect(submit).toBeInTheDocument();
    userEvent.click(submit);
    await expect(mockDispatchFn).toBeCalledWith(actions.license.requestUpdate('connectorRenewal', props.connectorId, props.licenseId));
    expect(submit).not.toBeInTheDocument();
  });

  test('test1', async () => {
    renderWithProviders(<ConfirmDialogProvider><MemoryRouter> <TileNotification {...props1} /></MemoryRouter></ConfirmDialogProvider>);

    const content = screen.getByText('Your subscription has been renewed. Click Reactivate to continue.');

    expect(content).toBeInTheDocument();
    const reactivate = screen.getByText('Request to reactivate');

    expect(reactivate).toBeInTheDocument();

    userEvent.click(reactivate);
    const message = screen.getByText('Contact your account owner to reactivate this integration app.');

    expect(message).toBeInTheDocument();
  });

  test('Request to Buy single button', async () => {
    renderWithProviders(<ConfirmDialogProvider><MemoryRouter> <TileNotification {...props3} /></MemoryRouter></ConfirmDialogProvider>);

    const content = screen.getByText('Buy the Integration');

    expect(content).toBeInTheDocument();
    const message = screen.getByText('Request to buy');

    expect(message).toBeInTheDocument();
    userEvent.click(message);

    const dialogMessage = screen.getByText('We will contact you to buy your subscription.');

    expect(dialogMessage).toBeInTheDocument();

    const cancelMessage = screen.getByText('Cancel');

    expect(cancelMessage).toBeInTheDocument();
    userEvent.click(cancelMessage);

    expect(cancelMessage).not.toBeInTheDocument();
    userEvent.click(message);

    const submitMessage = screen.getByText('Submit request');

    expect(submitMessage).toBeInTheDocument();
    userEvent.click(submitMessage);

    await expect(mockDispatchFn).toBeCalledWith(actions.license.requestUpdate('connectorRenewal', props3.connectorId, props3.licenseId));
    expect(submitMessage).not.toBeInTheDocument();
  });

  test('Request to Buy with multiple buttons', async () => {
    renderWithProviders(<ConfirmDialogProvider><MemoryRouter> <TileNotification {...props4} /></MemoryRouter></ConfirmDialogProvider>);

    const content = screen.getByText('Request to buy the Integration or cancel');

    expect(content).toBeInTheDocument();
    const message = screen.getByText('Request to buy');

    expect(message).toBeInTheDocument();
    const errorMessage = screen.getByText('Uninstall');

    expect(errorMessage).toBeInTheDocument();
    userEvent.click(message);
    const dialogMessage = screen.getByText('We will contact you to reactivate your subscription.');

    expect(dialogMessage).toBeInTheDocument();
    const dialogSubmitButton = screen.getByText('Submit request');

    expect(dialogSubmitButton).toBeInTheDocument();
    const dialogCancelButton = screen.getByText('Cancel');

    expect(dialogCancelButton).toBeInTheDocument();
    userEvent.click(dialogSubmitButton);
    await expect(mockDispatchFn).toBeCalledWith(actions.integrationApp.license.resume(props4.integrationId));
    expect(dialogMessage).not.toBeInTheDocument();
  });

  test('Request to Renew single button', async () => {
    renderWithProviders(<ConfirmDialogProvider><MemoryRouter> <TileNotification {...props5} /></MemoryRouter></ConfirmDialogProvider>);

    const content = screen.getByText('Request to renew Integration');

    expect(content).toBeInTheDocument();
    const renewButton = screen.getByText('Request to renew');

    expect(renewButton).toBeInTheDocument();
    userEvent.click(renewButton);
    const dialogMessage = screen.getByText('We will contact you to renew your subscription.');

    expect(dialogMessage).toBeInTheDocument();
    const submitButton = screen.getByText('Submit request');

    expect(submitButton).toBeInTheDocument();
    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeInTheDocument();
    userEvent.click(submitButton);
    await expect(mockDispatchFn).toBeCalledWith(actions.license.requestUpdate('connectorRenewal', props5.connectorId, props5.licenseId));
    expect(submitButton).not.toBeInTheDocument();
  });

  test('Request to buy with multiple buttons and it should send a request to buy the subscription', async () => {
    renderWithProviders(<ConfirmDialogProvider><MemoryRouter> <TileNotification {...props6} /></MemoryRouter></ConfirmDialogProvider>);

    const content = screen.getByText('Buy the Integration and will send the request');

    expect(content).toBeInTheDocument();
    const message = screen.getByText('Request to buy');

    expect(message).toBeInTheDocument();
    const errorMessage = screen.getByText('Uninstall');

    expect(errorMessage).toBeInTheDocument();
    userEvent.click(message);

    const dialogMessage = screen.getByText('We will contact you to buy your subscription.');

    expect(dialogMessage).toBeInTheDocument();
    const submitButton = screen.getByText('Submit request');

    expect(submitButton).toBeInTheDocument();
    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeInTheDocument();
    userEvent.click(submitButton);
    await expect(mockDispatchFn).toBeCalledWith(actions.license.requestUpdate('connectorRenewal', props6.connectorId, props6.licenseId));
    expect(submitButton).not.toBeInTheDocument();
    userEvent.click(errorMessage);
    const uninstallMessage = screen.getByText('Contact your account owner to uninstall this integration app.');

    expect(uninstallMessage).toBeInTheDocument();
  });
});
