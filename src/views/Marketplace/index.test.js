
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import Marketplace from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initMarketplace() {
  const ui = (
    <MemoryRouter>
      <Marketplace />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('Marketplace test cases', () => {
  runServer();

  test('should pass the initial render with default value', async () => {
    await initMarketplace();

    expect(screen.queryByText(/Marketplace/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search template & integration apps')).toBeInTheDocument();
  });
});
