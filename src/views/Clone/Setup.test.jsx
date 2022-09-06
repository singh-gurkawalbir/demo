/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, cleanup, within } from '@testing-library/react';
import * as reactRedux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import Clone from './Setup';
import { reduxStore, renderWithProviders } from '../../test/test-utils';
import { runServer } from '../../test/api/server';

let initialStore;

function initStore(integrationSession, integrationApps) {
  initialStore.getState().data.resources.integrations = [
    {
      _id: '5fc5e0e66cfe5b44bb95de70',
      lastModified: '2022-07-27T11:14:41.700Z',
      name: '3PL Central',
      description: 'Testing Integration description',
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5d529bfbdb0c7b14a6011a57',
        '5fc5e4a46cfe5b44bb95df44',
      ],
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
      install: [],
      mode: 'settings',
      sandbox: false,
      _registeredConnectionIds: [
        '5d4017fb5663022451fdf1ad',
        '5f573f1a87fe9d2ebedd30e5',
      ],
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
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2021-11-15T11:52:08.762Z',
    },
  ];
  initialStore.getState().data.resources.flows = [
    {
      _id: '60db46af9433830f8f0e0fe7',
      lastModified: '2021-06-30T02:36:49.734Z',
      name: '3PL Central - FTP',
      description: 'Testing Flows Description',
      pageProcessors: [
        {
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
    },
    {
      _id: '60db46af9433830f8f0e0fe8',
      lastModified: '2021-06-30T02:36:49.734Z',
      description: 'Testing Flows Description',
      disabled: false,
      // _integrationId: '5fc5e0e66cfe5b44bb95de70',
      sandbox: false,
      skipRetries: false,
      pageProcessors: [
        {
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
    {
      _id: '61924a4aaba738048023c161',
      lastModified: '2021-11-15T11:53:47.252Z',
      name: 'Test flow 2',
      description: 'This description.',
      disabled: true,
      _integrationId: '619249e805f85b2022e086bd',
      skipRetries: false,
      pageProcessors: [
        {
          type: 'import',
          _importId: '61924a47aba738048023c0f7',
        },
      ],
      pageGenerators: [
        {
          _exportId: '61924a46aba738048023c0df',
        },
      ],
      createdAt: '2021-11-15T11:53:46.788Z',
      free: false,
      _templateId: '5c261974e53d9a2ecf6ad887',
      _sourceId: '61506aa61ac0cc69b5be2670',
      wizardState: 'done',
      autoResolveMatchingTraceKeys: true,
    },
  ];
  initialStore.getState().data.resources.exports = [
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
      assistantMetadata: {
        resource: 'orders',
        version: 'latest',
        operation: 'get_packages_details',
      },
      http: {
        relativeURI: '/orders/3862/packages',
        method: 'GET',
        successMediaType: 'json',
        errorMediaType: 'json',
        formType: 'assistant',
      },
      adaptorType: 'HTTPExport',
    },
    {
      _id: '61924a46aba738048023c0df',
      createdAt: '2021-11-15T11:53:42.848Z',
      lastModified: '2021-11-15T11:53:43.040Z',
      name: 'Test export',
      description: 'Test export description.',
      _connectionId: '5f573f1a87fe9d2ebedd30e5',
      _sourceId: '61506aa31ac0cc69b5be2602',
      apiIdentifier: 'e6886d2fe3',
      asynchronous: true,
      type: 'delta',
      _templateId: '5c261974e53d9a2ecf6ad887',
      parsers: [],
      delta: {
        dateField: 'CreatedDate',
      },
      salesforce: {
        type: 'soql',
        api: 'rest',
        soql: {
          query: 'SELECT CreatedById,CreatedDate,Description,DisplayUrl,ExternalDataSourceId,ExternalId,Family,Id,IsActive,IsDeleted,LastModifiedById,LastModifiedDate,LastReferencedDate,LastViewedDate,Name,ProductCode,QuantityUnitOfMeasure,SystemModstamp FROM Product2',
        },
        distributed: {
          referencedFields: [],
          disabled: false,
          userDefinedReferencedFields: [],
          relatedLists: [],
        },
      },
      transform: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      filter: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      inputFilter: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      adaptorType: 'SalesforceExport',
    },
  ];
  initialStore.getState().data.resources.imports = [
    {
      _id: '605b30767904202f31742092',
      createdAt: '2021-03-24T12:28:38.813Z',
      lastModified: '2021-04-29T15:37:16.667Z',
      name: 'FTP Import 1',
      description: 'Test FTP import description',
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
    {
      _id: '61924a47aba738048023c0f7',
      createdAt: '2021-11-15T11:53:43.543Z',
      lastModified: '2021-11-15T11:53:44.003Z',
      name: 'Test Import',
      description: 'Test Import Description',
      responseTransform: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      parsers: [],
      _connectionId: '5d4017fb5663022451fdf1ad',
      _sourceId: '61506aa41ac0cc69b5be2610',
      distributed: true,
      apiIdentifier: 'ib8ff29690',
      ignoreExisting: true,
      _templateId: '5c261974e53d9a2ecf6ad887',
      lookups: [],
      netsuite_da: {
        operation: 'add',
        recordType: 'inventoryitem',
        internalIdLookup: {
          expression: '["custitem_celigo_sfio_sf_id","is","{{{Id}}}"]',
        },
        lookups: [],
        mapping: {
          fields: [
            {
              generate: 'itemid',
              extract: 'ProductCode',
              internalId: false,
              immutable: false,
              discardIfEmpty: false,
            },
            {
              generate: 'displayname',
              extract: 'Name',
              internalId: false,
              immutable: false,
              discardIfEmpty: false,
            },
            {
              generate: 'custitem_celigo_sfio_sf_id',
              extract: 'Id',
              internalId: false,
              immutable: false,
              discardIfEmpty: false,
            },
          ],
        },
      },
      adaptorType: 'NetSuiteDistributedImport',
    },
  ];
  initialStore.getState().data.resources.connections = [
    {
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
    {
      _id: '5fc5e4a46cfe5b44bb95df44',
      createdAt: '2020-12-01T06:37:24.341Z',
      lastModified: '2022-07-27T18:02:24.948Z',
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
    {
      _id: '5d4017fb5663022451fdf1ad',
      createdAt: '2019-07-30T10:12:11.785Z',
      lastModified: '2022-05-28T00:24:14.294Z',
      type: 'netsuite',
      name: 'Test Connection 1',
      offline: false,
      debugDate: '2020-09-21T08:45:03.928Z',
      sandbox: false,
      netsuite: {
        account: 'TSTDRV1934805',
        roleId: '3',
        email: 'hajra.parveen@celigo.com',
        password: '******',
        environment: 'production',
        requestLevelCredentials: false,
        dataCenterURLs: {
          restDomain: 'https://tstdrv1934805.restlets.api.netsuite.com',
          webservicesDomain: 'https://tstdrv1934805.suitetalk.api.netsuite.com',
          systemDomain: 'https://tstdrv1934805.app.netsuite.com',
        },
        wsdlVersion: '2016.2',
        concurrencyLevel: 1,
        suiteAppInstalled: false,
        authType: 'basic',
      },
      queues: [
        {
          name: '5d4017fb5663022451fdf1ad',
          size: 0,
        },
      ],
    },
    {
      _id: '5f573f1a87fe9d2ebedd30e5',
      createdAt: '2020-09-08T08:21:46.109Z',
      lastModified: '2022-01-25T07:36:28.071Z',
      type: 'salesforce',
      name: 'Test Connection 2',
      offline: false,
      sandbox: false,
      salesforce: {
        sandbox: false,
        baseURI: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com',
        oauth2FlowType: 'refreshToken',
        bearerToken: '******',
        refreshToken: '******',
        packagedOAuth: true,
        scope: [],
        concurrencyLevel: 5,
        info: {
          sub: 'https://login.salesforce.com/id/00D6F000001oricUAA/0056F000009uZUlQAM',
          user_id: '0056F000009uZUlQAM',
          organization_id: '00D6F000001oricUAA',
          preferred_username: 'snigdha@celigo.com',
          nickname: 'snigdha',
          name: 'snigdha panigrahy',
          email: 'snigdharani.panigrahy@celigo.com',
          email_verified: true,
          given_name: 'snigdha',
          family_name: 'panigrahy',
          zoneinfo: 'America/Los_Angeles',
          photos: {
            picture: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/F',
            thumbnail: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/T',
          },
          profile: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/0056F000009uZUlQAM',
          picture: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/F',
          address: {
            country: 'IN',
          },
          urls: {
            enterprise: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/c/{version}/00D6F000001oric',
            metadata: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/m/{version}/00D6F000001oric',
            partner: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/u/{version}/00D6F000001oric',
            rest: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/',
            sobjects: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/sobjects/',
            search: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/search/',
            query: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/query/',
            recent: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/recent/',
            tooling_soap: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/T/{version}/00D6F000001oric',
            tooling_rest: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/tooling/',
            profile: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/0056F000009uZUlQAM',
            feeds: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feeds',
            groups: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/groups',
            users: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/users',
            feed_items: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-items',
            feed_elements: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-elements',
            custom_domain: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com',
          },
          active: true,
          user_type: 'STANDARD',
          language: 'en_US',
          locale: 'en_US',
          utcOffset: -28800000,
          updated_at: '2020-04-29T08:19:07Z',
        },
      },
      queues: [
        {
          name: '5f573f1a87fe9d2ebedd30e5',
          size: 0,
        },
      ],
    },
  ];
  initialStore.getState().session.templates = integrationSession;
  initialStore.getState().session.integrationApps = integrationApps;
  initialStore.getState().data.scripts = [{
    _id: '61924a2caba738048023c093',
    lastModified: '2021-11-15T11:53:16.445Z',
    createdAt: '2021-11-15T11:53:16.272Z',
    name: 'SFNSIOContent-Type1.js',
    description: '',
    _sourceId: '61506a881ac0cc69b5be25c3',
  }];
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

describe('Clone Setup', () => {
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
  test('Should able to access the setup page which has is installed failure as false and click on configure', async () => {
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
                  skipRetries: false,
                  pageProcessors: [
                    {
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
                  autoResolveMatchingTraceKeys: true,
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
                  assistantMetadata: {
                    resource: 'orders',
                    version: 'latest',
                    operation: 'get_packages_details',
                  },
                  http: {
                    relativeURI: '/orders/3862/packages',
                    method: 'GET',
                    requestMediaType: 'json',
                    successMediaType: 'json',
                    errorMediaType: 'json',
                    formType: 'assistant',
                  },
                  rawData: '5d4010e14cd24a7c773122efebb372a471d8466aa1e52b628035c2a7',
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
                  file: {
                    fileName: 'walmart-canada-pagination.json',
                    skipAggregation: false,
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
                  lastModified: '2022-07-27T18:02:24.948Z',
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
                    },
                    unencrypted: {
                      tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                      userLoginId: 'Celigo_SandBox',
                    },
                    auth: {
                      type: 'oauth',
                      oauth: {
                        tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
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
          '5fc5e4a46cfe5b44bb95df44': {
            _id: '5fc5e4a46cfe5b44bb95df44',
            createdAt: '2020-12-01T06:37:24.341Z',
            lastModified: '2022-07-27T18:02:24.948Z',
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
              },
              rateLimit: {
              },
              unencrypted: {
                tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                userLoginId: 'Celigo_SandBox',
              },
              auth: {
                type: 'oauth',
                oauth: {
                  tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
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
    const setupNode = screen.getByText('Setup');

    expect(setupNode).toBeInTheDocument();
    const goBackButtonNode = screen.getAllByRole('button');

    expect(goBackButtonNode[0]).toHaveAttribute('type', 'button');
    await userEvent.click(goBackButtonNode[0]);
    expect(mockHistoryBack).toHaveBeenCalledTimes(1);
    const headingNode1 = screen.getByRole('heading', {name: '1'});

    expect(headingNode1).toBeInTheDocument();
    const headingNode2 = screen.getByRole('heading', {name: '2'});

    expect(headingNode2).toBeInTheDocument();
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
    const ftpConnectionTextNode = screen.getByText('FTP Connection');

    expect(ftpConnectionTextNode).toBeInTheDocument();
    const threeplConnectionTextNode = screen.getByText('3PL Central Connection');

    expect(threeplConnectionTextNode).toBeInTheDocument();
    const configureNode = screen.getAllByRole('button', {name: 'Configure'});

    expect(configureNode[0]).toBeInTheDocument();
    expect(configureNode[1]).toBeInTheDocument();
    await userEvent.click(configureNode[0]);
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    await userEvent.click(configureNode[1]);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
  });
  test('Should able to access the setup page which has is installed failure as true and click on configure', async () => {
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
                  skipRetries: false,
                  pageProcessors: [
                    {
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
                  autoResolveMatchingTraceKeys: true,
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
                  assistantMetadata: {
                    resource: 'orders',
                    version: 'latest',
                    operation: 'get_packages_details',
                  },
                  http: {
                    relativeURI: '/orders/3862/packages',
                    method: 'GET',
                    requestMediaType: 'json',
                    successMediaType: 'json',
                    errorMediaType: 'json',
                    formType: 'assistant',
                  },
                  rawData: '5d4010e14cd24a7c773122efebb372a471d8466aa1e52b628035c2a7',
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
                  file: {
                    fileName: 'walmart-canada-pagination.json',
                    skipAggregation: false,
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
                  lastModified: '2022-07-27T18:02:24.948Z',
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
                    },
                    unencrypted: {
                      tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                      userLoginId: 'Celigo_SandBox',
                    },
                    auth: {
                      type: 'oauth',
                      oauth: {
                        tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
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
          '5fc5e4a46cfe5b44bb95df44': {
            _id: '5fc5e4a46cfe5b44bb95df44',
            createdAt: '2020-12-01T06:37:24.341Z',
            lastModified: '2022-07-27T18:02:24.948Z',
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
              },
              unencrypted: {
                tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                userLoginId: 'Celigo_SandBox',
              },
              auth: {
                type: 'oauth',
                oauth: {
                  tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
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
    const setupNode = screen.getByText('Setup');

    expect(setupNode).toBeInTheDocument();
    const goBackButtonNode = screen.getAllByRole('button');

    expect(goBackButtonNode[0]).toHaveAttribute('type', 'button');
    await userEvent.click(goBackButtonNode[0]);
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
  test('Should able to verify the cloning text when the cloned flow has isSetupComplete as true', async () => {
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
                  skipRetries: false,
                  pageProcessors: [
                    {
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
                  autoResolveMatchingTraceKeys: true,
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
                  assistantMetadata: {
                    resource: 'orders',
                    version: 'latest',
                    operation: 'get_packages_details',
                  },
                  http: {
                    relativeURI: '/orders/3862/packages',
                    method: 'GET',
                    requestMediaType: 'json',
                    successMediaType: 'json',
                    errorMediaType: 'json',
                    formType: 'assistant',
                  },
                  rawData: '5d4010e14cd24a7c773122efebb372a471d8466aa1e52b628035c2a7',
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
                  file: {
                    fileName: 'walmart-canada-pagination.json',
                    skipAggregation: false,
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
                  lastModified: '2022-07-27T18:02:24.948Z',
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
          '5fc5e4a46cfe5b44bb95df44': {
            _id: '5fc5e4a46cfe5b44bb95df44',
            createdAt: '2020-12-01T06:37:24.341Z',
            lastModified: '2022-07-27T18:02:24.948Z',
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
              },
              unencrypted: {
                tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                userLoginId: 'Celigo_SandBox',
              },
              auth: {
                type: 'oauth',
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
    const cloningNode = screen.getByText('Cloning');

    expect(cloningNode).toBeInTheDocument();
  });
  test('Should able to access the setup page which has is installed failure as false and click on configure along with install bundle option', async () => {
    const integrationSession = {
      'flows-61924a4aaba738048023c161': {
        preview: {
          components: {
            objects: [
              {
                model: 'Flow',
                doc: {
                  _id: '61924a4aaba738048023c161',
                  lastModified: '2021-11-15T11:53:47.252Z',
                  name: 'Test flow 2',
                  description: 'This description.',
                  disabled: true,
                  _integrationId: '619249e805f85b2022e086bd',
                  skipRetries: false,
                  pageProcessors: [
                    {
                      type: 'import',
                      _importId: '61924a47aba738048023c0f7',
                    },
                  ],
                  pageGenerators: [
                    {
                      _exportId: '61924a46aba738048023c0df',
                    },
                  ],
                  createdAt: '2021-11-15T11:53:46.788Z',
                  free: false,
                  _templateId: '5c261974e53d9a2ecf6ad887',
                  _sourceId: '61506aa61ac0cc69b5be2670',
                  wizardState: 'done',
                  autoResolveMatchingTraceKeys: true,
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '61924a46aba738048023c0df',
                  createdAt: '2021-11-15T11:53:42.848Z',
                  lastModified: '2021-11-15T11:53:43.040Z',
                  name: 'Test export',
                  description: 'Test export description.',
                  _connectionId: '5f573f1a87fe9d2ebedd30e5',
                  _sourceId: '61506aa31ac0cc69b5be2602',
                  apiIdentifier: 'e6886d2fe3',
                  asynchronous: true,
                  type: 'delta',
                  _templateId: '5c261974e53d9a2ecf6ad887',
                  delta: {
                    dateField: 'CreatedDate',
                  },
                  salesforce: {
                    type: 'soql',
                    api: 'rest',
                    soql: {
                      query: 'SELECT CreatedById,CreatedDate,Description,DisplayUrl,ExternalDataSourceId,ExternalId,Family,Id,IsActive,IsDeleted,LastModifiedById,LastModifiedDate,LastReferencedDate,LastViewedDate,Name,ProductCode,QuantityUnitOfMeasure,SystemModstamp FROM Product2',
                    },
                    distributed: {
                      disabled: false,
                    },
                  },
                  transform: {
                    type: 'expression',
                    expression: {
                      version: '1',
                    },
                    version: '1',
                  },
                  filter: {
                    type: 'expression',
                    expression: {
                      version: '1',
                    },
                    version: '1',
                  },
                  inputFilter: {
                    type: 'expression',
                    expression: {
                      version: '1',
                    },
                    version: '1',
                  },
                  adaptorType: 'SalesforceExport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '61924a47aba738048023c0f7',
                  createdAt: '2021-11-15T11:53:43.543Z',
                  lastModified: '2021-11-15T11:53:44.003Z',
                  name: 'Test Import',
                  description: 'Test Import Description',
                  responseTransform: {
                    type: 'expression',
                    expression: {
                      version: '1',
                    },
                    version: '1',
                  },
                  parsers: [],
                  _connectionId: '5d4017fb5663022451fdf1ad',
                  _sourceId: '61506aa41ac0cc69b5be2610',
                  distributed: true,
                  apiIdentifier: 'ib8ff29690',
                  ignoreExisting: true,
                  _templateId: '5c261974e53d9a2ecf6ad887',
                  lookups: [],
                  netsuite_da: {
                    operation: 'add',
                    recordType: 'inventoryitem',
                    internalIdLookup: {
                      expression: '["custitem_celigo_sfio_sf_id","is","{{{Id}}}"]',
                    },
                    lookups: [],
                    mapping: {
                      fields: [
                        {
                          generate: 'itemid',
                          extract: 'ProductCode',
                          internalId: false,
                          immutable: false,
                          discardIfEmpty: false,
                        },
                        {
                          generate: 'displayname',
                          extract: 'Name',
                          internalId: false,
                          immutable: false,
                          discardIfEmpty: false,
                        },
                        {
                          generate: 'custitem_celigo_sfio_sf_id',
                          extract: 'Id',
                          internalId: false,
                          immutable: false,
                          discardIfEmpty: false,
                        },
                      ],
                    },
                  },
                  filter: {
                    type: 'expression',
                    expression: {
                      version: '1',
                    },
                    version: '1',
                  },
                  adaptorType: 'NetSuiteDistributedImport',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5f573f1a87fe9d2ebedd30e5',
                  createdAt: '2020-09-08T08:21:46.109Z',
                  lastModified: '2022-01-25T07:36:28.071Z',
                  type: 'salesforce',
                  name: 'Test Connection 2',
                  offline: false,
                  sandbox: false,
                  salesforce: {
                    sandbox: false,
                    baseURI: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com',
                    oauth2FlowType: 'refreshToken',
                    bearerToken: '******',
                    refreshToken: '******',
                    packagedOAuth: true,
                    concurrencyLevel: 5,
                    info: {
                      sub: 'https://login.salesforce.com/id/00D6F000001oricUAA/0056F000009uZUlQAM',
                      user_id: '0056F000009uZUlQAM',
                      organization_id: '00D6F000001oricUAA',
                      preferred_username: 'snigdha@celigo.com',
                      nickname: 'snigdha',
                      name: 'snigdha panigrahy',
                      email: 'snigdharani.panigrahy@celigo.com',
                      email_verified: true,
                      given_name: 'snigdha',
                      family_name: 'panigrahy',
                      zoneinfo: 'America/Los_Angeles',
                      photos: {
                        picture: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/F',
                        thumbnail: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/T',
                      },
                      profile: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/0056F000009uZUlQAM',
                      picture: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/F',
                      address: {
                        country: 'IN',
                      },
                      urls: {
                        enterprise: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/c/{version}/00D6F000001oric',
                        metadata: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/m/{version}/00D6F000001oric',
                        partner: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/u/{version}/00D6F000001oric',
                        rest: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/',
                        sobjects: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/sobjects/',
                        search: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/search/',
                        query: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/query/',
                        recent: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/recent/',
                        tooling_soap: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/T/{version}/00D6F000001oric',
                        tooling_rest: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/tooling/',
                        profile: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/0056F000009uZUlQAM',
                        feeds: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feeds',
                        groups: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/groups',
                        users: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/users',
                        feed_items: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-items',
                        feed_elements: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-elements',
                        custom_domain: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com',
                      },
                      active: true,
                      user_type: 'STANDARD',
                      language: 'en_US',
                      locale: 'en_US',
                      utcOffset: -28800000,
                      updated_at: '2020-04-29T08:19:07Z',
                    },
                  },
                  queues: [
                    {
                      name: '5f573f1a87fe9d2ebedd30e5',
                      size: 0,
                    },
                  ],
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5d4017fb5663022451fdf1ad',
                  createdAt: '2019-07-30T10:12:11.785Z',
                  lastModified: '2022-05-28T00:24:14.294Z',
                  type: 'netsuite',
                  name: 'Test Connection 1',
                  offline: false,
                  debugDate: '2020-09-21T08:45:03.928Z',
                  sandbox: false,
                  netsuite: {
                    account: 'TSTDRV1934805',
                    roleId: '3',
                    email: 'hajra.parveen@celigo.com',
                    password: '******',
                    environment: 'production',
                    requestLevelCredentials: false,
                    dataCenterURLs: {
                      restDomain: 'https://tstdrv1934805.restlets.api.netsuite.com',
                      webservicesDomain: 'https://tstdrv1934805.suitetalk.api.netsuite.com',
                      systemDomain: 'https://tstdrv1934805.app.netsuite.com',
                    },
                    wsdlVersion: '2016.2',
                    concurrencyLevel: 1,
                    suiteAppInstalled: false,
                    authType: 'basic',
                  },
                  queues: [
                    {
                      name: '5d4017fb5663022451fdf1ad',
                      size: 0,
                    },
                  ],
                },
              },
              {
                model: 'Script',
                doc: {
                  _id: '61924a2caba738048023c093',
                  lastModified: '2021-11-15T11:53:16.445Z',
                  createdAt: '2021-11-15T11:53:16.272Z',
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
            createdAt: '2019-07-30T10:12:11.785Z',
            lastModified: '2022-05-28T00:24:14.294Z',
            type: 'netsuite',
            name: 'Test Connection 1',
            offline: false,
            debugDate: '2020-09-21T08:45:03.928Z',
            sandbox: false,
            netsuite: {
              account: 'TSTDRV1934805',
              roleId: '3',
              email: 'hajra.parveen@celigo.com',
              password: '******',
              environment: 'production',
              requestLevelCredentials: false,
              dataCenterURLs: {
                restDomain: 'https://tstdrv1934805.restlets.api.netsuite.com',
                webservicesDomain: 'https://tstdrv1934805.suitetalk.api.netsuite.com',
                systemDomain: 'https://tstdrv1934805.app.netsuite.com',
              },
              wsdlVersion: '2016.2',
              concurrencyLevel: 1,
              suiteAppInstalled: false,
              authType: 'basic',
            },
            queues: [
              {
                name: '5d4017fb5663022451fdf1ad',
                size: 0,
              },
            ],
          },
          '5f573f1a87fe9d2ebedd30e5': {
            _id: '5f573f1a87fe9d2ebedd30e5',
            createdAt: '2020-09-08T08:21:46.109Z',
            lastModified: '2022-01-25T07:36:28.071Z',
            type: 'salesforce',
            name: 'Test Connection 2',
            offline: false,
            sandbox: false,
            salesforce: {
              sandbox: false,
              baseURI: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com',
              oauth2FlowType: 'refreshToken',
              bearerToken: '******',
              refreshToken: '******',
              packagedOAuth: true,
              scope: [],
              concurrencyLevel: 5,
              info: {
                sub: 'https://login.salesforce.com/id/00D6F000001oricUAA/0056F000009uZUlQAM',
                user_id: '0056F000009uZUlQAM',
                organization_id: '00D6F000001oricUAA',
                preferred_username: 'snigdha@celigo.com',
                nickname: 'snigdha',
                name: 'snigdha panigrahy',
                email: 'snigdharani.panigrahy@celigo.com',
                email_verified: true,
                given_name: 'snigdha',
                family_name: 'panigrahy',
                zoneinfo: 'America/Los_Angeles',
                photos: {
                  picture: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/F',
                  thumbnail: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/T',
                },
                profile: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/0056F000009uZUlQAM',
                picture: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/F',
                address: {
                  country: 'IN',
                },
                urls: {
                  enterprise: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/c/{version}/00D6F000001oric',
                  metadata: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/m/{version}/00D6F000001oric',
                  partner: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/u/{version}/00D6F000001oric',
                  rest: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/',
                  sobjects: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/sobjects/',
                  search: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/search/',
                  query: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/query/',
                  recent: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/recent/',
                  tooling_soap: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/T/{version}/00D6F000001oric',
                  tooling_rest: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/tooling/',
                  profile: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/0056F000009uZUlQAM',
                  feeds: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feeds',
                  groups: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/groups',
                  users: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/users',
                  feed_items: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-items',
                  feed_elements: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-elements',
                  custom_domain: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com',
                },
                active: true,
                user_type: 'STANDARD',
                language: 'en_US',
                locale: 'en_US',
                utcOffset: -28800000,
                updated_at: '2020-04-29T08:19:07Z',
              },
            },
            queues: [
              {
                name: '5f573f1a87fe9d2ebedd30e5',
                size: 0,
              },
            ],
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
    const setupNode = screen.getByText('Setup');

    expect(setupNode).toBeInTheDocument();
    const goBackButtonNode = screen.getAllByRole('button');

    expect(goBackButtonNode[0]).toHaveAttribute('type', 'button');
    await userEvent.click(goBackButtonNode[0]);
    const headingNode1 = screen.getByRole('heading', {name: '1'});

    expect(headingNode1).toBeInTheDocument();
    const headingNode2 = screen.getByRole('heading', {name: '2'});

    expect(headingNode2).toBeInTheDocument();
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
    const testConnection1TextNode = screen.getByText('Test Connection 1');

    expect(testConnection1TextNode).toBeInTheDocument();
    const testConnection2TextNode = screen.getByText('Test Connection 2');

    expect(testConnection2TextNode).toBeInTheDocument();
    const bundleTextNode = screen.getByText('Integrator Bundle');

    expect(bundleTextNode).toBeInTheDocument();
    const configureNode = screen.getAllByRole('button', {name: 'Configure'});

    expect(configureNode[0]).toBeInTheDocument();
    expect(configureNode[1]).toBeInTheDocument();
    await userEvent.click(configureNode[0]);
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    await userEvent.click(configureNode[1]);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    const installNode = screen.getByRole('button', {name: 'Install'});

    expect(installNode).toBeInTheDocument();
    await userEvent.click(installNode);
    expect(mockDispatchFn).toHaveBeenCalledTimes(3);
    const verifyNowNode = screen.getByRole('button', {name: 'Verify now'});

    expect(verifyNowNode).toBeInTheDocument();
    await userEvent.click(verifyNowNode);
    expect(mockDispatchFn).toHaveBeenCalledTimes(5);
    const verifyingNode = screen.getByRole('button', {name: 'Verifying'});

    expect(verifyingNode).toBeInTheDocument();
  });
  test('Should able to access the setup page which has is installed failure as false and click on configure along with install bundle option by setting is trigger as false and verifying as true', async () => {
    const integrationSession = {
      'flows-61924a4aaba738048023c161': {
        preview: {
          components: {
            objects: [
              {
                model: 'Flow',
                doc: {
                  _id: '61924a4aaba738048023c161',
                  lastModified: '2021-11-15T11:53:47.252Z',
                  name: 'Test flow 2',
                  description: 'This description.',
                  disabled: true,
                  _integrationId: '619249e805f85b2022e086bd',
                  skipRetries: false,
                  pageProcessors: [
                    {
                      responseMapping: {
                        fields: [],
                        lists: [],
                      },
                      type: 'import',
                      _importId: '61924a47aba738048023c0f7',
                    },
                  ],
                  pageGenerators: [
                    {
                      _exportId: '61924a46aba738048023c0df',
                    },
                  ],
                  createdAt: '2021-11-15T11:53:46.788Z',
                  free: false,
                  _templateId: '5c261974e53d9a2ecf6ad887',
                  _sourceId: '61506aa61ac0cc69b5be2670',
                  wizardState: 'done',
                  autoResolveMatchingTraceKeys: true,
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '61924a46aba738048023c0df',
                  createdAt: '2021-11-15T11:53:42.848Z',
                  lastModified: '2021-11-15T11:53:43.040Z',
                  name: 'Test export',
                  description: 'Test export description.',
                  _connectionId: '5f573f1a87fe9d2ebedd30e5',
                  _sourceId: '61506aa31ac0cc69b5be2602',
                  apiIdentifier: 'e6886d2fe3',
                  asynchronous: true,
                  type: 'delta',
                  _templateId: '5c261974e53d9a2ecf6ad887',
                  parsers: [],
                  delta: {
                    dateField: 'CreatedDate',
                  },
                  salesforce: {
                    type: 'soql',
                    api: 'rest',
                    soql: {
                      query: 'SELECT CreatedById,CreatedDate,Description,DisplayUrl,ExternalDataSourceId,ExternalId,Family,Id,IsActive,IsDeleted,LastModifiedById,LastModifiedDate,LastReferencedDate,LastViewedDate,Name,ProductCode,QuantityUnitOfMeasure,SystemModstamp FROM Product2',
                    },
                    distributed: {
                      referencedFields: [],
                      disabled: false,
                      userDefinedReferencedFields: [],
                      relatedLists: [],
                    },
                  },
                  transform: {
                    type: 'expression',
                    expression: {
                      version: '1',
                    },
                    version: '1',
                  },
                  filter: {
                    type: 'expression',
                    expression: {
                      version: '1',
                    },
                    version: '1',
                  },
                  inputFilter: {
                    type: 'expression',
                    expression: {
                      version: '1',
                    },
                    version: '1',
                  },
                  adaptorType: 'SalesforceExport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '61924a47aba738048023c0f7',
                  createdAt: '2021-11-15T11:53:43.543Z',
                  lastModified: '2021-11-15T11:53:44.003Z',
                  name: 'Test Import',
                  description: 'Test Import Description',
                  responseTransform: {
                    type: 'expression',
                    expression: {
                      version: '1',
                    },
                    version: '1',
                  },
                  parsers: [],
                  _connectionId: '5d4017fb5663022451fdf1ad',
                  _sourceId: '61506aa41ac0cc69b5be2610',
                  distributed: true,
                  apiIdentifier: 'ib8ff29690',
                  ignoreExisting: true,
                  _templateId: '5c261974e53d9a2ecf6ad887',
                  lookups: [],
                  netsuite_da: {
                    operation: 'add',
                    recordType: 'inventoryitem',
                    internalIdLookup: {
                      expression: '["custitem_celigo_sfio_sf_id","is","{{{Id}}}"]',
                    },
                    lookups: [],
                    mapping: {
                      fields: [
                        {
                          generate: 'itemid',
                          extract: 'ProductCode',
                          internalId: false,
                          immutable: false,
                          discardIfEmpty: false,
                        },
                        {
                          generate: 'displayname',
                          extract: 'Name',
                          internalId: false,
                          immutable: false,
                          discardIfEmpty: false,
                        },
                        {
                          generate: 'custitem_celigo_sfio_sf_id',
                          extract: 'Id',
                          internalId: false,
                          immutable: false,
                          discardIfEmpty: false,
                        },
                      ],
                      lists: [],
                    },
                  },
                  filter: {
                    type: 'expression',
                    expression: {
                      version: '1',
                    },
                    version: '1',
                  },
                  adaptorType: 'NetSuiteDistributedImport',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5f573f1a87fe9d2ebedd30e5',
                  createdAt: '2020-09-08T08:21:46.109Z',
                  lastModified: '2022-01-25T07:36:28.071Z',
                  type: 'salesforce',
                  name: 'Test Connection 2',
                  offline: false,
                  sandbox: false,
                  salesforce: {
                    sandbox: false,
                    baseURI: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com',
                    oauth2FlowType: 'refreshToken',
                    bearerToken: '******',
                    refreshToken: '******',
                    packagedOAuth: true,
                    scope: [],
                    concurrencyLevel: 5,
                    info: {
                      sub: 'https://login.salesforce.com/id/00D6F000001oricUAA/0056F000009uZUlQAM',
                      user_id: '0056F000009uZUlQAM',
                      organization_id: '00D6F000001oricUAA',
                      preferred_username: 'snigdha@celigo.com',
                      nickname: 'snigdha',
                      name: 'snigdha panigrahy',
                      email: 'snigdharani.panigrahy@celigo.com',
                      email_verified: true,
                      given_name: 'snigdha',
                      family_name: 'panigrahy',
                      zoneinfo: 'America/Los_Angeles',
                      photos: {
                        picture: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/F',
                        thumbnail: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/T',
                      },
                      profile: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/0056F000009uZUlQAM',
                      picture: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/F',
                      address: {
                        country: 'IN',
                      },
                      urls: {
                        enterprise: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/c/{version}/00D6F000001oric',
                        metadata: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/m/{version}/00D6F000001oric',
                        partner: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/u/{version}/00D6F000001oric',
                        rest: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/',
                        sobjects: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/sobjects/',
                        search: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/search/',
                        query: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/query/',
                        recent: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/recent/',
                        tooling_soap: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/T/{version}/00D6F000001oric',
                        tooling_rest: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/tooling/',
                        profile: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/0056F000009uZUlQAM',
                        feeds: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feeds',
                        groups: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/groups',
                        users: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/users',
                        feed_items: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-items',
                        feed_elements: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-elements',
                        custom_domain: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com',
                      },
                      active: true,
                      user_type: 'STANDARD',
                      language: 'en_US',
                      locale: 'en_US',
                      utcOffset: -28800000,
                      updated_at: '2020-04-29T08:19:07Z',
                    },
                  },
                  queues: [
                    {
                      name: '5f573f1a87fe9d2ebedd30e5',
                      size: 0,
                    },
                  ],
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5d4017fb5663022451fdf1ad',
                  createdAt: '2019-07-30T10:12:11.785Z',
                  lastModified: '2022-05-28T00:24:14.294Z',
                  type: 'netsuite',
                  name: 'Test Connection 1',
                  offline: false,
                  debugDate: '2020-09-21T08:45:03.928Z',
                  sandbox: false,
                  netsuite: {
                    account: 'TSTDRV1934805',
                    roleId: '3',
                    email: 'hajra.parveen@celigo.com',
                    password: '******',
                    environment: 'production',
                    requestLevelCredentials: false,
                    dataCenterURLs: {
                      restDomain: 'https://tstdrv1934805.restlets.api.netsuite.com',
                      webservicesDomain: 'https://tstdrv1934805.suitetalk.api.netsuite.com',
                      systemDomain: 'https://tstdrv1934805.app.netsuite.com',
                    },
                    wsdlVersion: '2016.2',
                    concurrencyLevel: 1,
                    suiteAppInstalled: false,
                    authType: 'basic',
                  },
                  queues: [
                    {
                      name: '5d4017fb5663022451fdf1ad',
                      size: 0,
                    },
                  ],
                },
              },
              {
                model: 'Script',
                doc: {
                  _id: '61924a2caba738048023c093',
                  lastModified: '2021-11-15T11:53:16.445Z',
                  createdAt: '2021-11-15T11:53:16.272Z',
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
            createdAt: '2019-07-30T10:12:11.785Z',
            lastModified: '2022-05-28T00:24:14.294Z',
            type: 'netsuite',
            name: 'Test Connection 1',
            offline: false,
            debugDate: '2020-09-21T08:45:03.928Z',
            sandbox: false,
            netsuite: {
              account: 'TSTDRV1934805',
              roleId: '3',
              email: 'hajra.parveen@celigo.com',
              password: '******',
              environment: 'production',
              requestLevelCredentials: false,
              dataCenterURLs: {
                restDomain: 'https://tstdrv1934805.restlets.api.netsuite.com',
                webservicesDomain: 'https://tstdrv1934805.suitetalk.api.netsuite.com',
                systemDomain: 'https://tstdrv1934805.app.netsuite.com',
              },
              wsdlVersion: '2016.2',
              concurrencyLevel: 1,
              suiteAppInstalled: false,
              authType: 'basic',
            },
            queues: [
              {
                name: '5d4017fb5663022451fdf1ad',
                size: 0,
              },
            ],
          },
          '5f573f1a87fe9d2ebedd30e5': {
            _id: '5f573f1a87fe9d2ebedd30e5',
            createdAt: '2020-09-08T08:21:46.109Z',
            lastModified: '2022-01-25T07:36:28.071Z',
            type: 'salesforce',
            name: 'Test Connection 2',
            offline: false,
            sandbox: false,
            salesforce: {
              sandbox: false,
              baseURI: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com',
              oauth2FlowType: 'refreshToken',
              bearerToken: '******',
              refreshToken: '******',
              packagedOAuth: true,
              scope: [],
              concurrencyLevel: 5,
              info: {
                sub: 'https://login.salesforce.com/id/00D6F000001oricUAA/0056F000009uZUlQAM',
                user_id: '0056F000009uZUlQAM',
                organization_id: '00D6F000001oricUAA',
                preferred_username: 'snigdha@celigo.com',
                nickname: 'snigdha',
                name: 'snigdha panigrahy',
                email: 'snigdharani.panigrahy@celigo.com',
                email_verified: true,
                given_name: 'snigdha',
                family_name: 'panigrahy',
                zoneinfo: 'America/Los_Angeles',
                photos: {
                  picture: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/F',
                  thumbnail: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/T',
                },
                profile: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/0056F000009uZUlQAM',
                picture: 'https://d6f000001oricuaa-dev-ed--c.documentforce.com/profilephoto/005/F',
                address: {
                  country: 'IN',
                },
                urls: {
                  enterprise: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/c/{version}/00D6F000001oric',
                  metadata: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/m/{version}/00D6F000001oric',
                  partner: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/u/{version}/00D6F000001oric',
                  rest: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/',
                  sobjects: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/sobjects/',
                  search: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/search/',
                  query: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/query/',
                  recent: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/recent/',
                  tooling_soap: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/Soap/T/{version}/00D6F000001oric',
                  tooling_rest: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/tooling/',
                  profile: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/0056F000009uZUlQAM',
                  feeds: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feeds',
                  groups: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/groups',
                  users: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/users',
                  feed_items: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-items',
                  feed_elements: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-elements',
                  custom_domain: 'https://d6f000001oricuaa-dev-ed.my.salesforce.com',
                },
                active: true,
                user_type: 'STANDARD',
                language: 'en_US',
                locale: 'en_US',
                utcOffset: -28800000,
                updated_at: '2020-04-29T08:19:07Z',
              },
            },
            queues: [
              {
                name: '5f573f1a87fe9d2ebedd30e5',
                size: 0,
              },
            ],
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
    const setupNode = screen.getByText('Setup');

    expect(setupNode).toBeInTheDocument();
    const goBackButtonNode = screen.getAllByRole('button');

    expect(goBackButtonNode[0]).toHaveAttribute('type', 'button');
    await userEvent.click(goBackButtonNode[0]);
    const headingNode1 = screen.getByRole('heading', {name: '1'});

    expect(headingNode1).toBeInTheDocument();
    const headingNode2 = screen.getByRole('heading', {name: '2'});

    expect(headingNode2).toBeInTheDocument();
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
    const testConnection1TextNode = screen.getByText('Test Connection 1');

    expect(testConnection1TextNode).toBeInTheDocument();
    const testConnection2TextNode = screen.getByText('Test Connection 2');

    expect(testConnection2TextNode).toBeInTheDocument();
    const bundleTextNode = screen.getByText('Integrator Bundle');

    expect(bundleTextNode).toBeInTheDocument();
    const configureNode = screen.getAllByRole('button', {name: 'Configure'});

    expect(configureNode[0]).toBeInTheDocument();
    expect(configureNode[1]).toBeInTheDocument();
    await userEvent.click(configureNode[0]);
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    await userEvent.click(configureNode[1]);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    const installNode = screen.getByRole('button', {name: 'Install'});

    expect(installNode).toBeInTheDocument();
    await userEvent.click(installNode);
    expect(mockDispatchFn).toHaveBeenCalledTimes(3);
    const verifyingNode = screen.getByRole('button', {name: 'Verifying'});

    expect(verifyingNode).toBeInTheDocument();
  });
  test('Should able to access the setup page without flow name', async () => {
    const integrationSession = {
      'flows-60db46af9433830f8f0e0fe8': {
        preview: {
          components: {
            objects: [
              {
                model: 'Flow',
                doc: {
                  _id: '60db46af9433830f8f0e0fe8',
                  lastModified: '2022-07-27T18:04:57.044Z',
                  description: 'Testing Flow',
                  disabled: false,
                  _integrationId: '5fc5e0e66cfe5b44bb95de70',
                  skipRetries: false,
                  pageProcessors: [
                    {
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
                  autoResolveMatchingTraceKeys: true,
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
                  assistantMetadata: {
                    resource: 'orders',
                    version: 'latest',
                    operation: 'get_packages_details',
                  },
                  http: {
                    relativeURI: '/orders/3862/packages',
                    method: 'GET',
                    requestMediaType: 'json',
                    successMediaType: 'json',
                    errorMediaType: 'json',
                    formType: 'assistant',
                  },
                  rawData: '5d4010e14cd24a7c773122efebb372a471d8466aa1e52b628035c2a7',
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
                  file: {
                    fileName: 'walmart-canada-pagination.json',
                    skipAggregation: false,
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
                  lastModified: '2022-07-27T18:02:24.948Z',
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
                    },
                    unencrypted: {
                      tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                      userLoginId: 'Celigo_SandBox',
                    },
                    auth: {
                      type: 'oauth',
                      failValues: [

                      ],
                      oauth: {
                        tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
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
          '5fc5e4a46cfe5b44bb95df44': {
            _id: '5fc5e4a46cfe5b44bb95df44',
            createdAt: '2020-12-01T06:37:24.341Z',
            lastModified: '2022-07-27T18:02:24.948Z',
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
              },
              unencrypted: {
                tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                userLoginId: 'Celigo_SandBox',
              },
              auth: {
                type: 'oauth',
                oauth: {
                  tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
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
    const setupNode = screen.getByText('Setup');

    expect(setupNode).toBeInTheDocument();
    const goBackButtonNode = screen.getAllByRole('button');

    expect(goBackButtonNode[0]).toHaveAttribute('type', 'button');
    await userEvent.click(goBackButtonNode[0]);
    const headingNode1 = screen.getByRole('heading', {name: '1'});

    expect(headingNode1).toBeInTheDocument();
    const headingNode2 = screen.getByRole('heading', {name: '2'});

    expect(headingNode2).toBeInTheDocument();
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
    const ftpConnectionTextNode = screen.getByText('FTP Connection');

    expect(ftpConnectionTextNode).toBeInTheDocument();
    const threeplConnectionTextNode = screen.getByText('3PL Central Connection');

    expect(threeplConnectionTextNode).toBeInTheDocument();
    const configureNode = screen.getAllByRole('button', {name: 'Configure'});

    expect(configureNode[0]).toBeInTheDocument();
    expect(configureNode[1]).toBeInTheDocument();
    await userEvent.click(configureNode[0]);
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    await userEvent.click(configureNode[1]);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
  });
});
