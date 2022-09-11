/* global describe, test, expect, afterEach, jest, afterAll */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, useHistory } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as reactRouterDom from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { reduxStore, renderWithProviders, mockPostRequestOnce, mockPutRequestOnce } from '../../../../test/test-utils';
import ManageNotificationsDrawer from '.';
import server, { runServer } from '../../../../test/api/server';
import actions from '../../../../actions';

const initialStore = reduxStore;

initialStore.getState().data.resources.connections = [{
  _id: '606aca53ba723015469f04aa',
  type: 'ftp',
  name: 'Test Connection',
  offline: false,
  _connectorId: '57c8199e8489cc1a298cc6ea',
  _integrationId: '602aac4c53b612272ca1f54b',
}];
initialStore.getState().data.resources.flows = [
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
initialStore.getState().data.integrationAShares = {
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
initialStore.getState().session.loadResources = [{
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
initialStore.getState().user.profile = {
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
initialStore.getState().user.preferences = {
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
initialStore.getState().data.resources.integrations = [{
  _id: '602aac4c53b612272ca1f54b',
  lastModified: '2018-07-03T12:08:00.302Z',
  name: 'Dummy1',
  description: 'Add this',
  sandbox: false,
  _registeredConnectionIds: [
    '606aca53ba723015469f04aa',
  ],
}];
initialStore.getState().comms.networkComms = {
  'put:/notifications': {
    status: 'success',
    hidden: false,
    refresh: false,
    method: 'put',
  },
};

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
  afterEach(() => {
    cleanup();
  });
  afterAll(done => {
    server.close();
    done();
  });
  test('Should able to access the Notification Drawer and notify the user when a flow throws error by selecting a flow and save the notication drawer', async () => {
    const props = {
      integrationId: '602aac4c53b612272ca1f54b',
    };
    const mockResolverFunction = jest.fn();
    const mockNotificationUpdateFunction = jest.fn();

    mockPostRequestOnce('/api/fieldHelp', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    });
    mockPutRequestOnce('/api/notifications', (req, res, ctx) => {
      mockNotificationUpdateFunction();

      return res(ctx.json([]));
    });

    await initManageNotification(props);

    expect(screen.getByText('Notify user on flow error')).toBeInTheDocument();
    const svg = document.querySelector("[viewBox='0 0 24 24']");

    expect(svg).toBeInTheDocument();
    userEvent.click(svg);

    expect(screen.getByText("Please choose 'All flows' to receive an email notification whenever any flow in this integration has a job error, or select individual flows to focus your email traffic to just higher priority data flows.")).toBeInTheDocument();

    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    const helpTextYesButton = screen.getByText('Yes');

    expect(helpTextYesButton).toBeInTheDocument();
    userEvent.click(helpTextYesButton);
    userEvent.click(svg);
    const helpTextNoButton = screen.getByText('No');

    expect(helpTextNoButton).toBeInTheDocument();
    userEvent.click(helpTextNoButton);
    fireEvent.change(screen.queryByPlaceholderText(/How can we make this information more helpful?/i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);
    await waitFor(() => {
      expect(mockResolverFunction).toHaveBeenCalledTimes(2);
    });
    const pleaseSelectText = await screen.queryAllByRole('button', { name: 'Please select'}).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-flows');

    expect(pleaseSelectText).toBeInTheDocument();
    userEvent.click(pleaseSelectText);
    const checkboxMessage = screen.getByRole('option', {name: 'All flows'});

    expect(checkboxMessage).toBeInTheDocument();
    fireEvent.click(checkboxMessage);
    const doneMessage = screen.getByText('Done');

    expect(doneMessage).toBeInTheDocument();
    userEvent.click(doneMessage);
    const notifyUserWhenConnectionGoesOfflineText = screen.getByText('Notify user when connection goes offline');

    expect(notifyUserWhenConnectionGoesOfflineText).toBeInTheDocument();
    const pleaseSelectText1 = await screen.queryAllByRole('button', { name: 'Please select'}).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-connections');

    expect(pleaseSelectText1).toBeInTheDocument();
    userEvent.click(pleaseSelectText1);
    const checkboxMessage1 = screen.queryAllByRole('listbox').find(eachOption => eachOption.getAttribute('role') === 'listbox');

    expect(checkboxMessage1).toBeInTheDocument();
    fireEvent.click(checkboxMessage1);
    const saveMessage = screen.getByText('Save');

    expect(saveMessage).toBeInTheDocument();
    userEvent.click(saveMessage);
    await waitFor(() => {
      expect(mockNotificationUpdateFunction).toHaveBeenCalledTimes(1);
    });
  });
  test('Should able to access the Notification Drawer and notify the user when a connection throws error by selecting a connection and save and close the notication drawer', async () => {
    const props = {
      integrationId: '602aac4c53b612272ca1f54b',
    };
    const { store } = await initManageNotification(props);

    expect(screen.getByText('Notify user on flow error')).toBeInTheDocument();
    const svg = document.querySelector("[viewBox='0 0 24 24']");

    expect(svg).toBeInTheDocument();
    userEvent.click(svg);

    expect(screen.getByText("Please choose 'All flows' to receive an email notification whenever any flow in this integration has a job error, or select individual flows to focus your email traffic to just higher priority data flows.")).toBeInTheDocument();

    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    const helpTextYesButton = screen.getByText('Yes');

    expect(helpTextYesButton).toBeInTheDocument();
    userEvent.click(helpTextYesButton);
    userEvent.click(svg);
    const helpTextNoButton = screen.getByText('No');

    expect(helpTextNoButton).toBeInTheDocument();
    userEvent.click(helpTextNoButton);
    fireEvent.change(screen.queryByPlaceholderText(/How can we make this information more helpful?/i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);

    expect(screen.getByText('Notify user when connection goes offline')).toBeInTheDocument();
    const pleaseSelectText = await screen.queryAllByRole('button', { name: 'Please select'}).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-connections');

    expect(pleaseSelectText).toBeInTheDocument();
    userEvent.click(pleaseSelectText);
    const checkboxMessage = screen.getByRole('option', {name: 'Test Connection'});

    expect(checkboxMessage).toBeInTheDocument();
    fireEvent.click(checkboxMessage);
    const doneMessage = screen.getByText('Done');

    expect(doneMessage).toBeInTheDocument();
    userEvent.click(doneMessage);
    const saveandcloseMessage = screen.getByText('Save & close');

    expect(saveandcloseMessage).toBeInTheDocument();
    userEvent.click(saveandcloseMessage);
    store.dispatch(actions.api.complete('/notifications', 'put'));
  });
  test('Should able to access the Notification Drawer and verify the connection and flow which have been selected by the user', async () => {
    initialStore.getState().data.resources.notifications = [
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
    ];
    const props = {
      integrationId: '602aac4c53b612272ca1f54b',
    };

    await initManageNotification(props);

    expect(screen.getByText('Notify user on flow error')).toBeInTheDocument();
    const svg = document.querySelector("[viewBox='0 0 24 24']");

    expect(svg).toBeInTheDocument();
    userEvent.click(svg);

    expect(screen.getByText("Please choose 'All flows' to receive an email notification whenever any flow in this integration has a job error, or select individual flows to focus your email traffic to just higher priority data flows.")).toBeInTheDocument();

    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    const helpTextYesButton = screen.getByText('Yes');

    expect(helpTextYesButton).toBeInTheDocument();
    userEvent.click(helpTextYesButton);
    userEvent.click(svg);
    const helpTextNoButton = screen.getByText('No');

    expect(helpTextNoButton).toBeInTheDocument();
    userEvent.click(helpTextNoButton);
    fireEvent.change(screen.queryByPlaceholderText(/How can we make this information more helpful?/i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);

    expect(screen.getByText('Notify user on flow error')).toBeInTheDocument();

    expect(screen.getByText('Sample1')).toBeInTheDocument();

    expect(screen.getByText('Notify user when connection goes offline')).toBeInTheDocument();

    expect(screen.getByText('Test Connection')).toBeInTheDocument();
    const cancelText = screen.getByRole('button', {name: 'Close'});

    expect(cancelText).toBeInTheDocument();
  });
  test('Should able to access the Notification Drawer and remove the saved connection and flow which have been selected by the user and save', async () => {
    initialStore.getState().data.resources.notifications = [
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
    ];
    const mockNotificationUpdateFunction = jest.fn();

    mockPutRequestOnce('/api/notifications', (req, res, ctx) => {
      mockNotificationUpdateFunction();

      return res(ctx.json([]));
    });
    const props = {
      integrationId: '602aac4c53b612272ca1f54b',
    };

    await initManageNotification(props);

    expect(screen.getByText('Notify user on flow error')).toBeInTheDocument();
    const svg = document.querySelector("[viewBox='0 0 24 24']");

    expect(svg).toBeInTheDocument();
    userEvent.click(svg);

    expect(screen.getByText("Please choose 'All flows' to receive an email notification whenever any flow in this integration has a job error, or select individual flows to focus your email traffic to just higher priority data flows.")).toBeInTheDocument();

    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    const helpTextYesButton = screen.getByText('Yes');

    expect(helpTextYesButton).toBeInTheDocument();
    userEvent.click(helpTextYesButton);
    userEvent.click(svg);
    const helpTextNoButton = screen.getByText('No');

    expect(helpTextNoButton).toBeInTheDocument();
    userEvent.click(helpTextNoButton);
    fireEvent.change(screen.queryByPlaceholderText(/How can we make this information more helpful?/i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);

    expect(screen.getByText('Notify user on flow error')).toBeInTheDocument();
    const flowSelected = screen.getByText('Sample1');

    expect(flowSelected).toBeInTheDocument();
    userEvent.click(flowSelected);
    const checkboxMessage = screen.getByRole('option', {name: 'Sample1'});

    expect(checkboxMessage).toBeInTheDocument();
    fireEvent.click(checkboxMessage);
    const doneMessage = screen.getByText('Done');

    expect(doneMessage).toBeInTheDocument();
    userEvent.click(doneMessage);

    expect(screen.getByText('Notify user when connection goes offline')).toBeInTheDocument();
    const connectionSelected = screen.getByText('Test Connection');

    expect(connectionSelected).toBeInTheDocument();
    userEvent.click(connectionSelected);
    const checkboxMessage1 = screen.getByRole('option', {name: 'Test Connection'});

    expect(checkboxMessage1).toBeInTheDocument();
    fireEvent.click(checkboxMessage1);
    const doneButtonNode = screen.getByRole('button', {name: 'Done'});

    expect(doneButtonNode).toBeInTheDocument();
    userEvent.click(doneButtonNode);
    await waitFor(() => expect(doneButtonNode).not.toBeInTheDocument());
    const saveText = screen.getByRole('button', {name: 'Save'});

    expect(saveText).toBeInTheDocument();
  });
  test('Should able to access the Notification Drawer and remove the unsaved selected connection and flow which have been selected by the user and save', async () => {
    const mockNotificationUpdateFunction = jest.fn();

    initialStore.getState().data.resources.notifications = [
    ];
    mockPutRequestOnce('/api/notifications', (req, res, ctx) => {
      mockNotificationUpdateFunction();

      return res(ctx.json([]));
    });
    const props = {
      integrationId: '602aac4c53b612272ca1f54b',
    };

    await initManageNotification(props);

    expect(screen.getByText('Notify user on flow error')).toBeInTheDocument();
    const svg = document.querySelector("[viewBox='0 0 24 24']");

    expect(svg).toBeInTheDocument();
    userEvent.click(svg);

    expect(screen.getByText("Please choose 'All flows' to receive an email notification whenever any flow in this integration has a job error, or select individual flows to focus your email traffic to just higher priority data flows.")).toBeInTheDocument();

    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    const helpTextYesButton = screen.getByText('Yes');

    expect(helpTextYesButton).toBeInTheDocument();
    userEvent.click(helpTextYesButton);
    userEvent.click(svg);
    const helpTextNoButton = screen.getByText('No');

    expect(helpTextNoButton).toBeInTheDocument();
    userEvent.click(helpTextNoButton);
    fireEvent.change(screen.queryByPlaceholderText(/How can we make this information more helpful?/i), {
      target: {value: 'Hey! cool'},
    });
    const submitText = screen.getByText('Submit');

    expect(submitText).toBeInTheDocument();
    userEvent.click(submitText);

    expect(screen.getByText('Notify user on flow error')).toBeInTheDocument();
    const flowSelected = await screen.queryAllByRole('button', { name: 'Please select'}).find(eachOption => eachOption.getAttribute('id') === 'mui-component-select-flows');

    expect(flowSelected).toBeInTheDocument();
    userEvent.click(flowSelected);
    const checkboxMessage = screen.queryAllByRole('option').find(eachOption => eachOption.getAttribute('data-value') === '5aabd0fdc69b4508218f832b');

    expect(checkboxMessage).toBeInTheDocument();
    fireEvent.click(checkboxMessage);
    const doneMessage = screen.getByRole('button', {name: 'Done'});

    expect(doneMessage).toBeInTheDocument();
    userEvent.click(doneMessage);
    await waitFor(() => expect(doneMessage).not.toBeInTheDocument());
    const saveText = screen.getByRole('button', {name: 'Save'});

    expect(saveText).toBeInTheDocument();
  });
  test('Should able to access the Notification Drawer and test it by using an invalid user and check when', async () => {
    const props = {
      integrationId: '602aac4c53b612272ca1f54b',
    };
    const history = useHistory();

    jest.spyOn(reactRouterDom, 'useHistory').mockReturnValueOnce(history);

    initialStore.getState().data.integrationAShares = {
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
    initialStore.getState().comms.networkComms = {
    };
    await initManageNotification(props);
    expect(history.replace).toHaveBeenCalled();
  });
});
