
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ResourceDrawerLink from '.';
import {renderWithProviders, mockGetRequestOnce} from '../../test/test-utils';
import ConnectionResourceDrawerLink from './connection';
import actions from '../../actions';
import { runServer } from '../../test/api/server';

const resource1 = {
  _id: '5e7068331c056a75e6df19b2',
  createdAt: '2020-03-17T06:03:31.798Z',
  lastModified: '2020-03-19T23:47:55.181Z',
  type: 'rest',
  name: '3D Cart Staging delete',
  assistant: '3dcart',
  offline: true,
  sandbox: false,
  isHTTP: true,
  description: 'abcdefgh',
  shared: true,
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
};

const resource2 = {
  _id: '5e7068331c056a75e6df19b1',
  createdAt: '2020-03-17T06:03:31.798Z',
  lastModified: '2020-03-19T23:47:55.181Z',
  type: 'rest',
  assistant: '3dcart',
  offline: true,
  sandbox: false,
  isHTTP: true,
  description: 'abcdefgh',
  shared: true,
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
};
const resource3 = {
  createdAt: '2020-03-17T06:03:31.798Z',
  lastModified: '2020-03-19T23:47:55.181Z',
  type: 'rest',
  assistant: '3dcart',
  offline: true,
  sandbox: false,
  isHTTP: true,
  description: 'abcdefgh',
  shared: true,
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
};

const connectorLicenses = {
  user: {
    email: 'abc@abc.com',
  },
  _id: 'id',

};

describe('resourceDrawer UI test', () => {
  test('should test connection with linkLabel as name', async () => {
    renderWithProviders(<MemoryRouter><ResourceDrawerLink resourceType="connections" resource={resource1} /> </MemoryRouter>);
    const link = screen.getByText('3D Cart Staging delete');

    expect(link).toHaveAttribute('href', '//edit/connections/5e7068331c056a75e6df19b2');
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(screen.getByText('abcdefgh')).toBeInTheDocument();
    expect(screen.getByText('Shared')).toBeInTheDocument();
  });
  test('should test connection with linkLabel as unknown', async () => {
    renderWithProviders(<MemoryRouter><ResourceDrawerLink resourceType="connections" resource={resource3} /> </MemoryRouter>);
    const link = screen.getByText('unknown');

    expect(link).toHaveAttribute('href', '//edit/connections/undefined');
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(screen.getByText('abcdefgh')).toBeInTheDocument();
  });

  test('should test connection with linkLabel as ID', async () => {
    renderWithProviders(<MemoryRouter><ResourceDrawerLink resourceType="connections" resource={resource2} /> </MemoryRouter>);
    const link = screen.getByText('5e7068331c056a75e6df19b1');

    expect(link).toHaveAttribute('href', '//edit/connections/5e7068331c056a75e6df19b1');
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(screen.getByText('abcdefgh')).toBeInTheDocument();
  });
  test('should test connection with disable as true', () => {
    renderWithProviders(<MemoryRouter><ResourceDrawerLink resourceType="connections" resource={resource2} disabled /> </MemoryRouter>);
    expect(screen.getByText('5e7068331c056a75e6df19b1')).toBeInTheDocument();
  });
  test('should test connectorLicenses', () => {
    renderWithProviders(<MemoryRouter><ResourceDrawerLink resourceType="connectorLicenses" resource={connectorLicenses} /> </MemoryRouter>);
    const link = screen.getByText('abc@abc.com');

    expect(link).toHaveAttribute('href', '//edit/connectorLicenses/id');
  });

  runServer();
  test('should test connection resource link', async () => {
    mockGetRequestOnce('/api/shared/ashares', [
      {
        _id: '618cc96475f94b333a55bbd3',
        dismissed: true,
        accessLevel: 'administrator',
        integrationAccessLevel: [],
        ownerUser: {
          _id: '5feda6fdae2e896a3f3c5cbf',
          email: 'dhilip.s@celigo.com',
          name: 'Dhilip S',
          company: 'Dhilip',
          preferences: {
            environment: 'production',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: 'h:mm:ss a',
            drawerOpened: true,
            defaultAShareId: 'own',
            scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
            showReactSneakPeekFromDate: '2019-11-05',
            showReactBetaFromDate: '2019-12-26',
            dashboard: {
              view: 'list',
              pinnedIntegrations: [
                '619f77445324e30fbb2a541c',
                '61f3e489aae2457e6ea838b6',
                '61f8ed0929a80b4b8134eb25',
                '61fa1ab7a6e61314fcdf8d86',
                '6203f8193ac01960c714e5ab',
                '60ee8aa598d5d30b37795033',
                '60f548a995933011558120f5',
                '61bb11b9c9995f173361c4e2',
              ],
            },
            expand: 'Resources',
            fbBottomDrawerHeight: 522,
          },
          allowedToPublish: true,
          timezone: 'Asia/Calcutta',
          useErrMgtTwoDotZero: true,
        },
      },
    ]);
    const {store} = renderWithProviders(<MemoryRouter><ConnectionResourceDrawerLink resource={resource1} integrationId="5ff579d745ceef7dcd797c15" /> </MemoryRouter>);

    store.dispatch(actions.user.org.accounts.requestCollection());
    store.dispatch(actions.resource.requestCollection('integrations'));

    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user?.org?.accounts?.length).toBeGreaterThan(0));
    expect(screen.getByText('3D Cart Staging delete')).toBeInTheDocument();
  });
});
