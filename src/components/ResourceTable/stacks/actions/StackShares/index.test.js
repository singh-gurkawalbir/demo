/* global describe, test, expect,  beforeEach, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import CeligoTable from '../../../../CeligoTable';
import metadata from '../../metadata';
import { renderWithProviders } from '../../../../../test/test-utils';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function renderFunction() {
  renderWithProviders(
    <MemoryRouter initialEntries={['/parent']}>
      <Route path="/parent">
        <CeligoTable
          actionProps={{resourceType: 'stacks'}}
          {...metadata}
          data={[{_id: 'someId'}]}
    />
      </Route>
    </MemoryRouter>
  );

  userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('Share stack metadata UI Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should click on share stack link', () => {
    renderFunction();
    userEvent.click(screen.getByText('Share stack'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/parent/share/stacks/someId');
  });
});
