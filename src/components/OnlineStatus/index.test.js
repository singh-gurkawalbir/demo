/* global describe, test, expect */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import OnlineStatus from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initOnlineStatus({
  props = {
    offline: true,
  },
} = {}) {
  const ui = (
    <MemoryRouter>
      <OnlineStatus {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('OnlineStatus test cases', () => {
  runServer();

  test('should pass the initial render with default value/ offline true', async () => {
    await initOnlineStatus();
    expect(screen.queryByText(/Offline/i)).toBeInTheDocument();
  });

  test('should pass the initial render with offline false', async () => {
    await initOnlineStatus({
      props: {
        offline: false,
      },
    });
    expect(screen.queryByText(/Online/i)).toBeInTheDocument();
  });
});
