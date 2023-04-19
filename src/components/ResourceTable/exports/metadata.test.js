
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../test/test-utils';
import CeligoTable from '../../CeligoTable';
import metadata from './metadata';

jest.mock('../commonCells/ConnectorName', () => ({
  __esModule: true,
  ...jest.requireActual('../commonCells/ConnectorName'),
  default: ({resource}) => (<span>{resource.connectorName}</span>),
}));

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

function initExports(data = {}) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={data} />
    </MemoryRouter>
  );

  renderWithProviders(ui);
}

describe('test suite for Exports', () => {
  test('should render the table accordingly', async () => {
    const data = [{
      _id: 'exp123',
      name: 'The Export',
      connectorName: 'Netsuite',
      lastModified: '1 week ago',
    }];

    initExports(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Name',
      'Application',
      'Last updated',
      'Actions',
    ]);

    //  first for table headings and the second as data row
    expect(screen.getAllByRole('row')).toHaveLength(2);

    expect(screen.getByRole('rowheader', { name: data[0].name})).toBeInTheDocument();
    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'Netsuite',
      '1 week ago',
      '',
    ]);
    expect(screen.getByRole('link', {name: 'The Export'})).toBeInTheDocument();

    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Edit export',
      'View audit log',
      'Used by',
      'Clone export',
      'Delete export',
    ]);
  });
});
