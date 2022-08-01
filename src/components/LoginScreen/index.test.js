/* global describe, test, expect */
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginScreen from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initLoginScreen({props = {}} = {}) {
  const ui = (
    <MemoryRouter>
      <LoginScreen {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('LoginScreen component', () => {
  runServer();

  test('should pass the initial render', async () => {
    const { utils } = await initLoginScreen();

    expect(screen.getByRole('button', {name: 'Sign in'})).toBeInTheDocument();
    expect(utils.container.lastChild.lastChild.firstChild).toBeNull();
    expect(utils.container.lastChild.lastChild.className).toEqual(expect.stringContaining('makeStyles-fallBackWrapper-'));
  });

  test('should pass the initial render', async () => {
    await initLoginScreen({
      props: {
        contentUrl: 'content_url',
      },
    });
    expect(screen.getByRole('button', {name: 'Sign in'})).toBeInTheDocument();
    const iframeRef = screen.getByTitle('Announcement');

    expect(iframeRef).toBeInTheDocument();
  });

  test('should pass the initial render', async () => {
    await initLoginScreen({
      props: {
        backgroundImageUrl: 'background_image_url',
        foregroundImageUrl: 'foreground_image_url',
      },
    });
    expect(screen.getByRole('img', {name: 'Information'})).toBeInTheDocument();
  });

  test('should pass the initial render', async () => {
    await initLoginScreen({
      props: {
        backgroundImageUrl: 'background_image_url',
        foregroundImageUrl: 'foreground_image_url',
        targetUrl: 'target_url',
      },
    });
    expect(screen.getByRole('img', {name: 'Information'})).toBeInTheDocument();
    expect(screen.getByTitle('target_url')).toBeInTheDocument();
  });
});
