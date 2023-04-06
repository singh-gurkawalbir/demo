import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../../test/test-utils';
import actions from '../../../../../../actions';
import metadata from '../../../metadata';
import CeligoTable from '../../../../../CeligoTable';
import * as snakbar from '../../../../../../hooks/enqueueSnackbar';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

const end = new Date();

end.setMonth(end.getMonth() - 2);

mutateStore(initialStore, draft => {
  draft.user.preferences = {defaultAShareId: 'own' };

  draft.user.org.accounts = [
    {_id: 'own',
      ownerUser: {licenses: [
        {_integrationId: '1_integrationId', _connectorId: 'some_connectorId', resumable: false, trialEndDate: end},
        {_integrationId: '3_integrationId', _connectorId: 'some_connectorId', resumable: true, expires: end},
        {_integrationId: '2_integrationId', _connectorId: 'some_connectorId', resumable: true, expires: end, _id: 'someLicenseId'},
      ]}}];
});

function initHomeTiles(data = {}, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={[data]} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe("homeTiles's Reactivate Action UI tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show the reactivate button with pending status', async () => {
    const data = {name: 'tileName', _connectorId: 'some_connectorId', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, _id: 'someID'};

    initHomeTiles(data, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));

    expect(screen.getByText('Reactivate integration')).toBeInTheDocument();
  });
  test('should click on reactivate button as a owner', async () => {
    const data = {name: 'tileName', integration: {permissions: {accessLevel: 'owner'}}, _connectorId: 'some_connectorId', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, _id: 'someID'};

    initHomeTiles(data, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    const reactivate = screen.getByText('Reactivate integration');

    expect(reactivate).toBeInTheDocument();
    await userEvent.click(reactivate);
    expect(mockDispatch).toHaveBeenCalledWith(actions.integrationApp.license.resume('2_integrationId'));
  });
  test('should click on reactivate button as a administrator', async () => {
    const data = {name: 'tileName', integration: {permissions: {accessLevel: 'administrator'}}, _connectorId: 'some_connectorId', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, _id: 'someID'};

    initHomeTiles(data, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    const reactivate = screen.getByText('Reactivate integration');

    expect(reactivate).toBeInTheDocument();
    await userEvent.click(reactivate);
    expect(mockDispatch).toHaveBeenCalledWith(actions.integrationApp.license.resume('2_integrationId'));
  });
  test('should click on reactivate button as a manage', async () => {
    const myEnqueueSnackbar = jest.fn();

    jest.spyOn(snakbar, 'default').mockReturnValue([myEnqueueSnackbar]);
    const data = {name: 'tileName', integration: {permissions: {accessLevel: 'manage'}}, _connectorId: 'some_connectorId', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, _id: 'someID'};

    await initHomeTiles(data, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    const reactivate = await waitFor(() => screen.getByRole('menuitem', {name: /Reactivate integration/i}));

    expect(reactivate).toBeInTheDocument();
    await userEvent.click(reactivate);
    expect(myEnqueueSnackbar).toHaveBeenCalledWith({message: 'Contact your account owner to reactivate this integration app.', variant: 'error'});
  });
  test('should show reactivate button when license has expired', async () => {
    const data = {name: 'tileName', _connectorId: 'some_connectorId', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, _id: 'someID'};

    initHomeTiles(data, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Renew subscription')).not.toBeInTheDocument();
  });
  test('should not show reactivate option because resumable is true', async () => {
    const data = {name: 'tileName', _connectorId: 'some_connectorId', pinned: true, status: 'is_pending_setup', _integrationId: '3_integrationId', supportsMultiStore: true, _id: 'someID'};

    await initHomeTiles(data, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Renew subscription')).not.toBeInTheDocument();
  });
});
