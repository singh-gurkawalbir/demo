
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ResourceName from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';

async function initResourceName({
  props = {
    resourceId: 'resource_id',
  },
  resources = {
    flows: [{
      _id: 'resource_id',
      name: 'Name 1',
    }],
  },
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = resources;
  });

  const ui = (
    <MemoryRouter>
      <ResourceName {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('resourceName test cases', () => {
  runServer();

  test('should pass the initial render with default value', async () => {
    await initResourceName();

    expect(screen.queryByText('Name 1')).toBeInTheDocument();
  });

  test('should pass the initial render with export value', async () => {
    await initResourceName({
      resources: {
        exports: [{
          _id: 'resource_id',
          name: 'Export Name 1',
        }],
      },
    });

    expect(screen.queryByText('Export Name 1')).toBeInTheDocument();
  });

  test('should pass the initial render with import value', async () => {
    await initResourceName({
      resources: {
        imports: [{
          _id: 'resource_id',
          name: 'Import Name 1',
        }],
      },
    });

    expect(screen.queryByText('Import Name 1')).toBeInTheDocument();
  });

  test('should pass the initial render with no resource found', async () => {
    const { utils } = await initResourceName({
      resources: {
        imports: [{
          _id: 'resource_id_1',
          name: 'Import Name 1',
        }],
      },
    });

    expect(utils.container.firstChild).toBeEmptyDOMElement();
  });
});

