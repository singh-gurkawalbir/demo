/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CeligoTable from '../../../../../CeligoTable';
import metadata from '../../metadata';
import { renderWithProviders, reduxStore } from '../../../../../../test/test-utils';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const initialStore = reduxStore;

initialStore.getState().data.resources.flows = [
  {
    _id: 'flow_id',
    name: 'demo flow',
    disabled: false,
    _integrationId: 'integration_id',
    pageProcessors: [{
      type: 'import',
      _importId: 'resource_id',
    }],
  },
];

function renderFunction() {
  renderWithProviders(
    <MemoryRouter>
      <CeligoTable
        {...metadata}
        data={[{_flowId: 'flow_id', _id: 'someId'}]}
      />
    </MemoryRouter>, {initialStore}
  );
  userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('Edit Flow action test cases', () => {
  test('should click on Edit Flow button', () => {
    renderFunction();
    userEvent.click(screen.getByText('Edit flow'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/integration_id/flowBuilder/flow_id');
  });
});
