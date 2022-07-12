/* global describe, test, expect, jest */
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter, Route, useRouteMatch } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../test/test-utils';
import OfflineConnectionDrawerRoute from '.';
import { getCreatedStore } from '../../../store';

function initDrawer(props = {}) {
  const initialStore = getCreatedStore();

  initialStore.getState().data.resources.integrations = [{
    _id: '6253af74cddb8a1ba550a010',
    lastModified: '2022-06-30T06:39:32.607Z',
    name: 'demoint',
    description: 'demo integration',
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '62bd43c87b94d20de64e9ab3',
      '62bd452420ecb90e02f2a6f0',
    ],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2022-04-11T04:32:52.823Z',
  }];
  initialStore.getState().data.resources.connections = [
    {
      _id: '62beb2c2a0f5f2144816f818',
      createdAt: '2022-07-01T08:39:30.787Z',
      lastModified: '2022-07-04T02:51:17.529Z',
      type: 'rdbms',
      name: 'Snowflake connection',
      offline: true,
      rdbms: {
        type: 'snowflake',
        host: 'demo',
        database: 'demo',
        user: 'user',
        password: '******',
        options: [],
        snowflake: {
          warehouse: 'demo',
          schema: 'demo',
        },
        disableStrictSSL: false,
      },
    },
    {
      _id: '62bd43c87b94d20de64e9ab3',
      createdAt: '2022-06-30T06:33:44.780Z',
      lastModified: '2022-06-30T06:33:44.870Z',
      type: 'http',
      name: 'demo',
      offline: true,
      sandbox: false,
      http: {
        formType: 'rest',
        mediaType: 'json',
        baseURI: 'https://3jno0syp47.execute-api.us-west-2.amazonaws.com/test/orders',
        unencrypted: {
          field: 'value',
        },
        encrypted: '******',
        auth: {
          type: 'basic',
          basic: {
            username: 'demo',
            password: '******',
          },
        },
      },
    },
    {
      _id: '62bd452420ecb90e02f2a6f0',
      createdAt: '2022-06-30T06:39:32.493Z',
      lastModified: '2022-07-03T00:50:46.856Z',
      type: 'salesforce',
      name: 'demo sales',
      offline: true,
      sandbox: false,
      salesforce: {
        sandbox: false,
        username: 'user',
        oauth2FlowType: 'jwtBearerToken',
        packagedOAuth: true,
        scope: [],
        concurrencyLevel: 5,
      },
    },
    {
      _id: '62c3d4109666a2025517b8e2',
      createdAt: '2022-07-05T06:02:56.561Z',
      lastModified: '2022-07-07T22:00:23.424Z',
      type: 'salesforce',
      name: 'demo sales',
      offline: true,
      _sourceId: '62bd452420ecb90e02f2a6f0',
      salesforce: {
        sandbox: false,
        oauth2FlowType: 'refreshToken',
        packagedOAuth: true,
        scope: [],
        concurrencyLevel: 5,
      },
    },
  ];
  initialStore.getState().data.resources.tiles = [{
    _integrationId: '6253af74cddb8a1ba550a010',
    numError: 1,
    offlineConnections: ['62bd43c87b94d20de64e9ab3', '62bd452420ecb90e02f2a6f0'],
    name: 'demoint',
    description: 'demo integration',
    lastModified: '2022-06-30T06:39:32.607Z',
    sandbox: false,
    numFlows: 1,
    _parentId: null,
    supportsChild: false,
    iaV2: false,
    _registeredConnectionIds: [
      '62bd43c87b94d20de64e9ab3',
      '62bd452420ecb90e02f2a6f0',
    ],
    lastErrorAt: '2022-07-07T14:46:36.382Z',
  }];
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/home/6253af74cddb8a1ba550a010/offlineconnections/62c3d4109666a2025517b8e2'}]}>
      <Route path="/home">
        <OfflineConnectionDrawerRoute {...props} />
      </Route>
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('OfflineConnection drawer UI tests', () => {
  test('should display the drawer contents', () => {
    initDrawer();
    expect(screen.getByText(/Fix offline connections/i)).toBeInTheDocument();
    const element = document.querySelector('[aria-label="Close"]');

    expect(element).toBeInTheDocument();
  });
  test('should run the predifined handle close function when the form is closed', () => {
    initDrawer();
    const element = document.querySelector('[aria-label="Close"]');

    console.log();
    // userEvent.click(element);
    // const match = useRouteMatch();
  });
});
