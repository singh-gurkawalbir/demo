
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ManageLookupDialog from './Dialog';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';

async function initManageLookupDialog({ props } = {}) {
  const ui = (
    <MemoryRouter>
      <ManageLookupDialog {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('manageLookupDialog component Test cases', () => {
  runServer();
  test('should pass the intial render with default values', async () => {
    await initManageLookupDialog();

    expect(screen.queryByText('Add lookup')).toBeInTheDocument();
  });
});
