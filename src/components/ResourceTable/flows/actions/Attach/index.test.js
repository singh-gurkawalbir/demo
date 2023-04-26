
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../../../test/test-utils';
import CeligoTable from '../../../../CeligoTable';
import Attach from '.';

const metadata = {
  useColumns: () => [],
  useRowActions: () => [Attach],
};

describe('attach flow action test case', () => {
  test('should show modal dialog for attach flow', async () => {
    renderWithProviders(
      <MemoryRouter>
        <CeligoTable
          {...metadata}
          data={[{_id: 'someId'}]} />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    await userEvent.click(screen.getByText('Attach flows'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
