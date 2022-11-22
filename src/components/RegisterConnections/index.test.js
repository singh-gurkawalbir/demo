/* global describe, jest, test, expect, beforeEach, afterEach */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import actions from '../../actions';
import { renderWithProviders, reduxStore } from '../../test/test-utils';
import RegisterConnections from '.';

jest.mock('../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../LoadResources'),
  default: ({children}) => children,
}));

function initRegisterConnections(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <RegisterConnections {...props} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('Test suite for RegisterConnections component', () => {
  let useDispatchSpy;
  let mockDispatchFn;

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
    mockDispatchFn.mockClear();
  });

  test('should pass initial rendering', () => {
    const onClose = jest.fn();

    initRegisterConnections({onClose});
    const columnHeaders = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(screen.getByText('Register connections')).toBeInTheDocument();
    expect(columnHeaders).toEqual([
      '  ',
      'Name',
      'Status',
      'Connector',
      'API',
      'Last updated',
      'Queue size']);

    const registerButton = screen.getByRole('button', {name: 'Register'});

    expect(registerButton).toBeInTheDocument();
    userEvent.click(registerButton);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.connection.requestRegister([], undefined));

    const closeDialogButton = screen.getByTestId('closeModalDialog');

    expect(closeDialogButton).toBeInTheDocument();
    userEvent.click(closeDialogButton);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test('should be able to register multiple connections', () => {
    const integrationId = '626int';
    const onClose = jest.fn();
    const state = reduxStore.getState();

    state.session.filters.registerConnections = {
      isAllSelected: false,
      sort: {
        order: 'asc',
        orderBy: 'name',
      },
    };
    state.user.preferences.environment = 'production';
    state.user.preferences.defaultAShareId = 'id123';
    state.user.org.accounts = [
      {
        _id: 'id123',
        accessLevel: 'manage',
      },
    ];
    state.data.resources.connections = [
      {
        _id: '627conn1',
        name: 'Connection 1',
        type: 'netsuite',
        lastModified: '2022-08-24T10:24:52.046Z',
      },
      {
        _id: '627conn2',
        name: 'Connection 2',
        type: 'http',
        http: {
          baseURI: 'https://http.com',
        },
        lastModified: '2022-08-25T08:14:18.288Z',
      },
      {
        _id: '627conn3',
        name: 'Connection 3',
        offline: true,
        type: 'rest',
        rest: {
          baseURI: 'https://rest.com',
        },
        lastModified: '2022-08-25T08:14:18.288Z',
      }];

    initRegisterConnections({integrationId, onClose}, reduxStore);

    const connectionLinks = screen.getAllByRole('link').map(ele => ele.textContent);

    expect(connectionLinks).toEqual(['Connection 1', 'Connection 2', 'Connection 3']);

    [
      'Connection 1 online NetSuite relative date time 0',
      'Connection 2 online HTTP https://http.com relative date time 0',
      'Connection 3 Offline REST API (HTTP) https://rest.com relative date time 0',
    ].forEach(rowText => expect(screen.getByRole('row', {name: rowText})).toBeInTheDocument());

    const registerButton = screen.getByRole('button', {name: 'Register'});
    const selectAllConnections = screen.getAllByRole('checkbox')[0];

    userEvent.click(selectAllConnections);
    userEvent.click(registerButton);

    expect(mockDispatchFn).toHaveBeenLastCalledWith(actions.connection.requestRegister(['627conn1', '627conn2', '627conn3'], integrationId));
  });
});
