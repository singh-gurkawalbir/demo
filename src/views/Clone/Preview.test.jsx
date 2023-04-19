import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, cleanup, waitForElementToBeRemoved, waitFor, fireEvent } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import ClonePreview from './Preview';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

function initStore(integrationSession) {
  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [
      {
        _id: '5fc5e0e66cfe5b44bb95de70',
        lastModified: '2022-07-27T11:14:41.700Z',
        name: '3PL Central',
        description: 'Testing Integration description',
      },
      {
        _id: '6294909fd5391a2e79b38eff',
        lastModified: '2022-06-01T10:21:47.332Z',
        name: 'Salesforce - NetSuite',
        _connectorId: '5b61ae4aeb538642c26bdbe6',
      },
    ];
    draft.data.resources.flows = [
      {
        _id: '60db46af9433830f8f0e0fe7',
        lastModified: '2021-06-30T02:36:49.734Z',
        name: '3PL Central - FTP',
        description: 'Testing Flows Description',
        disabled: false,
        _integrationId: '5fc5e0e66cfe5b44bb95de70',
      },
      {
        _id: '6294aa3dccb94d35de69481e',
        lastModified: '2022-05-30T11:27:58.128Z',
        name: 'NetSuite Contact to Salesforce Contact Add/Update',
        description: 'Syncs records present in NetSuite Contacts as Salesforce Contacts in real-time. This flow triggers when an update is made to a contact or a new contact is created for a customer that has Salesforce ID present in it. When a new contact is created in NetSuite and is synced successfully to Salesforce, the flow writes back its Salesforce ID to NetSuite contact.',
        disabled: true,
        _integrationId: '6294909fd5391a2e79b38eff',
        _connectorId: '5b61ae4aeb538642c26bdbe6',
      },
    ];
    draft.data.resources.exports = [
      {
        _id: '60dbc5a8a706701ed4a148ac',
        createdAt: '2021-06-30T01:15:20.177Z',
        lastModified: '2021-06-30T02:36:51.936Z',
        name: 'Test 3pl central export',
        description: 'Test 3PL central export description',
        _connectionId: '5fc5e4a46cfe5b44bb95df44',
        apiIdentifier: 'ec742bc9b0',
        asynchronous: true,
        assistant: '3plcentral',
        sandbox: false,
        adaptorType: 'HTTPExport',
      },
      {
        _id: '6294aa2eccb94d35de6947d2',
        createdAt: '2022-05-30T11:27:42.954Z',
        lastModified: '2022-05-30T11:27:44.488Z',
        name: 'Get Contacts From NetSuite',
        _connectionId: '6294909fccb94d35de693596',
        _integrationId: '6294909fd5391a2e79b38eff',
        _connectorId: '5b61ae4aeb538642c26bdbe6',
        externalId: 'netsuite_contact_to_salesforce_contact_export',
        apiIdentifier: 'e158f37624',
        asynchronous: true,
        type: 'distributed',
        adaptorType: 'NetSuiteExport',
      },
    ];
    draft.data.resources.imports = [
      {
        _id: '605b30767904202f31742092',
        createdAt: '2021-03-24T12:28:38.813Z',
        lastModified: '2021-04-29T15:37:16.667Z',
        name: 'FTP Import 1',
        description: 'Test FTP import description',
        _connectionId: '5d529bfbdb0c7b14a6011a57',
        distributed: false,
        sandbox: false,
        adaptorType: 'FTPImport',
      },
      {
        _id: '6294aa3cccb94d35de694808',
        createdAt: '2022-05-30T11:27:56.745Z',
        lastModified: '2022-05-30T11:27:57.238Z',
        name: 'Salesforce Contact Id Write Back to NetSuite',
        _connectionId: '6294909fccb94d35de693596',
        _integrationId: '6294909fd5391a2e79b38eff',
        _connectorId: '5b61ae4aeb538642c26bdbe6',
        externalId: 'netsuite_contact_to_salesforce_contact_import_idwriteback',
        distributed: true,
        apiIdentifier: 'ia26181de1',
        adaptorType: 'NetSuiteDistributedImport',
      },
      {
        _id: '6294aa2fd5391a2e79b3a0b8',
        createdAt: '2022-05-30T11:27:43.058Z',
        lastModified: '2022-05-30T11:27:44.870Z',
        name: 'Post Contacts to Salesforce',
        _connectionId: '629490a0ccb94d35de693598',
        _integrationId: '6294909fd5391a2e79b38eff',
        _connectorId: '5b61ae4aeb538642c26bdbe6',
        idLockTemplate: '{{{id}}}',
        adaptorType: 'SalesforceImport',
      },
    ];
    draft.data.resources.connections = [
      {
        _id: '5d529bfbdb0c7b14a6011a57',
        createdAt: '2019-08-13T11:16:11.951Z',
        lastModified: '2022-06-24T11:44:40.123Z',
        type: 'ftp',
        name: 'FTP Connection',
        offline: true,
      },
      {
        _id: '5fc5e4a46cfe5b44bb95df44',
        createdAt: '2020-12-01T06:37:24.341Z',
        lastModified: '2022-07-27T18:02:24.948Z',
        type: 'http',
        name: '3PL Central Connection',
        assistant: '3plcentral',
      },
      {
        _id: '6294909fccb94d35de693596',
        createdAt: '2022-05-30T09:38:39.897Z',
        lastModified: '2022-05-30T11:18:48.232Z',
        type: 'netsuite',
        name: 'NetSuite Connection [Salesforce - NetSuite (IO)]',
        offline: false,
        _connectorId: '5b61ae4aeb538642c26bdbe6',
        _integrationId: '6294909fd5391a2e79b38eff',
      },
      {
        _id: '629490a0ccb94d35de693598',
        createdAt: '2022-05-30T09:38:40.303Z',
        lastModified: '2022-07-28T10:55:31.583Z',
        type: 'salesforce',
        name: 'Salesforce Connection [Salesforce - NetSuite (IO)]',
        offline: false,
        _connectorId: '5b61ae4aeb538642c26bdbe6',
        _integrationId: '6294909fd5391a2e79b38eff',
      },
    ];
    draft.user.preferences = {
      environment: 'production',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm:ss a',
      drawerOpened: true,
      expand: 'Resources',
      scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
      showReactSneakPeekFromDate: '2019-11-05',
      showReactBetaFromDate: '2019-12-26',
      defaultAShareId: 'own',
      fbBottomDrawerHeight: 301,
      lastLoginAt: '2022-01-25T07:36:20.829Z',
      dashboard: {
        tilesOrder: [
          '5fc5e0e66cfe5b44bb95de70',
        ],
        view: 'tile',
      },
      recentActivity: {
        production: {
          integration: '5fc5e0e66cfe5b44bb95de70',
          flow: '60db46af9433830f8f0e0fe7',
        },
      },
    };
    draft.session.templates = integrationSession;
  });
}

