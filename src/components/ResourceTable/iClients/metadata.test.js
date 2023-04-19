
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
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
    resourceType: 'iClients',
  }),
}));

function initDefault(data = {}) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={data} />
    </MemoryRouter>
  );

  renderWithProviders(ui);
}

describe('test suite for default', () => {
  test('should render the table accordingly', () => {
    const data = [{
      _id: '123',
      name: 'iClient test',
      lastModified: '2020-08-24T13:18:06.179Z',
      provider: 'Custom OAuth2.0',
      oauth2: {
        clientId: 'nhhhh',
        clientSecret: '******',
        scope: [],
      },
    }];

    initDefault(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Name',
      'Application',
      'Last updated',
      'Actions',
    ]);

    //  first for table headings and the second as data row
    expect(screen.getAllByRole('row')).toHaveLength(2);

    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'iClient test',
      'Custom OAuth2.0',
      '2020-08-24T13:18:06.179Z',
      '',
    ]);
    expect(screen.getByRole('link', {name: 'iClient test'})).toBeInTheDocument();

    const actionButton = screen.getByRole('button', {name: /more/i});

    userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Edit iClient',
      'View audit log',
      'Used by',
      'Delete iClient',
    ]);
  });
});
