/* global describe, test, expect */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import MarketingContentFallback from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';

async function initMarketingContentFallback() {
  const ui = (
    <MemoryRouter>
      <MarketingContentFallback />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('MarketingContentFallback component', () => {
  runServer();

  test('should pass the initial render', async () => {
    const { utils } = await initMarketingContentFallback();

    expect(utils.container.firstChild.firstChild).toBeNull();
    expect(utils.container.firstChild.className).toEqual(expect.stringContaining('makeStyles-fallBackWrapper-'));
  });
});
