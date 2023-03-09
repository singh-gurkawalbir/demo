
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../../../test/test-utils';
import CeligoTable from '../../../../CeligoTable';
import EditFlowGroup from '.';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    location: {pathname: '/parentUrl'},
  }),
}));

const metadata = {
  useColumns: () => [],
  useRowActions: () => [EditFlowGroup],
};

async function initceligoTable(resource = {}) {
  const ui = (
    <MemoryRouter initialEntries={['/integrations/603ce75ac4fec33283691f43/flows']}>
      <Route path="/integrations/603ce75ac4fec33283691f43/flows">
        <CeligoTable
          {...metadata}
          data={[{...resource, key: 'somekey'}]} />
      </Route>
    </MemoryRouter>
  );

  renderWithProviders(ui);
  await userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('editFlowGroup action UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should redirect on the edit page for flowgroup', async () => {
    await initceligoTable({});
    await userEvent.click(screen.getByText('Edit flow group'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/603ce75ac4fec33283691f43/flows/flowgroups/edit');
  });
  test('should show Edit flow group button as disabled', async () => {
    await initceligoTable({sectionId: 'unassigned'});

    const menuitem = screen.getAllByRole('menuitem');
    const editFlowGroupBtn = menuitem.find(item => item.getAttribute('data-test') === 'editFlowGroup');

    expect(editFlowGroupBtn).toHaveAttribute('aria-disabled', 'true');
  });
});
