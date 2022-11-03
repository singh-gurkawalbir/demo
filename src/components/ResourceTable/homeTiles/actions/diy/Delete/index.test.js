/* global test, expect, describe, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../../../../test/test-utils';
import metadata from '../../../metadata';
import CeligoTable from '../../../../../CeligoTable';
import * as useHandleDelete from '../../../../../../views/Integration/hooks/useHandleDelete';

const initialStore = reduxStore;

initialStore.getState().user.preferences = {defaultAShareId: 'own'};

function initHomeTiles(data = {}, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={[data]} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('HomeTile delete action UI tests', () => {
  test('should call mock handdelete function', () => {
    const mockDelete = jest.fn();
    const mockuseHandleDelete = jest.spyOn(useHandleDelete, 'default');

    mockuseHandleDelete.mockReturnValue(mockDelete);

    const data = {key: 'keyText', name: 'tileName', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, mode: 'modeText'};

    initHomeTiles(data, initialStore);
    userEvent.click(screen.queryByRole('button', {name: /more/i}));
    userEvent.click(screen.getByText('Delete integration'));
    expect(mockuseHandleDelete).toHaveBeenCalledWith('2_integrationId', {_connectorId: undefined, mode: 'modeText', name: 'tileName', supportsMultiStore: true});
    expect(mockDelete).toHaveBeenCalledWith();
  });
  test('should not show delete integration option because of permissions', () => {
    const mockDelete = jest.fn();
    const mockuseHandleDelete = jest.spyOn(useHandleDelete, 'default');

    mockuseHandleDelete.mockReturnValue(mockDelete);

    const data = {key: 'keyText', name: 'tileName', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, mode: 'modeText'};

    initHomeTiles(data);
    userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Delete integration')).not.toBeInTheDocument();
  });
});
