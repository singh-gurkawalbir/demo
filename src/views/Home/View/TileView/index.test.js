
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import TileView from './index';

const demotiles = [
  {
    _integrationId: '62bedcdca0f5f21448171ea2',
    numError: 0,
    offlineConnections: [],
    name: 'Clone - demoint',
    description: 'demo integration',
    lastModified: '2022-07-05T06:02:56.701Z',
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
  {
    _integrationId: '62beb29aa0f5f2144816f80c',
    numError: 0,
    offlineConnections: [],
    name: 'Data Warehouse Automation for Snowflake',
    description: 'For companies using Snowflake as a Data Warehouse, this Business Process Automation provides a seamless data load from different data sources like Shopify, Magento, HubSpot, BigCommerce, Zendesk and more.',
    lastModified: '2022-07-01T08:39:31.036Z',
    sandbox: false,
    numFlows: 0,
    _parentId: null,
    mode: 'install',
    supportsChild: false,
    iaV2: false,
    _templateId: '611f3bc1e3488c6cb37b8bc0',
    _registeredConnectionIds: [
      '62beb2c2a0f5f2144816f818',
    ],
  },
  {
    _integrationId: '6253af74cddb8a1ba550a010',
    numError: 1,
    offlineConnections: [],
    name: 'demoint',
    description: 'demo integration',
    lastModified: '2022-06-30T06:39:32.607Z',
    sandbox: false,
    numFlows: 1,
    _parentId: null,
    supportsChild: false,
    iaV2: false,
    _registeredConnectionIds: [
      '62bd43c87b94d20de64e9ab3',
      '62bd452420ecb90e02f2a6f0',
    ],
    lastErrorAt: '2022-07-07T14:46:36.382Z',
  },
];

function initTileView(props = {}) {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
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
          tilesOrder: [
            '62bedcdca0f5f21448171ea2',
            '62be9cf14a6daf23ece8ed33',
            '62beb29aa0f5f2144816f80c',
            '6253af74cddb8a1ba550a010',
          ],
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

    draft.session.filters = props.obj;
  });

  return renderWithProviders(<MemoryRouter><TileView /></MemoryRouter>, {initialStore});
}
jest.mock('./HomeCard', () => ({
  __esModule: true,
  ...jest.requireActual('./HomeCard'),
  default: () =>
    (
      <>
        <div>
          HomeCard
        </div>
      </>
    )
  ,
}));

jest.mock('../../../../components/ResourceTableWrapper/ResourceEmptyState', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/ResourceTableWrapper/ResourceEmptyState'),
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

describe('TileView UI tests', () => {
  test('should render HomeCard when tiles are present in the store', () => {
    initTileView({tiles: demotiles, obj: {}});
    expect(screen.getByText('HomeCard')).toBeInTheDocument();
  });
  test('should render ResourceEmptyState when tiles are not present in the state', () => {
    initTileView({tiles: []});
    expect(screen.getByText('ResourceEmptyState')).toBeInTheDocument();
  });
  test('should display the no result search message when filtered tiles are empty', () => {
    initTileView({tiles: demotiles, obj: {homeTiles: {applications: ['salesforce,shopify']}}});
    expect(screen.getByText('Your search didn’t return any matching results. Try expanding your search criteria.')).toBeInTheDocument();
  });
});
