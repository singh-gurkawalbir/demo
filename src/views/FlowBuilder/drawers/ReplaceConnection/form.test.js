
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReplaceConnection from './form';
import actions from '../../../../actions';
import { ConfirmDialogProvider } from '../../../../components/ConfirmDialog';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

async function initReplaceConnection({
  props = {
    flowId: 'flow_id',
    integrationId: 'integration_id',
    setConnName: jest.fn(),
  },
  connectionId = 'connection_id',
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      connections: [
        {
          _id: 'connection_id',
          name: 'connection name',
          type: 'rdbms',
          rdbms: {
            type: 'snowflake',
          },
        },
        {
          _id: 'connection_id_1',
          name: 'connection name 1',
          type: 'rdbms',
          rdbms: {
            type: 'snowflake',
          },
        },
      ],
      flows: [
        {
          _id: 'flow_id',
        },
      ],
      integrations: [
        {
          _id: 'integration_id',
        },
      ],
    };
  });

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/flowBuilder/flow_id/replaceConnection/${connectionId}`}]}
    >
      <Route
        path="/flowBuilder/flow_id/replaceConnection/:connId"
      >
        <ConfirmDialogProvider>
          <ReplaceConnection {...props} />
        </ConfirmDialogProvider>
      </Route>
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

const mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

jest.mock('../../../../components/DynaForm/DynaSubmit', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/DynaForm/DynaSubmit'),
  default: props => (
    <>
      <button type="button" onClick={props.onClick}>{props.children}</button>
    </>
  ),
}));

describe('ReplaceConnection test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: reduxStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    mockHistoryGoBack.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    const onClose = jest.fn();

    await initReplaceConnection({
      props: {
        flowId: 'flow_id',
        integrationId: 'integration_id',
        setConnName: jest.fn(),
        onClose,
      },
    });
    const replaceButton = screen.getByRole('button', { name: 'Replace'});
    const cancelButton = screen.getByRole('button', { name: 'Cancel'});

    expect(replaceButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);
    expect(onClose).toBeCalled();

    await userEvent.click(replaceButton);
    const replaceDialogButton = screen.getByRole('button', { name: 'Replace'});

    expect(replaceDialogButton).toBeInTheDocument();
    await userEvent.click(replaceDialogButton);
    expect(mockDispatchFn).toBeCalledWith(actions.resource.replaceConnection('flows', 'flow_id', 'connection_id', undefined));
  });

  test('should pass the initial render with invalid connection id', async () => {
    await initReplaceConnection({
      connectionId: 'connection_id_3',
    });
    const replaceButton = screen.getByRole('button', { name: 'Replace'});
    const cancelButton = screen.getByRole('button', { name: 'Cancel'});

    expect(replaceButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });
});
