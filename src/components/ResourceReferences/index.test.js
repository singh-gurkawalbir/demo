/* global describe, test, expect, beforeEach, jest */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResourceReferences from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mockGetRequestOnce } from '../../test/test-utils';

async function initResourceReferences({
  props = {
    resourceType: 'exports',
    resourceId: 'resource_id',
  },
  resource = {},
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().session.resource = resource;

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

describe('ResourceReferences test cases', () => {
  runServer();

  beforeEach(() => {
    mockGetRequestOnce('/api/exports/resource_id/dependencies', {});
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
    const closeButton = screen.getByRole('button');

    expect(closeButton).toBeInTheDocument();
    userEvent.click(closeButton);
    expect(onClose).toBeCalled();
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
});

