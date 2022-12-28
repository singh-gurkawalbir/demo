
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import HooksDrawer from '.';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders } from '../../../../test/test-utils';

async function initHooksDrawer({
  props = {
    flowId: 'flow_id',
    integrationId: 'integration_id',
  },
  pathname = '/flowBuilder/flow_id/hooks/connections/resource_id',
} = {}) {
  const { store, utils } = await renderWithProviders((
    <MemoryRouter
      initialEntries={[{pathname}]}
    >
      <Route
        path="/flowBuilder/flow_id"
      >
        <HooksDrawer {...props} />
      </Route>
    </MemoryRouter>
  ));

  return {
    store,
    utils,
  };
}

describe('HooksDrawer test cases', () => {
  runServer();

  test('should pass the initial render with default value', async () => {
    await initHooksDrawer();

    expect(screen.queryByText('Hooks')).toBeInTheDocument();
  });

  test('should pass the initial render with different pathname value', async () => {
    await initHooksDrawer({
      pathname: '/flowBuilder/flow_id',
    });

    expect(screen.queryByText('Hooks')).not.toBeInTheDocument();
  });
});
