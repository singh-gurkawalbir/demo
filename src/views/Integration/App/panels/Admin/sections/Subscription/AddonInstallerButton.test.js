
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {mutateStore, reduxStore, renderWithProviders} from '../../../../../../../test/test-utils';
import AddonInstallerButton from './AddonInstallerButton';
import { ConfirmDialogProvider } from '../../../../../../../components/ConfirmDialog';
import actions from '../../../../../../../actions';

async function initAddonButton(props = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.integrationApps.addon = {};
    draft.session.integrationApps.addon['678901234567890'] = {installInprogress: false};
    draft.user.org.accounts = [{accessLevel: 'administrator',
      _id: 'own',
      ownerUser: {licenses: [{
        _id: '5a6ec1bae9aaa11c9bc86106',
        created: '2018-01-29T06:39:54.268Z',
        lastModified: '2022-06-27T07:52:09.014Z',
        expires: '2123-05-05T00:00:00.000Z',
        type: 'connector',
        upgradeText: 'Request upgrade',
        _integrationId: '678901234567891123456789',
        resumable: false,
      }]}}];
  });

  return renderWithProviders(<ConfirmDialogProvider><AddonInstallerButton {...props} /></ConfirmDialogProvider>, {initialStore});
}

describe('App AddonInstallerButton UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should display the install progress message when clicked on "install" button and resource status is "available"', async () => {
    const props = {resource: {status: 'available', id: '67890123456789012345', integrationId: '678901234567891123456789', name: 'resource'}};

    await initAddonButton(props);
    userEvent.click(screen.getByText(/install/i));
    expect(screen.getByText('Installing resource add-on...')).toBeInTheDocument();
  });
  test('should display the Uninstall progress message when clicked on "install" button and resource status is "installed"', async () => {
    const props = {resource: {status: 'installed', id: '678901234567890', integrationId: '678901234567891123456789', name: 'resource'}};

    await initAddonButton(props);
    userEvent.click(screen.getByText(/uninstall/i));
    expect(screen.getByText('Are you sure you want to uninstall?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm uninstall')).toBeInTheDocument();
    const UninstallButtons = screen.getAllByText('Uninstall');
    const n = UninstallButtons.length;

    userEvent.click(UninstallButtons[n - 1]);
    await waitFor(() => expect(screen.getByText('Uninstalling resource add-on...')).toBeInTheDocument());
  });
  test('should make the respective dispatch calls for resource status "partiallyUninstalled"', async () => {
    const props = {resource: {status: 'paritallyUninstalled', id: '678901234567890', name: 'resource', integrationId: '678901234567891123456789', storeId: '678901234567892' }};

    await initAddonButton(props);
    userEvent.click(screen.getByText(/Resume Uninstall/i));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.integrationApp.isAddonInstallInprogress(true, '678901234567890')));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.integrationApp.uninstaller.stepUninstall(
      '678901234567892',
      '678901234567891123456789',
      undefined,
      '678901234567890'
    )));
  });
  test('should make the respective dispatch calls for resource status "partiallyInstalled"', async () => {
    const props = {resource: {status: 'partiallyInstalled', id: '678901234567890', name: 'resource', integrationId: '678901234567891123456789', storeId: '678901234567892' }};

    await initAddonButton(props);
    userEvent.click(screen.getByText(/Resume Install/i));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.integrationApp.isAddonInstallInprogress(true, '678901234567890')));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.integrationApp.installer.installStep(
      '678901234567891123456789',
      undefined,
      '678901234567892',
      '678901234567890'
    )));
  });
});
