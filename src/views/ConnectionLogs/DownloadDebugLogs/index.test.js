import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DownloadDebugLogs from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';
import actions from '../../../actions';

async function initDownloadDebugLogs({
  props = {
    connectionId: 'connection_id',
    disabled: false,
  },
} = {}) {
  const ui = (
    <MemoryRouter>
      <DownloadDebugLogs {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('downloadDebugLogs_afe test cases', () => {
  runServer();
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

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initDownloadDebugLogs();
    const downloadButton = screen.getByRole('button', { name: /Download logs/i});

    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).not.toHaveAttribute('disabled');
    await userEvent.click(downloadButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.connections.download('connection_id'));
  });

  test('should pass the initial render with button disabled', async () => {
    await initDownloadDebugLogs({
      props: {
        connectionId: 'connection_id',
        disabled: true,
      },
    });
    const downloadButton = screen.getByRole('button', { name: /Download logs/i});

    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toHaveAttribute('disabled');
  });
});
