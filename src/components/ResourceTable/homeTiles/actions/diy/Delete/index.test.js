
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../../test/test-utils';
import metadata from '../../../metadata';
import CeligoTable from '../../../../../CeligoTable';
import * as useHandleDelete from '../../../../../../views/Integration/hooks/useHandleDelete';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.user.preferences = {defaultAShareId: 'own'};
});

function initHomeTiles(data = {}, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={[data]} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('homeTile delete action UI tests', () => {
  const mockDelete = jest.fn();
  let mockuseHandleDelete;

  beforeEach(() => {
    mockuseHandleDelete = jest.spyOn(useHandleDelete, 'default');
    mockuseHandleDelete.mockReturnValue(mockDelete);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should call mock handdelete function', async () => {
    const data = {key: 'keyText', name: 'tileName', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, mode: 'modeText'};

    initHomeTiles(data, initialStore);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    await userEvent.click(screen.getByText('Delete integration'));
    expect(mockuseHandleDelete).toHaveBeenCalledWith('2_integrationId', {_connectorId: undefined, mode: 'modeText', name: 'tileName', supportsMultiStore: true});
    expect(mockDelete).toHaveBeenCalledWith();
  });
  test('should not show delete integration option because of permissions', async () => {
    const mockDelete = jest.fn();
    const mockuseHandleDelete = jest.spyOn(useHandleDelete, 'default');

    mockuseHandleDelete.mockReturnValue(mockDelete);

    const data = {key: 'keyText', name: 'tileName', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, mode: 'modeText'};

    initHomeTiles(data);
    await userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Delete integration')).not.toBeInTheDocument();
  });
});
