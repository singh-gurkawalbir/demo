/* global describe, test, expect, beforeEach, jest */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ResourceList from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mockGetRequestOnce } from '../../test/test-utils';

jest.mock('../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/LoadResources'),
  default: props => (
    <div>{props.children}</div>
  ),
}));
async function initResourceList({
  props = { },
  resourceType = 'exports',
  filter = {},
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().user.preferences = {
    environment: 'production',
    defaultAShareId: 'own',
  };
  initialStore.getState().user.profile = {
    allowedToPublish: true,
    developer: true,
  };
  initialStore.getState().user.org = {
    accounts: [
      {
        accessLevel: 'owner',
        _id: 'own',
        ownerUser: {
          licenses: [{
            type: 'endpoint',
            _id: 'license_id_1',
            tier: 'premium',
            endpoint: {
              apiManagement: true,
              production: {
                numAddOnAgents: 2,
                numAgents: 2,
              },
            },
          }],
        },
      },
    ],
  };

  initialStore.getState().session.filters = filter;
  initialStore.getState().session.loadResources = {
    none: {
      connections: 'received',
      exports: 'received',
    },
  };
  initialStore.getState().data.resources = {
    exports: [
      {
        _id: 'export_id_1',
        name: 'export name 1',
      },
    ],
  };
  initialStore.getState().auth = {
    authenticated: true,
    defaultAccountSet: true,
  };
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/${resourceType}`}]}
    >
      <Route path="/:resourceType">
        <ResourceList {...props} />
      </Route>
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('ResourceList test cases', () => {
  runServer();

  beforeEach(() => {
    mockGetRequestOnce('api/integrations/none/exports', [{
      _id: 'export_id_1',
      name: 'export name 1',
      _connectionId: 'connection_id_1',
    }]);
    mockGetRequestOnce('api/integrations/none/connections', [{
      _id: 'connection_id_1',
      name: 'connection name 1',
    }]);
    mockGetRequestOnce('api/connections', []);
  });

  test('should pass the initial render with default value/export', async () => {
    await initResourceList();
    expect(screen.queryByText(/Exports/i)).toBeInTheDocument();
  });

  test('should pass the initial render with export resource with filter', async () => {
    await initResourceList({
      filter: {
        exports: {
          isAllSelected: false,
          keyword: 'no result keyword',
          sort: { order: 'desc', orderBy: 'lastModified' },
          selected: {},
          take: 100,
        },
      },
    });

    expect(screen.queryByText(/Exports/i)).toBeInTheDocument();
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria./i)).toBeInTheDocument();
  });

  test('should pass the initial render with api resource type', async () => {
    mockGetRequestOnce('api/apis', []);
    mockGetRequestOnce('api/scripts', []);
    await initResourceList({
      resourceType: 'apis',
    });

    expect(screen.queryByText(/My APIs/i)).toBeInTheDocument();
  });

  test('should pass the initial render with connectors resource type', async () => {
    mockGetRequestOnce('api/connectors', []);

    await initResourceList({
      resourceType: 'connectors',
    });
    expect(screen.queryByText(/Integration apps/i)).toBeInTheDocument();
  });

  test('should pass the initial render with connections resource type', async () => {
    await initResourceList({
      resourceType: 'connections',
    });
    expect(screen.queryAllByText(/Connections/)).toHaveLength(2);
  });

  test('should pass the initial render with stacks resource type', async () => {
    await initResourceList({
      resourceType: 'stacks',
    });
    expect(screen.queryByText(/Stacks/)).toBeInTheDocument();
  });

  test('should pass the initial render with iClients resource type', async () => {
    await initResourceList({
      resourceType: 'iClients',
    });
    expect(screen.queryAllByText(/iClients/)[0]).toBeInTheDocument();
  });

  test('should pass the initial render with empty resource type', async () => {
    await initResourceList({
      resourceType: null,
    });
    expect(screen.queryByText(/You do not have permissions to access this page/i)).toBeInTheDocument();
  });
});
