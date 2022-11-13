/* global describe, test,expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../../../test/test-utils';
import CeligoTable from '../../../../CeligoTable';
import EditFlowGroup from '.';
// import metadata from '../../metadata';

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
    <MemoryRouter initialEntries={['/parentUrl']}>
      <Route path="/parentUrl">
        <CeligoTable
          {...metadata}
          data={[resource]} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('EditFlowGroup action UI test cases', () => {
  test('should redirect on the edit page for flowgroup', () => {
    initceligoTable({});
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    userEvent.click(screen.getByText('Edit flow group'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/parentUrl/flowgroups/edit');
  });
  test('should show Edit flow group button as disabled', () => {
    initceligoTable({sectionId: 'unassigned'});

    userEvent.click(screen.getByRole('button', {name: /more/i}));
    const menuitem = screen.getAllByRole('menuitem');
    const editFlowGroupBtn = menuitem.find(item => item.getAttribute('data-test') === 'editFlowGroup');

    expect(editFlowGroupBtn).toHaveAttribute('aria-disabled', 'true');
  });
});
