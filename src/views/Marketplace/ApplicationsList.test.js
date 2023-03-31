
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ApplicationsList from './ApplicationsList';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';

async function initApplicationsList({
  props = {},
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.user.preferences = {
      environment: 'production',
      defaultAShareId: 'own',
    };
    draft.user.org = {
      accounts: [
        {
          accessLevel: 'owner',
          _id: 'own',
          ownerUser: {
            licenses: [{
              type: 'endpoint',
            }],
          },
        },
      ],
    };
    draft.data.resources = {
      integrations: [
        {
          _id: 'id_1',
          name: 'name 1',
        },
      ],
    };
    draft.data.marketplace = {
      templates: [
        {
          _id: 'id_1',
          name: 'name 1',
          applications: ['salesforce'],
        },
      ],
      connectors: [
        {
          _id: 'id_3',
          name: 'oame 3',
          applications: ['salesforce'],
          framework: 'twoDotZero',
        },
        {
          _id: 'id_1',
          name: 'name 1',
          applications: ['netsuite'],
          framework: 'twoDotZero',
        },
        {
          _id: 'id_2',
          name: 'mame 2',
          applications: ['netsuite'],
          framework: 'twoDotZero',
        },
        {
          _id: 'id_2',
          name: 'mame 2',
          applications: ['dummyname'],
          framework: 'twoDotZero',
        },
      ],
    };
  });

  const ui = (
    <MemoryRouter>
      <ApplicationsList {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('ApplicationsList test cases', () => {
  runServer();

  test('should pass the initial render with default value', async () => {
    await initApplicationsList();
    expect(screen.queryByText('NetSuite')).toBeInTheDocument();
    expect(screen.queryByText(/Salesforce/i)).toBeInTheDocument();
    screen.debug(null, Infinity);
  });

  test('should pass the initial render with search key as netsuite', async () => {
    await initApplicationsList({
      props: {
        filter: {
          keyword: 'netsuite',
        },
      },
    });
    expect(screen.queryByText('NetSuite')).toBeInTheDocument();
    expect(screen.queryByText(/Salesforce/i)).not.toBeInTheDocument();
  });

  test('should pass the initial render with search key as novalue', async () => {
    await initApplicationsList({
      props: {
        filter: {
          keyword: 'novalue',
        },
      },
    });
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria./i)).toBeInTheDocument();
  });
});
