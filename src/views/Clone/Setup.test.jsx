/* eslint-disable jest/max-expects */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, cleanup, within, waitFor } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import Clone from './Setup';
import { mutateStore, reduxStore, renderWithProviders } from '../../test/test-utils';
import { runServer } from '../../test/api/server';

let initialStore;

function initStore(integrationSession, integrationApps) {
  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [
      {
        _id: '5fc5e0e66cfe5b44bb95de70',
        lastModified: '2022-07-27T11:14:41.700Z',
        name: '3PL Central',
        description: 'Testing Integration description',
        sandbox: false,
        installSteps: [{
          name: 'FTP Connection',
          _connectionId: '5d529bfbdb0c7b14a6011a57',
          description: 'Please configure FTP connection',
          type: 'Connection',
          completed: false,
          options: {
            connectionType: 'ftp',
          },
          isCurrentStep: true,
        },
        {
          name: '3PL Central Connection',
          _connectionId: '5fc5e4a46cfe5b44bb95df44',
          description: 'Please configure 3PL Central connection',
          type: 'Connection',
          completed: false,
          options: {
            connectionType: '3plcentral',
          },
        }],
      },
      {
        _id: '619249e805f85b2022e086bd',
        lastModified: '2021-11-15T11:53:47.337Z',
        name: 'Test Export to Test Import',
        description: 'Test Integration',
        readme: 'testing',
        mode: 'settings',
        sandbox: false,
        _templateId: '5c261974e53d9a2ecf6ad887',
        installSteps: [
          {
            name: 'NetSuite Connection',
            completed: true,
            type: 'connection',
            sourceConnection: {
              type: 'netsuite',
              name: 'NetSuite Connection',
            },
          },
          {
            name: 'Salesforce Connection',
            completed: true,
            type: 'connection',
            sourceConnection: {
              type: 'salesforce',
              name: 'Salesforce Connection',
            },
          },
          {
            name: 'Integrator Bundle',
            description: 'Please install Integrator bundle in NetSuite account',
            completed: true,
            type: 'url',
            url: 'https://tstdrv1934805.app.netsuite.com/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV916910&domain=PRODUCTION&config=F&id=20038',
          },
          {
            name: 'Integrator Adaptor Package',
            description: 'Please install Integrator bundle in Salesforce account',
            completed: true,
            type: 'url',
            url: 'https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3m000002Komn',
          },
          {
            name: 'Copy resources now from template zip',
            completed: true,
            type: 'template_zip',
            templateZip: true,
          },
        ],
      },
    ];
    draft.data.resources.flows = [
      {
        _id: '60db46af9433830f8f0e0fe7',
        lastModified: '2021-06-30T02:36:49.734Z',
        name: '3PL Central - FTP',
        description: 'Testing Flows Description',
      },
      {
        _id: '60db46af9433830f8f0e0fe8',
        lastModified: '2021-06-30T02:36:49.734Z',
        description: 'Testing Flows Description',
        disabled: false,
        sandbox: false,
        skipRetries: false,
      },
      {
        _id: '61924a4aaba738048023c161',
        lastModified: '2021-11-15T11:53:47.252Z',
        name: 'Test flow 2',
        description: 'This description.',
        disabled: true,
        _integrationId: '619249e805f85b2022e086bd',
        skipRetries: false,
        free: false,
        _templateId: '5c261974e53d9a2ecf6ad887',
        _sourceId: '61506aa61ac0cc69b5be2670',
        wizardState: 'done',
        autoResolveMatchingTraceKeys: true,
      },
    ];
    draft.data.resources.exports = [
      {
        _id: '60dbc5a8a706701ed4a148ac',
        name: 'Test 3pl central export',
        description: 'Test 3PL central export description',
        _connectionId: '5fc5e4a46cfe5b44bb95df44',
        assistant: '3plcentral',
        adaptorType: 'HTTPExport',
      },
      {
        _id: '61924a46aba738048023c0df',
        name: 'Test export',
        description: 'Test export description.',
        _connectionId: '5f573f1a87fe9d2ebedd30e5',
        _sourceId: '61506aa31ac0cc69b5be2602',
        type: 'delta',
        _templateId: '5c261974e53d9a2ecf6ad887',
        adaptorType: 'SalesforceExport',
      },
    ];
    draft.data.resources.imports = [
      {
        _id: '605b30767904202f31742092',
        name: 'FTP Import 1',
        description: 'Test FTP import description',
        _connectionId: '5d529bfbdb0c7b14a6011a57',
        sandbox: false,
        adaptorType: 'FTPImport',
      },
      {
        _id: '61924a47aba738048023c0f7',
        name: 'Test Import',
        description: 'Test Import Description',
        _connectionId: '5d4017fb5663022451fdf1ad',
        _sourceId: '61506aa41ac0cc69b5be2610',
        _templateId: '5c261974e53d9a2ecf6ad887',
        adaptorType: 'NetSuiteDistributedImport',
      },
    ];
    draft.data.resources.connections = [
      {
        _id: '5d529bfbdb0c7b14a6011a57',
        type: 'ftp',
        name: 'FTP Connection',
        offline: true,
        sandbox: false,
      },
      {
        _id: '5fc5e4a46cfe5b44bb95df44',
        type: 'http',
        name: '3PL Central Connection',
        assistant: '3plcentral',
        offline: false,
        sandbox: false,
      },
      {
        _id: '5d4017fb5663022451fdf1ad',
        type: 'netsuite',
        name: 'Test Connection 1',
        offline: false,
        sandbox: false,
      },
      {
        _id: '5f573f1a87fe9d2ebedd30e5',
        type: 'salesforce',
        name: 'Test Connection 2',
        offline: false,
        sandbox: false,
      },
    ];
    draft.session.templates = integrationSession;
    draft.session.integrationApps = integrationApps;
    draft.data.scripts = [{
      _id: '61924a2caba738048023c093',
      lastModified: '2021-11-15T11:53:16.445Z',
      createdAt: '2021-11-15T11:53:16.272Z',
      name: 'SFNSIOContent-Type1.js',
      description: '',
      _sourceId: '61506a881ac0cc69b5be25c3',
    }];
  });
}

