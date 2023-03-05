import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsDrawer from '.';
import actions from '../../../../actions';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

function initSettingsDrawer({
  props = {
    flowId: 'flow_id',
    integrationId: 'integration_id',
    resourceType: 'flows',
    resourceId: 'flow_id',
  },
  useErrMgtTwoDotZero = true,
  accessLevel = 'owner',
  accountId = 'own',
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      flows: [
        {
          _id: 'flow_id',
          name: 'name',
          _integrationId: 'integration_id',
          settings: {
            setting1: 'value1',
          },
        },
        {
          _id: 'flow_id_1',
          name: 'name 1',
          _connectorId: 'connector_id_1',
          settings: '{"setting1":"value1"}',

        },
        {
          _id: 'flow_id_2',
          name: 'name 2',
          settings: 'djfnj',
        },
      ],
      integrations: [
        {
          _id: 'integration_id',
        },
        {
          _id: 'integration_id_1',
          _connectorId: 'connector_id_1',
        },
      ],
      notifications: [
        {
          _id: 'notification_1',
          type: 'flow',
          _flowId: 'flow_id_3',
          subscribedByUser: {},
        },
      ],
    };
    draft.user.preferences = {
      defaultAShareId: accountId,
    };
    draft.user.profile = {
      useErrMgtTwoDotZero,
    };
    draft.user.org = {
      accounts: [
        {
          accessLevel,
          _id: 'own',
          ownerUser: {},
        },
        {
          accessLevel: 'monitor',
          _id: 'account_id_1',
          ownerUser: {},
        },
        {
          accepted: true,
          _id: 'account_id_2',
          ownerUser: {},
          integrationAccessLevel: [
            {
              accessLevel: 'monitor',
              _integrationId: 'integration_id_1',
            },
          ],
        },
      ],
    };
    draft.session.loadResources.notifications = 'received';
  });

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/flowBuilder/${props.flowId}/settings`}]}
    >
      <Route
        path="/flowBuilder/:flowId"
      >
        <SettingsDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  const { store, utils } = renderWithProviders(ui, { initialStore });

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

jest.mock('../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm'),
  default: props => (
    <>
      <button type="button" onClick={props.onSave}>mock Save</button>
      <button type="button" onClick={props.onClose}>mock Close</button>
      {/* eslint-disable-next-line react/jsx-handler-names */}
      <button type="button" onClick={props.remountAfterSaveFn}>remountAfterSaveFn</button>
    </>
  ),
}));

describe('SettingsDrawer test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'RESOURCE_STAGE_PATCH_AND_COMMIT':
          break;
        default:
          reduxStore.dispatch(action);
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
    initSettingsDrawer();
    let saveButton;

    waitFor(async () => {
      saveButton = screen.getByRole('button', { name: 'mock Save'});
      const closeButton = screen.getByRole('button', { name: 'mock Close'});
      const remountAfterSaveFnButton = screen.getByRole('button', { name: 'remountAfterSaveFn'});

      expect(screen.queryByText('Settings')).toBeInTheDocument();
      expect(saveButton).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
      expect(remountAfterSaveFnButton).toBeInTheDocument();

      await userEvent.click(remountAfterSaveFnButton);

      await userEvent.click(closeButton);
      expect(mockHistoryGoBack).toBeCalled();
    });

    waitFor(() => {
      const notifyOnFlowError = screen.getByRole('radiogroup', { name: 'Notify me of flow errors'});

      expect(notifyOnFlowError).toBeInTheDocument();
    });

    waitFor(async () => {
      const yesRadio = screen.getAllByRole('radio', { name: 'Yes'}).find(eachInput => eachInput.getAttribute('name') === 'notifyOnFlowError');

      expect(yesRadio).toBeInTheDocument();

      await userEvent.click(yesRadio);
      await userEvent.click(saveButton);
      expect(mockDispatchFn).toBeCalledWith(actions.resource.patchAndCommitStaged('flows', 'flow_id', [
        {
          op: 'replace',
          path: '/name',
          value: 'name',
        },
        {
          op: 'replace',
          path: '/description',
          value: undefined,
        },
        {
          op: 'replace',
          path: '/_runNextFlowIds',
          value: [],
        },
        {
          op: 'replace',
          path: '/autoResolveMatchingTraceKeys',
          value: true,
        },
        {
          op: 'replace',
          path: '/_integrationId',
          value: 'integration_id',
        },
        {
          op: 'replace',
          path: '/settings',
          value: {setting1: 'value1' },
        },
      ], { asyncKey: 'flowbuildersettings' }));
    });
  });

  test('should pass the initial render with invliad setting value', async () => {
    initSettingsDrawer({
      props: {
        flowId: 'flow_id_2',
        resourceType: 'flows',
        resourceId: 'flow_id_2',
      },
    });
    waitFor(async () => {
      const saveButton = screen.getByRole('button', { name: 'mock Save'});
      const closeButton = screen.getByRole('button', { name: 'mock Close'});

      expect(screen.queryByText('Settings')).toBeInTheDocument();
      expect(saveButton).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();

      await userEvent.click(saveButton);
      expect(mockDispatchFn).toBeCalledWith(actions.resource.patchAndCommitStaged('flows', 'flow_id_2', [
        {
          op: 'replace',
          path: '/name',
          value: 'name 2',
        },
        {
          op: 'replace',
          path: '/description',
          value: undefined,
        },
        {
          op: 'replace',
          path: '/_runNextFlowIds',
          value: [],
        },
        {
          op: 'replace',
          path: '/autoResolveMatchingTraceKeys',
          value: true,
        },
        {
          op: 'replace',
          path: '/settings',
          value: 'djfnj',
        },
      ], { asyncKey: 'flowbuildersettings' }));
    });
  });

  test('should pass the initial render with monitor level access', async () => {
    initSettingsDrawer({
      accessLevel: 'monitor',
      accountId: 'account_id_1',
    });
    waitFor(async () => {
      const saveButton = screen.getByRole('button', { name: 'mock Save'});
      const closeButton = screen.getByRole('button', { name: 'mock Close'});
      const remountAfterSaveFnButton = screen.getByRole('button', { name: 'remountAfterSaveFn'});

      expect(screen.queryByText('Settings')).toBeInTheDocument();
      expect(saveButton).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
      expect(remountAfterSaveFnButton).toBeInTheDocument();

      await userEvent.click(saveButton);
    });
  });

  test('should pass the initial render with integration app flow', async () => {
    initSettingsDrawer({
      props: {
        flowId: 'flow_id_1',
        integrationId: 'integration_id_1',
        resourceType: 'flows',
        resourceId: 'flow_id_1',
      },
    });
    waitFor(async () => {
      const saveButton = screen.getByRole('button', { name: 'mock Save'});
      const closeButton = screen.getByRole('button', { name: 'mock Close'});
      const remountAfterSaveFnButton = screen.getByRole('button', { name: 'remountAfterSaveFn'});

      expect(screen.queryByText('Settings')).toBeInTheDocument();
      expect(saveButton).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
      expect(remountAfterSaveFnButton).toBeInTheDocument();

      await userEvent.click(saveButton);
      expect(mockDispatchFn).toBeCalledWith(actions.resource.patchAndCommitStaged('flows', 'flow_id_1', [
        {
          op: 'replace',
          path: '/name',
          value: 'name 1',
        },
        {
          op: 'replace',
          path: '/description',
          value: undefined,
        },
        {
          op: 'replace',
          path: '/_runNextFlowIds',
          value: [],
        },
        {
          op: 'replace',
          path: '/autoResolveMatchingTraceKeys',
          value: true,
        },
        {
          op: 'replace',
          path: '/_integrationId',
          value: 'integration_id_1',
        },
        {
          op: 'replace',
          path: '/settings',
          value: {setting1: 'value1'},
        },
      ], { asyncKey: 'flowbuildersettings' }));
    });
  });

  test('should pass the initial render with integration app flow with monitor access', async () => {
    initSettingsDrawer({
      props: {
        flowId: 'flow_id_1',
        integrationId: 'integration_id_1',
        resourceType: 'flows',
        resourceId: 'flow_id_1',
      },
      accessLevel: 'monitor',
      accountId: 'account_id_2',
    });
    waitFor(async () => {
      const saveButton = screen.getByRole('button', { name: 'mock Save'});
      const closeButton = screen.getByRole('button', { name: 'mock Close'});
      const remountAfterSaveFnButton = screen.getByRole('button', { name: 'remountAfterSaveFn'});

      expect(screen.queryByText('Settings')).toBeInTheDocument();
      expect(saveButton).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
      expect(remountAfterSaveFnButton).toBeInTheDocument();

      await userEvent.click(saveButton);
    });
  });

  test('should pass the initial render with integration app flow duplicate', () => {
    initSettingsDrawer({
      props: {
        flowId: 'flow_id_0',
        resourceType: 'flows',
        resourceId: 'flow_id_0',
      },
    });
    waitFor(async () => {
      const saveButton = screen.getByRole('button', { name: 'mock Save'});
      const closeButton = screen.getByRole('button', { name: 'mock Close'});
      const remountAfterSaveFnButton = screen.getByRole('button', { name: 'remountAfterSaveFn'});

      expect(screen.queryByText('Settings')).toBeInTheDocument();
      expect(saveButton).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
      expect(remountAfterSaveFnButton).toBeInTheDocument();
    });
  });
});
