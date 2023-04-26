
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import actions from '../../../actions';
import { renderWithProviders } from '../../../test/test-utils';
import TileNotification from '.';
import { ConfirmDialogProvider } from '../../ConfirmDialog';
import { runServer } from '../../../test/api/server';
import {message as messageStore} from '../../../utils/messageStore';

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

describe('testing Tile Notification Component', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'LICENSE_UPDATE_REQUEST':
          break;
        case 'INTEGRATION_APPS_LICENSE_RESUME':
          break;
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should able to request to renew with multiple buttons', async () => {
    renderWithProviders(
      <ConfirmDialogProvider>
        <MemoryRouter>
          <TileNotification {...props} />
        </MemoryRouter>
      </ConfirmDialogProvider>
    );
    const subscription = screen.getByText('Your subscription expired on 03/31/2022. Contact sales to renew your subscription.');

    expect(subscription).toBeInTheDocument();
    const renew = screen.getByText('Request to renew');

    expect(renew).toBeInTheDocument();
    const uninstall = screen.getByText('Uninstall');

    expect(uninstall).toBeInTheDocument();
    await userEvent.click(renew);
    const submit = screen.getByText('Submit request');

    expect(submit).toBeInTheDocument();
    await userEvent.click(submit);
    await expect(mockDispatchFn).toHaveBeenCalledWith(actions.license.requestUpdate('connectorRenewal', {connectorId: props.connectorId, licenseId: props.licenseId}));
    expect(submit).not.toBeInTheDocument();
  });

  test('should able to request to reactivate', async () => {
    renderWithProviders(
      <ConfirmDialogProvider>
        <MemoryRouter>
          <TileNotification
            {...{...props,
              content: 'Your subscription has been renewed. Click Reactivate to continue.',
              expired: false,
              resumable: true,
              mode: 'setting',
              licenseId: '5bceb6b51de6a24df7642d46',
              integrationId: '5e982de03a5827019768ac89',
              _connectorId: '57c8199e8489cc1a298cc6ea',
              name: 'Cash Application Manager for NetSuite'}}
          />
        </MemoryRouter>
      </ConfirmDialogProvider>
    );

    const content = screen.getByText('Your subscription has been renewed. Click Reactivate to continue.');

    expect(content).toBeInTheDocument();
    const reactivate = screen.getByText('Reactivate');

    expect(reactivate).toBeInTheDocument();

    await userEvent.click(reactivate);
    const message = screen.getByText(messageStore.INTEGRATION.CONTACT_OWNER);

    expect(message).toBeInTheDocument();
  });

  test('should able to request to Buy single button', async () => {
    const licenseId = '5f5f3541c819d4674ae24404';

    renderWithProviders(
      <ConfirmDialogProvider>
        <MemoryRouter>
          <TileNotification
            {...{...props,
              content: 'Buy the Integration',
              showTrialLicenseMessage: true,
              expired: false,
              licenseId,
              tileStatus: 'is_pending_setup',
              isIntegrationV2: true,
              integrationId: '5f5f35863a46da41054e8d55',
              mode: 'settings',
              name: 'Cash Application Manager for NetSuite',
              _connectorId: '57c8199e8489cc1a298cc6ea',
              resumable: true,
            }}
          />
        </MemoryRouter>
      </ConfirmDialogProvider>
    );

    const content = screen.getByText('Buy the Integration');

    expect(content).toBeInTheDocument();
    const message = screen.getByText('Request to buy');

    expect(message).toBeInTheDocument();
    await userEvent.click(message);

    const dialogMessage = screen.getByText('We will contact you to buy your subscription.');

    expect(dialogMessage).toBeInTheDocument();

    const cancelMessage = screen.getByText('Cancel');

    expect(cancelMessage).toBeInTheDocument();
    await userEvent.click(cancelMessage);

    expect(cancelMessage).not.toBeInTheDocument();
    await userEvent.click(message);

    const submitMessage = screen.getByText('Submit request');

    expect(submitMessage).toBeInTheDocument();
    await userEvent.click(submitMessage);

    await expect(mockDispatchFn).toHaveBeenCalledWith(actions.license.requestUpdate('connectorRenewal', {connectorId: props.connectorId, licenseId}));
    expect(submitMessage).not.toBeInTheDocument();
  });

  test('should able to request to Buy with multiple buttons', async () => {
    const integrationId = '5f5f35863a46da41054e8d55';

    renderWithProviders(
      <ConfirmDialogProvider>
        <MemoryRouter>
          <TileNotification
            {...{...props,
              content: 'Request to buy the Integration or cancel',
              showTrialLicenseMessage: true,
              expired: false,
              trialExpired: true,
              licenseId: '5f5f3541c819d4674ae24404',
              integrationId: '5f5f35863a46da41054e8d55',
              mode: 'settings',
              name: 'Cash Application Manager for NetSuite',
              _connectorId: '57c8199e8489cc1a298cc6ea',
              resumable: true,
              accessLevel: 'administrator',
            }}
          />
        </MemoryRouter>
      </ConfirmDialogProvider>
    );

    const content = screen.getByText('Request to buy the Integration or cancel');

    expect(content).toBeInTheDocument();
    const message = screen.getByText('Request to buy');

    expect(message).toBeInTheDocument();
    const errorMessage = screen.getByText('Uninstall');

    expect(errorMessage).toBeInTheDocument();
    await userEvent.click(message);
    await expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.license.resume(integrationId));
  });

  test('should able to request to Renew single button', async () => {
    const licenseId = '5cdd11eec6cf5f2ec5ca74b4';

    renderWithProviders(
      <ConfirmDialogProvider>
        <MemoryRouter>
          <TileNotification
            {...{...props,
              content: 'Request to renew Integration',
              expired: false,
              licenseId,
              tileStatus: 'is_pending_setup',
              integrationId: '5f5f35863a46da41054e8d55',
              mode: 'settings',
              name: 'Cash Application Manager for NetSuite',
              _connectorId: '57c8199e8489cc1a298cc6ea',
            }}
          />
        </MemoryRouter>
      </ConfirmDialogProvider>
    );

    const content = screen.getByText('Request to renew Integration');

    expect(content).toBeInTheDocument();
    const renewButton = screen.getByText('Request to renew');

    expect(renewButton).toBeInTheDocument();
    await userEvent.click(renewButton);
    const dialogMessage = screen.getByText('We will contact you to renew your subscription.');

    expect(dialogMessage).toBeInTheDocument();
    const submitButton = screen.getByText('Submit request');

    expect(submitButton).toBeInTheDocument();
    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(submitButton);
    await expect(mockDispatchFn).toHaveBeenCalledWith(actions.license.requestUpdate('connectorRenewal', {connectorId: props.connectorId, licenseId}));
    expect(submitButton).not.toBeInTheDocument();
  });

  test('should able to request to buy with multiple buttons and it should send a request to buy the subscription', async () => {
    const licenseId = '5f5f3541c819d4674ae24404';

    renderWithProviders(
      <ConfirmDialogProvider>
        <MemoryRouter>
          <TileNotification
            {...{...props,
              content: 'Buy the Integration and will send the request',
              showTrialLicenseMessage: true,
              expired: false,
              trialExpired: true,
              licenseId,
              integrationId: '5f5f35863a46da41054e8d55',
              mode: 'settings',
              name: 'Cash Application Manager for NetSuite',
              _connectorId: '57c8199e8489cc1a298cc6ea',
            }}
        />
        </MemoryRouter>
      </ConfirmDialogProvider>
    );

    const content = screen.getByText('Buy the Integration and will send the request');

    expect(content).toBeInTheDocument();
    const message = screen.getByText('Request to buy');

    expect(message).toBeInTheDocument();
    const errorMessage = screen.getByText('Uninstall');

    expect(errorMessage).toBeInTheDocument();
    await userEvent.click(message);

    const dialogMessage = screen.getByText('We will contact you to buy your subscription.');

    expect(dialogMessage).toBeInTheDocument();
    const submitButton = screen.getByText('Submit request');

    expect(submitButton).toBeInTheDocument();
    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(submitButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.license.requestUpdate('connectorRenewal', {connectorId: props.connectorId, licenseId})));
    expect(submitButton).not.toBeInTheDocument();
    await userEvent.click(errorMessage);
    const uninstallMessage = screen.getByText('Contact your account owner to uninstall this integration app.');

    expect(uninstallMessage).toBeInTheDocument();
  });
});