async function initClonePreview(props) {
  const ui = (
    <MemoryRouter
      initialEntries={[{ pathname: props.pathname }]}
        >
      <Route
        path="/clone/:resourceType/:resourceId/preview"
        params={{
          resourceId: props.match.params.resourceId,
          resourceType: props.match.params.resourceType,
        }}
        >
        <ClonePreview {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/LoadResources'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));

describe('Clone Preview', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    cleanup();
  });
  test('Should able to access the Integration clone preview page', async () => {
    const props = {
      match: {
        params: {
          resourceId: '5fc5e0e66cfe5b44bb95de70',
          resourceType: 'integrations',
        },
      },
      pathname: '/clone/integrations/5fc5e0e66cfe5b44bb95de70/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'integrations-5fc5e0e66cfe5b44bb95de70': {
        preview: {
          components: {
            objects: [
              {
                model: 'Integration',
                doc: {
                  _id: '5fc5e0e66cfe5b44bb95de70',
                  lastModified: '2021-09-29T16:17:12.522Z',
                  name: '3PL Central',
                  description: 'Testing Integration Description',
                  readme: 'https://staging.integrator.io/integrations/5fc5e0e66cfe5b44bb95de70/admin/readme/edit/readme ',
                  install: [],
                  sandbox: false,
                  _registeredConnectionIds: [
                    '5d529bfbdb0c7b14a6011a57',
                    '5fc5e4a46cfe5b44bb95df44',
                  ],
                  installSteps: [],
                  uninstallSteps: [],
                  flowGroupings: [],
                  createdAt: '2020-12-01T06:21:26.538Z',
                },
              },
              {
                model: 'Flow',
                doc: {
                  _id: '60db46af9433830f8f0e0fe7',
                  lastModified: '2021-06-30T02:36:49.734Z',
                  name: '3PL Central - FTP',
                  description: 'Testing flows Description',
                  disabled: false,
                  _integrationId: '5fc5e0e66cfe5b44bb95de70',
                  skipRetries: false,
                  pageProcessors: [
                    {
                      responseMapping: {
                        fields: [],
                        lists: [],
                      },
                      type: 'import',
                      _importId: '605b30767904202f31742092',
                    },
                  ],
                  pageGenerators: [
                    {
                      _exportId: '60dbc5a8a706701ed4a148ac',
                      skipRetries: false,
                    },
                  ],
                  createdAt: '2021-06-29T16:13:35.071Z',
                  lastExecutedAt: '2021-06-30T01:55:17.721Z',
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '60dbc5a8a706701ed4a148ac',
                  createdAt: '2021-06-30T01:15:20.177Z',
                  lastModified: '2021-06-30T02:36:51.936Z',
                  name: 'Test 3pl central export',
                  description: 'Test 3PL central export description',
                  _connectionId: '5fc5e4a46cfe5b44bb95df44',
                  apiIdentifier: 'ec742bc9b0',
                  asynchronous: true,
                  assistant: '3plcentral',
                  sandbox: false,
                  assistantMetadata: {
                    resource: 'orders',
                    version: 'latest',
                    operation: 'get_packages_details',
                  },
                  parsers: [],
                  http: {
                    relativeURI: '/orders/3862/packages',
                    method: 'GET',
                    successMediaType: 'json',
                    errorMediaType: 'json',
                    formType: 'assistant',
                  },
                  rawData: '5d4010e14cd24a7c773122ef5d92fdf3fcca446b9e5ac853c6287f70',
                  adaptorType: 'HTTPExport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '605b30767904202f31742092',
                  createdAt: '2021-03-24T12:28:38.813Z',
                  lastModified: '2021-04-29T15:37:16.667Z',
                  name: 'FTP Import 1',
                  description: 'Test FTP Import description',
                  _connectionId: '5d529bfbdb0c7b14a6011a57',
                  distributed: false,
                  apiIdentifier: 'if1d74ac06',
                  oneToMany: false,
                  sandbox: false,
                  file: {
                    fileName: 'walmart-canada-pagination.json',
                    type: 'json',
                  },
                  ftp: {
                    directoryPath: '/ChaitanyaReddyMule/Connector_dev',
                    fileName: 'walmart-canada-pagination.json',
                  },
                  adaptorType: 'FTPImport',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5d529bfbdb0c7b14a6011a57',
                  createdAt: '2019-08-13T11:16:11.951Z',
                  lastModified: '2022-06-24T11:44:40.123Z',
                  type: 'ftp',
                  name: 'FTP Connection',
                  offline: true,
                  debugDate: '2021-02-08T12:50:45.678Z',
                  sandbox: false,
                  ftp: {
                    type: 'sftp',
                    hostURI: 'celigo.files.com',
                    username: 'chaitanyareddy.mule@celigo.com',
                    password: '******',
                    port: 22,
                    usePassiveMode: true,
                    userDirectoryIsRoot: false,
                    useImplicitFtps: true,
                    requireSocketReUse: false,
                  },
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5fc5e4a46cfe5b44bb95df44',
                  createdAt: '2020-12-01T06:37:24.341Z',
                  lastModified: '2022-07-15T06:51:28.160Z',
                  type: 'http',
                  name: '3PL Central Connection',
                  assistant: '3plcentral',
                  offline: false,
                  debugDate: '2021-06-30T02:54:38.481Z',
                  sandbox: false,
                  debugUntil: '2021-06-30T02:54:38.481Z',
                  http: {
                    formType: 'assistant',
                    _iClientId: '5fc5e169269ea947c166510c',
                    mediaType: 'json',
                    baseURI: 'https://secure-wms.com/',
                    ping: {
                      relativeURI: 'orders',
                      method: 'GET',
                      failValues: [],
                      successValues: [],
                    },
                    rateLimit: {
                      failValues: [],
                    },
                    unencrypted: {
                      tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                      userLoginId: 'Celigo_SandBox',
                    },
                    auth: {
                      type: 'oauth',
                      failValues: [],
                      oauth: {
                        tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
                        scope: [],
                        grantType: 'clientcredentials',
                        clientCredentialsLocation: 'basicauthheader',
                        accessTokenBody: '{"grant_type": "client_credentials","tpl":"{b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3}", "user_login_id":"Celigo_SandBox"}',
                      },
                      token: {
                        token: '******',
                        location: 'header',
                        headerName: 'Authorization',
                        scheme: 'Bearer',
                        refreshMethod: 'POST',
                        refreshMediaType: 'urlencoded',
                      },
                    },
                  },
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
      },
    };

    await initStore(integrationSession);
    await initClonePreview(props);
    const cloneIntegrationHeadingNode = screen.getByRole('heading', {name: 'Clone integration'});

    expect(cloneIntegrationHeadingNode).toBeInTheDocument();
    const integrationNameNode = screen.getByRole('textbox', {value: 'Clone - 3PL Central'});

    expect(integrationNameNode).toBeInTheDocument();
    await userEvent.clear(integrationNameNode);
    await userEvent.type(integrationNameNode, 'Succesfully Cloned - 3Pl Central');
    expect(integrationNameNode).toHaveValue('Succesfully Cloned - 3Pl Central');
    const environmentNode = screen.getByRole('radiogroup', {name: 'Environment'});

    expect(environmentNode).toBeInTheDocument();
    const environmentProductionNode = screen.getByRole('radio', {name: 'Production'});

    expect(environmentProductionNode).toBeInTheDocument();
    const environmentSandboxNode = screen.getByRole('radio', {name: 'Sandbox'});

    expect(environmentSandboxNode).toBeInTheDocument();
    await userEvent.click(environmentSandboxNode);
    expect(environmentSandboxNode).toBeChecked();
    expect(environmentProductionNode).not.toBeChecked();
    await userEvent.click(environmentProductionNode);
    expect(environmentSandboxNode).not.toBeChecked();
    expect(environmentProductionNode).toBeChecked();
    const paragraphNode = screen.getByText('The following components will get cloned with this integration.');

    expect(paragraphNode).toBeInTheDocument();
    const flowButtonNode = screen.getByRole('button', {name: 'Flows'});

    expect(flowButtonNode).toBeInTheDocument();
    expect(flowButtonNode).toHaveAttribute('aria-expanded', 'true');
    await fireEvent.click(flowButtonNode);
    expect(flowButtonNode).toHaveAttribute('aria-expanded', 'false');
    const tableNode = screen.getAllByRole('rowgroup');

    expect(tableNode[0].querySelectorAll('thead')).toHaveLength(0);
    expect(tableNode[1].querySelectorAll('tbody')).toHaveLength(0);
    const tableRow = screen.getAllByRole('row', {name: 'Name Description'});

    expect(tableRow[0].querySelectorAll('th')).toHaveLength(2);
    const integrationsButtonNode = screen.getByRole('button', {name: 'Integrations'});

    expect(integrationsButtonNode).toBeInTheDocument();
    expect(integrationsButtonNode).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(integrationsButtonNode);
    expect(integrationsButtonNode).toHaveAttribute('aria-expanded', 'true');
    const exportButtonNode = screen.getByRole('button', {name: 'Exports'});

    expect(exportButtonNode).toBeInTheDocument();
    expect(exportButtonNode).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(exportButtonNode);
    expect(exportButtonNode).toHaveAttribute('aria-expanded', 'true');
    const importButtonNode = screen.getByRole('button', {name: 'Imports'});

    expect(importButtonNode).toBeInTheDocument();
    expect(importButtonNode).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(importButtonNode);
    expect(importButtonNode).toHaveAttribute('aria-expanded', 'true');
    const connectionsButtonNode = screen.getByRole('button', {name: 'Connections'});

    expect(connectionsButtonNode).toBeInTheDocument();
    expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(connectionsButtonNode);
    expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'true');
    const cloneIntegrationButtonNode = screen.getByRole('button', {name: 'Clone integration'});

    expect(cloneIntegrationButtonNode).toBeInTheDocument();
    await userEvent.click(cloneIntegrationButtonNode);
    await waitFor(() => expect(cloneIntegrationButtonNode).not.toBeInTheDocument());
  });
  test('Should able to access the Flow clone preview page', async () => {
    const props = {
      match: {
        params: {
          resourceId: '60db46af9433830f8f0e0fe7',
          resourceType: 'flows',
        },
      },
      pathname: '/clone/flows/60db46af9433830f8f0e0fe7/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'flows-60db46af9433830f8f0e0fe7': {
        preview: {
          components: {
            objects: [
              {
                model: 'Flow',
                doc: {
                  _id: '60db46af9433830f8f0e0fe7',
                  lastModified: '2022-07-27T18:04:57.044Z',
                  name: '3PL Central - FTP',
                  description: 'Testing Flow',
                  disabled: false,
                  _integrationId: '5fc5e0e66cfe5b44bb95de70',
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '60dbc5a8a706701ed4a148ac',
                  createdAt: '2021-06-30T01:15:20.177Z',
                  lastModified: '2022-07-27T18:04:41.999Z',
                  name: 'Test 3pl central export',
                  description: 'Test 3PL central export description',
                  _connectionId: '5fc5e4a46cfe5b44bb95df44',
                  apiIdentifier: 'ec742bc9b0',
                  asynchronous: true,
                  assistant: '3plcentral',
                  adaptorType: 'HTTPExport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '605b30767904202f31742092',
                  createdAt: '2021-03-24T12:28:38.813Z',
                  lastModified: '2022-07-27T18:04:53.906Z',
                  name: 'FTP Import 1',
                  description: 'Test FTP Import description',
                  _connectionId: '5d529bfbdb0c7b14a6011a57',
                  adaptorType: 'FTPImport',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5d529bfbdb0c7b14a6011a57',
                  createdAt: '2019-08-13T11:16:11.951Z',
                  lastModified: '2022-06-24T11:44:40.123Z',
                  type: 'ftp',
                  name: 'FTP Connection',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5fc5e4a46cfe5b44bb95df44',
                  createdAt: '2020-12-01T06:37:24.341Z',
                  lastModified: '2022-07-27T18:02:24.948Z',
                  type: 'http',
                  name: '3PL Central Connection',
                  assistant: '3plcentral',
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
      },
    };

    await initStore(integrationSession);
    await initClonePreview(props);
    waitFor(() => {
      const cloneFlowNode = screen.getByRole('heading', {name: 'Clone flow'});

      expect(cloneFlowNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const flowNameNode = screen.getByRole('textbox', {name: ''});

      expect(flowNameNode).toHaveValue('Clone - 3PL Central - FTP');
      await userEvent.clear(flowNameNode);
      await userEvent.type(flowNameNode, 'Succesfully Cloned - 3PL Central - FTP');
      expect(flowNameNode).toHaveValue('Succesfully Cloned - 3PL Central - FTP');
    });
    waitFor(() => {
      const environmentNode = screen.getByRole('radiogroup', {name: 'Environment'});

      expect(environmentNode).toBeInTheDocument();
    });
    let environmentProductionNode;

    waitFor(() => {
      environmentProductionNode = screen.getByRole('radio', {name: 'Production'});

      expect(environmentProductionNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const environmentSandboxNode = screen.getByRole('radio', {name: 'Sandbox'});

      expect(environmentSandboxNode).toBeInTheDocument();
      await userEvent.click(environmentSandboxNode);
      expect(environmentSandboxNode).toBeChecked();
      expect(environmentProductionNode).not.toBeChecked();
      await userEvent.click(environmentProductionNode);
      expect(environmentSandboxNode).not.toBeChecked();
      expect(environmentProductionNode).toBeChecked();
    });
    waitFor(() => {
      const paragraphNode = screen.getByText('The following components will get cloned with this flow.');

      expect(paragraphNode).toBeInTheDocument();
    });
    let integrationNode;

    waitFor(async () => {
      integrationNode = screen.getByRole('button', {name: 'Please select'});

      expect(integrationNode).toBeInTheDocument();
      await userEvent.click(integrationNode);
    });
    waitFor(() => {
      const menuitemNode = screen.getByRole('menuitem', {name: '3PL Central'});

      expect(menuitemNode).toBeInTheDocument();
      fireEvent.click(menuitemNode);
      waitForElementToBeRemoved(menuitemNode);
      expect(integrationNode).toHaveAccessibleName('3PL Central');
    });
    waitFor(async () => {
      const flowButtonNode = screen.getByRole('button', {name: 'Flows'});

      expect(flowButtonNode).toBeInTheDocument();
      expect(flowButtonNode).toHaveAttribute('aria-expanded', 'true');
      await fireEvent.click(flowButtonNode);
      expect(flowButtonNode).toHaveAttribute('aria-expanded', 'false');
    });
    waitFor(() => {
      const tableNode = screen.getAllByRole('rowgroup');

      expect(tableNode[0].querySelectorAll('thead')).toHaveLength(0);
      expect(tableNode[1].querySelectorAll('tbody')).toHaveLength(0);
    });
    waitFor(() => {
      const tableRow = screen.getAllByRole('row', {name: 'Name Description'});

      expect(tableRow[0].querySelectorAll('th')).toHaveLength(2);
    });
    waitFor(async () => {
      const exportButtonNode = screen.getByRole('button', {name: 'Exports'});

      expect(exportButtonNode).toBeInTheDocument();
      expect(exportButtonNode).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(exportButtonNode);
      expect(exportButtonNode).toHaveAttribute('aria-expanded', 'true');
    });
    waitFor(async () => {
      const importButtonNode = screen.getByRole('button', {name: 'Imports'});

      expect(importButtonNode).toBeInTheDocument();
      expect(importButtonNode).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(importButtonNode);
      expect(importButtonNode).toHaveAttribute('aria-expanded', 'true');
    });
    waitFor(async () => {
      const connectionsButtonNode = screen.getByRole('button', {name: 'Connections'});

      expect(connectionsButtonNode).toBeInTheDocument();
      expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(connectionsButtonNode);
      expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'true');
    });
  });
  test('Should able to access the Integration App clone preview page', async () => {
    const props = {
      match: {
        params: {
          resourceId: '6294909fd5391a2e79b38eff',
          resourceType: 'integrations',
        },
      },
      pathname: '/clone/integrations/6294909fd5391a2e79b38eff/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'integrations-6294909fd5391a2e79b38eff': {
        preview: {
          components: {
            objects: [
              {
                model: 'Integration',
                doc: {
                  _id: '6294909fd5391a2e79b38eff',
                  lastModified: '2022-06-01T10:21:47.332Z',
                  name: 'Salesforce - NetSuite',
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                },
              },
              {
                model: 'Flow',
                doc: {
                  _id: '6294aa3dccb94d35de69481e',
                  lastModified: '2022-05-30T11:27:58.128Z',
                  name: 'NetSuite Contact to Salesforce Contact Add/Update',
                  description: 'Syncs records present in NetSuite Contacts as Salesforce Contacts in real-time. This flow triggers when an update is made to a contact or a new contact is created for a customer that has Salesforce ID present in it. When a new contact is created in NetSuite and is synced successfully to Salesforce, the flow writes back its Salesforce ID to NetSuite contact.',
                  disabled: true,
                  _integrationId: '6294909fd5391a2e79b38eff',
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '6294aa2eccb94d35de6947d2',
                  createdAt: '2022-05-30T11:27:42.954Z',
                  lastModified: '2022-05-30T11:27:44.488Z',
                  name: 'Get Contacts From NetSuite',
                  _connectionId: '6294909fccb94d35de693596',
                  _integrationId: '6294909fd5391a2e79b38eff',
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                  adaptorType: 'NetSuiteExport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '6294aa2fd5391a2e79b3a0b8',
                  createdAt: '2022-05-30T11:27:43.058Z',
                  lastModified: '2022-05-30T11:27:44.870Z',
                  name: 'Post Contacts to Salesforce',
                  parsers: [

                  ],
                  _connectionId: '629490a0ccb94d35de693598',
                  _integrationId: '6294909fd5391a2e79b38eff',
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                  externalId: 'netsuite_contact_to_salesforce_contact_import',
                  adaptorType: 'SalesforceImport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '6294aa3cccb94d35de694808',
                  createdAt: '2022-05-30T11:27:56.745Z',
                  lastModified: '2022-05-30T11:27:57.238Z',
                  name: 'Salesforce Contact Id Write Back to NetSuite',
                  parsers: [

                  ],
                  _connectionId: '6294909fccb94d35de693596',
                  _integrationId: '6294909fd5391a2e79b38eff',
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                  externalId: 'netsuite_contact_to_salesforce_contact_import_idwriteback',
                  adaptorType: 'NetSuiteDistributedImport',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '6294909fccb94d35de693596',
                  createdAt: '2022-05-30T09:38:39.897Z',
                  lastModified: '2022-05-30T11:18:48.232Z',
                  type: 'netsuite',
                  name: 'NetSuite Connection [Salesforce - NetSuite (IO)]',
                  offline: false,
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                  _integrationId: '6294909fd5391a2e79b38eff',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '629490a0ccb94d35de693598',
                  createdAt: '2022-05-30T09:38:40.303Z',
                  lastModified: '2022-07-28T10:55:31.583Z',
                  type: 'salesforce',
                  name: 'Salesforce Connection [Salesforce - NetSuite (IO)]',
                  offline: false,
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                  _integrationId: '6294909fd5391a2e79b38eff',
                },
              },
              {
                model: 'Script',
                doc: {
                  _id: '5f7abcb05fc935549ceb214a',
                  lastModified: '2020-11-09T12:29:30.356Z',
                  createdAt: '2020-10-05T06:26:56.840Z',
                  name: 'SFNSIA Update Integration Status Script',
                  description: 'This script is required to execute preSavePage for Salesforce realtime export records. It updates the inprogress integration status for every realtime record trigger from salesforce',
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
      },
    };

    await initStore(integrationSession);
    await initClonePreview(props);
    waitFor(() => {
      const cloneIntegrationNode = screen.getByRole('heading', {name: 'Clone integration'});

      expect(cloneIntegrationNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const tagNode = screen.getByRole('textbox');

      expect(tagNode).toHaveAttribute('name', 'tag');
      await userEvent.type(tagNode, 'testing tag');
      expect(tagNode).toHaveAttribute('value', 'testing tag');
    });
    waitFor(() => {
      const environmentNode = screen.getByRole('radiogroup', {name: 'Environment'});

      expect(environmentNode).toBeInTheDocument();
    });
    let environmentProductionNode;

    waitFor(() => {
      environmentProductionNode = screen.getByRole('radio', {name: 'Production'});

      expect(environmentProductionNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const environmentSandboxNode = screen.getByRole('radio', {name: 'Sandbox'});

      expect(environmentSandboxNode).toBeInTheDocument();
      await userEvent.click(environmentSandboxNode);
      expect(environmentSandboxNode).toBeChecked();
      expect(environmentProductionNode).not.toBeChecked();
      await userEvent.click(environmentProductionNode);
      expect(environmentSandboxNode).not.toBeChecked();
      expect(environmentProductionNode).toBeChecked();
    });
    waitFor(() => {
      const paragraphNode = screen.getByText('The following components will get cloned with this integration.');

      expect(paragraphNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const flowButtonNode = screen.getByRole('button', {name: 'Flows'});

      expect(flowButtonNode).toBeInTheDocument();
      expect(flowButtonNode).toHaveAttribute('aria-expanded', 'true');
      await fireEvent.click(flowButtonNode);
      expect(flowButtonNode).toHaveAttribute('aria-expanded', 'false');
    });
    waitFor(() => {
      const tableNode = screen.getAllByRole('rowgroup');

      expect(tableNode[0].querySelectorAll('thead')).toHaveLength(0);
      expect(tableNode[1].querySelectorAll('tbody')).toHaveLength(0);
    });
    waitFor(() => {
      const tableRow = screen.getAllByRole('row', {name: 'Name Description'});

      expect(tableRow[0].querySelectorAll('th')).toHaveLength(2);
    });
    waitFor(async () => {
      const integrationsButtonNode = screen.getByRole('button', {name: 'Integrations'});

      expect(integrationsButtonNode).toBeInTheDocument();
      expect(integrationsButtonNode).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(integrationsButtonNode);
      expect(integrationsButtonNode).toHaveAttribute('aria-expanded', 'true');
    });
    waitFor(async () => {
      const exportButtonNode = screen.getByRole('button', {name: 'Exports'});

      expect(exportButtonNode).toBeInTheDocument();
      expect(exportButtonNode).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(exportButtonNode);
      expect(exportButtonNode).toHaveAttribute('aria-expanded', 'true');
    });
    waitFor(async () => {
      const importButtonNode = screen.getByRole('button', {name: 'Imports'});

      expect(importButtonNode).toBeInTheDocument();
      expect(importButtonNode).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(importButtonNode);
      expect(importButtonNode).toHaveAttribute('aria-expanded', 'true');
    });
    waitFor(async () => {
      const connectionsButtonNode = screen.getByRole('button', {name: 'Connections'});

      expect(connectionsButtonNode).toBeInTheDocument();
      expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(connectionsButtonNode);
      expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'true');
    });
    waitFor(async () => {
      const scriptButtonNode = screen.getByRole('button', {name: 'Scripts'});

      expect(scriptButtonNode).toBeInTheDocument();
      expect(scriptButtonNode).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(scriptButtonNode);
      expect(scriptButtonNode).toHaveAttribute('aria-expanded', 'true');
    });
    waitFor(async () => {
      const cloneIntegrationButtonNode = screen.getByRole('button', {name: 'Clone integration'});

      expect(cloneIntegrationButtonNode).toBeInTheDocument();
      await userEvent.click(cloneIntegrationButtonNode);
      expect(cloneIntegrationButtonNode).not.toBeInTheDocument();
    });
  });
  test('Should able to access the Integration clone preview page of type sandbox', async () => {
    const props = {
      match: {
        params: {
          resourceId: '5fc5e0e66cfe5b44bb95de70',
          resourceType: 'integrations',
        },
      },
      pathname: '/clone/integrations/5fc5e0e66cfe5b44bb95de70/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'integrations-5fc5e0e66cfe5b44bb95de70': {
        preview: {
          components: {
            objects: [
              {
                model: 'Integration',
                doc: {
                  _id: '5fc5e0e66cfe5b44bb95de70',
                  lastModified: '2021-09-29T16:17:12.522Z',
                  name: '3PL Central',
                  description: 'Testing Integration Description',
                  readme: 'https://staging.integrator.io/integrations/5fc5e0e66cfe5b44bb95de70/admin/readme/edit/readme ',
                  install: [],
                  sandbox: false,
                },
              },
              {
                model: 'Flow',
                doc: {
                  _id: '60db46af9433830f8f0e0fe7',
                  lastModified: '2021-06-30T02:36:49.734Z',
                  name: '3PL Central - FTP',
                  description: 'Testing flows Description',
                  disabled: false,
                  _integrationId: '5fc5e0e66cfe5b44bb95de70',
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '60dbc5a8a706701ed4a148ac',
                  createdAt: '2021-06-30T01:15:20.177Z',
                  lastModified: '2021-06-30T02:36:51.936Z',
                  name: 'Test 3pl central export',
                  description: 'Test 3PL central export description',
                  _connectionId: '5fc5e4a46cfe5b44bb95df44',
                  assistant: '3plcentral',
                  sandbox: false,
                  adaptorType: 'HTTPExport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '605b30767904202f31742092',
                  createdAt: '2021-03-24T12:28:38.813Z',
                  lastModified: '2021-04-29T15:37:16.667Z',
                  name: 'FTP Import 1',
                  description: 'Test FTP Import description',
                  _connectionId: '5d529bfbdb0c7b14a6011a57',
                  sandbox: false,
                  adaptorType: 'FTPImport',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5d529bfbdb0c7b14a6011a57',
                  createdAt: '2019-08-13T11:16:11.951Z',
                  lastModified: '2022-06-24T11:44:40.123Z',
                  type: 'ftp',
                  name: 'FTP Connection',
                  offline: true,
                  debugDate: '2021-02-08T12:50:45.678Z',
                  sandbox: false,
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5fc5e4a46cfe5b44bb95df44',
                  createdAt: '2020-12-01T06:37:24.341Z',
                  lastModified: '2022-07-15T06:51:28.160Z',
                  type: 'http',
                  name: '3PL Central Connection',
                  assistant: '3plcentral',
                  offline: false,
                  debugDate: '2021-06-30T02:54:38.481Z',
                  sandbox: false,
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
      },
    };

    initStore(integrationSession);
    await initClonePreview(props);
    waitFor(() => {
      const cloneIntegrationHeadingNode = screen.getByRole('heading', {name: 'Clone integration'});

      expect(cloneIntegrationHeadingNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const integrationNameNode = screen.getByRole('textbox', {value: 'Clone - 3PL Central'});

      expect(integrationNameNode).toBeInTheDocument();
      await userEvent.clear(integrationNameNode);
      await userEvent.type(integrationNameNode, 'Succesfully Cloned - 3Pl Central');
      expect(integrationNameNode).toHaveValue('Succesfully Cloned - 3Pl Central');
    });
    waitFor(() => {
      const environmentNode = screen.getByRole('radiogroup', {name: 'Environment'});

      expect(environmentNode).toBeInTheDocument();
    });
    let environmentProductionNode;

    waitFor(() => {
      environmentProductionNode = screen.getByRole('radio', {name: 'Production'});

      expect(environmentProductionNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const environmentSandboxNode = screen.getByRole('radio', {name: 'Sandbox'});

      expect(environmentSandboxNode).toBeInTheDocument();
      await userEvent.click(environmentSandboxNode);
      expect(environmentSandboxNode).toBeChecked();
      expect(environmentProductionNode).not.toBeChecked();
    });
    waitFor(() => {
      const paragraphNode = screen.getByText('The following components will get cloned with this integration.');

      expect(paragraphNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const flowButtonNode = screen.getByRole('button', {name: 'Flows'});

      expect(flowButtonNode).toBeInTheDocument();
      expect(flowButtonNode).toHaveAttribute('aria-expanded', 'true');
      await fireEvent.click(flowButtonNode);
      expect(flowButtonNode).toHaveAttribute('aria-expanded', 'false');
    });
    waitFor(() => {
      const tableNode = screen.getAllByRole('rowgroup');

      expect(tableNode[0].querySelectorAll('thead')).toHaveLength(0);
      expect(tableNode[1].querySelectorAll('tbody')).toHaveLength(0);
    });
    waitFor(() => {
      const tableRow = screen.getAllByRole('row', {name: 'Name Description'});

      expect(tableRow[0].querySelectorAll('th')).toHaveLength(2);
    });
    waitFor(async () => {
      const integrationsButtonNode = screen.getByRole('button', {name: 'Integrations'});

      expect(integrationsButtonNode).toBeInTheDocument();
      expect(integrationsButtonNode).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(integrationsButtonNode);
      expect(integrationsButtonNode).toHaveAttribute('aria-expanded', 'true');
    });
    waitFor(async () => {
      const exportButtonNode = screen.getByRole('button', {name: 'Exports'});

      expect(exportButtonNode).toBeInTheDocument();
      expect(exportButtonNode).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(exportButtonNode);
      expect(exportButtonNode).toHaveAttribute('aria-expanded', 'true');
    });
    waitFor(async () => {
      const importButtonNode = screen.getByRole('button', {name: 'Imports'});

      expect(importButtonNode).toBeInTheDocument();
      expect(importButtonNode).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(importButtonNode);
      expect(importButtonNode).toHaveAttribute('aria-expanded', 'true');
    });
    waitFor(async () => {
      const connectionsButtonNode = screen.getByRole('button', {name: 'Connections'});

      expect(connectionsButtonNode).toBeInTheDocument();
      expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(connectionsButtonNode);
      expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'true');
    });
    waitFor(async () => {
      const cloneIntegrationButtonNode = screen.getByRole('button', {name: 'Clone integration'});

      expect(cloneIntegrationButtonNode).toBeInTheDocument();
      await userEvent.click(cloneIntegrationButtonNode);
      expect(cloneIntegrationButtonNode).not.toBeInTheDocument();
    });
  });
  test('Should able to acess the Integration Clone preview page by using created components which has Integrations', async () => {
    const props = {
      match: {
        params: {
          resourceId: '5fc5e0e66cfe5b44bb95de70',
          resourceType: 'integrations',
        },
      },
      pathname: '/clone/integrations/5fc5e0e66cfe5b44bb95de70/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'integrations-5fc5e0e66cfe5b44bb95de70': {

        createdComponents: [
          {
            model: 'Integration',
            doc: {
              _id: '5fc5e0e66cfe5b44bb95de70',
              lastModified: '2021-09-29T16:17:12.522Z',
              name: '3PL Central',
              description: 'Testing Integration Description',
              readme: 'https://staging.integrator.io/integrations/5fc5e0e66cfe5b44bb95de70/admin/readme/edit/readme ',
              sandbox: false,
            },
          },
          {
            model: 'Flow',
            doc: {
              _id: '60db46af9433830f8f0e0fe7',
              lastModified: '2021-06-30T02:36:49.734Z',
              name: '3PL Central - FTP',
              description: 'Testing flows Description',
              disabled: false,
              _integrationId: '5fc5e0e66cfe5b44bb95de70',
            },
          },
          {
            model: 'Export',
            doc: {
              _id: '60dbc5a8a706701ed4a148ac',
              createdAt: '2021-06-30T01:15:20.177Z',
              lastModified: '2021-06-30T02:36:51.936Z',
              name: 'Test 3pl central export',
              description: 'Test 3PL central export description',
              _connectionId: '5fc5e4a46cfe5b44bb95df44',
              apiIdentifier: 'ec742bc9b0',
              asynchronous: true,
              assistant: '3plcentral',
              sandbox: false,
              adaptorType: 'HTTPExport',
            },
          },
          {
            model: 'Import',
            doc: {
              _id: '605b30767904202f31742092',
              createdAt: '2021-03-24T12:28:38.813Z',
              lastModified: '2021-04-29T15:37:16.667Z',
              name: 'FTP Import 1',
              description: 'Test FTP Import description',
              _connectionId: '5d529bfbdb0c7b14a6011a57',
              sandbox: false,
              adaptorType: 'FTPImport',
            },
          },
          {
            model: 'Connection',
            doc: {
              _id: '5d529bfbdb0c7b14a6011a57',
              createdAt: '2019-08-13T11:16:11.951Z',
              lastModified: '2022-06-24T11:44:40.123Z',
              type: 'ftp',
              name: 'FTP Connection',
              sandbox: false,
            },
          },
          {
            model: 'Connection',
            doc: {
              _id: '5fc5e4a46cfe5b44bb95df44',
              createdAt: '2020-12-01T06:37:24.341Z',
              lastModified: '2022-07-15T06:51:28.160Z',
              type: 'http',
              name: '3PL Central Connection',
              assistant: '3plcentral',
              offline: false,
              sandbox: false,
            },
          },
        ],
      },
    };

    initStore(integrationSession);
    await initClonePreview(props);
    waitFor(() => {
      const loading = screen.getByText('Loading');

      expect(loading).toBeInTheDocument();
    });
  });
  test('Should able to acess the Integration Clone preview page by using created components which has no Integrations', async () => {
    const props = {
      match: {
        params: {
          resourceId: '60db46af9433830f8f0e0fe7',
          resourceType: 'flows',
        },
      },
      pathname: '/clone/flows/60db46af9433830f8f0e0fe7/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'flows-60db46af9433830f8f0e0fe7': {
        createdComponents: [
          {
            model: 'Flow',
            doc: {
              _id: '60db46af9433830f8f0e0fe7',
              lastModified: '2022-07-27T18:04:57.044Z',
              name: '3PL Central - FTP',
              description: 'Testing Flow',
              disabled: false,
              _integrationId: '5fc5e0e66cfe5b44bb95de70',
            },
          },
          {
            model: 'Export',
            doc: {
              _id: '60dbc5a8a706701ed4a148ac',
              createdAt: '2021-06-30T01:15:20.177Z',
              lastModified: '2022-07-27T18:04:41.999Z',
              name: 'Test 3pl central export',
              description: 'Test 3PL central export description',
              _connectionId: '5fc5e4a46cfe5b44bb95df44',
              apiIdentifier: 'ec742bc9b0',
              asynchronous: true,
              assistant: '3plcentral',
              oneToMany: false,
              sandbox: false,
              adaptorType: 'HTTPExport',
            },
          },
          {
            model: 'Import',
            doc: {
              _id: '605b30767904202f31742092',
              createdAt: '2021-03-24T12:28:38.813Z',
              lastModified: '2022-07-27T18:04:53.906Z',
              name: 'FTP Import 1',
              description: 'Test FTP Import description',
              _connectionId: '5d529bfbdb0c7b14a6011a57',
              distributed: false,
              apiIdentifier: 'if1d74ac06',
              oneToMany: false,
              sandbox: false,
              adaptorType: 'FTPImport',
            },
          },
          {
            model: 'Connection',
            doc: {
              _id: '5d529bfbdb0c7b14a6011a57',
              createdAt: '2019-08-13T11:16:11.951Z',
              lastModified: '2022-06-24T11:44:40.123Z',
              type: 'ftp',
              name: 'FTP Connection',
              offline: true,
              debugDate: '2021-02-08T12:50:45.678Z',
              sandbox: false,
            },
          },
          {
            model: 'Connection',
            doc: {
              _id: '5fc5e4a46cfe5b44bb95df44',
              createdAt: '2020-12-01T06:37:24.341Z',
              lastModified: '2022-07-27T18:02:24.948Z',
              type: 'http',
              name: '3PL Central Connection',
              assistant: '3plcentral',
              offline: false,
              debugDate: '2021-06-30T02:54:38.481Z',
              sandbox: false,
            },
          },
        ],
      },
    };

    initStore(integrationSession);
    await initClonePreview(props);
    waitFor(() => {
      const loading = screen.getByText('Loading');

      expect(loading).toBeInTheDocument();
    });
  });
  test('Should able to acess the Export Clone preview page by using created components which has no Integrations and flows', async () => {
    const props = {
      match: {
        params: {
          resourceId: '60dbc5a8a706701ed4a148ac',
          resourceType: 'exports',
        },
      },
      pathname: '/clone/exports/60dbc5a8a706701ed4a148ac/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'exports-60dbc5a8a706701ed4a148ac': {
        createdComponents: [
          {
            model: 'Export',
            doc: {
              _id: '60dbc5a8a706701ed4a148ac',
              createdAt: '2021-06-30T01:15:20.177Z',
              lastModified: '2022-07-27T18:04:41.999Z',
              name: 'Test 3pl central export',
              description: 'Test 3PL central export description',
              _connectionId: '5fc5e4a46cfe5b44bb95df44',
              apiIdentifier: 'ec742bc9b0',
              asynchronous: true,
              assistant: '3plcentral',
              adaptorType: 'HTTPExport',
            },
          },
          {
            model: 'Connection',
            doc: {
              _id: '5fc5e4a46cfe5b44bb95df44',
              createdAt: '2020-12-01T06:37:24.341Z',
              lastModified: '2022-07-27T18:02:24.948Z',
              type: 'http',
              name: '3PL Central Connection',
              assistant: '3plcentral',
            },
          },
        ],
      },
    };

    initStore(integrationSession);
    await initClonePreview(props);
    waitFor(() => {
      const loading = screen.getByText('Loading');

      expect(loading).toBeInTheDocument();
    });
  });
});

