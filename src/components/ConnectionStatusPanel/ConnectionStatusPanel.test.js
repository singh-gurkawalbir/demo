/* global describe, test, expect ,jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryHistory} from 'history';
import ConnectionStatusPanel from '.';
import actions from '../../actions';
import { renderWithProviders } from '../../test/test-utils';

const resourceType = ['connections', 'exports', 'imports'];
const collection = [
  [{_id: 'connection1', offline: true}, {_id: 'connection2', offline: false}, {_id: 'connection3', offline: true, _connectorId: '_connectorId'}],
  [{_id: 'export1', _connectionId: 'connection1'}],
  [{_id: 'import1', _connectionId: 'connection1'}],
];

describe('ConnectionStatusPanel UI tests', () => {
  function renderWithStore(resourceType, resourceId, dataCollection) {
    const {store} = renderWithProviders(<MemoryRouter ><ConnectionStatusPanel resourceId={resourceId} resourceType={resourceType} /></MemoryRouter>);

    store.dispatch(actions.resource.receivedCollection(resourceType, dataCollection));
  }

  test('should test the online message for connection', async () => {
    renderWithStore('connections', 'connection2', [{_id: '2', offline: false}]);

    const message = screen.queryByText('This connection is currently offline. Re-enter your credentials to bring it back online.');

    expect(message).not.toBeInTheDocument();

    screen.debug();
  });

  test('should test the offline message for connection', () => {
    renderWithStore('connections', 'connection1', collection[0]);
    const message = screen.getByText('This connection is currently offline. Re-enter your credentials to bring it back online.');

    expect(message).toBeInTheDocument();
  });

  test('should test the message for connection having _connectorId', async () => {
    renderWithStore('connections', 'connection3', collection[0]);

    const message = screen.queryByText('This connection is currently offline. Re-enter your credentials to bring it back online.');

    expect(message).toBeInTheDocument();
  });

  test('should test offline message for export', () => {
    const history = createMemoryHistory();

    history.push = jest.fn();

    const {store} = renderWithProviders(
      <Router history={history}><ConnectionStatusPanel resourceId="export1" resourceType="exports" /></Router>
    );

    store.dispatch(actions.resource.receivedCollection(resourceType[0], collection[0]));
    store.dispatch(actions.resource.receivedCollection(resourceType[1], collection[1]));

    screen.debug();
    const message = screen.getByRole('button', {name: /Fix your connection/i});

    userEvent.click(message);
    expect(history.push).toHaveBeenCalledWith('/edit/connections/connection1?fixConnnection=true');
  });

  test('should test offline message for import', () => {
    const history = createMemoryHistory();

    history.push = jest.fn();

    const {store} = renderWithProviders(
      <Router history={history}><ConnectionStatusPanel resourceId="import1" resourceType="imports" /></Router>
    );

    store.dispatch(actions.resource.receivedCollection(resourceType[0], collection[0]));
    store.dispatch(actions.resource.receivedCollection(resourceType[2], collection[2]));

    const message = screen.getByRole('button', {name: /Fix your connection/i});

    userEvent.click(message);
    expect(history.push).toHaveBeenCalledWith('/edit/connections/connection1?fixConnnection=true');
  });

  test('should test message for nonexisting import', () => {
    renderWithProviders(<MemoryRouter><ConnectionStatusPanel resourceId="5ac5e74506bd2615df9fba91" resourceType="imports" /></MemoryRouter>);

    const message = screen.queryByRole('button', {name: /Fix your connection/i});

    expect(message).not.toBeInTheDocument();
  });
});
