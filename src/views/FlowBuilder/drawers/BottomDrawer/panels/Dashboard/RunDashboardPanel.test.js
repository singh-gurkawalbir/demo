
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RunDashboardPanel from './RunDashboardPanel';
import { runServer } from '../../../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../../../test/test-utils';

async function initMarketplace({
  props = {
    flowId: 'flow_id_1',
  },
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources = {
    flows: [
      {
        _id: 'flow_id_1',
      },
      {
        _id: 'flow_id_2',
        _integrationId: 'integration_id_1',
      },
    ],
  };
  const ui = (
    <MemoryRouter>
      <RunDashboardPanel {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('RunDashboardPanel test cases', () => {
  runServer();

  test('should pass the initial render with default value', async () => {
    await initMarketplace();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('should pass the initial render with integration id', async () => {
    await initMarketplace();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