async function initClone(props) {
  const ui = (
    <MemoryRouter
      initialEntries={[{ pathname: props.pathname }]}
    >
      <Route
        path="/clone/:resourceType/:resourceId/setup"
        params={{
          resourceId: 'props.resourceId',
          resourceType: 'props.resourceType',
        }}
        >
        <Clone />
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
jest.mock('../../components/ResourceSetup/Drawer', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/ResourceSetup/Drawer'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));

const mockHistoryBack = jest.fn();
const mockHistoryPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryBack,
    push: mockHistoryPush,
    replace: mockReplace,
  }),
}));

describe('clone Setup', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = reduxStore;

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
  test('should able to access the setup page which has is installed failure as false and click on configure', async () => {
    const integrationSession = {
      'flows-60db46af9433830f8f0e0fe7': {
        preview: {
          components: {
            objects: [
              {
                model: 'Flow',
                doc: {
                  _id: '60db46af9433830f8f0e0fe7',
                  name: '3PL Central - FTP',
                  description: 'Testing Flow',
                  disabled: false,
                  _integrationId: '5fc5e0e66cfe5b44bb95de70',
                  skipRetries: false,
                  autoResolveMatchingTraceKeys: true,
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '60dbc5a8a706701ed4a148ac',
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
                  type: 'ftp',
                  name: 'FTP Connection',
                  sandbox: false,
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5fc5e4a46cfe5b44bb95df44',
                  type: 'http',
                  name: '3PL Central Connection',
                  assistant: '3plcentral',
                  offline: false,
                  sandbox: false,
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
        installSteps: [
          {
            name: 'FTP Connection',
            _connectionId: '5d529bfbdb0c7b14a6011a57',
            description: 'Please configure FTP connection',
            type: 'Connection',
            completed: false,
            options: {
              connectionType: 'ftp',
            },
          },
          {
            name: '3PL Central Connection',
            _connectionId: '5fc5e4a46cfe5b44bb95df44',
            description: 'Please configure 3PL Central connection',
            type: 'Connection',
            completed: false,
            options: {
              connectionType: '3plcentral',
            },
            isCurrentStep: true,
          },
        ],
        connectionMap: {
          '5d529bfbdb0c7b14a6011a57': {
            _id: '5d529bfbdb0c7b14a6011a57',
            type: 'ftp',
            name: 'FTP Connection',
            offline: true,
            sandbox: false,
          },
          '5fc5e4a46cfe5b44bb95df44': {
            _id: '5fc5e4a46cfe5b44bb95df44',
            type: 'http',
            name: '3PL Central Connection',
            assistant: '3plcentral',
            offline: false,
            sandbox: false,
          },
        },
        data: {
          name: 'Clone - 3PL Central - FTP',
          sandbox: false,
          _integrationId: '5fc5e0e66cfe5b44bb95de70',
          _flowGroupingId: null,
        },
      },
    };
    const props = {
      pathname: '/clone/flows/60db46af9433830f8f0e0fe7/setup',
      resourceId: '60db46af9433830f8f0e0fe7',
      resourceType: 'flows',

    };

    await initStore(integrationSession);

    await initClone(props);
    waitFor(() => {
      const setupNode = screen.getByText('Setup');

      expect(setupNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const goBackButtonNode = screen.getAllByRole('button');

      expect(goBackButtonNode[0]).toHaveAttribute('type', 'button');
      await userEvent.click(goBackButtonNode[0]);
      expect(mockHistoryBack).toHaveBeenCalledTimes(1);
    });
    waitFor(() => {
      const headingNode1 = screen.getByRole('heading', {name: '1'});

      expect(headingNode1).toBeInTheDocument();
    });
    waitFor(() => {
      const headingNode2 = screen.getByRole('heading', {name: '2'});

      expect(headingNode2).toBeInTheDocument();
    });
    waitFor(() => {
      const list = screen.getByRole('list');
      const { getAllByRole } = within(list);
      const items = getAllByRole('listitem');
      const names = items.map(item => item.textContent);

      expect(names).toMatchInlineSnapshot(`
      Array [
        "Setup",
        " 3PL Central - FTP ",
      ]
    `);
    });
    waitFor(() => {
      const ftpConnectionTextNode = screen.getByText('FTP Connection');

      expect(ftpConnectionTextNode).toBeInTheDocument();
    });
    waitFor(() => {
      const threeplConnectionTextNode = screen.getByText('3PL Central Connection');

      expect(threeplConnectionTextNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const configureNode = screen.getAllByRole('button', {name: 'Configure'});

      expect(configureNode[0]).toBeInTheDocument();
      expect(configureNode[1]).toBeInTheDocument();
      await userEvent.click(configureNode[0]);
      expect(mockDispatchFn).toHaveBeenCalledTimes(2);
      await userEvent.click(configureNode[1]);
      expect(mockDispatchFn).toHaveBeenCalledTimes(3);
    });
  });
  test('should able to access the setup page which has is installed failure as true and click on configure', async () => {
    const integrationSession = {
      'flows-60db46af9433830f8f0e0fe7': {
        preview: {
          components: {
            objects: [
              {
                model: 'Flow',
                doc: {
                  _id: '60db46af9433830f8f0e0fe7',
                  name: '3PL Central - FTP',
                  description: 'Testing Flow',
                  disabled: false,
                  _integrationId: '5fc5e0e66cfe5b44bb95de70',
                  skipRetries: false,
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '60dbc5a8a706701ed4a148ac',
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
                  type: 'ftp',
                  name: 'FTP Connection',
                  offline: true,
                  sandbox: false,
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5fc5e4a46cfe5b44bb95df44',
                  type: 'http',
                  name: '3PL Central Connection',
                  assistant: '3plcentral',
                  offline: false,
                  sandbox: false,
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
        installSteps: [
          {
            name: 'FTP Connection',
            _connectionId: '5d529bfbdb0c7b14a6011a57',
            description: 'Please configure FTP connection',
            type: 'Connection',
            completed: false,
            options: {
              connectionType: 'ftp',
            },
          },
          {
            name: '3PL Central Connection',
            _connectionId: '5fc5e4a46cfe5b44bb95df44',
            description: 'Please configure 3PL Central connection',
            type: 'Connection',
            completed: false,
            options: {
              connectionType: '3plcentral',
            },
            isCurrentStep: true,
          },
        ],
        connectionMap: {
          '5d529bfbdb0c7b14a6011a57': {
            _id: '5d529bfbdb0c7b14a6011a57',
            type: 'ftp',
            name: 'FTP Connection',
            offline: true,
            sandbox: false,
          },
          '5fc5e4a46cfe5b44bb95df44': {
            _id: '5fc5e4a46cfe5b44bb95df44',
            type: 'http',
            name: '3PL Central Connection',
            assistant: '3plcentral',
            offline: false,
            sandbox: false,
          },
        },
        data: {
          name: 'Clone - 3PL Central - FTP',
          sandbox: false,
          _integrationId: '5fc5e0e66cfe5b44bb95de70',
          _flowGroupingId: null,
        },
        isInstallFailed: true,
      },
    };
    const props = {
      pathname: '/clone/flows/60db46af9433830f8f0e0fe7/setup',
      resourceId: '60db46af9433830f8f0e0fe7',
      resourceType: 'flows',

    };

    await initStore(integrationSession);

    await initClone(props);
    waitFor(() => {
      const setupNode = screen.getByText('Setup');

      expect(setupNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const goBackButtonNode = screen.getAllByRole('button');

      expect(goBackButtonNode[0]).toHaveAttribute('type', 'button');
      await userEvent.click(goBackButtonNode[0]);
    });
    waitFor(() => {
      const list = screen.getByRole('list');
      const { getAllByRole } = within(list);
      const items = getAllByRole('listitem');
      const names = items.map(item => item.textContent);

      expect(names).toMatchInlineSnapshot(`
      Array [
        "Setup",
        " 3PL Central - FTP ",
      ]
    `);
    });
  });
  test('should able to verify the cloning text when the cloned flow has isSetupComplete as true', async () => {
    const integrationSession = {
      'flows-60db46af9433830f8f0e0fe7': {
        preview: {
          components: {
            objects: [
              {
                model: 'Flow',
                doc: {
                  _id: '60db46af9433830f8f0e0fe7',
                  name: '3PL Central - FTP',
                  description: 'Testing Flow',
                  disabled: false,
                  _integrationId: '5fc5e0e66cfe5b44bb95de70',
                  skipRetries: false,
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '60dbc5a8a706701ed4a148ac',
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
                  type: 'ftp',
                  name: 'FTP Connection',
                  offline: true,
                  sandbox: false,
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5fc5e4a46cfe5b44bb95df44',
                  type: 'http',
                  name: '3PL Central Connection',
                  assistant: '3plcentral',
                  offline: false,
                  sandbox: false,
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
        installSteps: [
          {
            name: 'FTP Connection',
            _connectionId: '5d529bfbdb0c7b14a6011a57',
            description: 'Please configure FTP connection',
            type: 'Connection',
            completed: true,
            options: {
              connectionType: 'ftp',
            },
          },
          {
            name: '3PL Central Connection',
            _connectionId: '5fc5e4a46cfe5b44bb95df44',
            description: 'Please configure 3PL Central connection',
            type: 'Connection',
            completed: true,
            options: {
              connectionType: '3plcentral',
            },
          },
        ],
        connectionMap: {
          '5d529bfbdb0c7b14a6011a57': {
            _id: '5d529bfbdb0c7b14a6011a57',
            type: 'ftp',
            name: 'FTP Connection',
            offline: true,
            sandbox: false,
          },
          '5fc5e4a46cfe5b44bb95df44': {
            _id: '5fc5e4a46cfe5b44bb95df44',
            type: 'http',
            name: '3PL Central Connection',
            assistant: '3plcentral',
            offline: false,
            sandbox: false,
          },
        },
        data: {
          name: 'Clone - 3PL Central - FTP',
          sandbox: false,
          _integrationId: '5fc5e0e66cfe5b44bb95de70',
          _flowGroupingId: null,
        },
        cMap: {
          '5d529bfbdb0c7b14a6011a57': '5d529bfbdb0c7b14a6011a57',
          '5fc5e4a46cfe5b44bb95df44': '5fc5e4a46cfe5b44bb95df44',
        },
      },
    };
    const props = {
      pathname: '/clone/flows/60db46af9433830f8f0e0fe7/setup',
      resourceId: '60db46af9433830f8f0e0fe7',
      resourceType: 'flows',

    };

    await initStore(integrationSession);

    await initClone(props);
    waitFor(() => {
      const cloningNode = screen.getByText('Cloning');

      expect(cloningNode).toBeInTheDocument();
    });
  });
  test('should able to access the setup page which has is installed failure as false and click on configure along with install bundle option', async () => {
    const integrationSession = {
      'flows-61924a4aaba738048023c161': {
        preview: {
          components: {
            objects: [
              {
                model: 'Flow',
                doc: {
                  _id: '61924a4aaba738048023c161',
                  name: 'Test flow 2',
                  description: 'This description.',
                  disabled: true,
                  _integrationId: '619249e805f85b2022e086bd',
                  skipRetries: false,
                  free: false,
                  _templateId: '5c261974e53d9a2ecf6ad887',
                  _sourceId: '61506aa61ac0cc69b5be2670',
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '61924a46aba738048023c0df',
                  name: 'Test export',
                  description: 'Test export description.',
                  _connectionId: '5f573f1a87fe9d2ebedd30e5',
                  _sourceId: '61506aa31ac0cc69b5be2602',
                  _templateId: '5c261974e53d9a2ecf6ad887',
                  adaptorType: 'SalesforceExport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '61924a47aba738048023c0f7',
                  name: 'Test Import',
                  description: 'Test Import Description',
                  _connectionId: '5d4017fb5663022451fdf1ad',
                  _sourceId: '61506aa41ac0cc69b5be2610',
                  _templateId: '5c261974e53d9a2ecf6ad887',
                  adaptorType: 'NetSuiteDistributedImport',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5f573f1a87fe9d2ebedd30e5',
                  type: 'salesforce',
                  name: 'Test Connection 2',
                  offline: false,
                  sandbox: false,
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5d4017fb5663022451fdf1ad',
                  type: 'netsuite',
                  name: 'Test Connection 1',
                  offline: false,
                  sandbox: false,
                },
              },
              {
                model: 'Script',
                doc: {
                  _id: '61924a2caba738048023c093',
                  name: 'SFNSIOContent-Type1.js',
                  description: '',
                  _sourceId: '61506a881ac0cc69b5be25c3',
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
        installSteps: [
          {
            name: 'Test Connection 1',
            _connectionId: '5d4017fb5663022451fdf1ad',
            description: 'Test connection 1 description',
            type: 'Connection',
            completed: false,
            options: {
              connectionType: 'netsuite',
            },
          },
          {
            name: 'Test Connection 2',
            _connectionId: '5f573f1a87fe9d2ebedd30e5',
            description: 'Test Connection 2 description',
            type: 'Connection',
            completed: false,
            options: {
              connectionType: 'salesforce',
            },
            isCurrentStep: true,
          },
          {
            key: 'NetSuite account 1',
            installURL: '/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV916910&domain=PRODUCTION&config=F&id=20038',
            imageURL: 'images/company-logos/netsuite.png',
            completed: false,
            description: 'Please install Integrator bundle in NetSuite account',
            name: 'Integrator Bundle',
            application: 'netsuite',
            type: 'installPackage',
            options: {},
            isCurrentStep: true,
          },
        ],
        connectionMap: {
          '5d4017fb5663022451fdf1ad': {
            _id: '5d4017fb5663022451fdf1ad',
            type: 'netsuite',
            name: 'Test Connection 1',
            offline: false,
            sandbox: false,
          },
          '5f573f1a87fe9d2ebedd30e5': {
            _id: '5f573f1a87fe9d2ebedd30e5',
            type: 'salesforce',
            name: 'Test Connection 2',
            offline: false,
            sandbox: false,
          },
        },
        data: {
          name: 'Clone - Test Export to Test Import',
          sandbox: false,
          _integrationId: '619249e805f85b2022e086bd',
          _flowGroupingId: null,
        },
      },
    };
    const props = {
      pathname: '/clone/flows/61924a4aaba738048023c161/setup',
      resourceId: '61924a4aaba738048023c161',
      resourceType: 'flows',

    };

    await initStore(integrationSession);

    await initClone(props);
    waitFor(() => {
      const setupNode = screen.getByText('Setup');

      expect(setupNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const goBackButtonNode = screen.getAllByRole('button');

      expect(goBackButtonNode[0]).toHaveAttribute('type', 'button');
      await userEvent.click(goBackButtonNode[0]);
    });
    waitFor(() => {
      const headingNode1 = screen.getByRole('heading', {name: '1'});

      expect(headingNode1).toBeInTheDocument();
    });
    waitFor(() => {
      const headingNode2 = screen.getByRole('heading', {name: '2'});

      expect(headingNode2).toBeInTheDocument();
    });
    waitFor(() => {
      const headingNode3 = screen.getByRole('heading', {name: '3'});

      expect(headingNode3).toBeInTheDocument();
      const list = screen.getByRole('list');
      const { getAllByRole } = within(list);
      const items = getAllByRole('listitem');
      const names = items.map(item => item.textContent);

      expect(names).toMatchInlineSnapshot(`
      Array [
        "Setup",
        " Test flow 2 ",
      ]
    `);
    });
    waitFor(() => {
      const testConnection1TextNode = screen.getByText('Test Connection 1');

      expect(testConnection1TextNode).toBeInTheDocument();
    });
    waitFor(() => {
      const testConnection2TextNode = screen.getByText('Test Connection 2');

      expect(testConnection2TextNode).toBeInTheDocument();
    });
    waitFor(() => {
      const bundleTextNode = screen.getByText('Integrator Bundle');

      expect(bundleTextNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const configureNode = screen.getAllByRole('button', {name: 'Configure'});

      expect(configureNode[0]).toBeInTheDocument();
      expect(configureNode[1]).toBeInTheDocument();
      await userEvent.click(configureNode[0]);
      expect(mockDispatchFn).toHaveBeenCalledTimes(1);
      await userEvent.click(configureNode[1]);
      expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    });
    waitFor(async () => {
      const installNode = screen.getByRole('button', {name: 'Install'});

      expect(installNode).toBeInTheDocument();
      await userEvent.click(installNode);
      expect(mockDispatchFn).toHaveBeenCalledTimes(3);
    });
    waitFor(async () => {
      const verifyNowNode = screen.getByRole('button', {name: 'Verify now'});

      expect(verifyNowNode).toBeInTheDocument();
      await userEvent.click(verifyNowNode);
      expect(mockDispatchFn).toHaveBeenCalledTimes(5);
    });
    waitFor(() => {
      const verifyingNode = screen.getByRole('button', {name: 'Verifying'});

      expect(verifyingNode).toBeInTheDocument();
    });
  });
  test('should able to access the setup page which has is installed failure as false and click on configure along with install bundle option by setting is trigger as false and verifying as true', async () => {
    const integrationSession = {
      'flows-61924a4aaba738048023c161': {
        preview: {
          components: {
            objects: [
              {
                model: 'Flow',
                doc: {
                  _id: '61924a4aaba738048023c161',
                  name: 'Test flow 2',
                  description: 'This description.',
                  disabled: true,
                  _integrationId: '619249e805f85b2022e086bd',
                  _templateId: '5c261974e53d9a2ecf6ad887',
                  _sourceId: '61506aa61ac0cc69b5be2670',
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '61924a46aba738048023c0df',
                  name: 'Test export',
                  description: 'Test export description.',
                  _connectionId: '5f573f1a87fe9d2ebedd30e5',
                  _sourceId: '61506aa31ac0cc69b5be2602',
                  _templateId: '5c261974e53d9a2ecf6ad887',
                  adaptorType: 'SalesforceExport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '61924a47aba738048023c0f7',
                  name: 'Test Import',
                  description: 'Test Import Description',
                  _connectionId: '5d4017fb5663022451fdf1ad',
                  _sourceId: '61506aa41ac0cc69b5be2610',
                  distributed: true,
                  apiIdentifier: 'ib8ff29690',
                  ignoreExisting: true,
                  _templateId: '5c261974e53d9a2ecf6ad887',
                  adaptorType: 'NetSuiteDistributedImport',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5f573f1a87fe9d2ebedd30e5',
                  type: 'salesforce',
                  name: 'Test Connection 2',
                  offline: false,
                  sandbox: false,
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5d4017fb5663022451fdf1ad',
                  type: 'netsuite',
                  name: 'Test Connection 1',
                  offline: false,
                  sandbox: false,
                },
              },
              {
                model: 'Script',
                doc: {
                  _id: '61924a2caba738048023c093',
                  name: 'SFNSIOContent-Type1.js',
                  description: '',
                  _sourceId: '61506a881ac0cc69b5be25c3',
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
        installSteps: [
          {
            name: 'Test Connection 1',
            _connectionId: '5d4017fb5663022451fdf1ad',
            description: 'Test connection 1 description',
            type: 'Connection',
            completed: false,
            options: {
              connectionType: 'netsuite',
            },
          },
          {
            name: 'Test Connection 2',
            _connectionId: '5f573f1a87fe9d2ebedd30e5',
            description: 'Test Connection 2 description',
            type: 'Connection',
            completed: false,
            options: {
              connectionType: 'salesforce',
            },
            isCurrentStep: true,
          },
          {
            key: 'NetSuite account 1',
            installURL: '/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV916910&domain=PRODUCTION&config=F&id=20038',
            imageURL: 'images/company-logos/netsuite.png',
            completed: false,
            description: 'Please install Integrator bundle in NetSuite account',
            name: 'Integrator Bundle',
            application: 'netsuite',
            type: 'installPackage',
            isTriggered: false,
            verifying: true,
            options: {},
            isCurrentStep: true,
          },
        ],
        connectionMap: {
          '5d4017fb5663022451fdf1ad': {
            _id: '5d4017fb5663022451fdf1ad',
            type: 'netsuite',
            name: 'Test Connection 1',
            offline: false,
            sandbox: false,
          },
          '5f573f1a87fe9d2ebedd30e5': {
            _id: '5f573f1a87fe9d2ebedd30e5',
            type: 'salesforce',
            name: 'Test Connection 2',
            offline: false,
            sandbox: false,
          },
        },
        data: {
          name: 'Clone - Test Export to Test Import',
          sandbox: false,
          _integrationId: '619249e805f85b2022e086bd',
          _flowGroupingId: null,
        },
      },
    };
    const props = {
      pathname: '/clone/flows/61924a4aaba738048023c161/setup',
      resourceId: '61924a4aaba738048023c161',
      resourceType: 'flows',

    };

    await initStore(integrationSession);

    await initClone(props);
    waitFor(() => {
      const setupNode = screen.getByText('Setup');

      expect(setupNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const goBackButtonNode = screen.getAllByRole('button');

      expect(goBackButtonNode[0]).toHaveAttribute('type', 'button');
      await userEvent.click(goBackButtonNode[0]);
    });
    waitFor(() => {
      const headingNode1 = screen.getByRole('heading', {name: '1'});

      expect(headingNode1).toBeInTheDocument();
    });
    waitFor(() => {
      const headingNode2 = screen.getByRole('heading', {name: '2'});

      expect(headingNode2).toBeInTheDocument();
    });
    waitFor(() => {
      const headingNode3 = screen.getByRole('heading', {name: '3'});

      expect(headingNode3).toBeInTheDocument();
    });
    waitFor(() => {
      const list = screen.getByRole('list');
      const { getAllByRole } = within(list);
      const items = getAllByRole('listitem');
      const names = items.map(item => item.textContent);

      expect(names).toMatchInlineSnapshot(`
      Array [
        "Setup",
        " Test flow 2 ",
      ]
    `);
    });
    waitFor(() => {
      const testConnection1TextNode = screen.getByText('Test Connection 1');

      expect(testConnection1TextNode).toBeInTheDocument();
    });
    waitFor(() => {
      const testConnection2TextNode = screen.getByText('Test Connection 2');

      expect(testConnection2TextNode).toBeInTheDocument();
    });
    waitFor(() => {
      const bundleTextNode = screen.getByText('Integrator Bundle');

      expect(bundleTextNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const configureNode = screen.getAllByRole('button', {name: 'Configure'});

      expect(configureNode[0]).toBeInTheDocument();
      expect(configureNode[1]).toBeInTheDocument();
      await userEvent.click(configureNode[0]);
      expect(mockDispatchFn).toHaveBeenCalledTimes(2);
      await userEvent.click(configureNode[1]);
      expect(mockDispatchFn).toHaveBeenCalledTimes(3);
    });
    waitFor(async () => {
      const installNode = screen.getByRole('button', {name: 'Install'});

      expect(installNode).toBeInTheDocument();
      await userEvent.click(installNode);
      expect(mockDispatchFn).toHaveBeenCalledTimes(3);
    });
    waitFor(() => {
      const verifyingNode = screen.getByRole('button', {name: 'Verifying'});

      expect(verifyingNode).toBeInTheDocument();
    });
  });
  test('should able to access the setup page without flow name', async () => {
    const integrationSession = {
      'flows-60db46af9433830f8f0e0fe8': {
        preview: {
          components: {
            objects: [
              {
                model: 'Flow',
                doc: {
                  _id: '60db46af9433830f8f0e0fe8',
                  description: 'Testing Flow',
                  disabled: false,
                  _integrationId: '5fc5e0e66cfe5b44bb95de70',
                  skipRetries: false,
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '60dbc5a8a706701ed4a148ac',
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
                  type: 'ftp',
                  name: 'FTP Connection',
                  offline: true,
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5fc5e4a46cfe5b44bb95df44',
                  type: 'http',
                  name: '3PL Central Connection',
                  assistant: '3plcentral',
                  offline: false,
                  sandbox: false,
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
        installSteps: [
          {
            name: 'FTP Connection',
            _connectionId: '5d529bfbdb0c7b14a6011a57',
            description: 'Please configure FTP connection',
            type: 'Connection',
            completed: false,
            options: {
              connectionType: 'ftp',
            },
          },
          {
            name: '3PL Central Connection',
            _connectionId: '5fc5e4a46cfe5b44bb95df44',
            description: 'Please configure 3PL Central connection',
            type: 'Connection',
            completed: false,
            options: {
              connectionType: '3plcentral',
            },
            isCurrentStep: true,
          },
        ],
        connectionMap: {
          '5d529bfbdb0c7b14a6011a57': {
            _id: '5d529bfbdb0c7b14a6011a57',
            type: 'ftp',
            name: 'FTP Connection',
            offline: true,
            sandbox: false,
          },
          '5fc5e4a46cfe5b44bb95df44': {
            _id: '5fc5e4a46cfe5b44bb95df44',
            type: 'http',
            name: '3PL Central Connection',
            assistant: '3plcentral',
            offline: false,
            sandbox: false,
          },
        },
        data: {
          name: 'Clone - 3PL Central - FTP',
          sandbox: false,
          _integrationId: '5fc5e0e66cfe5b44bb95de70',
          _flowGroupingId: null,
        },
      },
    };
    const props = {
      pathname: '/clone/flows/60db46af9433830f8f0e0fe8/setup',
      resourceId: '60db46af9433830f8f0e0fe8',
      resourceType: 'flows',

    };

    await initStore(integrationSession);

    await initClone(props);
    waitFor(() => {
      const setupNode = screen.getByText('Setup');

      expect(setupNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const goBackButtonNode = screen.getAllByRole('button');

      expect(goBackButtonNode[0]).toHaveAttribute('type', 'button');
      await userEvent.click(goBackButtonNode[0]);
    });
    waitFor(() => {
      const headingNode1 = screen.getByRole('heading', {name: '1'});

      expect(headingNode1).toBeInTheDocument();
    });
    waitFor(() => {
      const headingNode2 = screen.getByRole('heading', {name: '2'});

      expect(headingNode2).toBeInTheDocument();
    });
    waitFor(() => {
      const list = screen.getByRole('list');
      const { getAllByRole } = within(list);
      const items = getAllByRole('listitem');
      const names = items.map(item => item.textContent);

      expect(names).toMatchInlineSnapshot(`
      Array [
        "Setup",
        " Flow ",
      ]
    `);
    });
    waitFor(() => {
      const ftpConnectionTextNode = screen.getByText('FTP Connection');

      expect(ftpConnectionTextNode).toBeInTheDocument();
    });
    waitFor(() => {
      const threeplConnectionTextNode = screen.getByText('3PL Central Connection');

      expect(threeplConnectionTextNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const configureNode = screen.getAllByRole('button', {name: 'Configure'});

      expect(configureNode[0]).toBeInTheDocument();
      expect(configureNode[1]).toBeInTheDocument();
      await userEvent.click(configureNode[0]);
      expect(mockDispatchFn).toHaveBeenCalledTimes(1);
      await userEvent.click(configureNode[1]);
      expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    });
  });

  test('should able to access the setup page without install steps', async () => {
    const integrationSession = {
      'imports-60db46af9433830f8f0e0fe8': {
        preview: {
          components: {
            objects: [
              {
                model: 'Flow',
                doc: {
                  _id: '60db46af9433830f8f0e0fe8',
                  description: 'Testing Flow',
                  disabled: false,
                  _integrationId: '5fc5e0e66cfe5b44bb95de70',
                  skipRetries: false,
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '60dbc5a8a706701ed4a148ac',
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
                  type: 'ftp',
                  name: 'FTP Connection',
                  offline: true,
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5fc5e4a46cfe5b44bb95df44',
                  type: 'http',
                  name: '3PL Central Connection',
                  assistant: '3plcentral',
                  offline: false,
                  sandbox: false,
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
        connectionMap: {
          '5d529bfbdb0c7b14a6011a57': {
            _id: '5d529bfbdb0c7b14a6011a57',
            type: 'ftp',
            name: 'FTP Connection',
            offline: true,
            sandbox: false,
          },
          '5fc5e4a46cfe5b44bb95df44': {
            _id: '5fc5e4a46cfe5b44bb95df44',
            type: 'http',
            name: '3PL Central Connection',
            assistant: '3plcentral',
            offline: false,
            sandbox: false,
          },
        },
        data: {
          name: 'Clone - 3PL Central - FTP',
          sandbox: false,
          _integrationId: '5fc5e0e66cfe5b44bb95de70',
          _flowGroupingId: null,
        },
      },
    };
    const props = {
      pathname: '/clone/imports/60db46af9433830f8f0e0fe8/setup',
      resourceId: '60db46af9433830f8f0e0fe8',
      resourceType: 'flows',

    };

    await initStore(integrationSession);

    await initClone(props);
    waitFor(() => { expect(mockHistoryPush).toBeCalledWith('/clone/imports/60db46af9433830f8f0e0fe8/preview'); });
  });
});
