/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
import * as reactRedux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import {renderWithProviders, reduxStore} from '../../../../../test/test-utils';
import DashboardPanel from '.';
import actions from '../../../../../actions';

function initDashboardPanel(props) {
  const initialStore = reduxStore;

  initialStore.getState().user.profile.useErrMgtTwoDotZero = props.error;
  const ui = (
    <MemoryRouter initialEntries={[{pathname: `/integrations/6253af74cddb8a1ba550a010/dashboard/${props.param}`}]} >
      <Route
        path="/integrations/:integrationId/dashboard/:dashboardType"
            >
        <DashboardPanel />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
const mockHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));
jest.mock('../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/LoadResources'),
  default: props =>
    (
      props.children
    )
  ,
}));
jest.mock('../../../../../components/PanelHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/PanelHeader'),
  default: props =>
    (
      <><div>PanelHeader </div><div>{props.infoText}</div></>
    )
  ,
}));
jest.mock('../../../../Dashboard', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../Dashboard'),
  default: () =>
    (
      <div>IntegrationDashboard</div>
    )
  ,
}));
jest.mock('../../../../../components/JobDashboard', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/JobDashboard'),
  default: () =>
    (
      <div>JobDashboard</div>
    )
  ,
}));

describe('Integration App Dashboard panel UI tests', () => {
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
  test('should make a dispatch call on initialRender', () => {
    const props = {error: false,
      param: 'runningFlows',
      integrationId: '6253af74cddb8a1ba550a010',
      childId: '1234567890987654321' };

    initDashboardPanel(props);
    waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.patchFilter('jobs', {
      childId: '1234567890987654321',
      flowId: '',
      currentPage: 0,
    })));
  });
  test('should only display "IntegrationDashboard" component when "isUserInErrMgtTwoDotZero" is true', () => {
    const props = {error: true,
      param: 'runningFlows',
      integrationId: '6253af74cddb8a1ba550a010',
      childId: '1234567890987654321' };

    initDashboardPanel(props);
    waitFor(() => expect(screen.getByText('IntegrationDashboard')).toBeInTheDocument());   // IntegrationDashboard component is mocked//
  });
  test('should display "jobDashboard" and "PanelHeader" components when "isUserInErrMgtTwoDotZero" is false', () => {
    const props = {error: false,
      param: 'runningFlows',
      integrationId: '6253af74cddb8a1ba550a010',
      childId: '1234567890987654321' };

    initDashboardPanel(props);
    expect(screen.getByText('JobDashboard')).toBeInTheDocument();   // JobDashboard component is mocked//
    expect(screen.getByText('PanelHeader')).toBeInTheDocument();
  });
  test('should redirect to runningFlows tab when "isUserInErrMgtTwoDotZero" is true', () => {
    const props = {error: true,
      integrationId: '6253af74cddb8a1ba550a010',
      childId: '1234567890987654321' };

    initDashboardPanel(props);
    waitFor(() => expect(mockHistoryReplace).toBeCalled());
  });
});

