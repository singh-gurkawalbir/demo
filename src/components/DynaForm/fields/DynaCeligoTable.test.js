
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaCeligoTable from './DynaCeligoTable';

describe('dynaCeligoTable tests', () => {
  test('should able to test DynaCeligoTable with no data and non collapsable table', async () => {
    const props = {
      useColumns: jest.fn().mockReturnValue([]),
    };

    await renderWithProviders(<DynaCeligoTable {...props} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
  test('should able to test DynaCeligoTable without data and collapsable table', async () => {
    const props = {
      useColumns: jest.fn().mockReturnValue([]),
      title: 'Table title',
      collapsable: true,
      isTitleBold: true,
      noDataMessage: 'No data in the table',
    };

    await renderWithProviders(<DynaCeligoTable {...props} />);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Table title'})).toBeInTheDocument();
    expect(screen.getByText('No data in the table')).toBeInTheDocument();
  });
  test('should able to test DynaCeligoTable with table data', async () => {
    const props = {
      useColumns: jest.fn().mockReturnValue([]),
      title: 'Table title',
      collapsable: true,
    };

    await renderWithProviders(<DynaCeligoTable {...props} />);
    expect(screen.getByRole('button', {name: 'Table title'})).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
