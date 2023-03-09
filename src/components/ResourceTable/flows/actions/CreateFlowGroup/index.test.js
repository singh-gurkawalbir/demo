
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../../../test/test-utils';
import CeligoTable from '../../../../CeligoTable';
import { ConfirmDialogProvider } from '../../../../ConfirmDialog';
import CreateFlowGroup from '.';

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
  useRowActions: () => [CreateFlowGroup],
};

describe('create flow group UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should redirect to flow page for adding new group', async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/integrations/603ce75ac4fec33283691f43/flows']}>
        <Route path="/integrations/603ce75ac4fec33283691f43/flows">
          <ConfirmDialogProvider>
            <CeligoTable
              {...metadata}
              data={[{key: 'someKey'}]} />
          </ConfirmDialogProvider>
        </Route>
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    await userEvent.click(screen.queryByText('Create flow group'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/603ce75ac4fec33283691f43/flows/flowgroups/add');
  });
});
