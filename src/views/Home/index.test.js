/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import Dashboard from './index';
import {renderWithProviders} from '../../test/test-utils';
import { getCreatedStore } from '../../store';
import actions from '../../actions';

jest.mock('./InstallZip', () => ({
  __esModule: true,
  ...jest.requireActual('./InstallZip'),
  default: () => (
    <>
      <div>InstallZip</div>
    </>
  ),
}));
jest.mock('../../components/drawer/Resource', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/drawer/Resource'),
  default: () => (
    <>
      <div>ResourceDrawer</div>
    </>
  ),
}));
jest.mock('../../components/drawer/Install/Integration', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/drawer/Install/Integration'),
  default: () => (
    <>
      <div>InstallIntegration</div>
    </>
  ),
}));
jest.mock('./OfflineConnectionDrawer', () => ({
  __esModule: true,
  ...jest.requireActual('./OfflineConnectionDrawer'),
  default: () => (
    <>
      <div>OfflineConnectionDrawer</div>
    </>
  ),
}));
jest.mock('./PageBar', () => ({
  __esModule: true,
  ...jest.requireActual('./PageBar'),
  default: () => (
    <>
      <div>PageBar</div>
    </>
  ),
}));
jest.mock('./View', () => ({
  __esModule: true,
  ...jest.requireActual('./View'),
  default: () => (
    <>
      <div>HomeView</div>
    </>
  ),
}));

function initDashboard() {
  const initialStore = getCreatedStore();

  initialStore.getState().data.resources.integrations = {
    _id: '62beb29aa0f5f2144816f80c',
    lastModified: '2022-07-01T08:39:31.036Z',
    name: 'Data Warehouse Automation for Snowflake',
    mode: 'install',
    version: '1.0.0',
    sandbox: false,
    _registeredConnectionIds: [
      '62beb2c2a0f5f2144816f818',
    ],
    _templateId: '611f3bc1e3488c6cb37b8bc0',
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2022-07-01T08:38:50.705Z',
    _sourceId: '611f3e5482edfc2c354dd721',
  };
  initialStore.getState().data.resources.connections = [{
    _id: '62beb2c2a0f5f2144816f818',
    createdAt: '2022-07-01T08:39:30.787Z',
    lastModified: '2022-07-04T02:51:17.529Z',
    type: 'rdbms',
    name: 'Snowflake connection',
    offline: true,
  }];
  initialStore.getState().user.profile = {
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
  };
  initialStore.getState().user.preferences = {
    environment: 'production',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm:ss a',
    drawerOpened: true,
    expand: 'Resources',
    ssConnectionIds: ['62beb2c2a0f5f2144816f818'],
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

  return renderWithProviders(<Dashboard />, {initialStore});
}
describe('dashboard UI tests', () => {
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
  test('should render the respective subComponents', async () => {
    initDashboard();
    expect(screen.getByText('InstallZip')).toBeInTheDocument();
    expect(screen.getByText('ResourceDrawer')).toBeInTheDocument();
    expect(screen.getByText('InstallIntegration')).toBeInTheDocument();
    expect(screen.getByText('OfflineConnectionDrawer')).toBeInTheDocument();
    expect(screen.getByText('PageBar')).toBeInTheDocument();
    expect(screen.getByText('HomeView')).toBeInTheDocument();
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.resource.requestCollection('tiles')));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.resource.requestCollection(
      'suitescript/connections/62beb2c2a0f5f2144816f818/tiles'
    )));
  });
});
