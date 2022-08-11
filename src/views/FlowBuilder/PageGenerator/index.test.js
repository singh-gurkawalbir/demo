/* global describe, test, expect, jest, beforeEach */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders} from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import PageGenerator from './index';

const mockDispatch = jest.fn();

const history = {
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../AppBlock', () => ({
  __esModule: true,
  ...jest.requireActual('../AppBlock'),
  default: props => {
    const blockType = `blockType: ${props.blockType}`;
    const actions = props.actions.map(a => <div key={a.name}>{`actionsname : ${a.name}`}</div>);
    const connectorType = `Connector Type: ${props.connectorType}`;

    return (
      <>
        <button type="button" onClick={props.onBlockClick}>
          mock onBlockClick
        </button>
        <button type="button" onClick={props.onDelete}>
          mock onDelete
        </button>
        <div>{blockType}</div>
        <div>{actions}</div>
        <div>{connectorType}</div>
      </>
    );
  },
}));

const connections = [
  {
    _id: '5e7068331c056a75e6df19b2',
    createdAt: '2020-03-17T06:03:31.798Z',
    lastModified: '2020-03-19T23:47:55.181Z',
    type: 'rest',
    name: '3D Cart Staging delete',
    assistant: '3dcart',
    offline: true,
    sandbox: false,
    isHTTP: true,
    http: {
      formType: 'assistant',
      mediaType: 'json',
      baseURI: 'https://apirest.3dcart.com',
      concurrencyLevel: 11,
      ping: {
        relativeURI: '/3dCartWebAPI/v1/Customers',
        method: 'GET',
      },
      headers: [
        {
          name: 'SecureUrl',
          value: 'https://celigoc1.com',
        },
        {
          name: 'PrivateKey',
          value: '{{{connection.http.encrypted.PrivateKey}}}',
        },
        {
          name: 'content-type',
          value: 'application/json',
        },
      ],
      encrypted: '******',
      encryptedFields: [],
      auth: {
        type: 'token',
        oauth: {
          scope: [],
        },
        token: {
          token: '******',
          location: 'header',
          headerName: 'Token',
          scheme: ' ',
          refreshMethod: 'POST',
          refreshMediaType: 'urlencoded',
        },
      },
    },
    rest: {
      baseURI: 'https://apirest.3dcart.com',
      bearerToken: '******',
      tokenLocation: 'header',
      mediaType: 'json',
      authType: 'token',
      authHeader: 'Token',
      authScheme: ' ',
      headers: [
        {
          name: 'SecureUrl',
          value: 'https://celigoc1.com',
        },
        {
          name: 'PrivateKey',
          value: '{{{connection.rest.encrypted.PrivateKey}}}',
        },
      ],
      encrypted: '******',
      encryptedFields: [],
      unencryptedFields: [],
      scope: [],
      pingRelativeURI: '/3dCartWebAPI/v1/Customers',
      concurrencyLevel: 11,
      refreshTokenHeaders: [],
    },
  },
];
const connections3 = [
  {
    _id: '5e7068331c056a75e6df19b2',
    createdAt: '2020-03-17T06:03:31.798Z',
    lastModified: '2020-03-19T23:47:55.181Z',
    adaptorType: 'HTTPExport',
    http: {type: 'file'},
    name: '3D Cart Staging delete',
    assistant: '3dcart',
    offline: true,
    sandbox: false,
  },
];
const as2connections = [
  {
    _id: '62f24d45f8b63672312cd561',
    createdAt: '2022-08-09T12:04:21.456Z',
    lastModified: '2022-08-09T12:04:21.551Z',
    type: 'as2',
    name: 'weev',
    sandbox: false,
    as2: {
      as2Id: 'awrvrv',
      contentBasedFlowRouter: {_scriptId: 'some_scriptId'},
      partnerId: 'wqefwef',
      unencrypted: {
        partnerCertificate: 'qd3d',
        userPublicKey: 'q3FDWF',
      },
      preventCanonicalization: false,
      partnerStationInfo: {
        as2URI: 'https://www.qwrvre.com',
        mdn: {
          mdnSigning: 'NONE',
        },
        signing: 'MD5',
        encryptionType: 'AES128',
        encoding: 'base64',
        signatureEncoding: 'base64',
        auth: {
          type: 'basic',
          basic: {
            username: 'qed3w',
            password: '******',
          },
        },
      },
      userStationInfo: {
        mdn: {
          mdnSigning: 'MD5',
          mdnEncoding: 'base64',
        },
        signing: 'MD5',
        encryptionType: '3DES',
        encoding: 'base64',
      },
    },
  },
];
const exports = [
  {
    _id: '5e7068331c056a75e6df19b2',
    name: 'Export Name',
  },
];
const as2exports = [
  {
    _id: '5e7068331c056a75e6df19b2',
    name: 'Export Name',
    _connectionId: '62f24d45f8b63672312cd561',
  },
];

const webhookexport = [
  {
    _id: '5e7068331c056a75e6df19b2',
    name: 'Export Name',
    type: 'WebhookExport',
    webhook: { provider: 'someprovider'},
  },
];

