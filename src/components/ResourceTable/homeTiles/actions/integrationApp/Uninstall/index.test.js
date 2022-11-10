/* global test, expect, describe, jest, beforeEach, afterEach */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../../../../test/test-utils';
import metadata from '../../../metadata';
import CeligoTable from '../../../../../CeligoTable';
import * as useHandleDelete from '../../../../../../views/Integration/hooks/useHandleDelete';

const initialStore = reduxStore;

initialStore.getState().user.preferences = {defaultAShareId: 'own', dashboard: {view: 'list'} };

function initHomeTiles(data = {}, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={[data]} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe("HomeTile's Uninstall action UI tests", () => {
  const mockDelete = jest.fn();
  let mockuseHandleDelete;

  beforeEach(() => {
    mockuseHandleDelete = jest.spyOn(useHandleDelete, 'default');
    mockuseHandleDelete.mockReturnValue(mockDelete);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should verify the uninstall button is visible and handle delete function is called in clicking it', () => {
    const data = {_id: 'someId', name: 'tileName', _connectorId: 'some_connectorId', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, mode: 'modeText'};

    initHomeTiles(data, initialStore);
    userEvent.click(screen.queryByRole('button', {name: /more/i}));
    userEvent.click(screen.getByText('Uninstall integration'));
    expect(mockuseHandleDelete).toHaveBeenCalledWith('2_integrationId', {_connectorId: 'some_connectorId', mode: 'modeText', name: 'tileName', supportsMultiStore: true});
    expect(mockDelete).toHaveBeenCalledWith();
  });
  test('should verify the uninstall button is not avaiable because of permission', () => {
    const data = {_id: 'someId', name: 'tileName', pinned: true, status: 'is_pending_setup', _integrationId: '2_integrationId', supportsMultiStore: true, mode: 'modeText'};

    initHomeTiles(data);
    userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Uninstall integration')).not.toBeInTheDocument();
  });
});
