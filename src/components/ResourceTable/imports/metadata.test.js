
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';

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
    resourceType: 'imports',
  }),
}));

function initImports(data = {}) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={data} />
    </MemoryRouter>
  );

  renderWithProviders(ui);
}

describe('test suite for Imports', () => {
  test('should render the table accordingly', async () => {
    const data = [{
      _id: 'imp123',
      name: 'The Import',
      connectorName: 'Netsuite',
      lastModified: '1 week ago',
    }];

    initImports(data);
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
    expect(screen.getByRole('link', {name: 'The Import'})).toBeInTheDocument();

    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Edit import',
      'View audit log',
      'Used by',
      'Clone import',
      'Delete import',
    ]);
  });
});
