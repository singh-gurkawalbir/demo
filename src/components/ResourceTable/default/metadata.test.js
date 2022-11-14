/* global describe, expect, jest, test */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../test/test-utils';
import CeligoTable from '../../CeligoTable';
import metadata from './metadata';

jest.mock('../../CeligoTimeAgo', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTimeAgo'),
  default: ({date}) => (<span>{date}</span>),
}));

jest.mock('../../CeligoTable/TableContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTable/TableContext'),
  useGetTableContext: () => ({
    resourceType: 'exports',
  }),
}));

function initDefault(data = {}) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata('exports')} data={data} />
    </MemoryRouter>
  );

  renderWithProviders(ui);
}

describe('Test suite for default', () => {
  test('should render the table accordingly', () => {
    const data = [{
      _id: 'exp123',
      name: 'The Export',
      lastModified: '1 week ago',
    }];

    initDefault(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Name',
      'Last updated',
      'Actions',
    ]);

    //  first for table headings and the second as data row
    expect(screen.getAllByRole('row')).toHaveLength(2);

    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'The Export',
      '1 week ago',
      '',
    ]);
    expect(screen.getByRole('link', {name: 'The Export'})).toBeInTheDocument();

    const actionButton = screen.getByRole('button', {name: /more/i});

    userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Delete export',
      'Used by',
    ]);
  });
});
