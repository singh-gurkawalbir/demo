
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ErrorActionStatus from './ErrorActionStatus';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

async function initErrorActionStatus({
  props = {
    flowId: 'flow_id',
    resourceId: 'export_id',
  },
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().session.errorManagement.errorDetails = {
    flow_id: {
      export_id: {
        actions: {
          retry: {
            status: 'received',
            count: 1,
          },
          resolve: {
            status: 'received',
            count: 1,
          },
        },
      },
    },
  };
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/errors/export_id/open'}]}
    >
      <Route path="/errors/:resourceId/:errorType">
        <ErrorActionStatus {...props} />
      </Route>
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('ErrorActionStatus test cases', () => {
  runServer();

  test('should pass the initial render with default value', async () => {
    await initErrorActionStatus();
    expect(screen.queryByText('Retries: 1 | Resolves: 1')).toBeInTheDocument();
  });

  test('should pass the initial render without wrong export id', async () => {
    await initErrorActionStatus({
      props: {
        flowId: 'flow_id',
        resourceId: 'export_id_1',
      },
    });
    expect(screen.queryByText('Retries: 0 | Resolves: 0')).toBeInTheDocument();
  });
});
