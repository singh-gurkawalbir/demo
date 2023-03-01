import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConnectionLogs from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import actions from '../../actions';

async function initConnectionLogs({
  props = {
    connectionId: 'connection_id',
    flowId: 'flow_id',
  },
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      connections: [{
        _id: 'connection_id',
        type: 'mock type',
      }, {
        _id: 'connection_id_1',
        type: 'mongodb',
      }],
      flows: [{
        _id: 'flow_id_1',
      }],
    };
    draft.session.logs.connections = {
      connection_id: {
        logs: 'mock logs',
        status: 'success', // loading
      },
    };
  });

  const ui = (
    <MemoryRouter>
      <ConnectionLogs {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

jest.mock('../../components/AutoScrollEditorTerminal', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/AutoScrollEditorTerminal'),
  default: props => (
    <>
      <p>{props.value}</p>
    </>
  ),

}));

describe('connectionLogs_afe test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;
  const initialStore = reduxStore;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'CONNECTIONS_LOGS_DELETE':
        case 'CONNECTIONS_LOGS_REFRESH':
          break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initConnectionLogs();

    const refreshButton = await screen.getByRole('button', { name: /Refresh/i});
    const clearButton = await screen.getByRole('button', { name: /Clear/i});

    expect(refreshButton).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();

    await userEvent.click(refreshButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.connections.refresh('connection_id'));
    await userEvent.click(clearButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.connections.delete('connection_id'));
  });

  test('should pass the initial render with connection which doesn\'t have logs', async () => {
    await initConnectionLogs({
      props: {
        connectionId: 'connection_id_1',
        flowId: 'flow_id',
      },
    });

    expect(screen.queryByText(/Debug logs not supported for this connection./i)).toBeInTheDocument();
  });
});
