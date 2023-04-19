
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../../../../test/test-utils';
import {ConfirmDialogProvider} from '../../../../../ConfirmDialog';
import CeligoTable from '../../../../../CeligoTable';
import metadata from '../../metadata';
import actions from '../../../../../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

async function renderFunction() {
  renderWithProviders(
    <ConfirmDialogProvider>
      <MemoryRouter>
        <CeligoTable
          {...metadata}
          data={[{_id: 'someId'}]}
      />
      </MemoryRouter>
    </ConfirmDialogProvider>
  );
  await userEvent.click(screen.getByRole('button', {name: /more/i}));
}
describe('cancel Run UI Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should show the confirm dialog box and click on Yes, cancel button', async () => {
    await renderFunction();
    await userEvent.click(screen.getByText('Cancel run'));
    const title = screen.getByText('Confirm cancel');

    expect(screen.getByText('No, go back')).toBeInTheDocument();

    expect(title).toBeInTheDocument();
    const yesButton = screen.getByText('Yes, cancel');

    expect(yesButton).toBeInTheDocument();
    await userEvent.click(yesButton);
    expect(mockDispatch).toHaveBeenCalledWith(actions.job.dashboard.running.cancel({ jobId: 'someId' }));
  });
});
