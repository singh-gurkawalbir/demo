
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MarketingContentWithIframe from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';

async function initMarketingContentWithIframe({contentUrl = ''} = {}) {
  const ui = (
    <MemoryRouter>
      <MarketingContentWithIframe contentUrl={contentUrl} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('marketingContentWithIframe component', () => {
  runServer();

  test('should pass the initial render', async () => {
    await initMarketingContentWithIframe();

    const iframeRef = screen.getByTitle('Announcement');

    expect(iframeRef).toBeInTheDocument();

    const urlRef = new URL(iframeRef.src);

    expect(urlRef.pathname).toBe('/');
  });

  test('should pass the initial render duplicate', async () => {
    await initMarketingContentWithIframe({contentUrl: 'test_url'});

    const iframeRef = screen.getByTitle('Announcement');

    expect(iframeRef).toBeInTheDocument();

    const urlRef = new URL(iframeRef.src);

    expect(urlRef.pathname).toBe('/test_url');
  });
});
