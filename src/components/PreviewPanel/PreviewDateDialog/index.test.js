import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mutateStore, reduxStore } from '../../../test/test-utils';
import PreviewDateDialog from '.';

async function initPreviewDateDialog(props = {
  onRun: jest.fn(),
  onClose: jest.fn(),
}, initialStore) {
  const ui = (
    <>
      <PreviewDateDialog {...props} />
    </>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('../../DynaForm/DynaSubmit', () => ({
  __esModule: true,
  ...jest.requireActual('../../DynaForm/DynaSubmit'),
  default: ({children, onClick}) => (
    <button type="button" onClick={onClick}>{children}</button>
  ),
}));

describe('PreviewDateDialog Component test cases', () => {
  test('should pass initial rendering without any props consider as export preview', async () => {
    const onRun = jest.fn();
    const onClose = jest.fn();

    await initPreviewDateDialog({
      onRun,
      onClose,
    });

    expect(screen.getByText('Delta preview')).toBeInTheDocument();
    expect(screen.queryByText(/No records available to preview./i)).not.toBeInTheDocument();
    const runButton = screen.getByRole('button', { name: 'Preview' });
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    expect(runButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(runButton);
    expect(onRun).toBeCalled();
    expect(onClose).toBeCalledTimes(1);

    await userEvent.click(cancelButton);
    expect(onClose).toBeCalledTimes(2);
  });

  test('should pass rendering when passing flowId loading the last export date', async () => {
    const onRun = jest.fn();
    const onClose = jest.fn();

    await initPreviewDateDialog({
      onRun,
      onClose,
      flowId: 'flow_id',
      showWarning: true,
    });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('should pass rendering when passing flowId got error for last export date', async () => {
    const initialStore = reduxStore;
    const onRun = jest.fn();
    const onClose = jest.fn();
    const mustateState = draft => {
      draft.session = {
        flows: {
          flow_id: {
            lastExportDateTime: {
              data: null,
              status: 'error',
            },
          },
        },
      };
    };

    mutateStore(initialStore, mustateState);
    await initPreviewDateDialog({
      onRun,
      onClose,
      flowId: 'flow_id',
    }, initialStore);
    expect(onClose).toBeCalled();
  });

  test('should pass rendering when passing flowId got sucess for last export date', async () => {
    const initialStore = reduxStore;
    const onRun = jest.fn();
    const onClose = jest.fn();
    const mustateState = draft => {
      draft.session = {
        flows: {
          flow_id: {
            lastExportDateTime: {
              data: null,
              status: 'success',
            },
          },
        },
      };
    };

    mutateStore(initialStore, mustateState);
    await initPreviewDateDialog({
      onRun,
      onClose,
      flowId: 'flow_id',
      showWarning: true,
    }, initialStore);

    expect(screen.getByText('Delta preview')).toBeInTheDocument();
    expect(screen.queryByText(/No records available to preview./i)).toBeInTheDocument();
    const runButton = screen.getByRole('button', { name: 'Preview' });
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    expect(runButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(runButton);
    expect(onRun).toBeCalled();
    expect(onClose).toBeCalledTimes(1);

    await userEvent.click(cancelButton);
    expect(onClose).toBeCalledTimes(2);
  });
});