const distributedexports = [
  {
    _id: '5e7068331c056a75e6df19b2',
    name: 'Export Name',
    type: 'distributed',
    webhook: { provider: 'someprovider'},
  },
];

const flows = [{
  _id: '5ea16c600e2fab71928a6152',
  lastModified: '2021-08-13T08:02:49.712Z',
  name: ' Bulk insert with harcode and mulfield mapping settings',
  disabled: true,
  _integrationId: '5e9bf6c9edd8fa3230149fbd',
  skipRetries: false,
  pageProcessors: [
    {
      responseMapping: {
        fields: [],
        lists: [],
      },
      type: 'import',
      _importId: '5ea16cd30e2fab71928a6166',
    },
  ],
  pageGenerators: [
    {
      _exportId: '5e7068331c056a75e6df19b2',
    },
  ],
  createdAt: '2020-04-23T10:22:24.290Z',
  lastExecutedAt: '2020-04-23T11:08:41.093Z',
  autoResolveMatchingTraceKeys: true,
}];

describe('PageGenerator UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  function renderFunction(pg, history, initialStore) {
    renderWithProviders(
      <PageGenerator.WrappedComponent history={history} match={{url: 'someinitiaUrL'}} {...pg} />,
      {initialStore});
  }
  test('should test the case when connection is provided and no export', () => {
    const pg = {
      id: 'somePGId',
      _connectionId: '5e7068331c056a75e6df19b2',
    };

    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = connections;

    renderFunction(pg, history, initialStore);

    userEvent.click(screen.getByText('mock onBlockClick'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_STAGE_PATCH',
        patch: [
          { op: 'add', path: '/application', value: '3dcart' },
          {
            op: 'add',
            path: '/_connectionId',
            value: '5e7068331c056a75e6df19b2',
          },
          { op: 'add', path: '/rdbmsAppType', value: undefined },
        ],
        id: 'somePGId',
        scope: 'value',
      }
    );

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/add/pageGenerator/somePGId');

    expect(screen.getByText('Connector Type: rest')).toBeInTheDocument();
  });
  test('should test when webhookonly = true application type !== webhook', () => {
    const pg = {
      id: 'somePGId',
      webhookOnly: true,
      _connectionId: '5e7068331c056a75e6df19b2',
    };

    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = connections;

    renderFunction(pg, history, initialStore);

    userEvent.click(screen.getByText('mock onBlockClick'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_STAGE_PATCH',
        patch: [
          { op: 'add', path: '/application', value: '3dcart' },
          { op: 'add', path: '/type', value: 'webhook' },
          {
            op: 'add',
            path: '/_connectionId',
            value: '5e7068331c056a75e6df19b2',
          },
          { op: 'add', path: '/rdbmsAppType', value: undefined },
        ],
        id: 'somePGId',
        scope: 'value',
      }
    );

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/add/pageGenerator/somePGId');
    expect(screen.getByText('Connector Type: rest')).toBeInTheDocument();
  });
  test('should test the case when resource is FileAdaptor ', () => {
    const pg = {
      id: 'somePGId',
      webhookOnly: true,
      _connectionId: '5e7068331c056a75e6df19b2',
    };

    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = connections3;

    renderFunction(pg, history, initialStore);

    expect(screen.getByText('blockType: exportTransfer')).toBeInTheDocument();
    expect(screen.getByText('Connector Type: HTTPExport')).toBeInTheDocument();
  });
  test('should test when no export and no resource Id and only application is provided ', () => {
    const pg = {
      id: 'somePGId',
      application: 'activecampaign',
    };

    const initialStore = getCreatedStore();

    renderFunction(pg, history, initialStore);

    expect(screen.getByText('blockType: newPG')).toBeInTheDocument();
    expect(screen.getByText('Connector Type: http')).toBeInTheDocument();
  });
  test('should test the case when resource is data loader', () => {
    const pg = {
      id: 'somePGId',
      _connectionId: '5e7068331c056a75e6df19b2',
      application: 'dataLoader',
    };

    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = connections;

    renderFunction(pg, history, initialStore);

    userEvent.click(screen.getByText('mock onBlockClick'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_STAGE_PATCH',
        patch: [
          { op: 'add', path: '/type', value: 'simple' },
          { op: 'add', path: '/name', value: 'Data loader' },
        ],
        id: 'somePGId',
        scope: 'value',
      }
    );

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/edit/exports/somePGId');
    expect(screen.getByText('blockType: dataLoader')).toBeInTheDocument();

    expect(screen.queryByText('actionsname : as2Routing')).not.toBeInTheDocument();
    expect(screen.queryByText('actionsname : exportTransformation')).not.toBeInTheDocument();
    expect(screen.queryByText('actionsname : exportFilter')).not.toBeInTheDocument();
    expect(screen.queryByText('actionsname : exportHooks')).not.toBeInTheDocument();

    expect(screen.queryByText('Connector Type: dataLoader')).toBeInTheDocument();
  });
  test('should test the case when export is provided', () => {
    const pg = {
      id: 'somePGId',
      _exportId: '5e7068331c056a75e6df19b2',
    };

    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.exports = exports;

    renderFunction(pg, history, initialStore);

    userEvent.click(screen.getByText('mock onBlockClick'));

    expect(mockDispatch).not.toHaveBeenCalled();

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/edit/exports/5e7068331c056a75e6df19b2');
    expect(screen.getByText('blockType: export')).toBeInTheDocument();

    expect(screen.getByText('actionsname : exportTransformation')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportFilter')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportHooks')).toBeInTheDocument();
  });
  test('should test the case when block type is listener', () => {
    const pg = {
      id: 'somePGId',
      _exportId: '5e7068331c056a75e6df19b2',
    };

    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.exports = distributedexports;

    renderFunction(pg, history, initialStore);

    userEvent.click(screen.getByText('mock onBlockClick'));

    expect(mockDispatch).not.toHaveBeenCalled();

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/edit/exports/5e7068331c056a75e6df19b2');

    expect(screen.getByText('blockType: listener')).toBeInTheDocument();

    expect(screen.getByText('actionsname : exportTransformation')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportFilter')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportHooks')).toBeInTheDocument();

    expect(screen.getByText('Connector Type: distributed')).toBeInTheDocument();
  });

  test('should test the case when resource is of AS2', () => {
    const pg = {
      id: 'somePGId',
      _exportId: '5e7068331c056a75e6df19b2',
    };

    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.exports = as2exports;
    initialStore.getState().data.resources.connections = as2connections;

    renderFunction(pg, history, initialStore);

    userEvent.click(screen.getByText('mock onBlockClick'));

    expect(mockDispatch).not.toHaveBeenCalled();

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/edit/exports/5e7068331c056a75e6df19b2');
    expect(screen.getByText('blockType: export')).toBeInTheDocument();

    expect(screen.getByText('actionsname : as2Routing')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportTransformation')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportFilter')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportHooks')).toBeInTheDocument();
  });
  // test('pending is false multipleAs2ExportsOfSameConnectionId true', () => {
  //   const pg = {
  //     id: 'somePGId',
  //     _exportId: '5e7068331c056a75e6df19b2',
  //   };

  //   const initialStore = getCreatedStore();

  //   initialStore.getState().data.resources.exports = as2exports;
  //   initialStore.getState().data.resources.connections = as2connections;

  //   renderFunction(pg, history, initialStore);

  //   userEvent.click(screen.getByText('mock onBlockClick'));

  //   expect(mockDispatch).not.toHaveBeenCalled();

  //   expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/edit/exports/5e7068331c056a75e6df19b2');

  //   expect(screen.getByText('actionsname : as2Routing')).toBeInTheDocument();
  //   expect(screen.getByText('actionsname : exportTransformation')).toBeInTheDocument();
  //   expect(screen.getByText('actionsname : exportFilter')).toBeInTheDocument();
  //   expect(screen.getByText('actionsname : exportHooks')).toBeInTheDocument();
  // });
  test('should test case when webhook export is given', () => {
    const pg = {
      id: 'somePGId',
      _exportId: '5e7068331c056a75e6df19b2',
    };

    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.exports = webhookexport;

    renderFunction(pg, history, initialStore);

    userEvent.click(screen.getByText('mock onBlockClick'));

    expect(mockDispatch).not.toHaveBeenCalled();

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/edit/exports/5e7068331c056a75e6df19b2');
    expect(screen.getByText('actionsname : exportTransformation')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportFilter')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportHooks')).toBeInTheDocument();

    expect(screen.getByText('Connector Type: someprovider')).toBeInTheDocument();
  });

  test('should test the case when allowschedule is true', () => {
    const pg = {
      id: 'somePGId',
      _exportId: '5e7068331c056a75e6df19b2',
      flowId: '5ea16c600e2fab71928a6152',
    };

    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.exports = exports;
    initialStore.getState().data.resources.flows = flows;

    renderFunction(pg, history, initialStore);

    userEvent.click(screen.getByText('mock onBlockClick'));

    expect(mockDispatch).not.toHaveBeenCalled();

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/edit/exports/5e7068331c056a75e6df19b2');

    expect(screen.getByText('actionsname : exportSchedule')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportTransformation')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportFilter')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportHooks')).toBeInTheDocument();
  });
  test('should test history.push call', () => {
    const pg = {
      id: 'somePGId',
      _exportId: '5e7068331c056a75e6df19b2',
      flowId: '5ea16c600e2fab71928a6152',
    };

    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.exports = exports;
    initialStore.getState().data.resources.flows = flows;

    renderWithProviders(
      <PageGenerator.WrappedComponent history={history} match={{url: 'someinitiaUrL', isExact: true}} {...pg} />,
      {initialStore});

    userEvent.click(screen.getByText('mock onBlockClick'));

    expect(mockDispatch).not.toHaveBeenCalled();

    expect(history.push).toHaveBeenCalledWith('someinitiaUrL/edit/exports/5e7068331c056a75e6df19b2');
  });
});
