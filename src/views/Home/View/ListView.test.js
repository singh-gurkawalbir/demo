
import React from 'react';
import {screen} from '@testing-library/react';
import { Router } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryHistory} from 'history';
import ListView from './ListView';
import {mutateStore, renderWithProviders} from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';

function initListView(props = {}) {
  const initialStore = getCreatedStore();
  const history = createMemoryHistory();

  mutateStore(initialStore, draft => {
    draft.data.resources.connections = [
      {
        _id: '62bd43c87b94d20de64e9ab3',
        createdAt: '2022-06-30T06:33:44.780Z',
        lastModified: '2022-06-30T06:33:44.870Z',
        type: 'http',
        name: 'demo',
        sandbox: false,
        http: {
          formType: 'rest',
          mediaType: 'json',
          baseURI: 'https://3jno0syp47.execute-api.us-west-2.amazonaws.com/test/orders',
          unencrypted: {
            field: 'value',
          },
          encrypted: '******',
          auth: {
            type: 'basic',
            basic: {
              username: 'demo',
              password: '******',
            },
          },
        },
      },
    ];
    draft.data.resources.tiles = props.tiles;
    draft.user = {
      preferences: {
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
          view: 'list',
        },
      },
      profile: {
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
        useErrMgtTwoDotZero: true,
        authTypeSSO: null,
        emailHash: '087e41a1843139c27bce730b99664a84',
      },
      debug: false,
    };
  });

  return renderWithProviders(<Router history={history}><ListView {...props} /></Router>, {initialStore});
}

jest.mock('../../../components/ResourceTableWrapper/ResourceEmptyState', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/ResourceTableWrapper/ResourceEmptyState'),
  default: () =>
    (
      <>
        <div>
          ResourceEmptyState
        </div>
      </>
    )
  ,
}));
const tile = [
  {
    _integrationId: '62be9cf14a6daf23ece8ed33',
    numError: 0,
    offlineConnections: [],
    name: 'Clone - demoint',
    description: 'demo integration',
    lastModified: '2022-07-01T07:53:19.652Z',
    sandbox: false,
    numFlows: 0,
    _parentId: null,
    mode: 'install',
    supportsChild: false,
    iaV2: false,
    _registeredConnectionIds: [
      '62bd43c87b94d20de64e9ab3',
    ],
  },
];

describe('ListView UI tests', () => {
  test('should display the RowHeaders of the listView', () => {
    const props = {tiles: tile};

    initListView(props);
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Applications/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Last open error/i)).toBeInTheDocument();
    expect(screen.getByText(/Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Actions/i)).toBeInTheDocument();
  });
  test('should render the tile info', () => {
    const props = {tiles: tile};

    initListView(props);
    expect(screen.getByText(/Clone - demoint/i, {exact: false})).toBeInTheDocument();
    expect(screen.getByText(/Continue setup/i, {exact: false})).toBeInTheDocument();
    expect(screen.getByText(/Custom/i)).toBeInTheDocument();
    expect(screen.getByText(/0 flows/i)).toBeInTheDocument();
  });
  test('should render empty message when no data is passed', () => {
    const props = {tiles: []};

    initListView(props);
    expect(screen.getByText('ResourceEmptyState')).toBeInTheDocument();
  });
});
