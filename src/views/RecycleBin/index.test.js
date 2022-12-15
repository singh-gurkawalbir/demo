/* global describe, test, expect, jest */
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecycleBin from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mockGetRequestOnce } from '../../test/test-utils';

async function initRecycleBin(
  {
    defaultAShareId = 'own',
    redirectTo = null,
    status = 'received',
    resources = {},
    filters = {},
  } = {}) {
  const initialStore = cloneDeep(reduxStore);

  initialStore.getState().user.preferences = {
    defaultAShareId,
    environment: 'production',
  };
  initialStore.getState().user.org = {
    accounts: [{
      _id: defaultAShareId,
      accessLevel: defaultAShareId === 'own' ? 'owner' : null,
    }],
  };
  initialStore.getState().session.recycleBin = {
    status,
    redirectTo,
  };
  initialStore.getState().data.resources = resources;
  initialStore.getState().auth = {
    authenticated: true,
    defaultAccountSet: true,
  };
  initialStore.getState().session.filters = filters;
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/recycleBin'}]}
    >
      <Route
        path="/recycleBin"
      >
        <RecycleBin />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('RecycleBin test cases', () => {
  runServer();

  test('should pass the initial render with redirectTo', async () => {
    await initRecycleBin({
      redirectTo: '/home',
    });
    expect(mockHistoryPush).toBeCalledWith('/home');
  });

  test('should pass the initial render with requested status', async () => {
    await initRecycleBin({
      status: 'requested',
    });

    expect(screen.queryByText(/Recycle bin/i)).toBeInTheDocument();
    expect(screen.queryByText(/Restoring.../i)).toBeInTheDocument();
  });

  test('should pass the initial render with search keyword', async () => {
    const data = [
      {
        model: 'Integration',
        doc: {
          _id: 'id_1',
          name: 'name 1',
          _parentId: 'parent_id_1',
        },
        key: 'id_1',
      },
      {
        model: 'Integration',
        doc: {
          _id: 'id_2',
          name: 'what 2',
          _parentId: 'parent_id_2',
        },
        key: 'id_2',
      },
    ];

    mockGetRequestOnce('/api/recycleBinTTL', data);
    await initRecycleBin({
      resources: {
        recycleBinTTL: data,
      },
    });

    expect(await screen.queryByText(/Recycle bin/i)).toBeInTheDocument();
    const inputRef = screen.getByRole('textbox');

    expect(inputRef).toBeInTheDocument();
    userEvent.type(inputRef, 'xyz');
    await waitFor(() => expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria./i)).toBeInTheDocument());
  });

  test('should pass the initial render with empty bin', async () => {
    await initRecycleBin();
    expect(screen.queryByText(/Recycle bin/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/Your recycle bin is empty/i)).toBeInTheDocument());
  });

  test('should pass the initial render with sandbox data', async () => {
    const data = [
      {
        model: 'Integration',
        doc: {
          _id: 'id_1',
          sandbox: true,
          name: 'name 1',
          _parentId: 'parent_id_1',
        },
        key: 'id_1',
      },
    ];

    mockGetRequestOnce('/api/recycleBinTTL', data);
    await initRecycleBin({
      resources: {
        recycleBinTTL: data,
      },
    });

    expect(await screen.queryByText(/Recycle bin/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria./i)).toBeInTheDocument());
  });

  test('should pass the initial render with user login', async () => {
    await initRecycleBin({
      defaultAShareId: 'id_1',
    });

    expect(screen.queryByText(/You do not have permissions to access this page/i)).toBeInTheDocument();
  });
});
