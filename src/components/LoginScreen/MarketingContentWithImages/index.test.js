
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MarketingContentWithImages from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';

async function initMarketingContentWithImages({props = {}} = {}) {
  const ui = (
    <MemoryRouter>
      <MarketingContentWithImages
        {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('marketingContentWithImages component', () => {
  runServer();

  test('should pass the initial render', async () => {
    await initMarketingContentWithImages();
    const imgTag = screen.getByRole('img', {name: 'Information'});

    expect(imgTag).toBeInTheDocument();
  });

  test('should pass the initial render with props', async () => {
    await initMarketingContentWithImages({
      props: {
        backgroundImageUrl: 'background_image_url',
        foregroundImageUrl: 'foreground_image_url',
        targetUrl: 'target_url',
        direction: 'right',
        size: 'medium',
      },
    });
    const imgTag = screen.getByRole('img', {name: 'Information'});
    const anchorTag = screen.getByTitle('target_url');

    expect(imgTag).toBeInTheDocument();
    expect(anchorTag).toBeInTheDocument();
    expect(anchorTag).toHaveAttribute('href', 'target_url');

    const imgUrlRef = new URL(imgTag.src);

    expect(imgUrlRef.pathname).toBe('/foreground_image_url');
  });

  test('should pass the initial render with props1', async () => {
    await initMarketingContentWithImages({
      props: {
        backgroundImageUrl: 'background_image_url',
        foregroundImageUrl: 'foreground_image_url',
        targetUrl: 'target_url',
        direction: 'right',
        size: 'medium',
      },
    });
    const imgTag = screen.getByRole('img', {name: 'Information'});

    expect(imgTag).toBeInTheDocument();
    expect(imgTag).toHaveAttribute('src', 'foreground_image_url');

    const imgUrlRef = new URL(imgTag.src);

    expect(imgUrlRef.pathname).toBe('/foreground_image_url');

    const anchorTag = screen.getByTitle('target_url');

    expect(anchorTag).toBeInTheDocument();
    expect(anchorTag).toHaveAttribute('href', 'target_url');
  });
});
