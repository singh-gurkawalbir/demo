
import React from 'react';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import { ConfirmDialogProvider } from '../../ConfirmDialog';
import CeligoTable from '../../CeligoTable';
import actions from '../../../actions';
import metadata from './metadata';

jest.mock('../../DateTimeDisplay', () => ({
  __esModule: true,
  ...jest.requireActual('../../DateTimeDisplay'),
  default: ({dateTime}) => (<span>{dateTime}</span>),
}));

function initRecycleBin(data = {}) {
  const ui = (
    <ConfirmDialogProvider>
      <CeligoTable {...metadata} data={data} />
    </ConfirmDialogProvider>
  );

  renderWithProviders(ui);
}

describe('recycle Bin TTL test suite', () => {
  let useDispatchSpy;
  let mockDispatchFn;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should render the table accordingly', async () => {
    const lastModified = new Date().toUTCString();
    const data = [{
      doc: {
        name: 'flowName',
        lastModified,
      },
      model: 'Flow',
    }];

    initRecycleBin(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Name',
      'Type',
      'Deleted date',
      'Auto purge',
      'Actions',
    ]);

    //  first for table headings and the second as data row
    expect(screen.getAllByRole('row')).toHaveLength(2);

    expect(screen.getByRole('rowheader', { name: data[0].doc.name})).toBeInTheDocument();

    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'Flow',
      lastModified,
      '30 days',
      '',
    ]);

    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);

    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual([
      'Restore',
      'Purge',
    ]);
  });

  test('should show the Auto purge time left with greatest possible precision', () => {
    const useColumns = metadata.useColumns();
    const autoPurge = useColumns.find(eachColumn => eachColumn.key === 'autoPurge');
    const timeLeft1 = autoPurge.Value({ rowData: {} });

    expect(timeLeft1).toBe('NaN days');

    const timeLeft2 = autoPurge.Value({
      rowData: {
        doc: {
          lastModified: new Date(),
        },
      },
    });

    expect(timeLeft2).toBe('30 days');

    const today = new Date();
    const timeLeft3 = autoPurge.Value({
      rowData: {
        doc: {
          lastModified: new Date(new Date().setDate(today.getDate() - 30) + 4 * 60 * 60 * 1000),
        },
      },
    });

    expect(timeLeft3).toBe('4 hours');

    const timeLeft4 = autoPurge.Value({
      rowData: {
        doc: {
          lastModified: new Date(new Date().setDate(today.getDate() - 30) + 35 * 60 * 1000),
        },
      },
    });

    expect(timeLeft4).toBe('35 minutes');

    const timeLeft5 = autoPurge.Value({
      rowData: {
        doc: {
          lastModified: new Date(new Date().setDate(today.getDate() - 30) + 51 * 1000),
        },
      },
    });

    expect(timeLeft5).toBe('51 seconds');

    const timeLeft6 = autoPurge.Value({
      rowData: {
        doc: {
          lastModified: new Date(new Date().setDate(today.getDate() - 30)),
        },
      },
    });

    expect(timeLeft6).toBe('0 seconds');
  });

  test('should be able to restore the deleted item', async () => {
    const data = [{
      doc: {
        _id: 'flow123',
        name: 'flowName',
        lastModified: new Date().toUTCString(),
      },
      model: 'Flow',
    }];

    initRecycleBin(data);
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    const restoreButton = screen.getByRole('menuitem', {name: 'Restore'});

    await userEvent.click(restoreButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.recycleBin.restore('flows', 'flow123'));
  });

  test('should be able to purge the deleted item', async () => {
    const data = [{
      doc: {
        _id: 'flow123',
        name: 'flowName',
        lastModified: new Date().toUTCString(),
      },
      model: 'Flow',
    }];

    initRecycleBin(data);
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    let purgeButton = screen.getByRole('menuitem', {name: 'Purge'});

    await userEvent.click(purgeButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog').textContent).toContain('Confirm purge');
    expect(screen.getByRole('dialog').textContent).toContain('Are you sure you want to purge this flow?');

    //  should be able to cancel a purge by clicking Cancel Button
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    await userEvent.click(cancelButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);

    //  should be able to cancel a purge by clicking close Button
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    purgeButton = screen.getByRole('menuitem', {name: 'Purge'});
    await userEvent.click(purgeButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const closeButton = screen.getByTestId('closeModalDialog');

    await userEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);

    //  should be able to confirm a purge
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    purgeButton = screen.getByRole('menuitem', {name: 'Purge'});
    await userEvent.click(purgeButton);
    const confirmButton = screen.getByRole('button', {name: 'Purge'});

    await userEvent.click(confirmButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.recycleBin.purge('flows', 'flow123'));
  });
});
