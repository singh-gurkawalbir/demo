
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../../test/test-utils';
import metadata from '../../../metadata';
import CeligoTable from '../../../../../CeligoTable';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.user.preferences = {defaultAShareId: 'own'};

  draft.data.resources.connections = [{
    _id: 'ssLinkedConnectionId2',
    netsuite: {account: 'accountName'},
  }];
});

function initHomeTiles(data = {}, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={[data]} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('homeTile Clone(DIY) action UI tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show the Clone option and redirect to clone preview page', async () => {
    initHomeTiles({key: 'somekey', name: 'tileName', _integrationId: '2_integrationId', supportsMultiStore: true, mode: 'modeText'}, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    await userEvent.click(screen.getByText('Clone integration'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/clone/integrations/2_integrationId/preview');
  });
  test('should not show clone option beacuse of permission', async () => {
    initHomeTiles({key: 'somekey', name: 'tileName', _integrationId: '2_integrationId', supportsMultiStore: true, mode: 'modeText'});

    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Clone integration')).not.toBeInTheDocument();
  });
});
