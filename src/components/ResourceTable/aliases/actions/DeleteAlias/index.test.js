
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../../../test/test-utils';
import { ALIAS_FORM_KEY } from '../../../../../constants';
import actions from '../../../../../actions';
import metadata from '../../metadata';
import CeligoTable from '../../../../CeligoTable';
import { ConfirmDialogProvider } from '../../../../ConfirmDialog';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

async function initHomeTiles(data = {alias: 'aliasId'}, actionProps) {
  const ui = (
    <ConfirmDialogProvider>
      <MemoryRouter>
        <CeligoTable
          {...metadata} data={[data]} actionProps={{
            hasManageAccess: true,
            ...actionProps,
          }} />
      </MemoryRouter>
    </ConfirmDialogProvider>
  );

  renderWithProviders(ui);
  await userEvent.click(screen.queryByRole('button', {name: /more/i}));
}

const props = [
  {alias: 'aliasId', _id: 'someID'},
  {
    resourceId: 'someResourceId',
    resourceType: 'integrations',
  },

];

describe('deleteAlias test cases', () => {
  test('should show modal dialog for delete Alias on clicking Delete alias', async () => {
    await initHomeTiles(...props);
    await userEvent.click(screen.getByText('Delete alias'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete alias?')).toBeInTheDocument();
    const deleteButton = screen.getByText('Delete alias');

    await userEvent.click(deleteButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      actions.resource.aliases.delete('someResourceId', 'integrations', 'aliasId', ALIAS_FORM_KEY.integrations)
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  test('should click on cancel button of Delete Alias modal', async () => {
    await initHomeTiles(...props);
    await userEvent.click(screen.getByText('Delete alias'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const cancel = screen.getByText('Cancel');

    await userEvent.click(cancel);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
