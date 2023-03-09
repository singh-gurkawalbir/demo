
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryHistory} from 'history';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import getRoutePath from '../../../../utils/routePaths';
import SuiteScriptTile from './SuiteScriptTile';
import { buildDrawerUrl } from '../../../../utils/rightDrawer';

const history = createMemoryHistory();

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

const cprops = {
  _integrationId: '62bedcdca0f5f21448171ea2',
  numError: 0,
  offlineConnections: [],
  displayName: 'Clone - demoint',
  description: 'demo integration',
  lastModified: '2022-07-05T06:02:56.701Z',
  sandbox: false,
  numFlows: 0,
  _parentId: null,
  mode: 'install',
  supportsChild: false,
  iaV2: false,
  trialEndDate: '2018-07-25T11:15:51.209Z',
  _connectorId: 'suitescript-salesforce-netsuite',
  ssLinkedConnectionId: '6141b16ad316a90f0c3b6d5d',
  _registeredConnectionIds: [
    '6141b16ad316a90f0c3b6d5d',
    '5e3152806287420d5ce56573',
  ],
  key: '62bedcdca0f5f21448171ea2',
  status: 'is_pending_setup',
  tag: 'sample tag',
  flowsNameAndDescription: '',
  sortablePropType: 0,
  integration: {
    permissions: {
      accessLevel: 'owner',
      connections: {
        edit: true,
      },
    },
  },
  applications: [],
  pinned: false,
};

function initSsTile(props = {}) {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
    draft.data.resources.connections = [{
      _id: '6141b16ad316a90f0c3b6d5d',
      createdAt: '2021-09-15T08:40:10.299Z',
      lastModified: '2022-04-19T20:24:45.997Z',
      type: 'http',
      name: 'ADP Workforce Now connection',
      assistant: 'adp',
      offline: props.status,
      netsuite: {account: '12345'},
    }];

    draft.user.preferences = {
      environment: 'production',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm:ss a',
      drawerOpened: true,
      expand: 'Resources',
      scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
      showReactSneakPeekFromDate: '2019-11-05',
      showReactBetaFromDate: '2019-12-26',
      defaultAShareId: 'own',
      dashboard: {
        view: 'tile',
        tilesOrder: [
          '62bedcdca0f5f21448171ea2',
          '62be9cf14a6daf23ece8ed33',
          '62beb29aa0f5f2144816f80c',
          '6253af74cddb8a1ba550a010',
        ],
      },
    };
    draft.user.profile = {
      _id: '62386a5fed961b5e22e992c7',
      name: 'Prashanth Kumar Nesa',
      email: 'prashanthkumar.nesa@celigo.com',
      role: 'engineering intern',
      company: 'celigo',
      phone: '7995045186',
      auth_type_google: {},
      timezone: 'Asia/Calcutta',
      developer: true,
      allowedToPublish: true,
      agreeTOSAndPP: true,
      createdAt: '2022-03-21T12:06:55.685Z',
      useErrMgtTwoDotZero: props.errmgt,
      authTypeSSO: null,
      emailHash: '087e41a1843139c27bce730b99664a84',
    };
  });

  return renderWithProviders(<Router history={history}><SuiteScriptTile {...props} /></Router>, {initialStore});
}
describe('SuiteScript Tile UI tests', () => {
  test('should display the information about the tile', () => {
    const props = {tile: cprops, status: true};

    initSsTile(props);
    expect(screen.getByText('Clone - demoint')).toBeInTheDocument();
    expect(screen.getByText('Continue setup', {exact: false})).toBeInTheDocument();
    expect(screen.getByText('Integration app')).toBeInTheDocument();
    expect(screen.getByText('Celigo')).toBeInTheDocument();
  });
  test('should redirect to the respective url when clicked on tile status', async () => {
    history.push = jest.fn();
    const props = {tile: cprops, status: true};

    initSsTile(props);
    await userEvent.click(screen.getByText('Continue setup', {exact: false}));
    waitFor(() => {
      expect(history.push).toBeCalledWith(getRoutePath(buildDrawerUrl({
        path: 'edit/:resourceType/:id',
        baseUrl: '/',
        params: { resourceType: 'connections', id: '6141b16ad316a90f0c3b6d5d' },
      })));
    });
  });
  test('should redirect to a different url,when ss linked connection is offline', async () => {
    history.push = jest.fn();
    cprops.offlineConnections = ['6141b16ad316a90f0c3b6d5d'];
    const props = {tile: cprops, status: false};

    initSsTile(props);
    await userEvent.click(screen.getByText('Continue setup', {exact: false}));
    expect(history.push).toBeCalledWith('/suitescript/6141b16ad316a90f0c3b6d5d/integrationapps/undefined/62bedcdca0f5f21448171ea2/dashboard');
  });
  test('should redirect to the tile when clicked on the tile dispay name', async () => {
    history.push = jest.fn();
    cprops.offlineConnections = [];
    const props = {tile: cprops, status: true};

    initSsTile(props);
    await userEvent.click(screen.getByText('Clone - demoint', {exact: false}));
    expect(history.push).toBeCalled();
  });
  test('should redirect to a different url when the sslinked connection is offline', async () => {
    history.push = jest.fn();
    cprops.offlineConnections = ['6141b16ad316a90f0c3b6d5d'];
    const props = {tile: cprops, status: false};

    initSsTile(props);
    await userEvent.click(screen.getByText('Clone - demoint', {exact: false}));
    expect(history.push).toBeCalledWith('/suitescript/6141b16ad316a90f0c3b6d5d/integrationapps/suitescript-salesforce-netsuite/setup');
  });
});
