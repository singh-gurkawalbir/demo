/* global describe, test,expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../../../test/test-utils';
import CeligoTable from '../../../../CeligoTable';
import Attach from '.';

const metadata = {
  useColumns: () => [],
  useRowActions: () => [Attach],
};

describe('Attach flow action test case', () => {
  test('should show modal dialog for attach flow', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/parentUrl']}>
        <Route path="/parentUrl">
          <CeligoTable
            {...metadata}
            data={[{_id: 'someId'}]} />
        </Route>
      </MemoryRouter>
    );
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    userEvent.click(screen.getByText('Attach flows'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
