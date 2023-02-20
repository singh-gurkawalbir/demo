
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  screen,
} from '@testing-library/react';
import AuditPanel from './Audit';
import { runServer } from '../../../../../test/api/server';
import { renderWithProviders } from '../../../../../test/test-utils';

async function initMarketplace({
  props = {
    flowId: 'flow_id_1',
    integrationId: 'integration_id_1',
  },
} = {}) {
  const ui = (
    <MemoryRouter>
      <AuditPanel {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('AuditPanel test cases', () => {
  runServer();

  test('should pass the initial render with default value', async () => {
    await initMarketplace();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
