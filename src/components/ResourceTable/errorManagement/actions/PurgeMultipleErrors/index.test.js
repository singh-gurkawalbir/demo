
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PurgeMultipleErrors from '.';
import { runServer } from '../../../../../test/api/server';
import { renderWithProviders } from '../../../../../test/test-utils';
import ActionMenu from '../../../../CeligoTable/ActionMenu';
import actions from '../../../../../actions';
import { ConfirmDialogProvider } from '../../../../ConfirmDialog';

async function initPurgeMultipleErrors(rowData) {
  const useRowActions = () => [PurgeMultipleErrors];
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

  await userEvent.click(screen.getByRole('button', {name: /more/i}));

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

describe('purgeMultipleErrors action Test cases', () => {
  runServer();
  afterEach(() => {
    mockHistoryPush.mockClear();
  });
  test('should pass the intial render and purge errors', async () => {
    const resourceId = '6439276e7uybwe78292878';
    const flowId = '6938764rh739d3378';
    const selectedErrorCount = 3;
    const rowData = {
      isResolved: true,
      flowId,
      resourceId,
      selectedErrorCount,
    };

    await initPurgeMultipleErrors(rowData);
    const purgeError = screen.getByText(/Purge 3 selected errors/i);

    expect(purgeError).toBeInTheDocument();
    await userEvent.click(purgeError);
    expect(screen.getByText('Confirm purge error(s)')).toBeInTheDocument();
    const confirmPurgeButton = screen.getByRole('button', {name: 'Purge error(s)'});
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    expect(confirmPurgeButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(confirmPurgeButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.errorManager.flowErrorDetails.purge.request({flowId, resourceId, isRowAction: false})
    );
  });
});
