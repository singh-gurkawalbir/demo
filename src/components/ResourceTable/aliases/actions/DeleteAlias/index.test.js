/* global test, expect, describe, jest */
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

function initHomeTiles(data = {alias: 'aliasId'}, actionProps) {
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
}

const props = [
  {alias: 'aliasId', _id: 'someID'},
  {
    resourceId: 'someResourceId',
    resourceType: 'integrations',
  },

];

describe('DeleteAlias test cases', () => {
  test('should click on the delete button', () => {
    initHomeTiles(...props);
    userEvent.click(screen.queryByRole('button', {name: /more/i}));
    userEvent.click(screen.getByText('Delete alias'));
    expect(screen.getByText('Delete alias?')).toBeInTheDocument();
    const deleteButton = screen.getByText('Delete alias');

    userEvent.click(deleteButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      actions.resource.aliases.delete('someResourceId', 'integrations', 'aliasId', ALIAS_FORM_KEY.integrations)
    );
  });
  test('should click on cancel button', () => {
    initHomeTiles(...props);
    userEvent.click(screen.queryByRole('button', {name: /more/i}));
    userEvent.click(screen.getByText('Delete alias'));

    const cancel = screen.getByText('Cancel');

    userEvent.click(cancel);

    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });
});
