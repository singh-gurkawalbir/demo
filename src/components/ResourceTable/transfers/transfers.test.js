
import React from 'react';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import CeligoTable from '../../CeligoTable';
import { ConfirmDialogProvider } from '../../ConfirmDialog';
import actions from '../../../actions';
import metadata from './metadata';

jest.mock('../../DateTimeDisplay', () => ({
  __esModule: true,
  ...jest.requireActual('../../DateTimeDisplay'),
  default: ({dateTime}) => (<span>{dateTime}</span>),
}));

function initTransfers(data = {}) {
  const ui = (
    <ConfirmDialogProvider>
      <CeligoTable {...metadata} data={data} />
    </ConfirmDialogProvider>
  );

  renderWithProviders(ui);
}

describe('test suite for transfers', () => {
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

  test('should render the table accordingly', () => {
    const transferredAt = new Date().toDateString();
    const data = [{
      ownerUser: {
        name: 'User1',
        email: 'email@user1.com',
      },
      transferToUser: {
        name: 'User2',
        email: 'email@user2.com',
      },
      integrations: ['Integration 1', 'Integration 2'],
      dismissed: true,
      status: 'unapproved',
      transferredAt,
    }];

    initTransfers(data);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'From user',
      'To user',
      'Integrations',
      'Status',
      'Transfer date',
      'Actions',
    ]);

    expect(screen.getByRole('rowheader', { name: 'User1 email@user1.com'})).toBeInTheDocument();
    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      'User2email@user2.com',
      'Integration 1Integration 2',
      'Dismissed',
      transferredAt,
      '',
    ]);
  });

  describe('owner user should be able to cancel or delete the transfer', () => {
    test('should be able to cancel a transfer if it is yet to be unapproved by receiver or queued, but not dismissed', async () => {
      const data = [{
        _id: 'transfer123',
        transferToUser: {
          name: 'user',
          email: 'email@user.com',
        },
        integrations: ['Automation Flows', 'Test Flows'],
        status: 'queued',
        transferredAt: new Date().toDateString(),
      }];

      initTransfers(data);
      await userEvent.click(screen.getByRole('button', {name: /more/i}));
      const actionItems = screen.getAllByRole('menuitem');

      expect(actionItems).toHaveLength(1);
      expect(actionItems[0].textContent).toBe('Cancel transfer');
      const cancelTransfer = actionItems[0];

      await userEvent.click(cancelTransfer);
      const confirmDialog = screen.getByRole('dialog');
      const confirmButton = screen.getByRole('button', {name: 'Yes, cancel'});
      const cancelButton = screen.getByRole('button', {name: 'No, go back'});

      expect(confirmDialog.textContent).toContain('Confirm cancel');
      expect(confirmDialog).toContainElement(confirmButton);
      expect(confirmDialog).toContainElement(cancelButton);

      await userEvent.click(confirmButton);
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.transfer.cancel('transfer123'));
    });

    test('should be able to delete a transfer if it is yet to be approved, or accepted, or failed or declined by receiver', async () => {
      const data = [{
        _id: 'transfer123',
        transferToUser: {
          name: 'user',
          email: 'email@user.com',
        },
        integrations: ['Automation Flows', 'Test Flows'],
        status: 'done',
        transferredAt: new Date().toDateString(),
      }];

      initTransfers(data);
      await userEvent.click(screen.getByRole('button', {name: /more/i}));
      const actionItems = screen.getAllByRole('menuitem');

      expect(actionItems).toHaveLength(1);
      expect(actionItems[0].textContent).toBe('Delete transfer');
      const deleteTransfer = actionItems[0];

      await userEvent.click(deleteTransfer);
      const confirmDialog = screen.getByRole('dialog');
      const confirmButton = screen.getByRole('button', {name: 'Delete'});
      const cancelButton = screen.getByRole('button', {name: 'Cancel'});

      expect(confirmDialog.textContent).toContain('Confirm delete');
      expect(confirmDialog).toContainElement(confirmButton);
      expect(confirmDialog).toContainElement(cancelButton);

      await userEvent.click(confirmButton);
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.delete('transfers', 'transfer123'));
    });
  });
});
