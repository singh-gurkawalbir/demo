/* global test, expect, describe, beforeEach, jest */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders } from '../../../../../test/test-utils';
import metadata from '../../metadata';
import CeligoTable from '../../../../CeligoTable';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function renderFuntion(actionProps, data) {
  renderWithProviders(
    <MemoryRouter initialEntries={['/parent']}>
      <Route path="/parent">
        <CeligoTable
          actionProps={actionProps}
          {...metadata}
          data={[data]}
        />
      </Route>
    </MemoryRouter>
  );
  userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('UI test cases for edit alias', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should call onclick', () => {
    renderFuntion({hasManageAccess: true}, {_id: 'someid', alias: 'somereqAndResKey'});
    const editAliasButton = screen.getByText('Edit alias');

    userEvent.click(editAliasButton);
    expect(mockHistoryPush).toHaveBeenCalledWith('/parent/edit/somereqAndResKey');
  });
});
