
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';

const mockDispatch = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

const end = new Date();

end.setMonth(end.getMonth() - 2);

mutateStore(initialStore, draft => {
  draft.user.preferences = {defaultAShareId: 'own', dashboard: {view: 'list'} };
  draft.user.org.accounts = [
    {_id: 'own',
      ownerUser: {licenses: [
        {_integrationId: '1_integrationId', _connectorId: 'some_connectorId', resumable: true, expires: end},
        {_integrationId: '2_integrationId', _connectorId: 'some_connectorId', resumable: false, expires: end},
      ]}}];
  draft.data.resources.connections = [{
    _id: 'ssLinkedConnectionId2',
    netsuite: {account: 'accountName'},
  }];
});

function initHomeTiles(data = {}, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={[data]} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('homeTiles metadata UI tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should verify the Name coulmn', () => {
    initHomeTiles({name: 'tileName', _id: 'someId'});
    const row = screen.getAllByRole('row');

    expect(row[0].textContent.indexOf('Name ')).toBeGreaterThan(-1);
    expect(row[1].textContent.indexOf('tileName')).toBeGreaterThan(-1);
  });
  test('should verify the applications coulmn for standalone', () => {
    initHomeTiles({name: 'tileName', _integrationId: 'none', _id: 'someId'});
    const row = screen.getAllByRole('row');

    expect(row[0].textContent.indexOf('Applications')).toBeGreaterThan(-1);
    expect(row[1].textContent.indexOf('N/A')).toBeGreaterThan(-1);
  });
  test('should verify the applications coulmn for suite sript', () => {
    initHomeTiles({name: 'tileName', ssLinkedConnectionId: 'ssLinkedConnectionId', _id: 'someId'});
    const row = screen.getAllByRole('row');

    expect(row[0].textContent.indexOf('Applications')).toBeGreaterThan(-1);
    expect(row[1].textContent.indexOf('N/A')).toBeGreaterThan(-1);
  });
  test('should verify the application FTP', () => {
    initHomeTiles({name: 'tileName', _connectorId: '_connectorId', connector: {applications: ['ftp']}, _id: 'someId'}, initialStore);
    const row = screen.getAllByRole('row');

    expect(row[0].textContent.indexOf('Applications')).toBeGreaterThan(-1);

    expect(screen.getByAltText('ftp')).toBeInTheDocument();
  });
  test('should verify the status as success', () => {
    initHomeTiles({name: 'tileName', _connectorId: '_connectorId', connector: {applications: ['ftp']}, _id: 'someId'}, initialStore);
    const row = screen.getAllByRole('row');

    expect(row[0].textContent.indexOf('Status')).toBeGreaterThan(-1);
    expect(row[1].textContent.indexOf('Success')).toBeGreaterThan(-1);
  });
  test('should verify the Type', () => {
    initHomeTiles({name: 'tileName', _connectorId: '_connectorId', connector: {applications: ['ftp']}, _id: 'someId'}, initialStore);
    const row = screen.getAllByRole('row');

    expect(row[0].textContent.indexOf('Type')).toBeGreaterThan(-1);
    expect(row[1].textContent.indexOf('Integration app')).toBeGreaterThan(-1);
  });
  test('should verify the Row action for standalone', () => {
    initHomeTiles({name: 'tileName', _integrationId: 'none', _id: 'someId'}, initialStore);
    expect(screen.queryByRole('button', {name: /more/i})).not.toBeInTheDocument();
  });
  test('should verify the Row action only for UnpinAction', async () => {
    initHomeTiles({name: 'tileName', ssLinkedConnectionId: 'ssLinkedConnectionId', pinned: true, _id: 'someId'}, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Unpin integration')).toBeInTheDocument();
  });
  test('should verify the Row action only for PinAction', async () => {
    initHomeTiles({name: 'tileName', ssLinkedConnectionId: 'ssLinkedConnectionId', pinned: false, _id: 'someId'}, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Pin integration')).toBeInTheDocument();
  });
  test('should verify the Row action setup is pending reactivate option', async () => {
    initHomeTiles({name: 'tileName', pinned: true, _connectorId: 'some_connectorId', status: 'is_pending_setup', _integrationId: '1_integrationId', _id: 'someId'}, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Reactivate integration')).toBeInTheDocument();
    expect(screen.getByText('Unpin integration')).toBeInTheDocument();
    expect(screen.getByText('Uninstall integration')).toBeInTheDocument();
  });
  test('should verify the Row action setup is pending renew option', async () => {
    initHomeTiles({name: 'tileName', pinned: true, _connectorId: 'some_connectorId', status: 'is_pending_setup', _integrationId: '2_integrationId', _id: 'someId'}, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Renew subscription')).toBeInTheDocument();
    expect(screen.getByText('Unpin integration')).toBeInTheDocument();
    expect(screen.getByText('Uninstall integration')).toBeInTheDocument();
  });

  test('should verify the Row action setup is uninstall reactivate option', async () => {
    initHomeTiles({name: 'tileName', pinned: true, _connectorId: 'some_connectorId', status: 'uninstall', _integrationId: '1_integrationId', _id: 'someId'}, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Reactivate integration')).toBeInTheDocument();
    expect(screen.getByText('Unpin integration')).toBeInTheDocument();
    expect(screen.getByText('Uninstall integration')).toBeInTheDocument();
  });
  test('should verify the Row action setup is uninstall renew option', async () => {
    initHomeTiles({name: 'tileName', pinned: true, _connectorId: 'some_connectorId', status: 'uninstall', _integrationId: '2_integrationId', _id: 'someId'}, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Renew subscription')).toBeInTheDocument();
    expect(screen.getByText('Unpin integration')).toBeInTheDocument();
    expect(screen.getByText('Uninstall integration')).toBeInTheDocument();
  });
  test('should verify the Row action setup is uninstall no connector Id', async () => {
    initHomeTiles({name: 'tileName', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', _id: 'someId'}, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Delete integration')).toBeInTheDocument();
  });
  test('should verify the Row action setup is pending no connector Id', async () => {
    initHomeTiles({name: 'tileName', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', _id: 'someId'}, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Delete integration')).toBeInTheDocument();
  });
  test('should verify the Row action setup is status is not provided and tile is pinned', async () => {
    initHomeTiles({name: 'tileName', pinned: true, _integrationId: '2_integrationId', _id: 'someId'}, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Unpin integration')).toBeInTheDocument();
    expect(screen.getByText('Clone integration')).toBeInTheDocument();
    expect(screen.getByText('Download integration')).toBeInTheDocument();
    expect(screen.getByText('Delete integration')).toBeInTheDocument();
  });
  test('should verify the Row action setup is status is not provided and tile is not pinned', async () => {
    initHomeTiles({name: 'tileName', pinned: false, _integrationId: '2_integrationId', _id: 'someId'}, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.getByText('Pin integration')).toBeInTheDocument();
    expect(screen.getByText('Clone integration')).toBeInTheDocument();
    expect(screen.getByText('Download integration')).toBeInTheDocument();
    expect(screen.getByText('Delete integration')).toBeInTheDocument();
  });
});
