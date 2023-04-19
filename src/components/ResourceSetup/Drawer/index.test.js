
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResourceSetupDrawer from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';

async function initResourceSetupDrawer({
  props = {
    mode: 'install',
    integrationId: 'integration_id',
    templateId: 'template_id',
  },
  initialStore = reduxStore,
  resourceType = 'connections',
  resourceId = 'resource_id',
} = {}) {
  const setIsResourceStaged = jest.fn();

  mutateStore(initialStore, draft => {
    draft.session.resource = {
      connection_id_2: 'connection_id_3',
    }; // createdConnectionId
    draft.session.oAuthAuthorize = {
      connection_id_4: {
        authorized: true,
      },
    }; // isAuthorized

    draft.session.templates = {
      template_id: {},
    }; // isAuthorized

    draft.data.resources = {
      connections: [{
        _id: 'id_1',
        name: 'Name 1',
        offline: true,
        netsuite: {},
      }, {
        _id: 'connection_id_3',
        assistant: 'shopify',
        type: 'http',
        http: {
          auth: {
            type: 'oauth',
          },
        },
      }], // connectionDoc
      integrations: [{
        _id: 'integration_id',
        mode: 'install',
        _templateId: 'template_id',
        installSteps: [{
          name: 'NetSuite Connection',
          completed: false,
          type: 'connection',
          _connectionId: 'id_1',
          sourceConnection: {
            _id: 'id_1',
            type: 'netsuite',
            name: 'NetSuite Connection',
          },
        }],
      }, {
        _id: 'integration_id_1',
        mode: 'install',
        _connectorId: 'connector_id_1',
        installSteps: [{
          name: 'HTTP Connection',
          completed: false,
          type: 'connection',
          _connectionId: 'id_1',
          sourceConnection: {
            _id: 'id_1',
            type: 'http',
            name: 'HTTP Connection',
            formType: {
              type: 'http',
            },
          },
        }],
      }, {
        _id: 'integration_id_3',
        mode: 'install',
        installSteps: [{
          name: 'HTTP Connection',
          completed: false,
          type: 'connection',
          _connectionId: 'id_1',
          sourceConnection: {
            _id: 'id_1',
            type: 'http',
            name: 'HTTP Connection',
            formType: {
              type: 'http',
            },
          },
        }],
      }], // canSelectExistingResources
    };
  });

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/integrations/integration_id/setup/configure/${resourceType}/${resourceId}`}]}
    >
      <Route
        path="/integrations/:integrationId/setup"
        params={{
          integrationId: 'integration_id',
        }}
        >
        <ResourceSetupDrawer
          {...props}
          setIsResourceStaged={setIsResourceStaged}
          isResourceStaged
        />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

const mockOnSubmitComplete = jest.fn().mockReturnValue({
  connId: '',
  isAuthorized: '',
});

const mockOnClose = jest.fn().mockReturnValue({
  connId: '',
});

jest.mock('../AddOrSelect', () => ({
  __esModule: true,
  ...jest.requireActual('../AddOrSelect'),
  default: props => {
    const handleOnSubmitComplete = () => {
      const { connId, isAuthorized } = mockOnSubmitComplete();

      props.onSubmitComplete(connId, isAuthorized);
    };
    const handleOnClose = () => {
      const { connId } = mockOnClose();

      props.onClose(connId);
    };

    return (
      <>
        <button type="button" onClick={handleOnSubmitComplete}>
          Mock onSubmitComplete
        </button>
        <button type="button" onClick={handleOnClose}>
          Mock onClose
        </button>
      </>
    );
  },
}));

jest.mock('../../ResourceFormWithStatusPanel', () => ({
  __esModule: true,
  ...jest.requireActual('../../ResourceFormWithStatusPanel'),
  default: props => {
    const handleOnSubmitComplete = () => {
      const { connId, isAuthorized } = mockOnSubmitComplete();

      props.onSubmitComplete(connId, isAuthorized);
    };

    return (
      <>
        <button type="button" onClick={handleOnSubmitComplete}>
          Mock onSubmitComplete
        </button>
      </>
    );
  },
}));

jest.mock('../../drawer/Resource/Panel/ResourceFormActionsPanel', () => ({
  __esModule: true,
  ...jest.requireActual('../../drawer/Resource/Panel/ResourceFormActionsPanel'),
  default: props => {
    const handleOnClose = () => {
      const { connId } = mockOnClose();

      props.onCancel(connId);
    };

    return (
      <>
        <button type="button" onClick={handleOnClose}>
          Mock onCancel
        </button>
      </>
    );
  },
}));

const mockHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

describe('resourceSetupDrawer test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;
  let initialStore;

  beforeEach(() => {
    initialStore = reduxStore;
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockOnSubmitComplete.mockClear();
    mockOnClose.mockClear();
    mockHistoryReplace.mockClear();
  });

  test('should pass the initial render with default value/ with templateId', async () => {
    await initResourceSetupDrawer({
      initialStore,
    });

    expect(screen.queryByText(/Set up connection/i)).toBeInTheDocument();
    const onSubmitCompleteButton = screen.getByRole('button', {name: 'Mock onSubmitComplete'});
    const onCloseButton = screen.getByRole('button', {name: 'Mock onClose'});

    expect(onSubmitCompleteButton).toBeInTheDocument();
    expect(onCloseButton).toBeInTheDocument();

    await userEvent.click(onSubmitCompleteButton);
    expect(mockOnSubmitComplete).toHaveBeenCalledTimes(1);
    expect(mockHistoryReplace).toHaveBeenCalledTimes(1);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/integrations/integration_id/setup');

    await userEvent.click(onCloseButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockHistoryReplace).toHaveBeenCalledTimes(2);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/integrations/integration_id/setup');
  });

  test('should pass the initial render with mode ss-install', async () => {
    const onSubmitComplete = jest.fn();
    const onClose = jest.fn();

    await initResourceSetupDrawer({
      props: {
        mode: 'ss-install',
        integrationId: 'integration_id',
        onSubmitComplete,
        onClose,
      },
      initialStore,
    });

    expect(screen.queryByText(/Set up connection/i)).toBeInTheDocument();
    const onSubmitCompleteButton = screen.getByRole('button', {name: 'Mock onSubmitComplete'});
    const onCloseButton = screen.getByRole('button', {name: 'Mock onClose'});

    expect(onSubmitCompleteButton).toBeInTheDocument();
    expect(onCloseButton).toBeInTheDocument();

    await userEvent.click(onSubmitCompleteButton);
    expect(mockOnSubmitComplete).toHaveBeenCalledTimes(1);
    expect(onSubmitComplete).toHaveBeenCalledTimes(1);
    expect(mockHistoryReplace).toHaveBeenCalledTimes(0);

    await userEvent.click(onCloseButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('should pass the initial render with different resourceType', async () => {
    const handleStackSetupDone = jest.fn();
    const handleStackClose = jest.fn();

    await initResourceSetupDrawer({
      props: {
        handleStackSetupDone,
        handleStackClose,
      },
      initialStore,
      resourceType: 'exports',
    });

    expect(screen.queryByText(/Set up export/i)).toBeInTheDocument();
    const onSubmitCompleteButton = screen.getByRole('button', {name: 'Mock onSubmitComplete'});
    const onCloseButton = screen.getByRole('button', {name: 'Mock onClose'});

    expect(onSubmitCompleteButton).toBeInTheDocument();
    expect(onCloseButton).toBeInTheDocument();

    await userEvent.click(onSubmitCompleteButton);
    expect(mockOnSubmitComplete).toHaveBeenCalledTimes(1);
    expect(handleStackSetupDone).toHaveBeenCalledTimes(1);

    await userEvent.click(onCloseButton);
    expect(handleStackClose).toHaveBeenCalledTimes(1);
  });

  test('should pass the initial render with new connection Id', async () => {
    await initResourceSetupDrawer({
      props: {
        mode: 'install',
        integrationId: 'integration_id',
      },
      initialStore,
      resourceId: 'new-id_1',
    });

    expect(screen.queryByText(/Set up connection/i)).toBeInTheDocument();
    const onSubmitCompleteButton = screen.getByRole('button', {name: 'Mock onSubmitComplete'});
    const onCloseButton = screen.getByRole('button', {name: 'Mock onClose'});

    expect(onSubmitCompleteButton).toBeInTheDocument();
    expect(onCloseButton).toBeInTheDocument();
  });

  test('should pass the initial render with new connection Id type http', async () => {
    await initResourceSetupDrawer({
      props: {
        mode: 'install',
        integrationId: 'integration_id_3',
      },
      initialStore,
      resourceId: 'new-id_1',
    });

    expect(screen.queryByText(/Set up connection/i)).toBeInTheDocument();
    const onSubmitCompleteButton = screen.getByRole('button', {name: 'Mock onSubmitComplete'});
    const onCloseButton = screen.getByRole('button', {name: 'Mock onClose'});

    expect(onSubmitCompleteButton).toBeInTheDocument();
    expect(onCloseButton).toBeInTheDocument();
  });

  test('should pass the initial render with connector Id', async () => {
    await initResourceSetupDrawer({
      props: {
        mode: 'install',
        integrationId: 'integration_id_1',
      },
      initialStore,
    });

    expect(screen.queryByText(/Set up connection/i)).toBeInTheDocument();
    const onSubmitCompleteButton = screen.getByRole('button', {name: 'Mock onSubmitComplete'});
    const onCloseButton = screen.getByRole('button', {name: 'Mock onCancel'});

    expect(onSubmitCompleteButton).toBeInTheDocument();
    expect(onCloseButton).toBeInTheDocument();
  });

  test('should pass the initial render with mode clone', async () => {
    await initResourceSetupDrawer({
      props: {
        mode: 'clone',
        integrationId: 'integration_id_1',
      },
      initialStore,
      resourceId: 'connection_id_2',
    });

    expect(screen.queryByText(/Set up connection/i)).toBeInTheDocument();
    const onSubmitCompleteButton = screen.getByRole('button', {name: 'Mock onSubmitComplete'});
    const onCloseButton = screen.getByRole('button', {name: 'Mock onCancel'});

    expect(onSubmitCompleteButton).toBeInTheDocument();
    expect(onCloseButton).toBeInTheDocument();
    await userEvent.click(onSubmitCompleteButton);
    expect(mockOnSubmitComplete).toHaveBeenCalledTimes(1);
    expect(mockHistoryReplace).toHaveBeenCalledTimes(1);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/integrations/integration_id/setup/configure/connections/connection_id_3');
  });

  test('should pass the initial render with isauth true', async () => {
    await initResourceSetupDrawer({
      props: {
        mode: 'clone',
        integrationId: 'integration_id_1',
      },
      initialStore,
      resourceId: 'connection_id_4',
    });

    expect(screen.queryByText(/Set up connection/i)).toBeInTheDocument();
    const onSubmitCompleteButton = screen.getByRole('button', {name: 'Mock onSubmitComplete'});
    const onCloseButton = screen.getByRole('button', {name: 'Mock onCancel'});

    expect(onSubmitCompleteButton).toBeInTheDocument();
    expect(onCloseButton).toBeInTheDocument();
    await userEvent.click(onSubmitCompleteButton);
    expect(mockOnSubmitComplete).toHaveBeenCalledTimes(1);
    expect(mockHistoryReplace).toHaveBeenCalledTimes(2);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/integrations/integration_id/setup');

    await userEvent.click(onCloseButton);
  });
  test('should redirect to parentUrl if resource form init fails', async () => {
    mutateStore(initialStore, draft => {
      draft.session.resourceForm = {
        'connections-resource_id': {
          initFailed: true,
        },
      };
    });

    await initResourceSetupDrawer({
      props: {
        mode: 'install',
        integrationId: 'integration_id_1',
      },
      initialStore,
    });

    expect(screen.queryByText(/Set up connection/i)).toBeInTheDocument();
    const onSubmitCompleteButton = screen.getByRole('button', {name: 'Mock onSubmitComplete'});
    const onCloseButton = screen.getByRole('button', {name: 'Mock onCancel'});

    expect(onSubmitCompleteButton).toBeInTheDocument();
    expect(onCloseButton).toBeInTheDocument();

    expect(mockHistoryReplace).toHaveBeenCalledTimes(1);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/integrations/integration_id/setup');
  });
});

