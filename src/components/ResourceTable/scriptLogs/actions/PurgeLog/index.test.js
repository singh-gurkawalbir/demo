/* global describe, test, expect, jest, afterEach */
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PurgeLog from '.';
import { runServer } from '../../../../../test/api/server';
import { renderWithProviders } from '../../../../../test/test-utils';
import ActionMenu from '../../../../CeligoTable/ActionMenu';
import actions from '../../../../../actions';
import { ConfirmDialogProvider } from '../../../../ConfirmDialog';

async function initPurgeMultipleErrors(rowData) {
  const useRowActions = () => [PurgeLog];
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <ActionMenu
          setSelectedComponent={() => {}}
          useRowActions={useRowActions}
          rowData={rowData}
        />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );
  const { utils, store } = await renderWithProviders(ui);

  userEvent.click(screen.getByRole('button', {name: /more/i}));

  return { utils, store };
}
const mockHistoryPush = jest.fn();

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('PurgeMultipleErrors action Test cases', () => {
  runServer();
  afterEach(() => {
    mockHistoryPush.mockClear();
  });
  test('should pass the intial render with disabled action', async () => {
    const scriptId = '6439276e7uybwe78292878';
    const flowId = '6938764rh739d3378';
    const isPurgeAvailable = false;
    const rowData = {
      flowId,
      scriptId,
      isPurgeAvailable,
    };

    await initPurgeMultipleErrors(rowData);
    const purgeLogs = screen.getByText(/Purge all logs of this script/i);

    expect(purgeLogs).toBeInTheDocument();
    expect(purgeLogs.getAttribute('aria-disabled')).toBeTruthy;
  });
  test('should pass the intial render with disabled action', async () => {
    const scriptId = '6439276e7uybwe78292878';
    const flowId = '6938764rh739d3378';
    const isPurgeAvailable = true;
    const rowData = {
      flowId,
      scriptId,
      isPurgeAvailable,
    };

    await initPurgeMultipleErrors(rowData);
    const purgeLogs = screen.getByText(/Purge all logs of this script/i);

    expect(purgeLogs).toBeInTheDocument();
    expect(purgeLogs.getAttribute('aria-disabled')).toBeFalsy;

    userEvent.click(purgeLogs);
    expect(screen.getByText('Are you sure you want to purge all logs of this script? This cannot be undone.')).toBeInTheDocument();
    const confirmPurgeButton = screen.getByRole('button', {name: 'Purge all logs of this script'});
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    expect(confirmPurgeButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    userEvent.click(confirmPurgeButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.logs.scripts.purge.request({scriptId, flowId})
    );
  });
});
