
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import NotificationsSection from '.';

jest.mock('../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/LoadResources'),
  default: props => <div>{props.children}</div>,
}));

const flows = [
  {
    _id: '5ea16c600e2fab71928a6152',
    lastModified: '2021-08-13T08:02:49.712Z',
    name: null,
    disabled: true,
    _integrationId: '5ff579d745ceef7dcd797c15',
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
        _exportId: '5d00b9f0bcd64414811b2396',
      },
    ],
    createdAt: '2020-04-23T10:22:24.290Z',
    lastExecutedAt: '2020-04-23T11:08:41.093Z',
    autoResolveMatchingTraceKeys: true,
  },
  {
    _id: '5ea16c600e2fab71928a6153',
    lastModified: '2021-08-13T08:02:49.712Z',
    name: 'Second flow',
    disabled: true,
    _integrationId: '5ff579d745ceef7dcd797c15',
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
        _exportId: '5d00b9f0bcd64414811b2396',
      },
    ],
    createdAt: '2020-04-23T10:22:24.290Z',
    lastExecutedAt: '2020-04-23T11:08:41.093Z',
    autoResolveMatchingTraceKeys: true,
  },
];

const connections = [
  {
    _id: '5e7068331c056a75e6df19b2',
    createdAt: '2020-03-17T06:03:31.798Z',
    lastModified: '2020-03-19T23:47:55.181Z',
    type: 'rest',
    name: 'First connection',
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

describe('NotificationsSection UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  function initStoreAndRender(useErrMgtTwoDotZero) {
    const initialStore = getCreatedStore();

    const useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    const mockDispatch = jest.fn(action => {
      switch (action.type) {
        case 'RESOURCE_UPDATE_TILE_NOTIFICATIONS': break;
        default:
          initialStore.dispatch(action);
      }
    });

    useDispatchSpy.mockReturnValue(mockDispatch);

    mutateStore(initialStore, draft => {
      draft.data.resources.integrations = [{
        _id: '5ff579d745ceef7dcd797c15',
        lastModified: '2021-01-19T06:34:17.222Z',
        name: " AFE 2.0 refactoring for DB's",
        install: [],
        sandbox: false,
        _registeredConnectionIds: [
          '5e7068331c056a75e6df19b2',
        ],
        installSteps: [],
        uninstallSteps: [],
        flowGroupings: [
          {
            name: 'some group',
            _id: '62bdeb31a0f5f21448168826',
          },
        ],
        createdAt: '2021-01-06T08:50:31.935Z',
      }];
      draft.data.resources.flows = flows;
      draft.data.resources.connections = connections;
      draft.data.resources.notifications = [{
        subscribedByUser: {
          email: 'Celigo@celigo.com',
        },
        _integrationId: '5ff579d745ceef7dcd797c15',
      }];
      draft.user.profile = {
        _id: '5ca5c855ec5c172792285f53',
        name: 'Celigo 123',
        email: 'Celigo@celigo.com',
        role: 'io-qa intern',
        company: 'Amazon Central',
        phone: '',
        auth_type_google: {},
        timezone: 'Asia/Calcutta',
        developer: true,
        allowedToPublish: true,
        agreeTOSAndPP: true,
        createdAt: '2019-04-04T09:03:18.208Z',
        useErrMgtTwoDotZero,
        authTypeSSO: null,
        emailHash: '1c8eb6f416e72a5499283b56f2663fe1',
      };
    });

    renderWithProviders(<MemoryRouter><NotificationsSection integrationId="5ff579d745ceef7dcd797c15" /> </MemoryRouter>, {initialStore});

    return mockDispatch;
  }
  test('should test when store does not has integration', () => {
    renderWithProviders(<MemoryRouter><NotificationsSection integrationId="5ff579d745ceef7dcd797c15" /> </MemoryRouter>);
    expect(screen.getByText('Notify me of job error')).toBeInTheDocument();
    expect(screen.getByText('Notify me when connection goes offline')).toBeInTheDocument();
  });
  test('should test for jobs notification options', async () => {
    const mockDispatch = initStoreAndRender(false);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Notify me of job error')).toBeInTheDocument();

    await userEvent.click(screen.getByText('All flows'));
    await userEvent.click(screen.getByText('Second flow'));
    await userEvent.click(screen.getByText('Done'));
    await userEvent.click(screen.getByText('Save'));

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_UPDATE_TILE_NOTIFICATIONS',
        resourcesToUpdate: {
          subscribedConnections: [],
          subscribedFlows: [flows[0], flows[1], '5ea16c600e2fab71928a6153'],
        },
        integrationId: '5ff579d745ceef7dcd797c15',
        childId: undefined,
      }
    );
  });
  test('should test for flows notification options', async () => {
    const mockDispatch = initStoreAndRender(true);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Notify me of flow error')).toBeInTheDocument();

    await userEvent.click(screen.getByText('All flows'));
    await userEvent.click(screen.getByText('Second flow'));
    await userEvent.click(screen.getByText('Done'));
    await userEvent.click(screen.getByText('Save'));

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_UPDATE_TILE_NOTIFICATIONS',
        resourcesToUpdate: {
          subscribedConnections: [],
          subscribedFlows: [flows[0], flows[1], '5ea16c600e2fab71928a6153'],
        },
        integrationId: '5ff579d745ceef7dcd797c15',
        childId: undefined,
      }
    );
  });
  test('should test for connection notification options', async () => {
    const mockDispatch = initStoreAndRender(true);

    await userEvent.click(screen.getByText('Please select'));
    await userEvent.click(screen.getByText('First connection'));
    await userEvent.click(screen.getByText('Done'));
    await userEvent.click(screen.getByText('Save'));

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_UPDATE_TILE_NOTIFICATIONS',
        resourcesToUpdate: {
          subscribedConnections: ['5e7068331c056a75e6df19b2'],
          subscribedFlows: ['5ff579d745ceef7dcd797c15', flows[0], flows[1]],
        },
        integrationId: '5ff579d745ceef7dcd797c15',
        childId: undefined,
      }
    );
  });
});
