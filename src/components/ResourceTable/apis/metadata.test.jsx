
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';

jest.mock('../../CeligoTimeAgo', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTimeAgo'),
  default: ({date}) => (<span>{date}</span>),
}));

jest.mock('../../CeligoTable/TableContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTable/TableContext'),
  useGetTableContext: () => ({
    resourceType: 'apis',
  }),
}));

function initImports(data = []) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={data} />
    </MemoryRouter>
  );

  renderWithProviders(ui);
}
describe('test suite for apis', () => {
  test('should render the table accordingly', async () => {
    const lastModified = new Date().toUTCString();
    const data = [{
      _id: 'api123',
      name: 'The api',
      function: 'apifunction',
      _scriptId: '6287678493nff8e93873',
      lastModified,
    }];

    initImports(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Name',
      'Function',
      'Script',
      'Last updated',
      'Actions',
    ]);

    //  first for table headings and the second as data row
    expect(screen.getAllByRole('row')).toHaveLength(2);

    expect(screen.getByRole('rowheader', { name: data[0].name })).toBeInTheDocument();
    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'apifunction',
      '6287678493nff8e93873',
      lastModified,
      '',
    ]);
    expect(screen.getByRole('link', {name: 'The api'})).toBeInTheDocument();
    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Edit My API',
      'View audit log',
      'Delete My API',
    ]);
  });
});
