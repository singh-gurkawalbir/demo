
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import {renderWithProviders, reduxStore, mutateStore} from '../../../../../test/test-utils';
import DashboardPanel from '.';

function initDashboardPanel(props) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.user.profile.useErrMgtTwoDotZero = props.error;
  });

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
  test('should only display "IntegrationDashboard" component when "isUserInErrMgtTwoDotZero" is true', () => {
    const props = {error: true,
      param: 'runningFlows',
      integrationId: '6253af74cddb8a1ba550a010',
      childId: '1234567890987654321' };

    initDashboardPanel(props);
    waitFor(() => expect(screen.getByText('IntegrationDashboard')).toBeInTheDocument());   // IntegrationDashboard component is mocked//
  });
  test('should display "jobDashboard" and "PanelHeader" components when "isUserInErrMgtTwoDotZero" is not true', () => {
    const props = {error: false,
      param: 'runningFlows',
      integrationId: '6253af74cddb8a1ba550a010',
      childId: '1234567890987654321' };

    initDashboardPanel(props);
    waitFor(() => expect(screen.getByText('JobDashboard')).toBeInTheDocument());   // JobDashboard component is mocked//
    waitFor(() => expect(screen.getByText('PanelHeader')).toBeInTheDocument());
  });
  test('should redirect to the runningFlows tab when "isUserInErrMgtTwoDotZero" is true', () => {
    const props = {error: true,
      integrationId: '6253af74cddb8a1ba550a010',
      childId: '1234567890987654321' };

    initDashboardPanel(props);
    waitFor(() => expect(mockHistoryReplace).toBeCalled());
  });
});

