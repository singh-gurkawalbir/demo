
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuditPanel from '.';
import { runServer } from '../../../../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore} from '../../../../../../test/test-utils';

async function initMarketplace({
  props = {
    flowId: 'flow_id_1',
  },
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      flows: [
        {
          _id: 'flow_id_1',
          _integrationId: 'integration_id_1',
        },
      ],
      scripts: [],
    };
  });

  const ui = (
    <MemoryRouter>
      <AuditPanel {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

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
