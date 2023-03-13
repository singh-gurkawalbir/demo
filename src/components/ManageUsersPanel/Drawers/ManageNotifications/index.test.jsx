
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, useHistory } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as reactRouterDom from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as reactRedux from 'react-redux';
import { renderWithProviders, mockPutRequestOnce, mutateStore } from '../../../../test/test-utils';
import ManageNotificationsDrawer from '.';
import { runServer } from '../../../../test/api/server';
import { getCreatedStore } from '../../../../store';

let initialStore;

function store(notifications) {
  mutateStore(initialStore, draft => {
    draft.data.resources.connections = [{
      _id: '606aca53ba723015469f04aa',
      type: 'ftp',
      name: 'Test Connection',
      offline: false,
      _connectorId: '57c8199e8489cc1a298cc6ea',
      _integrationId: '602aac4c53b612272ca1f54b',
    }];
    draft.data.resources.flows = [
      {
        _id: '5aabd0fdc69b4508218f832b',
        name: 'FTP to FTP Quoted CSV',
        disabled: true,
        timezone: 'Asia/Calcutta',
        _integrationId: '602aac4c53b612272ca1f54b',
      },
      {
        _id: '5aaba8b53f358a48a041aa34',
        lastModified: '2021-03-10T06:46:31.998Z',
        name: 'Sample1',
        disabled: true,
        _integrationId: '602aac4c53b612272ca1f54b',
      },
    ];
    draft.data.integrationAShares = {
      '602aac4c53b612272ca1f54b': [{
        _id: '5ea6afa9cc041b3effb87105',
        accepted: true,
        accessLevel: 'administrator',
        sharedWithUser: {
          _id: '5d036cb0bb88170e9e00e6ac',
          email: 'testuser+1@celigo.com',
          name: 'Test User',
          accountSSOLinked: 'not_linked',
        },
      }],
    };
    draft.session.loadResources = [{
      'transfers/invited': 'received',
      ashares: 'failed',
      'shared/ashares': 'received',
      'ui/assistants': 'received',
      httpconnectors: 'failed',
      tiles: 'received',
      published: 'received',
      connections: 'received',
      marketplacetemplates: 'received',
      integrations: 'received',
      '5aaba5e93f358a48a041aa09': {
        flows: 'received',
        exports: 'received',
        imports: 'received',
      },
      notifications: 'received',
      'integrations/602aac4c53b612272ca1f54b/ashares': 'received',
    }];
    draft.user.profile = {
      _id: '5e215a82416fd0310ba1191f',
      name: 'UI Devs',
      email: 'ui-devs@celigo.com',
      role: 'Developer',
      company: 'cccc celigoooo 1',
      phone: '9898989897',
      timezone: 'Asia/Calcutta',
      developer: true,
      emailHash: 'a05d538c141fb4987d925d8426be895d',
    };
    draft.user.preferences = {
      environment: 'production',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm:ss a',
      expand: 'Resources',
      scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
      showReactSneakPeekFromDate: '2019-11-05',
      showReactBetaFromDate: '2019-12-26',
      defaultAShareId: '5ea6aef9dedba94094c71d15',
      accounts: {
        '5e27eb7fe2f22b579b581228': {
          expand: 'Resources',
          drawerOpened: true,
          fbBottomDrawerHeight: 441,
        },
        '5f87f1c030acea7b58fd8316': {
          expand: 'Help',
          drawerOpened: true,
          fbBottomDrawerHeight: 441,
          dashboard: {
            view: 'tile',
          },
        },
        '5fd347abc35d3b3b9d1dcabf': {
          fbBottomDrawerHeight: 681,
          expand: 'Tools',
        },
        '5ea6aef9dedba94094c71d15': {
          drawerOpened: true,
          expand: 'Tools',
        },
        '5f0c685ec4f5396909523154': {
          expand: 'Tools',
        },
        '6089288ff45b454e157d2fb8': {
          linegraphs: {
            '62307e31b7484c6c73568813': {
              range: {
                startDate: '2021-07-03T18:30:00.000Z',
                endDate: '2022-07-04T04:39:59.444Z',
                preset: 'lastyear',
              },
              resource: [
                '62307e31b7484c6c73568813',
              ],
            },
          },
          fbBottomDrawerHeight: 479,
        },
        '5ffc8fdd8ff7642582e5e528': {
          expand: null,
        },
      },
    };
    draft.data.resources.integrations = [{
      _id: '602aac4c53b612272ca1f54b',
      lastModified: '2018-07-03T12:08:00.302Z',
      name: 'Dummy1',
      description: 'Add this',
      sandbox: false,
      _registeredConnectionIds: [
        '606aca53ba723015469f04aa',
      ],
    }];
    draft.comms.networkComms = {
      'put:/notifications': {
        status: 'success',
        hidden: false,
        refresh: false,
        method: 'put',
      },
    };
    draft.data.resources.notifications = notifications;
  });
}

