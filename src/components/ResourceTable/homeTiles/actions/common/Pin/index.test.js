
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

function initHomeTiles(data = {}, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={[data]} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('pin actions of homeTile UI tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should make dispatch call when when clicked on Pin Integration', async () => {
    initHomeTiles({key: 'somekey', name: 'tileName', pinned: false, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true});
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));

    await userEvent.click(screen.getByText('Pin integration'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.user.preferences.pinIntegration('somekey'));
  });
});
