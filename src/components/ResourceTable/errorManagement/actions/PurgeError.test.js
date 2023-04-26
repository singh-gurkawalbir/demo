
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import metadata from '../resolvedErrors/metadata';
import CeligoTable from '../../../CeligoTable';
import actions from '../../../../actions';
import { ConfirmDialogProvider } from '../../../ConfirmDialog';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.resources.exports = [{
    _id: '6439276e7uybwe78292878',
    adaptorType: 'NetSuiteExport',
  }];
});

async function renderFuntion(actionProps, data, errorType) {
  await renderWithProviders(
    <MemoryRouter initialEntries={[`/${errorType}`]}>
      <Route path="/:errorType">
        <ConfirmDialogProvider>
          <CeligoTable
            actionProps={actionProps}
            {...metadata}
            data={[data]}
        />
        </ConfirmDialogProvider>
      </Route>
    </MemoryRouter>,
    {initialStore}
  );
  await userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('error Management Purge error UI tests', () => {
  const resourceId = '6439276e7uybwe78292878';
  const flowId = '6938764rh739d3378';
  const errorId = 'someerrorId';

  test('should make a dispatch call clicking on purge error action', async () => {
    await renderFuntion({resourceId, flowId}, {errorId}, 'resolved');
    const purgeError = screen.getByText('Purge error');

    expect(purgeError).toBeInTheDocument();
    await userEvent.click(purgeError);
    expect(screen.getByText(/Confirm purge error/i)).toBeInTheDocument();
    const confirmPurgeButton = screen.getByRole('button', {name: 'Purge error'});
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    expect(confirmPurgeButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(confirmPurgeButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.errorManager.flowErrorDetails.purge.request({flowId, resourceId, errors: [errorId], isRowAction: true})
    );
  });
});
