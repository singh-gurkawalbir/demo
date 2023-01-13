
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ResourceList from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore, mockGetRequestOnce } from '../../../test/test-utils';

async function initResourceList({
  props = {
    resourceType: 'exports',
  },
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().session.loadResources = {
    none: {
      exports: 'received',
      connections: 'received',
    },
    exports: 'received',
    dummy: 'received',
    tiles: 'received',
  };

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/${props.resourceType}`}]}
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

describe('resourceList test cases', () => {
  runServer();

  test('should pass the initial render with default value', async () => {
    mockGetRequestOnce('api/exports', []);
    await initResourceList();

    expect(screen.queryByText(/Create export/i)).toBeInTheDocument();
  });

  test('should pass the initial render with dummy resource type', async () => {
    await initResourceList({
      props: {
        resourceType: 'dummy',
      },
    });
    expect(screen.queryByText(/You don't have any dummy./i)).toBeInTheDocument();
  });

  test('should pass the initial render with tiles resource type', async () => {
    await initResourceList({
      props: {
        resourceType: 'tiles',
      },
    });
    expect(screen.queryByText(/Create flow/i)).toBeInTheDocument();
  });
});
