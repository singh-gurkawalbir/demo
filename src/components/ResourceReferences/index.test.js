
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResourceReferences from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mockGetRequestOnce, mutateStore } from '../../test/test-utils';

const mockLoadResources = jest.fn();
const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

jest.mock('../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../LoadResources'),
  default: props => {
    mockLoadResources(props.resources);

    return <div>{props.children}</div>;
  },
}));

async function initResourceReferences({
  props = {
    resourceType: 'exports',
    resourceId: 'resource_id',
  },
  resource = {},
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.resource = resource;
  });

  const ui = (
    <MemoryRouter>
      <ResourceReferences {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('resourceReferences test cases', () => {
  runServer();

  beforeEach(() => {
    mockGetRequestOnce('/api/exports/resource_id/dependencies', {});
  });
  afterEach(() => {
    mockLoadResources.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initResourceReferences();

    expect(screen.queryByText(/Retrieving export references/i)).toBeInTheDocument();
  });

  test('should pass the initial render with no dependencies value', async () => {
    await initResourceReferences({
      resource: {
        references: {},
      },
    });

    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(screen.queryByText(/This resource is not being used anywhere/i)).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  test('should pass the initial render with with dependencies', async () => {
    mockGetRequestOnce('/api/connections', []);
    await initResourceReferences({
      resource: {
        references: {
          connections: [{
            id: 'id_1',
            name: 'Name 1',
          }],
        },
      },
    });

    expect(screen.queryByText(/Used by/i)).toBeInTheDocument();
  });

  test('should pass the initial render with with dependencies & title', async () => {
    mockGetRequestOnce('/api/connections', []);
    const onClose = jest.fn();

    await initResourceReferences({
      props: {
        resourceType: 'exports',
        resourceId: 'resource_id',
        title: 'test title',
        onClose,
      },
      resource: {
        references: {
          connections: [{
            id: 'id_1',
            name: 'Name 1',
          }],
        },
      },
    });

    expect(screen.queryByText(/Unable to delete export as/i)).toBeInTheDocument();
    expect(screen.queryByText(/This export is referenced by the resources below. Only resources that have no references can be deleted./i)).toBeInTheDocument();
    await waitFor(async () => {
      const closeButton = screen.getByRole('button');

      expect(closeButton).toBeInTheDocument();
      await userEvent.click(closeButton);
    });
    expect(onClose).toHaveBeenCalled();
  });

  test('should pass the initial render with with wrong resource type', async () => {
    mockGetRequestOnce('/api/export/resource_id/dependencies', {});
    await initResourceReferences({
      props: {
        resourceType: 'export',
        resourceId: 'resource_id',
      },
    });

    expect(screen.queryByText(/Retrieving references/i)).toBeInTheDocument();
  });

  test('loadResources should get correct resourceType', async () => {
    await initResourceReferences({
      resource: {
        references: {
          exports: [{
            id: 'id_1',
            name: 'Name 1',
          }],
          connections: [{
            id: 'id_2',
            name: 'Name conn 1',
          }],
        },
      },
    });

    expect(mockLoadResources).toHaveBeenCalledWith(
      expect.objectContaining(['exports', 'connections'])
    );
  });

  test('loadResources should get unique resourceType', async () => {
    await initResourceReferences({
      resource: {
        references: {
          exports: [
            {
              id: 'id_1',
              name: 'Name 1',
            },
            {
              id: 'id_2',
              name: 'Name 2',
            },
          ],
        },
      },
    });

    expect(mockLoadResources).toHaveBeenCalledWith(
      expect.objectContaining(['exports'])
    );
  });
});
