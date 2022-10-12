/* global describe, test, expect */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import Subscription from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';

async function initSubscription() {
  const initialStore = reduxStore;

  initialStore.getState().user.preferences = {
    defaultAShareId: 'own',
    environment: 'production',
  };
  initialStore.getState().user.org = {
    accounts: [{
      _id: 'own',
      accessLevel: 'owner',
      ownerUser: {
        licenses: [{
          type: 'diy',
          usageTierName: 'free',
        }],
      },
    }],
  };
  const ui = (
    <MemoryRouter>
      <Subscription />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('Subscription test cases', () => {
  runServer();

  test('should pass the initial render with default value', async () => {
    await initSubscription();

    expect(screen.queryByText(/Details:/i)).toBeInTheDocument();
    expect(screen.queryByText(/Edition:/i)).toBeInTheDocument();
    expect(screen.queryByText(/Expiration date:/i)).toBeInTheDocument();
    expect(screen.queryByText(/Current usage:/i)).toBeInTheDocument();
    expect(screen.queryByText(/0 Hours/i)).toBeInTheDocument();
  });
});
