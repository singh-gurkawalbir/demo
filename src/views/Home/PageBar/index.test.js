/* global describe, test, expect, beforeEach */
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import IntegrationCeligoPageBar from '.';
import {renderWithProviders} from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';

function initPagebar(props = {}) {
  const initialStore = getCreatedStore();

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

  return renderWithProviders((<MemoryRouter><IntegrationCeligoPageBar {...props} /></MemoryRouter>), {initialStore});
}
jest.mock('../../../components/KeywordSearch', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/KeywordSearch'),
  default: props => (
    <>
      <div>SearchBar</div>
    </>
  ),
}));
jest.mock('../../../components/icons/TilesViewIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/icons/TilesViewIcon'),
  default: props => (
    <>
      <div>TileButton</div>
    </>
  ),
}));
jest.mock('../../../components/icons/ListViewIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/icons/ListViewIcon'),
  default: props => (
    <>
      <div>ListButton</div>
    </>
  ),
}));
describe('Celigo Home Pagebar UI tests', () => {
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
  test('should display all the contents of the pagebar', () => {
    initPagebar();
    expect(screen.getByText(/My integrations/i)).toBeInTheDocument();
    expect(screen.getByText(/Create flow/i)).toBeInTheDocument();
    expect(screen.getByText(/Create integration/i)).toBeInTheDocument();
    expect(screen.getByText(/Install integration/i)).toBeInTheDocument();
  });
  test('should redirect to the respective components when clicked on create flow and create integration buttons', () => {
    initPagebar();
    // expect(screen.getByText(/Create flow/i)).to();
    expect(screen.getByText(/Create integration/i)).toBeInTheDocument();
  });
  test('should render the globalsearch bar', () => {
    initPagebar();
    expect(screen.getByText(/SearchBar/i)).toBeInTheDocument();         // SearchBar text comes from the mocked component//
  });
  test('should make the respective dispatch calls for the listview and gridview iconbuttons', () => {
    initPagebar();
    userEvent.click(screen.getByText('TileButton'));
    expect(mockDispatchFn).toBeCalled();
    screen.debug(undefined, 300000);
    userEvent.click(screen.getByText('ListButton'));
    expect(mockDispatchFn).toBeCalled();
  });
  test('should ', () => {
    initPagebar();
    userEvent.click(screen.getByText(/Create flow/i));
    screen.debug(undefined, 300000);
  });
});
