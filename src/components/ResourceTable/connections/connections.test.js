/* global describe, expect, jest, test, beforeEach, afterEach */
import React from 'react';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import moment from 'moment';
import { renderWithProviders } from '../../../test/test-utils';
import CeligoTable from '../../CeligoTable';
import metadata from './metadata';
import { ConfirmDialogProvider } from '../../ConfirmDialog';
import actions from '../../../actions';
import { buildDrawerUrl } from '../../../utils/rightDrawer';
import { getCreatedStore } from '../../../store';

const mockHistoryPush = jest.fn();
const mockTableContext = {
  resourceType: 'connections',
  type: 'flowBuilder',
};

jest.mock('../commonCells/ConnectorName', () => ({
  __esModule: true,
  ...jest.requireActual('../commonCells/ConnectorName'),
  default: ({resource}) => (<span>{resource.connectorName}</span>),
}));

jest.mock('../../CeligoTimeAgo', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTimeAgo'),
  default: ({date}) => (<span>{date}</span>),
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useRouteMatch: () => ({
    url: 'https://sample.url',
  }),
}));

jest.mock('../../CeligoTable/TableContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTable/TableContext'),
  useGetTableContext: () => mockTableContext,
}));

function initConnections(data = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <CeligoTable {...metadata} data={data} />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('Test suite for Connections', () => {
  const globalStore = getCreatedStore();
  let useDispatchSpy;
  let mockDispatchFn;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'TRADING_PARTNER_CONNECTIONS_REQUEST': {
          globalStore.getState().session.connections.tradingPartnerConnections.conn123.status = 'success';
          break;
        }
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    mockHistoryPush.mockClear();
  });

  test('should render the table accordingly', () => {
    const data = [{
      _id: 'conn123',
      name: 'HTTP Connection',
      type: 'http',
      http: { baseURI: 'https://xyz.pqr' },
      offline: true,
      queueSize: 1600,
      connectorName: 'HTTP',
      lastModified: '1 week ago',
    }];

    initConnections(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Name',
      'Status',
      'Type',
      'API',
      'Last updated',
      'Queue size',
      'Actions',
    ]);

    //  first for table headings and the second as data row
    expect(screen.getAllByRole('row')).toHaveLength(2);

    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'HTTP Connection',
      'Offline',
      'HTTP',
      'https://xyz.pqr',
      '1 week ago',
      '1600',
      '',
    ]);
    const actionButton = screen.getByRole('button', {name: /more/i});

    userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Edit connection',
      'View audit log',
      'Used by',
    ]);
    const connectionRow = screen.getAllByRole('row')[1];

    userEvent.hover(connectionRow);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.connection.setActive('conn123'));
    userEvent.unhover(connectionRow);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.connection.setActive());
  });

  test('should be able to debug connection in flowBuilder', () => {
    const data = [{
      _id: 'conn123',
      name: 'HTTP Connection',
      type: 'rest',
      rest: { baseURI: 'https://xyz.pqr' },
      offline: true,
      connectorName: 'HTTP',
      lastModified: '1 week ago',
    }];
    const initialStore = getCreatedStore();

    initialStore.getState().user.preferences.defaultAShareId = 'own';

    initConnections(data, initialStore);
    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'HTTP Connection',
      'Offline',
      'HTTP',
      'https://xyz.pqr',
      '1 week ago',
      '0',
      '',
    ]);
    const actionButton = screen.getByRole('button', {name: /more/i});

    userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Edit connection',
      'Debug connection',
      'View audit log',
      'Used by',
      'Replace connection',
    ]);

    const openDebugger = screen.getByRole('menuitem', {name: 'Debug connection'});

    userEvent.click(openDebugger);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.bottomDrawer.addTab({
      tabType: 'connectionLogs',
      resourceId: 'conn123',
    }));
  });

  test('should be able to replace connection in flowBuilder', () => {
    const data = [{
      _id: 'conn123',
      name: 'HTTP Connection',
      type: 'http',
      http: { baseURI: 'https://xyz.pqr' },
      offline: true,
      queueSize: 1600,
      connectorName: 'HTTP',
      lastModified: '1 week ago',
    }];
    const initialStore = getCreatedStore();

    initialStore.getState().user.preferences.defaultAShareId = 'own';

    initConnections(data, initialStore);
    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'HTTP Connection',
      'Offline',
      'HTTP',
      'https://xyz.pqr',
      '1 week ago',
      '1600',
      '',
    ]);
    const actionButton = screen.getByRole('button', {name: /more/i});

    userEvent.click(actionButton);
    const replaceConnection = screen.getByRole('menuitem', {name: 'Replace connection'});

    userEvent.click(replaceConnection);
    expect(mockHistoryPush).toHaveBeenCalledWith(buildDrawerUrl({
      path: 'replaceConnection/:connId',
      baseUrl: 'https://sample.url',
      params: { connId: 'conn123' },
    }));
  });

  test('should be able to revoke http oauth token', () => {
    const data = [{
      _id: 'conn123',
      name: 'HTTP Connection',
      type: 'http',
      http: {
        baseURI: 'https://xyz.pqr',
        auth: {
          token: {
            revoke: {
              uri: 'sampleHttpOauthToken',
            },
          },
        },
      },
      offline: true,
      queueSize: 1600,
      connectorName: 'HTTP',
      lastModified: '1 week ago',
    }];

    initConnections(data);
    const actionButton = screen.getByRole('button', {name: /more/i});

    userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Edit connection',
      'View audit log',
      'Used by',
      'Revoke',
    ]);
    const revokeToken = screen.getByRole('menuitem', {name: 'Revoke'});

    userEvent.click(revokeToken);
    const confirmDialog = screen.getByRole('dialog');
    const confirmRevoke = screen.getByRole('button', {name: 'Revoke'});
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    expect(confirmDialog).toContainElement(confirmRevoke);
    expect(confirmDialog).toContainElement(cancelButton);
    expect(confirmDialog.textContent).toContain('Confirm revoke');
    expect(confirmDialog.textContent).toContain('Are you sure you want to revoke this token?');

    userEvent.click(confirmRevoke);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.connection.requestRevoke('conn123'));
  });

  test('should be able to download debug logs for a connection', () => {
    delete mockTableContext.type;
    const data = [{
      _id: 'conn123',
      name: 'HTTP Connection',
      type: 'http',
      debugDate: moment().add(1, 'days'),
      queueSize: 1600,
      connectorName: 'HTTP',
      lastModified: '1 week ago',
    }];

    initConnections(data);
    const actionButton = screen.getByRole('button', {name: /more/i});

    userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Edit connection',
      'Download debug logs',
      'View audit log',
      'Used by',
      'Delete connection',
    ]);
    const downloadDebugLogs = screen.getByRole('menuitem', {name: 'Download debug logs'});

    userEvent.click(downloadDebugLogs);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.connections.download('conn123'));
  });

  test('should be able to debug a connection when not in flowBuilder', () => {
    const data = [{
      _id: 'conn123',
      name: 'HTTP Connection',
      type: 'http',
      http: {
        baseURI: 'https://xyz.pqr' },
      queueSize: 1600,
      connectorName: 'HTTP',
      lastModified: '1 week ago',
    }];
    const initialStore = getCreatedStore();

    initialStore.getState().user.preferences.defaultAShareId = 'own';
    initConnections(data, initialStore);
    const actionButton = screen.getByRole('button', {name: /more/i});

    userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Edit connection',
      'Debug connection',
      'View audit log',
      'Used by',
      'Delete connection',
    ]);
    const debugConnection = screen.getByRole('menuitem', {name: 'Debug connection'});

    userEvent.click(debugConnection);
    expect(mockHistoryPush).toHaveBeenCalledWith(buildDrawerUrl({
      path: 'configDebugger/:connectionId',
      baseUrl: 'https://sample.url',
      params: { connectionId: 'conn123' },
    }));
  });

  test('should be able to de register a connection', () => {
    mockTableContext.integrationId = 'int123';
    const data = [{
      _id: 'conn123',
      name: 'HTTP Connection',
      type: 'http',
      http: {
        baseURI: 'https://xyz.pqr' },
      queueSize: 1600,
      connectorName: 'HTTP',
      lastModified: '1 week ago',
    }];
    const initialStore = getCreatedStore();

    initialStore.getState().user.preferences.defaultAShareId = 'own';
    initConnections(data, initialStore);
    const actionButton = screen.getByRole('button', {name: /more/i});

    userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Edit connection',
      'Debug connection',
      'View audit log',
      'Used by',
      'Deregister connection',
    ]);
    const deregisterConnection = screen.getByRole('menuitem', {name: 'Deregister connection'});

    userEvent.click(deregisterConnection);
    const confirmDialog = screen.getByRole('dialog');
    const confirmButton = screen.getByRole('button', {name: 'Deregister'});
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    expect(confirmDialog).toContainElement(confirmButton);
    expect(confirmDialog).toContainElement(cancelButton);

    userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.connection.requestDeregister('conn123', 'int123'));
  });

  describe('should be able to refresh metadata for netsuite and salesforce connections', () => {
    test('for netsuite connections', () => {
      const data = [{
        _id: 'conn123',
        name: 'HTTP Connection',
        type: 'netsuite',
        queueSize: 1600,
        lastModified: '1 week ago',
      }];
      const initialStore = getCreatedStore();

      initialStore.getState().data.resources.connections = [{
        _id: 'conn123',
        offline: false,
      }];
      initConnections(data, initialStore);
      const actionButton = screen.getByRole('button', {name: /more/i});

      userEvent.click(actionButton);
      const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

      expect(actionItems).toEqual([
        'Edit connection',
        'View audit log',
        'Used by',
        'Refresh metadata',
      ]);
      const refreshMetadata = screen.getByRole('menuitem', {name: 'Refresh metadata'});

      userEvent.click(refreshMetadata);
      [
        'netsuite/metadata/suitescript/connections/conn123/recordTypes',
        'netsuite/metadata/suitescript/connections/conn123/savedSearches',
        'netsuite/metadata/webservices/connections/conn123/recordTypes?recordTypeOnly=true',
      ].forEach(path =>
        expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.request(
          'conn123',
          path,
          { refreshCache: true }
        ))
      );
    });

    test('for salesforce connections', () => {
      const data = [{
        _id: 'conn123',
        name: 'HTTP Connection',
        type: 'salesforce',
        queueSize: 1600,
        lastModified: '1 week ago',
      }];
      const initialStore = getCreatedStore();

      initialStore.getState().data.resources.connections = [{
        _id: 'conn123',
        offline: false,
      }];
      initConnections(data, initialStore);
      userEvent.click(screen.getByRole('button', {name: /more/i}));
      const refreshMetadata = screen.getByRole('menuitem', {name: 'Refresh metadata'});

      userEvent.click(refreshMetadata);
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.request(
        'conn123',
        'salesforce/metadata/connections/conn123/sObjectTypes',
        { refreshCache: true }
      ));
    });

    test('should not refresh metadata if connection is offline', () => {
      const data = [{
        _id: 'conn123',
        name: 'HTTP Connection',
        type: 'salesforce',
        queueSize: 1600,
        lastModified: '1 week ago',
      }];
      const initialStore = getCreatedStore();

      initialStore.getState().data.resources.connections = [{
        _id: 'conn123',
        offline: true,
      }];
      initConnections(data, initialStore);
      userEvent.click(screen.getByRole('button', {name: /more/i}));
      const refreshMetadata = screen.getByRole('menuitem', {name: 'Refresh metadata'});

      userEvent.click(refreshMetadata);
      expect(document.querySelector('[aria-describedby="client-snackbar"]').textContent).toEqual('Connection is offline.');
    });
  });

  describe('should be able to mark or unmark a connection as trading partner', () => {
    test('should be able to mark a connection as trading partner', () => {
      mockTableContext.showTradingPartner = true;
      const data = [{
        _id: 'conn123',
        name: 'HTTP Connection',
        type: 'ftp',
        ftp: { baseURI: 'https://xyz.pqr' },
        queueSize: 1600,
        connectorName: 'HTTP',
        lastModified: '1 week ago',
      }];

      globalStore.getState().session.connections.tradingPartnerConnections = {
        conn123: {
          connections: [
            { name: 'conn1' },
            { name: 'conn2' },
          ],
        },
      };
      initConnections(data, globalStore);
      userEvent.click(screen.getByRole('button', {name: /more/i}));
      const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

      expect(actionItems).toEqual([
        'Edit connection',
        'View audit log',
        'Used by',
        'Mark as trading partner',
      ]);
      const markTradingPartner = screen.getByRole('menuitem', {name: 'Mark as trading partner'});

      userEvent.click(markTradingPartner);

      expect(mockDispatchFn).toHaveBeenCalledWith(actions.connection.requestTradingPartnerConnections('conn123'));
      const confirmDialog = screen.getByRole('dialog');
      const confirmButton = screen.getByRole('button', {name: 'Confirm'});
      const cancelButton = screen.getByRole('button', {name: 'Cancel'});

      expect(confirmDialog).toContainElement(confirmButton);
      expect(confirmDialog).toContainElement(cancelButton);

      const connectionsList = Array.from(document.querySelectorAll('p'));

      connectionsList.forEach(connection => expect(confirmDialog).toContainElement(connection));
      const connectionsListNames = connectionsList.map(ele => ele.textContent.trim());

      expect(connectionsListNames).toEqual(['conn1', 'conn2']);

      userEvent.click(confirmButton);
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.connection.updateTradingPartner('conn123'));
    });
  });
});
