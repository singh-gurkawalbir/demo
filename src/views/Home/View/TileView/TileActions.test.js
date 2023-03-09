import React from 'react';
import {screen} from '@testing-library/react';
import { Router } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import {createMemoryHistory} from 'history';
import userEvent from '@testing-library/user-event';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import TileActions from './TileActions';

const history = createMemoryHistory();

function initTileActions(props = {}) {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
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
          view: 'tile',
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
  });

  return renderWithProviders(<Router history={history}><TileActions {...props} /></Router>, {initialStore});
}

jest.mock('../../../../components/EllipsisActionMenu', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/EllipsisActionMenu'),
  default: props => (

    // eslint-disable-next-line react/button-has-type
    (props.actionsMenu.length < 2 ? <div>LESSOPTIONS</div> : <div><button onClick={props.onAction('generateTemplateZip')}>Download</button><button>CloneApp</button><button onClick={props.onAction('uninstallConnector')}>Delete</button><button onClick={props.onAction('deleteIntegration')}>DeleteDIY</button></div>)
  ),
}));
describe('TileActions UI tests', () => {
  const props = {tile: {
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
  }};
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should render the menu options analogous to EllipsisActionMenu', () => {
    initTileActions(props);
    expect(screen.getByText('Download')).toBeInTheDocument();     // buttons have been mocked out to check the functionality //
    expect(screen.getByText('CloneApp')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
  test('should run the respective function on clicking Download menuItem', async () => {
    initTileActions(props);
    await userEvent.click(screen.getByText('Download'));
    expect(mockDispatchFn).toBeCalled();
  });
  test('should run the respective function on clicking Delete menuItem', async () => {
    history.push = jest.fn();
    initTileActions(props);
    await userEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Delete')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Delete'));
    expect(mockDispatchFn).toBeCalled();
  });
  test('should display buttons for DIY templates and IA', async () => {
    initTileActions(props);
    await userEvent.click(screen.getByText('DeleteDIY'));
    expect(screen.getByText('Delete')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Delete'));
    expect(mockDispatchFn).toBeCalled();
  });
  test('should render empty DOM when rendered without any values in the store', () => {
    const {utils} = renderWithProviders(<Router history={history}><TileActions /></Router>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should not display the clone integration option for IA', () => {
    props.tile.isStandlone = true;
    props.tile._connectorId = '5b61ae4aeb538642c26bdbe6';
    // props.tile.name = 'Salesforce - NetSuite Connector';
    initTileActions(props);
    expect(screen.queryByText('CloneApp')).toBeNull();
    expect(screen.getByText(/LESSOPTIONS/i)).toBeInTheDocument();
  });
  test('should not display the clone integration option IA', () => {
    props.tile.isStandlone = true;
    props.tile._connectorId = '5b61ae4aeb538642c26bdbe6';
    props.tile.name = 'Salesforce - NetSuite Connector';
    initTileActions(props);
    expect(screen.getByText('CloneApp')).toBeInTheDocument();
    expect(screen.queryByText(/LESSOPTIONS/i)).toBeNull();
  });
});
