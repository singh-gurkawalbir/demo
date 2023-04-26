import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
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
const mockDispatchFn = jest.fn();
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
  Link: ({children}) => (<div>{children}</div>),
}));

jest.mock('../../CeligoTable/TableContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTable/TableContext'),
  useGetTableContext: () => mockTableContext,
}));

async function initCommonActions(data = [{}]) {
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
    <ConfirmDialogProvider>
      <CeligoTable {...metadata} data={data} />
    </ConfirmDialogProvider>
  );

  renderWithProviders(ui, {initialStore});
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

  test('should be able to view audit logs', async () => {
    mockTableContext = { resourceType: 'connections' };
    const connection = {
      _id: 'conn123',
      name: 'Zendesk HTTP connection',
    };

    mutateStore(initialStore, draft => {
      draft.data.resources.connections = [connection];
    });

    await initCommonActions([{_id: connection._id}]);
    const actionButton = screen.getByRole('button', { name: 'more' });

    await userEvent.click(actionButton);
    const viewAuditLogsButton = screen.getByRole('menuitem', {name: 'View audit log'});

    await userEvent.click(viewAuditLogsButton);
    const auditLogDialog = await waitFor(() => screen.getByRole('dialog'));

    expect(auditLogDialog).toBeInTheDocument();
    expect(auditLogDialog).toHaveTextContent(`Audit log: ${connection.name}`);
    const closeButton = screen.getByTestId('closeModalDialog');

    await userEvent.click(closeButton);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  test('should be able to view execution logs in a separate tab in flow builder', async () => {
    mockTableContext = { flowId: 'flow123' };
    const scriptId = 'script123';

    await initCommonActions([{_id: scriptId}]);
    const actionButton = screen.getByRole('button', { name: 'more' });

    await userEvent.click(actionButton);
    const viewExecutionLogsButton = screen.getByRole('menuitem', {name: 'View execution log'});

    await userEvent.click(viewExecutionLogsButton);
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

  test('should show execution logs in a drawer when accessed from "Scripts" resource', async () => {
    mockLocation = { pathname: '/scripts' };
    const scriptId = 'script123';

    await initCommonActions([{_id: scriptId}]);
    const actionButton = screen.getByRole('button', { name: 'more' });

    await userEvent.click(actionButton);
    const viewExecutionLogsButton = screen.getByRole('menuitem', {name: 'View execution log'});

    await userEvent.click(viewExecutionLogsButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.request({
      scriptId,
      isInit: true,
    }));
    expect(mockHistoryPush).toHaveBeenCalledWith(`/scripts/viewLogs/${scriptId}`);
  });

  describe('cloning resources', () => {
    test('should be able to clone resources (other than integration flows)', async () => {
      mockTableContext.resourceType = 'exports';
      await initCommonActions([{ _id: 'export123' }]);

      const actionButton = screen.getByRole('button', { name: 'more' });

      await userEvent.click(actionButton);
      const cloneButton = screen.getByRole('menuitem', {name: 'Clone export'});

      await userEvent.click(cloneButton);
      expect(mockHistoryPush).toHaveBeenCalledWith('/clone/exports/export123/preview');
    });

    test('should be able to clone an integration flow if has permission', async () => {
      mockTableContext.resourceType = 'flows';
      const data = [{
        _id: 'flow123',
        _integrationId: 'int123',
      }];

      mutateStore(initialStore, draft => {
        draft.user.preferences.defaultAShareId = 'own';
      });

      await initCommonActions(data);
      const actionButton = screen.getByRole('button', { name: 'more' });

      await userEvent.click(actionButton);
      expect(screen.getByRole('menuitem', {name: 'Clone flow'})).toBeInTheDocument();
    });

    test("should not be able to clone an integration flow if doesn't have permissions to clone", async () => {
      mockTableContext.resourceType = 'flows';
      const data = [{
        _id: 'flow123',
        _integrationId: 'int123',
      }];

      await initCommonActions(data);
      const actionButton = screen.getByRole('button', { name: 'more' });

      await userEvent.click(actionButton);
      expect(screen.queryByRole('menuitem', {name: 'Clone flow'})).not.toBeInTheDocument();
    });
  });

  test('should be able to edit a resource', async () => {
    mockTableContext.resourceType = 'connectors/connector123/licenses';
    mockRouteMatch = {
      path: '/connectors/:connectorId/connectorLicenses',
      url: '/connectors/connector123/connectorLicenses',
      isExact: true,
      params: {
        connectorId: 'connector123',
      },
    };
    await initCommonActions([{
      _id: 'ia123',
      type: 'integrationApp',
    }]);

    const actionButton = screen.getByRole('button', { name: 'more' });

    await userEvent.click(actionButton);
    const editButton = screen.getByRole('menuitem', {name: 'Edit license'});

    await userEvent.click(editButton);
    expect(mockHistoryPush).toHaveBeenCalledWith(`${mockRouteMatch.url}/edit/connectorLicenses/ia123`);
  });

  test('should be able to delete a resource', async () => {
    mockTableContext.resourceType = 'connectors/connector123/licenses';
    await initCommonActions([{
      _id: 'ia123',
      type: 'integrationApp',
    }]);

    const more = screen.getByRole('button', { name: 'more' });

    await userEvent.click(more);
    const deleteButton = screen.getByRole('menuitem', {name: 'Delete license'});

    await userEvent.click(deleteButton);
    const confirmDialog = screen.getByRole('dialog');
    const confirmButton = screen.getByRole('button', { name: 'Delete' });

    expect(confirmDialog).toContainElement(confirmButton);
    expect(confirmDialog.textContent).toContain('Are you sure you want to delete this license?');

    await userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.delete(mockTableContext.resourceType, 'ia123'));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  test('should not be able to delete a resource already in use', async () => {
    mockTableContext.resourceType = 'exports';
    const data = [{
      _id: 'export123',
      name: 'Netsuite Export',
      _connectionId: 'conn123',
    }];

    mutateStore(initialStore, draft => {
      draft.session.resource = {
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
    });

    await initCommonActions(data);
    const more = screen.getByRole('button', { name: 'more' });

    await userEvent.click(more);
    const deleteButton = screen.getByRole('menuitem', {name: 'Delete export'});

    await userEvent.click(deleteButton);
    const confirmDeleteButton = screen.getByRole('button', {name: 'Delete'});

    await userEvent.click(confirmDeleteButton);
    expect(screen.getByRole('dialog').textContent).toContain('Unable to delete export');
    const closeDialogButton = screen.getByTestId('closeModalDialog');

    await userEvent.click(closeDialogButton);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  test('should be able to download a resource', async () => {
    mockTableContext.resourceType = 'templates';
    await initCommonActions([{
      _id: 'template123',
      name: 'Shopify template',
    }]);

    const more = screen.getByRole('button', { name: 'more' });

    await userEvent.click(more);
    const downloadButton = screen.getByRole('menuitem', {name: 'Download template zip'});

    await userEvent.click(downloadButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.downloadFile('template123', 'templates'));
  });

  test('should be able to generate new token ( for agents )', async () => {
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

    await initCommonActions(data);
    const more = screen.getByRole('button', { name: 'more' });

    await userEvent.click(more);
    const generateTokenButton = screen.getByRole('menuitem', {name: 'Generate new token'});

    await userEvent.click(generateTokenButton);
    const confirmDialog = screen.getByRole('dialog');

    expect(confirmDialog.textContent).toContain('Confirm generate');
    const confirmButton = screen.getByRole('button', {name: 'Generate'});

    await userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.agent.changeToken(data[0]._id));
  });

  test('should be able to generate new token ( for stacks )', async () => {
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

    await initCommonActions(data);
    const more = screen.getByRole('button', { name: 'more' });

    await userEvent.click(more);
    const generateTokenButton = screen.getByRole('menuitem', {name: 'Generate new token'});

    await userEvent.click(generateTokenButton);
    const confirmDialog = screen.getByRole('dialog');

    expect(confirmDialog.textContent).toContain('Confirm generate');
    const confirmButton = screen.getByRole('button', {name: 'Generate'});

    await userEvent.click(confirmButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.stack.generateToken(data[0]._id)));
  });

  test('should not be able to generate new token for stacks of type lambda', async () => {
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

    await initCommonActions(data);
    const more = screen.getByRole('button', { name: 'more' });

    await userEvent.click(more);
    expect(screen.queryByRole('menuitem', {name: 'Generate new token'})).not.toBeInTheDocument();
  });

  test('should be able to view references of a resource', async () => {
    mockTableContext.resourceType = 'exports';

    mutateStore(initialStore, draft => {
      draft.session.resource = {
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
    });

    await initCommonActions([{
      _id: 'export123',
      name: 'Netsuite Export',
    }]);
    const more = screen.getByRole('button', { name: 'more' });

    await userEvent.click(more);
    const viewReferenceButton = screen.getByRole('menuitem', {name: 'Used by'});

    await userEvent.click(viewReferenceButton);
    const dialogBox = screen.getByRole('dialog');

    expect(dialogBox.textContent).toContain('Used by');
    const closeDialogButton = screen.getByTestId('closeModalDialog');

    await userEvent.click(closeDialogButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
