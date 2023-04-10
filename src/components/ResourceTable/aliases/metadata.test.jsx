
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.resources.imports = [{
    _id: '5ffad3d1f08d35214ed200g7',
    lastModified: '2021-01-22T08:40:45.731Z',
    name: 'concur expense',
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '5cd51efd3607fe7d8eda9c88',
      '5feafe6bf415e15f455dbc89',
    ],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2021-01-10T10:15:45.184Z',
  }];
});

function initImports(actionProps, data = []) {
  const ui = (
    <MemoryRouter>
      <CeligoTable actionProps={actionProps} {...metadata} data={data} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}
describe('uI test cases for metadata', () => {
  test('should render the table accordingly', async () => {
    const data = [{
      _id: '5ffad3d156784935214ed200g7',
      alias: 'aliastest',
      description: 'test',
      _importId: '5ffad3d1f08d35214ed200g7',
    }];

    initImports({hasManageAccess: 'true'}, data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Alias ID',
      'Resource name',
      'Resource type',
      'Actions',
    ]);

    //  first for table headings and the second as data row
    expect(screen.getAllByRole('row')).toHaveLength(2);

    expect(screen.getByRole('rowheader', { name: 'aliastest'})).toBeInTheDocument();

    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'concur expense',
      'Import',
      '',
    ]);

    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Edit alias',
      'Copy alias',
      'View details',
      'Delete alias',
    ]);
  });
});
