import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Subscription from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';

async function initSubscription({ type }) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.user.preferences = {
      defaultAShareId: 'own',
      environment: 'production',
    };
    draft.user.org = {
      accounts: [{
        _id: 'own',
        accessLevel: 'owner',
        ownerUser: {
          licenses: [{
            type,
            usageTierName: 'free',
          }],
        },
      }],
    };
  });
  const ui = (
    <MemoryRouter>
      <Subscription />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('subscription test cases', () => {
  runServer();

  test('should pass the initial render with dummy type', async () => {
    const { utils } = await initSubscription({
      type: 'dummy',
    });

    expect(utils.container).toBeEmptyDOMElement();
  });
});
