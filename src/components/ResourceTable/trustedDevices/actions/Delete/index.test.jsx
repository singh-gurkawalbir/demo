
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { ConfirmDialogProvider } from '../../../../ConfirmDialog';
import { mutateStore, reduxStore, renderWithProviders } from '../../../../../test/test-utils';
import metadata from '../../metadata';
import CeligoTable from '../../../../CeligoTable';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;
const asyncTaskKey = 'MFA_DELETE_DEVICE_ASYNC_KEY';

mutateStore(initialStore, draft => {
  draft.session.asyncTask[asyncTaskKey] =
  {
    status: 'complete',
  };
});

async function renderFuntion(data) {
  renderWithProviders(
    <ConfirmDialogProvider>
      <CeligoTable
        {...metadata}
        data={[data]} />
    </ConfirmDialogProvider>, {initialStore}
  );
  await userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('uI test cases for trusted Devices', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const data = {_id: '6287678bdh893338hdn3', browser: 'Chrome', os: 'windows'};

  test('should make dispatch calls when trusted MFA devices are deleted', async () => {
    await renderFuntion(data);
    const deleteDeviceButton = screen.getByText('Delete device');

    await userEvent.click(deleteDeviceButton);
    const response = screen.getByText('Delete trusted MFA device?');

    expect(response).toBeInTheDocument();
    const title = screen.getByText("Are you sure you want to delete your trusted MFA device? You'll need to re-authenticate your account the next time you sign into integrator.io with the device.");

    expect(title).toBeInTheDocument();
    const deleteButton = screen.getByText('Delete');

    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    expect(deleteButton).not.toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledWith({
      deviceId: '6287678bdh893338hdn3',
      type: 'MFA_DELETE_DEVICE',
    });
    const success = screen.getByText('Device deleted successfully.');

    expect(success).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledWith({
      key: 'MFA_DELETE_DEVICE_ASYNC_KEY',
      type: 'ASYNC_TASK_CLEAR',
    });
  });
  test('should test cancel button', async () => {
    renderWithProviders(
      <ConfirmDialogProvider>
        <CeligoTable
          {...metadata}
          data={[data]} />
      </ConfirmDialogProvider>
    );
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    const deleteDeviceButton = screen.getByText('Delete device');

    await userEvent.click(deleteDeviceButton);
    const devices = screen.getByText('Delete trusted MFA device?');

    expect(devices).toBeInTheDocument();
    const title = screen.getByText("Are you sure you want to delete your trusted MFA device? You'll need to re-authenticate your account the next time you sign into integrator.io with the device.");

    expect(title).toBeInTheDocument();
    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);
    expect(cancelButton).not.toBeInTheDocument();
  });
});