function initManageNotification(props = {}) {
  const ui = (
    <MemoryRouter
      initialEntries={[{ pathname: '/integrations/602aac4c53b612272ca1f54b/users/ui-drawer/testuser+1@celigo.com/manageNotifications' }]}
      >
      <Route
        path="/integrations/602aac4c53b612272ca1f54b/users/ui-drawer/:userEmail/manageNotifications"
        params={{userEmail: 'testuser+1@celigo.com'}}
        >
        <ManageNotificationsDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));

jest.mock('../../../drawer/Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../../drawer/Right'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));
jest.mock('../../../drawer/Right/DrawerHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../../drawer/Right/DrawerHeader'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: jest.fn(),
  }),
}));

describe('Manage Notifications', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('Should able to access the Notification Drawer and notify the user when a flow throws error by selecting a flow and save the notication drawer', async () => {
    const mockNotificationUpdateFunction = jest.fn();

    mockPutRequestOnce('/api/notifications', (req, res, ctx) => {
      mockNotificationUpdateFunction();

      return res(ctx.json([]));
    });
    store();
    await initManageNotification({
      integrationId: '602aac4c53b612272ca1f54b',
    });

    expect(screen.getByText('Notify user of flow error')).toBeInTheDocument();
    const pleaseSelectText = await screen.queryAllByRole('button', { name: 'Please select'}).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-flows');

    expect(pleaseSelectText).toBeInTheDocument();
    await userEvent.click(pleaseSelectText);
    const checkboxMessage = screen.getByRole('option', {name: 'All flows'});

    expect(checkboxMessage).toBeInTheDocument();
    fireEvent.click(checkboxMessage);
    const doneMessage = screen.getByText('Done');

    expect(doneMessage).toBeInTheDocument();
    await userEvent.click(doneMessage);
    const notifyUserWhenConnectionGoesOfflineText = screen.getByText('Notify user when connection goes offline');

    expect(notifyUserWhenConnectionGoesOfflineText).toBeInTheDocument();
    const pleaseSelectText1 = await screen.queryAllByRole('button', { name: 'Please select'}).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-connections');

    expect(pleaseSelectText1).toBeInTheDocument();
    await userEvent.click(pleaseSelectText1);
    const checkboxMessage1 = screen.queryAllByRole('listbox').find(eachOption => eachOption.getAttribute('role') === 'listbox');

    expect(checkboxMessage1).toBeInTheDocument();
    fireEvent.click(checkboxMessage1);
    const saveMessage = screen.getByText('Save');

    expect(saveMessage).toBeInTheDocument();
    await userEvent.click(saveMessage);
    await waitFor(() => {
      expect(mockNotificationUpdateFunction).toHaveBeenCalledTimes(1);
    });
  });
  test('Should able to access the Notification Drawer and notify the user when a connection throws error by selecting a connection and save and close the notication drawer', async () => {
    store();
    await initManageNotification({
      integrationId: '602aac4c53b612272ca1f54b',
    });

    expect(screen.getByText('Notify user of flow error')).toBeInTheDocument();

    expect(screen.getByText('Notify user when connection goes offline')).toBeInTheDocument();
    const pleaseSelectText = await screen.queryAllByRole('button', { name: 'Please select'}).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-connections');

    expect(pleaseSelectText).toBeInTheDocument();
    await userEvent.click(pleaseSelectText);
    const checkboxMessage = screen.getByRole('option', {name: 'Test Connection'});

    expect(checkboxMessage).toBeInTheDocument();
    fireEvent.click(checkboxMessage);
    const doneMessage = screen.getByText('Done');

    expect(doneMessage).toBeInTheDocument();
    await userEvent.click(doneMessage);
    const saveandcloseMessage = screen.getByText('Save & close');

    expect(saveandcloseMessage).toBeInTheDocument();
    await userEvent.click(saveandcloseMessage);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'RESOURCE_UPDATE_TILE_NOTIFICATIONS',
      resourcesToUpdate: {
        subscribedConnections: ['606aca53ba723015469f04aa'],
        subscribedFlows: [],
      },
      integrationId: '602aac4c53b612272ca1f54b',
      childId: undefined,
      userEmail: 'testuser+1@celigo.com',
      asyncKey: 'manageusernotifications',
    });
  });
  test('Should able to access the Notification Drawer and verify the connection and flow which have been selected by the user', async () => {
    store([
      {
        _id: '62c9d292886bf3359b079540',
        type: 'connection',
        _connectionId: '606aca53ba723015469f04aa',
        subscribedByUser: {
          name: 'Test User',
          email: 'testuser+1@celigo.com',
        },
      },
      {
        _id: '62c9d292886bf3359b079541',
        type: 'flow',
        _flowId: '5aaba8b53f358a48a041aa34',
        subscribedByUser: {
          name: 'Test User',
          email: 'testuser+1@celigo.com',
        },
      },
    ]);
    await initManageNotification({
      integrationId: '602aac4c53b612272ca1f54b',
    });

    expect(screen.getByText('Notify user of flow error')).toBeInTheDocument();

    expect(screen.getByText('Notify user of flow error')).toBeInTheDocument();

    expect(screen.getByText('Sample1')).toBeInTheDocument();

    expect(screen.getByText('Notify user when connection goes offline')).toBeInTheDocument();

    expect(screen.getByText('Test Connection')).toBeInTheDocument();
    const cancelText = screen.getByRole('button', {name: 'Close'});

    expect(cancelText).toBeInTheDocument();
  });
  test('Should able to access the Notification Drawer and remove the saved connection and flow which have been selected by the user and save', async () => {
    const mockNotificationUpdateFunction = jest.fn();

    mockPutRequestOnce('/api/notifications', (req, res, ctx) => {
      mockNotificationUpdateFunction();

      return res(ctx.json([]));
    });
    store([
      {
        _id: '62c9d292886bf3359b079540',
        type: 'connection',
        _connectionId: '606aca53ba723015469f04aa',
        subscribedByUser: {
          name: 'Test User',
          email: 'testuser+1@celigo.com',
        },
      },
      {
        _id: '62c9d292886bf3359b079541',
        type: 'flow',
        _flowId: '5aaba8b53f358a48a041aa34',
        subscribedByUser: {
          name: 'Test User',
          email: 'testuser+1@celigo.com',
        },
      },
    ]);
    await initManageNotification({
      integrationId: '602aac4c53b612272ca1f54b',
    });

    expect(screen.getByText('Notify user of flow error')).toBeInTheDocument();

    expect(screen.getByText('Notify user of flow error')).toBeInTheDocument();
    const flowSelected = screen.getByText('Sample1');

    expect(flowSelected).toBeInTheDocument();
    await userEvent.click(flowSelected);
    const checkboxMessage = screen.getByRole('option', {name: 'Sample1'});

    expect(checkboxMessage).toBeInTheDocument();
    fireEvent.click(checkboxMessage);
    const doneMessage = screen.getByText('Done');

    expect(doneMessage).toBeInTheDocument();
    await userEvent.click(doneMessage);

    expect(screen.getByText('Notify user when connection goes offline')).toBeInTheDocument();
    const connectionSelected = screen.getByText('Test Connection');

    expect(connectionSelected).toBeInTheDocument();
    await userEvent.click(connectionSelected);
    const checkboxMessage1 = screen.getByRole('option', {name: 'Test Connection'});

    expect(checkboxMessage1).toBeInTheDocument();
    fireEvent.click(checkboxMessage1);
    const doneButtonNode = screen.getByRole('button', {name: 'Done'});

    expect(doneButtonNode).toBeInTheDocument();
    await userEvent.click(doneButtonNode);
    await waitFor(() => expect(doneButtonNode).not.toBeInTheDocument());
    const saveText = await waitFor(() => screen.getByRole('button', {name: 'Save'}));

    expect(saveText).toBeInTheDocument();
  });
  test('Should able to access the Notification Drawer and remove the unsaved selected connection and flow which have been selected by the user and save', async () => {
    const mockNotificationUpdateFunction = jest.fn();

    mockPutRequestOnce('/api/notifications', (req, res, ctx) => {
      mockNotificationUpdateFunction();

      return res(ctx.json([]));
    });

    store();
    await initManageNotification({
      integrationId: '602aac4c53b612272ca1f54b',
    });

    expect(screen.getByText('Notify user of flow error')).toBeInTheDocument();

    expect(screen.getByText('Notify user of flow error')).toBeInTheDocument();
    const flowSelected = await screen.queryAllByRole('button', { name: 'Please select'}).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-flows');

    expect(flowSelected).toBeInTheDocument();
    await userEvent.click(flowSelected);
    const checkboxMessage = screen.queryAllByRole('option').find(eachOption => eachOption.getAttribute('data-value') === '5aabd0fdc69b4508218f832b');

    expect(checkboxMessage).toBeInTheDocument();
    fireEvent.click(checkboxMessage);
    const doneMessage = screen.getByRole('button', {name: 'Done'});

    expect(doneMessage).toBeInTheDocument();
    await userEvent.click(doneMessage);
    await waitFor(() => expect(doneMessage).not.toBeInTheDocument());
    const saveText = screen.getByRole('button', {name: 'Save'});

    expect(saveText).toBeInTheDocument();
    await userEvent.click(saveText);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'RESOURCE_UPDATE_TILE_NOTIFICATIONS',
      resourcesToUpdate: {
        subscribedConnections: [],
        subscribedFlows: ['5aabd0fdc69b4508218f832b'],
      },
      integrationId: '602aac4c53b612272ca1f54b',
      childId: undefined,
      userEmail: 'testuser+1@celigo.com',
      asyncKey: 'manageusernotifications',
    });
  });
  test('Should able to access the Notification Drawer and test it by using an invalid user and check when', async () => {
    const history = useHistory();

    jest.spyOn(reactRouterDom, 'useHistory').mockReturnValueOnce(history);
    store();

    mutateStore(initialStore, draft => {
      draft.data.integrationAShares = {
        '602aac4c53b612272ca1f54b': [{
          _id: '5ea6afa9cc041b3effb87105',
          accepted: true,
          accessLevel: 'administrator',
          sharedWithUser: {
            _id: '5d036cb0bb88170e9e00e6ac',
            email: 'testuser+2@celigo.com',
            name: 'Test User',
            accountSSOLinked: 'not_linked',
          },
        }],
      };
      draft.comms.networkComms = {
      };
    });

    await initManageNotification({
      integrationId: '602aac4c53b612272ca1f54b',
    });
    expect(history.replace).toHaveBeenCalled();
  });
});
