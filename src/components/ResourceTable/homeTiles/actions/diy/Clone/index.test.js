/* global test, expect, describe, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../../../../test/test-utils';
import metadata from '../../../metadata';
import CeligoTable from '../../../../../CeligoTable';
import * as useHandleDelete from '../../../../../../views/Integration/hooks/useHandleDelete';

const mockDispatch = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

initialStore.getState().user.preferences = {defaultAShareId: 'own'};

initialStore.getState().data.resources.connections = [{
  _id: 'ssLinkedConnectionId2',
  netsuite: {account: 'accountName'},
}];

function initHomeTiles(data = {}, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={[data]} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('HomeTile Clone(DIY) action UI tests', () => {
  test('should show the Clone option and redirect to clone preview page', () => {
    const mockDelete = jest.fn();
    const mockuseHandleDelete = jest.spyOn(useHandleDelete, 'default');

    mockuseHandleDelete.mockReturnValue(mockDelete);
    initHomeTiles({key: 'somekey', name: 'tileName', _integrationId: '2_integrationId', supportsMultiStore: true, mode: 'modeText'}, initialStore);
    userEvent.click(screen.queryByRole('button', {name: /more/i}));
    userEvent.click(screen.getByText('Clone integration'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/clone/integrations/2_integrationId/preview');
  });
  test('should not show clone option beacuse of permission', () => {
    const mockDelete = jest.fn();
    const mockuseHandleDelete = jest.spyOn(useHandleDelete, 'default');

    mockuseHandleDelete.mockReturnValue(mockDelete);
    initHomeTiles({key: 'somekey', name: 'tileName', _integrationId: '2_integrationId', supportsMultiStore: true, mode: 'modeText'});

    userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Clone integration')).not.toBeInTheDocument();
  });
});
