/* global describe, test, expect, */
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import HomeCard from './HomeCard';

const cprops = {sortedTiles: [
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
    key: '62be9cf14a6daf23ece8ed33',
    status: 'is_pending_setup',
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
  },
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
    key: '62bedcdca0f5f21448171ea2',
    status: 'is_pending_setup',
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
    key: '62beb29aa0f5f2144816f80c',
    status: 'is_pending_setup',
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
    key: '6253af74cddb8a1ba550a010',
    status: 'has_errors',
    flowsNameAndDescription: '',
    sortablePropType: 1,
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
  },
]};

function initHomeCard(props = []) {
  const initialStore = getCreatedStore();

  //   initialStore.getState().data.resources
  initialStore.getState().user = {
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
    //   dashboard: {
    //     view: 'list',
    //   },
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
    notifications: {
      accounts: [],
      stacks: [],
      transfers: [],
    },
    org: {
      users: [],
      accounts: [
        {
          _id: 'own',
          accessLevel: 'owner',
          ownerUser: {
            licenses: [
              {
                _id: '62386a5fed961b5e22e992c8',
                created: '2022-03-21T12:06:55.696Z',
                lastModified: '2022-03-21T12:06:55.707Z',
                type: 'endpoint',
                tier: 'free',
                supportTier: 'essential',
                sandbox: false,
                endpoint: {
                  production: {
                    numEndpoints: 2,
                    numAddOnEndpoints: 0,
                    numFlows: 1,
                    numAddOnFlows: 0,
                    numTradingPartners: 0,
                    numAddOnTradingPartners: 0,
                    numAgents: 0,
                    numAddOnAgents: 0,
                  },
                  sandbox: {
                    numEndpoints: 0,
                    numAddOnEndpoints: 0,
                    numFlows: 0,
                    numAddOnFlows: 0,
                    numTradingPartners: 0,
                    numAddOnTradingPartners: 0,
                    numAgents: 0,
                    numAddOnAgents: 0,
                  },
                  apiManagement: false,
                },
                resumable: false,
              },
              {
                _id: '6254397e22a35c0de1fc245e',
                created: '2022-04-11T14:21:50.104Z',
                lastModified: '2022-04-11T14:21:50.111Z',
                expires: '2022-05-11T14:21:50.103Z',
                type: 'integrationApp',
                _connectorId: '6253b0cbcddb8a1ba550a048',
                sandbox: false,
              },
              {
                _id: '625e3e1b26f1473265febe40',
                created: '2022-04-19T04:44:11.022Z',
                lastModified: '2022-04-19T04:44:11.030Z',
                expires: '2022-05-19T04:44:11.022Z',
                type: 'integrationApp',
                _connectorId: '6253b0cbcddb8a1ba550a048',
                sandbox: false,
              },
            ],
          },
        },
      ],
    },
    debug: false,
  };

  return (renderWithProviders(<MemoryRouter><HomeCard {...props} /></MemoryRouter>), {initialStore});
}
describe('HomeCard UI tests', () => {
  test('should display the contents of the tiles passed as props', () => {
    initHomeCard(cprops);
    expect(screen.getByText('demoint')).toBeInTheDocument();
    expect(screen.getByText(/Data Warehouse/i, {exact: false})).toBeInTheDocument();
    expect(screen.getByText(/1 flow/i)).toBeInTheDocument();
    expect(screen.getByText(/1 error/i)).toBeInTheDocument();
    const statusMssg = screen.getAllByText(/Continue setup >/i);

    expect(statusMssg).toHaveLength(3);
    screen.debug(null, Infinity);
  });
  test('should render empty DOM when no props are passed', () => {
    const props = {sortedTiles: []};
    const {utils} = renderWithProviders(<MemoryRouter><HomeCard {...props} /></MemoryRouter>);

    expect(utils.container).toContainHTML('<div><div class="makeStyles-pageWrapper-52"><ul class="makeStyles-listContainer-55 makeStyles-container-51" /></div></div>'); // blank html tags//
  });
});
