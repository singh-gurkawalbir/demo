/* global test, expect, describe, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../../../../test/test-utils';
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

initialStore.getState().data.resources.integrations = [
  {
    _id: '2_integrationId',
    name: 'shopify',
    _connectorId: '5656f5e3bebf89c03f5dd77e',
  },
];

function initHomeTiles(data = {}, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={[data]} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe("HomeTile's Clone integration Action UI tests", () => {
  test('should verify theds Row actionads setup is pending no connector Id', () => {
    const data = {_id: 'someID', name: 'Salesforce - NetSuite', pinned: true, _connectorId: '5b61ae4aeb538642c26bdbe6', _integrationId: '2_integrationId', supportsMultiStore: true, mode: 'sfnsio'};

    initHomeTiles(data, initialStore);
    userEvent.click(screen.queryByRole('button', {name: /more/i}));
    userEvent.click(screen.getByText('Clone integration'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/clone/integrations/2_integrationId/preview');
  });
  test('should not show option for clone integration because of invalid id', () => {
    const data = {_id: 'someID', name: 'Salesforce - NetSuite', pinned: true, _connectorId: '5b61ae4aeb538642c26bdbe6', _integrationId: '3_integrationId', supportsMultiStore: true, mode: 'sfnsio'};

    initHomeTiles(data, initialStore);
    userEvent.click(screen.queryByRole('button', {name: /more/i}));
    expect(screen.queryByText('Clone integration')).not.toBeInTheDocument();
  });
});
