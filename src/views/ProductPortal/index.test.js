
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ProductPortal from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initProductPortal() {
  const ui = (
    <MemoryRouter>
      <ProductPortal />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('test suite for product portal', () => {
  runServer();
  test('should able to test the product portal page', async () => {
    await initProductPortal();
    const iframeTitle = document.querySelector('iframe[title="Product portal"]');

    expect(iframeTitle).toBeInTheDocument();
    const srcLink = document.querySelector('iframe[src="https://portal.productboard.com/wcpkv3awtdpkze4x7wwbpog7"]');

    expect(srcLink).toBeInTheDocument();
  });
});
