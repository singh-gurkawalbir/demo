
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddOrSelect from './AddOrSelect';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mockGetRequestOnce, mutateStore } from '../../test/test-utils';

async function initAddOrSelect({
  props = {
    formKey: 'connections-new-O202icadl',
  },
  initialStore = reduxStore,
  renderFun,
} = {}) {
  mutateStore(initialStore, draft => {
    draft.session.stage = {
      'new-O202icadl': {
        patch: [
          {
            op: 'replace',
            path: '/_id',
            value: 'new-uwmt5Mi92',
            timestamp: 1657615760352,
          },
          {
            op: 'replace',
            path: '/type',
            value: 'netsuite',
            timestamp: 1657615760352,
          },
          {
            op: 'replace',
            path: '/name',
            value: 'NetSuite Connection',
            timestamp: 1657615760352,
          },
          {
            op: 'replace',
            path: '/newIA',
            value: true,
            timestamp: 1657615760352,
          },
          {
            op: 'replace',
            path: '/_integrationId',
            value: '62cd3575a7777017e5a4a44a',
            timestamp: 1657615760352,
          },
          {
            op: 'replace',
            path: '/_connectorId',
            timestamp: 1657615760352,
          },
          {
            op: 'replace',
            path: '/installStepConnection',
            value: true,
            timestamp: 1657615760352,
          },
        ],
      },
    };

    draft.data.resources = {
      connections: [{
        _id: 'id_1',
        name: 'Name 1',
        offline: true,
        netsuite: {},
      }, {
        _id: 'id_2',
        name: 'Name 2',
        offline: false,
        netsuite: {},
      }],
    };
  });

  const ui = (
    <MemoryRouter>
      <AddOrSelect {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore, renderFun });

  return {
    store,
    utils,
  };
}

jest.mock('../SaveAndCloseButtonGroup/SaveAndCloseMiniResourceForm', () => ({
  __esModule: true,
  ...jest.requireActual('../SaveAndCloseButtonGroup/SaveAndCloseMiniResourceForm'),
  default: props => (
    <>
      <button type="button" onClick={props.handleSave}>
        Mock handleSave
      </button>
      <button type="button" onClick={props.handleCancel}>
        Mock handleCancel
      </button>
    </>
  ),
}));

const mockonSubmitComplete = jest.fn().mockReturnValue({
  connId: '',
  isAuthorized: '',
});

jest.mock('../drawer/Resource/Panel/ResourceFormActionsPanel', () => ({
  __esModule: true,
  ...jest.requireActual('../drawer/Resource/Panel/ResourceFormActionsPanel'),
  default: props => {
    const submitComplete = () => {
      const {connId, isAuthorized} = mockonSubmitComplete();

      props.onSubmitComplete(connId, isAuthorized);
    };

    return (
      <>
        <button type="button" onClick={submitComplete}>
          Mock onSubmitComplete
        </button>

      </>
    );
  },
}));

describe('addOrSelect test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;
  let initialStore;

  beforeEach(() => {
    initialStore = reduxStore;
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'MOCK_DUMMY_STATE_UPDATE':
          mutateStore(initialStore, draft => {
            draft.session.form['connections-new-O202icadl'].value = {
              connection: 'id_1',
            };
          });
          break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initAddOrSelect({
      initialStore,
    });

    expect(screen.queryByText(/Set up new connection/i)).toBeInTheDocument();
    expect(screen.queryByText(/Use existing connection/i)).toBeInTheDocument();
  });

  test('should pass the initial render with custom value', async () => {
    mockGetRequestOnce('/api/connections', []);
    const onClose = jest.fn();
    const onSubmitComplete = jest.fn();

    const { utils } = await initAddOrSelect({
      props: {
        onClose,
        onSubmitComplete,
        resource: {
          name: 'NetSuite Connection',
          type: 'netsuite',
        },
        connectionType: 'netsuite',
        formKey: 'connections-new-O202icadl',
        resourceId: 'new-O202icadl',
      },
      initialStore,
    });

    waitFor(async () => {
      const newConn = screen.getByRole('radio', {name: 'Set up new connection'});
      const existingConn = screen.getByRole('radio', {name: 'Use existing connection'});
      const submitButton = screen.getByRole('button', {name: 'Mock onSubmitComplete'});

      expect(newConn).toBeInTheDocument();
      expect(existingConn).toBeInTheDocument();
      expect(screen.queryByText(/General/i)).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      await userEvent.click(submitButton);
      expect(onSubmitComplete).toHaveBeenCalledTimes(1);

      // existing connection
      await userEvent.click(existingConn);
    });
    waitFor(async () => {
      const doneButton = screen.getByRole('button', {name: 'Mock handleSave'});
      const cancelButton = screen.getByRole('button', {name: 'Mock handleCancel'});

      expect(doneButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();

      await userEvent.click(doneButton);
      await userEvent.click(cancelButton);
      expect(onClose).toHaveBeenCalled();

      const dispatch = reactRedux.useDispatch();

      dispatch({
        type: 'MOCK_DUMMY_STATE_UPDATE',
      });

      // rerendering the component to get latest state
      await initAddOrSelect({
        props: {
          onClose,
          onSubmitComplete,
          resource: {
            name: 'NetSuite Connection',
            type: 'netsuite',
          },
          connectionType: 'netsuite',
          formKey: 'connections-new-O202icadl',
          resourceId: 'new-O202icadl',
        },
        initialStore,
        renderFun: utils.rerender,
      });

      await userEvent.click(doneButton);
      expect(onSubmitComplete).toHaveBeenCalledTimes(2);
    });
  });
});

