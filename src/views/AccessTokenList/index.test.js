
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccessTokenList from '.';
import { runServer } from '../../test/api/server';
import { NO_RESULT_SEARCH_MESSAGE } from '../../constants';
import { renderWithProviders, reduxStore, mockGetRequestOnce, mutateStore } from '../../test/test-utils';

async function initAccessTokenList({
  props = {
    location: {
      pathname: '/accesstokens',
    },
  },
  defaultAShareId = 'own',
  resources = {},
  filters = {},
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.user.preferences = {
      defaultAShareId,
    };
    draft.user.org = {
      accounts: [{
        _id: defaultAShareId,
        accessLevel: defaultAShareId === 'own' ? 'owner' : null,
      }],
    };
    draft.data.resources = resources;
    draft.session.filters = filters;
    draft.auth = {
      defaultAccountSet: true,
      authenticated: true,
    };
    draft.session.loadResources = {};
  });

  const ui = (
    <MemoryRouter>
      <AccessTokenList {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('AccessTokenList test cases', () => {
  runServer();
  afterEach(cleanup);

  test('should pass the initial render', async () => {
    mockGetRequestOnce('/api/accesstokens', []);
    await initAccessTokenList();
    const createToken = await screen.getByRole('link', {name: /Create API token/i});

    expect(screen.queryByText(/API tokens/i)).toBeInTheDocument();
    expect(createToken).toBeInTheDocument();
    expect(createToken).toHaveAttribute('href');

    await waitFor(() => expect(screen.queryByText(/You don’t have any API tokens/i)).toBeInTheDocument());
  });

  test('should pass the initial render with acesstoken data', async () => {
    await initAccessTokenList({
      resources: {
        accesstokens: [{
          _id: 'id_1',
          token: '******',
          name: 'CURD full access token',
          revoked: false,
          fullAccess: true,
          createdAt: '2019-10-31T05:46:23.256Z',
          lastModified: '2020-01-23T09:53:07.884Z',
        }],
      },
    });

    expect(screen.queryByText(/API tokens/i)).toBeInTheDocument();

    const searchInput = screen.getByRole('textbox', {name: /Search/i});

    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, 'typ');
    await waitFor(() => expect(screen.queryByText(NO_RESULT_SEARCH_MESSAGE)).toBeInTheDocument());
  });

  test('should pass the initial render with different user', async () => {
    await initAccessTokenList({
      defaultAShareId: 'id_1',
    });

    await waitFor(() => expect(screen.queryByText(/You do not have permissions to access this page./i)).toBeInTheDocument());
  });
});

