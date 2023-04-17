import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mutateStore, reduxStore } from '../../../test/test-utils';
import PreviewDateDialog from '.';
import actions from '../../../actions';

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

describe('PreviewDateDialog component test cases', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(async () => {
    jest.clearAllMocks();
  });
  test('should pass initial rendering without any props consider as export preview', async () => {
    const onRun = jest.fn();
    const onClose = jest.fn();

    await initPreviewDateDialog({
      onRun,
      onClose,
    });

    expect(screen.getByText('Delta preview')).toBeInTheDocument();
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

  test('should pass rendering when passing new flowId', async () => {
    const initialStore = reduxStore;
    const onRun = jest.fn();
    const onClose = jest.fn();

    await initPreviewDateDialog({
      onRun,
      onClose,
      flowId: 'new-flow_id',
    }, initialStore);
    expect(mockDispatchFn).not.toBeCalledWith(actions.flow.requestLastExportDateTime({ flowId: 'new-flow_id' }));
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
    }, initialStore);

    expect(screen.getByText('Delta preview')).toBeInTheDocument();
    expect(screen.queryByText(/No records available to preview./i)).toBeInTheDocument();
    expect(mockDispatchFn).toBeCalledWith(actions.flow.requestLastExportDateTime({ flowId: 'flow_id' }));
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
