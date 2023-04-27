
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../../../../test/test-utils';
import actions from '../../../../../../actions';
import metadata from '../../../metadata';
import CeligoTable from '../../../../../CeligoTable';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

function initHomeTiles(data = {}) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={[data]} />
    </MemoryRouter>
  );

  renderWithProviders(ui);
}

describe('tiles Upin action UI tests', () => {
  test('should make dispatch for unpin integration when clicked on unpin action', async () => {
    initHomeTiles({key: 'somekey', name: 'tileName', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, mode: 'modeText'});
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    await userEvent.click(screen.getByText('Unpin integration'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.user.preferences.unpinIntegration('somekey'));
  });
});
