/* global describe, expect, jest, test, beforeEach, afterEach */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../test/test-utils';
import CeligoTable from '../../CeligoTable';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';
import { ConfirmDialogProvider } from '../../ConfirmDialog';
import ViewAuditLog from './AuditLogs';
import ViewExecutionLog from './ExecutionLogs';
import Clone from './Clone';
import Edit from './Edit';
import Delete from './Delete';
import Download from './Download';
import GenerateToken from './GenerateToken';
import References from './References';

let initialStore;
let mockTableContext;
let mockLocation;
let mockRouteMatch;
const mockDispatchFn = jest.fn(action => initialStore.dispatch(action));
const mockHistoryPush = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useLocation: () => mockLocation,
  useRouteMatch: () => mockRouteMatch,
}));

jest.mock('../../CeligoTable/TableContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTable/TableContext'),
  useGetTableContext: () => mockTableContext,
}));

function initCommonActions(data = [{}]) {
  const metadata = {
    useColumns: () => [],
    useRowActions: () => [
      ViewAuditLog,
      Clone,
      Delete,
      Download,
      Edit,
      ViewExecutionLog,
      GenerateToken,
      References,
    ],
  };
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <CeligoTable {...metadata} data={data} />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test suite for common actions', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
    mockTableContext = {};
    mockRouteMatch = {};
    mockLocation = { pathname: '/integrations' };
  });

  afterEach(() => {
    mockDispatchFn.mockClear();
    mockHistoryPush.mockClear();
  });

  test('should be able to view audit logs', () => {
    mockTableContext = { resourceType: 'connections' };
    const connection = {
      _id: 'conn123',
      name: 'Zendesk HTTP connection',
    };

    initialStore.getState().data.resources.connections = [connection];
    initCommonActions([{_id: connection._id}]);
    userEvent.click(screen.getByRole('button'));
    const viewAuditLogsButton = screen.getByRole('menuitem', {name: 'View audit log'});

    userEvent.click(viewAuditLogsButton);
    const auditLogDialog = screen.getByRole('dialog');

    expect(auditLogDialog).toBeInTheDocument();
    expect(auditLogDialog).toHaveTextContent(`Audit log: ${connection.name}`);
    const closeButton = screen.getByTestId('closeModalDialog');

    userEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('should be able to view execution logs in a separate tab in flow builder', () => {
    mockTableContext = { flowId: 'flow123' };
    const scriptId = 'script123';

    initCommonActions([{_id: scriptId}]);
    userEvent.click(screen.getByRole('button'));
    const viewExecutionLogsButton = screen.getByRole('menuitem', {name: 'View execution log'});

    userEvent.click(viewExecutionLogsButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.request({
      scriptId,
      flowId: 'flow123',
      isInit: true,
    }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.bottomDrawer.addTab({
      tabType: 'scriptLogs',
      resourceId: scriptId,
    }));
  });

  test('should show execution logs in a drawer when accessed from "Scripts" resource', () => {
    mockLocation = { pathname: '/scripts' };
    const scriptId = 'script123';

    initCommonActions([{_id: scriptId}]);
    userEvent.click(screen.getByRole('button'));
    const viewExecutionLogsButton = screen.getByRole('menuitem', {name: 'View execution log'});

    userEvent.click(viewExecutionLogsButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.request({
      scriptId,
      isInit: true,
    }));
    expect(mockHistoryPush).toHaveBeenCalledWith(`/scripts/viewLogs/${scriptId}`);
  });

  describe('cloning resources', () => {
    test('should be able to clone resources (other than integration flows)', () => {
      mockTableContext.resourceType = 'exports';
      initCommonActions([{ _id: 'export123' }]);
      userEvent.click(screen.getByRole('button'));
      const cloneButton = screen.getByRole('menuitem', {name: 'Clone export'});

      userEvent.click(cloneButton);
      expect(mockHistoryPush).toHaveBeenCalledWith('/clone/exports/export123/preview');
    });

    test('should be able to clone an integration flow if has permission', () => {
      mockTableContext.resourceType = 'flows';
      const data = [{
        _id: 'flow123',
        _integrationId: 'int123',
      }];

      initialStore.getState().user.preferences.defaultAShareId = 'own';
      initCommonActions(data);
      userEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('menuitem', {name: 'Clone flow'})).toBeInTheDocument();
    });

    test("should not be able to clone an integration flow if doesn't have permissions to clone", () => {
      mockTableContext.resourceType = 'flows';
      const data = [{
        _id: 'flow123',
        _integrationId: 'int123',
      }];

      initCommonActions(data);
      userEvent.click(screen.getByRole('button'));
      expect(screen.queryByRole('menuitem', {name: 'Clone flow'})).not.toBeInTheDocument();
    });
  });

  test('should be able to edit a resource', () => {
    mockTableContext.resourceType = 'connectors/connector123/licenses';
    mockRouteMatch = {
      path: '/connectors/:connectorId/connectorLicenses',
      url: '/connectors/connector123/connectorLicenses',
      isExact: true,
      params: {
        connectorId: 'connector123',
      },
    };
    initCommonActions([{
      _id: 'ia123',
      type: 'integrationApp',
    }]);
    userEvent.click(screen.getByRole('button'));

    const editButton = screen.getByRole('menuitem', {name: 'Edit license'});

    userEvent.click(editButton);
    expect(mockHistoryPush).toHaveBeenCalledWith(`${mockRouteMatch.url}/edit/connectorLicenses/ia123`);
  });

  test('should be able to delete a resource', () => {
    mockTableContext.resourceType = 'connectors/connector123/licenses';
    initCommonActions([{
      _id: 'ia123',
      type: 'integrationApp',
    }]);
    userEvent.click(screen.getByRole('button'));

    const deleteButton = screen.getByRole('menuitem', {name: 'Delete license'});

    userEvent.click(deleteButton);
    const confirmDialog = screen.getByRole('dialog');
    const confirmButton = screen.getByRole('button', { name: 'Delete' });

    expect(confirmDialog).toContainElement(confirmButton);
    expect(confirmDialog.textContent).toContain('Are you sure you want to delete this license?');
    userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.delete(mockTableContext.resourceType, 'ia123'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('should not be able to delete a resource already in use', () => {
    mockTableContext.resourceType = 'exports';
    const data = [{
      _id: 'export123',
      name: 'Netsuite Export',
      _connectionId: 'conn123',
    }];

    initialStore.getState().session.resource = {
      references: {
        flows: [
          {
            id: 'flow123',
            name: 'Netsuite flow',
            dependencyIds: {
              export: [
                'export123',
              ],
            },
          },
        ],
      },
    };
    initCommonActions(data);
    userEvent.click(screen.getByRole('button'));
    const deleteButton = screen.getByRole('menuitem', {name: 'Delete export'});

    userEvent.click(deleteButton);
    const confirmDeleteButton = screen.getByRole('button', {name: 'Delete'});

    userEvent.click(confirmDeleteButton);
    expect(screen.getByRole('dialog').textContent).toContain('Unable to delete export');
    const closeDialogButton = screen.getByTestId('closeModalDialog');

    userEvent.click(closeDialogButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('should be able to download a resource', () => {
    mockTableContext.resourceType = 'templates';
    initCommonActions([{
      _id: 'template123',
      name: 'Shopify template',
    }]);
    userEvent.click(screen.getByRole('button'));
    const downloadButton = screen.getByRole('menuitem', {name: 'Download template zip'});

    userEvent.click(downloadButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.downloadFile('template123', 'templates'));
  });

  test('should be able to generate new token ( for agents )', () => {
    mockTableContext.resourceType = 'agents';
    const data = [{
      _id: 'agent123',
      name: 'test',
      version: '3.0.8',
      _agentExtensionId: 'extId123',
      port: '7016',
      lastHeartbeatAt: '2022-01-13T15:53:38.536Z',
      lastModified: '2022-01-13T16:06:59.556Z',
      createdAt: '2022-01-13T04:42:33.434Z',
      description: 'test',
      offline: true,
    }];

    initCommonActions(data);
    userEvent.click(screen.getByRole('button'));
    const generateTokenButton = screen.queryByRole('menuitem', {name: 'Generate new token'});

    userEvent.click(generateTokenButton);
    const confirmDialog = screen.getByRole('dialog');

    expect(confirmDialog.textContent).toContain('Confirm generate');
    const confirmButton = screen.getByRole('button', {name: 'Generate'});

    userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.agent.changeToken(data[0]._id));
  });

  test('should be able to generate new token ( for stacks )', () => {
    mockTableContext.resourceType = 'stacks';
    const data = [{
      _id: 'stack123',
      name: 'mystack',
      type: 'server',
      framework: 'twoDotZero',
      server: {
        systemToken: '******',
        hostURI: 'https://a522-2409-4070-411c-58fe-adb8-4781-4b16-a709.in.ngrok.io',
        ipRanges: [],
      },
    }];

    initCommonActions(data);
    userEvent.click(screen.getByRole('button'));
    const generateTokenButton = screen.queryByRole('menuitem', {name: 'Generate new token'});

    userEvent.click(generateTokenButton);
    const confirmDialog = screen.getByRole('dialog');

    expect(confirmDialog.textContent).toContain('Confirm generate');
    const confirmButton = screen.getByRole('button', {name: 'Generate'});

    userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.stack.generateToken(data[0]._id));
  });

  test('should not be able to generate new token for stacks of type lambda', () => {
    mockTableContext.resourceType = 'stacks';
    const data = [{
      _id: 'stack123',
      name: 'test',
      type: 'lambda',
      lambda: {
        accessKeyId: 'qWeRty',
        awsRegion: 'ap-southeast-1',
        functionName: 'TEST123',
        language: 'Node.js',
      },
    }];

    initCommonActions(data);
    userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('menuitem', {name: 'Generate new token'})).not.toBeInTheDocument();
  });

  test('should be able to view references of a resource', () => {
    mockTableContext.resourceType = 'exports';
    initialStore.getState().session.resource = {
      references: {
        flows: [
          {
            id: 'flow123',
            name: 'Netsuite flow',
            dependencyIds: {
              export: [
                'export123',
              ],
            },
          },
        ],
      },
    };
    initCommonActions([{
      _id: 'export123',
      name: 'Netsuite Export',
    }]);
    userEvent.click(screen.getByRole('button'));
    const viewReferenceButton = screen.getByRole('menuitem', {name: 'Used by'});

    userEvent.click(viewReferenceButton);
    const dialogBox = screen.getByRole('dialog');

    expect(dialogBox.textContent).toContain('Used by');
    const closeDialogButton = screen.getByTestId('closeModalDialog');

    userEvent.click(closeDialogButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
