/* global describe, test, afterEach, beforeEach, jest, expect */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { cleanup, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { runServer } from '../../../../test/api/server';
// eslint-disable-next-line import/no-extraneous-dependencies
import { reduxStore, renderWithProviders } from '../../../../test/test-utils';
import ViewNotificationsDrawer from '.';

function initViewNotification(props = {}) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources.notifications = [
    {
      _id: '62cc4c0e70b1915aa176e5b8',
      type: 'connection',
      _connectionId: '61b20e032e84a42ca17106cf',
      subscribedByUser: {
        name: 'Test User',
        email: 'testuser+1@celigo.com',
      },
    },
    {
      _id: '62cc4c0e70b1915aa176e5b9',
      type: 'flow',
      _flowId: '62a6d47f6e4b5b50f556084d',
      subscribedByUser: {
        name: 'Test User',
        email: 'testuser+1@celigo.com',
      },
    },
  ];
  initialStore.getState().data.resources.flows = [
    {
      _id: '62c17e749666a20255163c0d',
      lastModified: '2022-07-11T18:32:35.374Z',
      name: 'Automation flow  [Jira - Testrail] to update the Automation status',
      disabled: false,
      _integrationId: '62c17d1a2a8ce51203950e51',
    },
    {
      _id: '62c280e89666a2025516d064',
      lastModified: '2022-07-04T06:11:43.082Z',
      name: 'Load JIRA data [Khaisar] - M2 [TestRail]',
      disabled: false,
      _integrationId: '62c17d1a2a8ce51203950e51',
    },
    {
      _id: '62a6d47f6e4b5b50f556084d',
      lastModified: '2022-07-04T05:55:00.650Z',
      name: 'Load JIRA data [Khaisar] - WA',
      disabled: false,
      _integrationId: '62c17d1a2a8ce51203950e51',
      skipRetries: false,
    },
  ];
  initialStore.getState().data.integrationAShares = {
    '62c17d1a2a8ce51203950e51': [
      {
        _id: '613716c0cb41a913fbf3159b',
        accepted: true,
        accessLevel: 'administrator',
        accountSSORequired: false,
        sharedWithUser: {
          _id: '5d036cb0bb88170e9e00e6ac',
          email: 'testuser+1@celigo.com',
          name: 'Test User',
          accountSSOLinked: 'not_linked',
        },
      },
    ],
  };
  initialStore.getState().user.profile = [{
    _id: '6040b91267059b24eb522db6',
    name: 'Chaitanya Reddy',
    email: 'chaitanyareddy.mule+1@celigo.com',
    role: 'Assosiate Software Analyst',
    company: 'Celigo',
    phone: '1234567890',
    auth_type_google: {},
    agreeTOSAndPP: true,
    createdAt: '2021-03-04T10:40:18.812Z',
    authTypeSSO: null,
    emailHash: '54d80e4bf5ffc62eaf499d16e7e400a8',
  }];
  initialStore.getState().user.org.users = [{
    _id: '5ea6afa9cc041b3effb87105',
    accepted: true,
    accessLevel: 'administrator',
    sharedWithUser: {
      _id: '5d036cb0bb88170e9e00e6ac',
      email: 'testuser+1@celigo.com',
      name: 'Test user',
      accountSSOLinked: 'not_linked',
    },
  }];
  initialStore.getState().data.resources.integrations = [
    {
      _id: '62c17d1a2a8ce51203950e51',
      lastModified: '2022-07-03T12:19:25.647Z',
      name: 'JIRA Required',
      description: 'Contains all the custom flows linking with JIRA integration',
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '61b20e032e84a42ca17106cf',
        '62c1894d2a8ce5120395154c',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2022-07-03T11:27:22.346Z',
    },
  ];
  initialStore.getState().data.resources.connections = [
    {
      _id: '61b20e032e84a42ca17106cf',
      createdAt: '2021-12-09T14:09:07.482Z',
      lastModified: '2022-07-03T14:48:18.315Z',
      type: 'rest',
      name: 'JIRA Automation',
      assistant: 'jira',
      debugDate: '2022-07-03T15:03:17.961Z',
      sandbox: false,
      debugUntil: '2022-07-03T15:03:17.961Z',
      isHTTP: true,
      http: {
        formType: 'assistant',
        mediaType: 'json',
        baseURI: 'https://celigo.atlassian.net/',
        ping: {
          relativeURI: '/',
          method: 'GET',
        },
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
        ],
        auth: {
          type: 'basic',
          basic: {
            username: 'khaisar.ahmad@celigo.com',
            password: '******',
          },
        },
      },
      rest: {
        baseURI: 'https://celigo.atlassian.net/',
        isHTTPProxy: true,
        mediaType: 'json',
        authType: 'basic',
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
        ],
        encryptedFields: [],
        unencryptedFields: [],
        scope: [],
        pingRelativeURI: '/',
        pingSuccessValues: [],
        pingFailureValues: [],
        pingMethod: 'GET',
        refreshTokenHeaders: [],
        basicAuth: {
          username: 'khaisar.ahmad@celigo.com',
          password: '******',
        },
      },
    },
    {
      _id: '62c1894d2a8ce5120395154c',
      createdAt: '2022-07-03T12:19:25.405Z',
      lastModified: '2022-07-07T16:16:34.466Z',
      type: 'http',
      name: 'Test Rail HTTP Connection',
      debugDate: '2022-07-07T16:31:33.722Z',
      sandbox: false,
      debugUntil: '2022-07-07T16:31:33.722Z',
      http: {
        formType: 'http',
        mediaType: 'json',
        baseURI: 'https://celigo.testrail.io/index.php?/api/v2',
        ping: {
          relativeURI: '/get_projects',
          method: 'GET',
        },
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
        ],
        unencrypted: {
          field: 'value',
        },
        encrypted: '******',
        auth: {
          type: 'basic',
          basic: {
            username: 'khaisar.ahmad@celigo.com',
            password: '******',
          },
        },
      },
    },
  ];
  initialStore.getState().user.preferences = {
    environment: 'production',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm:ss a',
    scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
    showReactSneakPeekFromDate: '2019-11-05',
    showReactBetaFromDate: '2019-12-26',
    defaultAShareId: '62cc4933e5b9204a59045ae8',
    expand: 'Resources',
    accounts: {
      '6040b99a7671bb3ddf6a368b': {
        drawerOpened: true,
        fbBottomDrawerHeight: 257,
        expand: null,
        dashboard: {
          view: 'tile',
        },
      },
      '61c45e7b11cd027c01583984': {
        expand: null,
      },
    },
  };

  const ui = (
    <MemoryRouter
      initialEntries={[{ pathname: props.url }]}
    >
      <Route
        path="integrations/62c17d1a2a8ce51203950e51/users/ui-drawer/:userEmail/notifications"
        params={{userEmail: props.userEmail}}
      >
        <ViewNotificationsDrawer {...props} />
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
describe('View Notifications', () => {
  runServer();
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => { jest.clearAllTimers(); cleanup; });
  test('Should render the view notification right drawer', async () => {
    await initViewNotification({
      integrationId: '62c17d1a2a8ce51203950e51',
      userEmail: 'testuser+1@celigo.com',
      url: 'integrations/62c17d1a2a8ce51203950e51/users/ui-drawer/testuser+1@celigo.com/notifications',
    });

    expect(screen.getByText('Subscribed flows')).toBeInTheDocument();

    expect(screen.getByText('Load JIRA data [Khaisar] - WA')).toBeInTheDocument();

    expect(screen.getByText('Subscribed connections')).toBeInTheDocument();
    const connections = screen.getByText('JIRA Automation');

    expect(connections).toBeInTheDocument();
  });
  test('Should render the view notification right drawer with in valid user email', async () => {
    const { utils } = await initViewNotification({
      integrationId: '62c17d1a2a8ce51203950e51',
      userEmail: 'testuser+2@test.com',
      url: 'integrations/62c17d1a2a8ce51203950e51/users/ui-drawer/testuser+2@celigo.com/notifications',
    });

    expect(utils.container).toBeEmptyDOMElement();
  });
});
