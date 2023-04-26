
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import ConnectionStatusPanel from '.';
import actions from '../../actions';
import { mockPostRequest, renderWithProviders } from '../../test/test-utils';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const resourceType = ['connections', 'exports', 'imports'];
const collection = [
  [{_id: 'connection1', offline: true}, {_id: 'connection2', offline: false}, {_id: 'connection3', offline: true, _connectorId: '_connectorId'}],
  [{_id: 'export1', _connectionId: 'connection1'}],
  [{_id: 'import1', _connectionId: 'connection1'}],
];

describe('connectionStatusPanel UI tests', () => {
  beforeEach(() => {
    // jest.resetAllMocks();
    mockPostRequest('/api/connections/connection1/ping', {status: 200});
    mockPostRequest('/api/connections/connection2/ping', {status: 200});
    mockPostRequest('/api/connections/connection3/ping', {status: 200});
  });
  function renderWithStore(resourcetype, resourceId) {
    const {store} = renderWithProviders(<MemoryRouter ><ConnectionStatusPanel resourceId={resourceId} resourceType={resourcetype} /></MemoryRouter>);

    act(() => { store.dispatch(actions.resource.receivedCollection(resourceType[0], collection[0])); });
    act(() => { store.dispatch(actions.resource.receivedCollection(resourceType[1], collection[1])); });
    act(() => { store.dispatch(actions.resource.receivedCollection(resourceType[2], collection[2])); });
  }

  test('should test the online message for connection', async () => {
    renderWithStore('connections', 'connection2');

    const message = screen.queryByText('This connection is currently offline. Re-enter your credentials to bring it back online.');

    expect(message).not.toBeInTheDocument();
  });

  test('should test the offline message for connection', () => {
    renderWithStore('connections', 'connection1');
    const message = screen.getByText('This connection is currently offline. Re-enter your credentials to bring it back online.');

    expect(message).toBeInTheDocument();
  });

  test('should test the message for connection having _connectorId', async () => {
    renderWithStore('connections', 'connection3');

    const message = screen.queryByText('This connection is currently offline. Re-enter your credentials to bring it back online.');

    expect(message).toBeInTheDocument();
  });

  test('should test offline message for export', async () => {
    renderWithStore('exports', 'export1');
    const message = screen.getByRole('button', {name: /Fix your connection/i});

    await userEvent.click(message);
    expect(mockHistoryPush).toHaveBeenCalledWith('/edit/connections/connection1?fixConnnection=true');
  });

  test('should test offline message for import', async () => {
    renderWithStore('imports', 'import1');

    const message = screen.getByRole('button', {name: /Fix your connection/i});

    await userEvent.click(message);
    expect(mockHistoryPush).toHaveBeenCalledWith('/edit/connections/connection1?fixConnnection=true');
  });

  test('should test message for non-existing import', () => {
    renderWithProviders(<MemoryRouter><ConnectionStatusPanel resourceId="5ac5e74506bd2615df9fba91" resourceType="imports" /></MemoryRouter>);

    const message = screen.queryByRole('button', {name: /Fix your connection/i});

    expect(message).not.toBeInTheDocument();
  });
});
