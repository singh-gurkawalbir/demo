
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';
import DashboardTabs from '.';

async function initDashboardTabs(param) {
  const initialStore = reduxStore;
  const ui = (
    <MemoryRouter initialEntries={[{pathname: `/integrations/6253af74cddb8a1ba550a010/dashboard/${param}`}]} >
      <Route
        path="/integrations/:integrationId/dashboard/:dashboardTab"
            >
        <DashboardTabs />
      </Route>
    </MemoryRouter>
  );

  mutateStore(initialStore, draft => {
    draft.data.completedJobs = {
      completedJobs: [
        {
          numPages: 0,
          avgRuntime: 8941.5,
          lastExecutedAt: '2022-07-07T14:46:36.382Z',
          numRuns: 2,
          _flowId: '62c6f122a2f4a703c3dee3d0',
          numError: 2,
          numSuccess: 0,
          numIgnore: 0,
          numResolvedByAuto: 1,
          numResolvedByUser: 0,
          numOpenError: 1,
          lastErrorAt: '2022-07-07T14:46:36.382Z',
          _integrationId: '6253af74cddb8a1ba550a010',
        },
      ],
    };

    draft.session.filters['6253af74cddb8a1ba550a010completedFlows'] = {
      sort: {
        order: 'desc',
        orderBy: 'lastExecutedAt',
      },
      paging: {
        rowsPerPage: 50,
        currPage: 0,
      },
      range: {
        startDate: '2022-06-25T18:30:00.000Z',
        endDate: '2022-07-25T05:32:02.695Z',
        preset: 'last30days',
      },
    };

    draft.session.filters.completedFlows = {
      sort: {
        order: 'desc',
        orderBy: 'lastModified',
      },
      selected: {},
      isAllSelected: false,
    };
  });

  return renderWithProviders(ui, {initialStore});
}

describe('Dashboard Tabs UI tests', () => {
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
  test('should display both runningFlows and completedFlows tabs in the DOM', () => {
    initDashboardTabs('runningFlows');
    expect(screen.getByText('Running flows')).toBeInTheDocument();
    expect(screen.getByText('Completed flows')).toBeInTheDocument();
  });
  test('should display table headers for running flows tab', async () => {
    await initDashboardTabs('runningFlows');
    expect(screen.getByText('Running flows')).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/started/i)).toBeInTheDocument();
    expect(screen.getByText(/success/i)).toBeInTheDocument();
    expect(screen.getByText(/ignored/i)).toBeInTheDocument();
    expect(screen.getByText(/errors/i)).toBeInTheDocument();
    expect(screen.getByText(/auto-resolved/i)).toBeInTheDocument();
    expect(screen.getByText(/pages/i)).toBeInTheDocument();
    expect(screen.getByText(/actions/i)).toBeInTheDocument();
  });
  test('should redirect to the completedFlows tab when clicked on the tab and should display the respective row headers for the table', async () => {
    initDashboardTabs('runningFlows');
    await userEvent.click(screen.getByText('Completed flows'));
    expect(screen.getByText('Running flows')).toBeInTheDocument();
    expect(screen.getByText(/Open errors/i)).toBeInTheDocument();
    expect(screen.getByText(/Last open error/i)).toBeInTheDocument();
    expect(screen.getByText(/Last run/i)).toBeInTheDocument();
    expect(screen.getByText(/runs/i)).toBeInTheDocument();
    expect(screen.getByText(/average run time/i)).toBeInTheDocument();
    expect(screen.getByText(/success/i)).toBeInTheDocument();
    expect(screen.getByText(/ignored/i)).toBeInTheDocument();
    expect(screen.getByText(/Auto-resolved/i)).toBeInTheDocument();
    expect(screen.getByText(/user-resolved/i)).toBeInTheDocument();
    expect(screen.getByText(/pages/i)).toBeInTheDocument();
    expect(screen.getByText(/actions/i)).toBeInTheDocument();
  });
  test('should display completed flows in the provided timerange', async () => {
    initDashboardTabs('runningFlows');
    await userEvent.click(screen.getByText('Completed flows'));

    // checking the actual values for a sample completed flow //
    expect(screen.getAllByText('07/07/2022 2:46:36 pm', {exact: false})).toHaveLength(2); // timestamp appears twice in the table for Last open error and Last run time //
    expect(screen.getByText('00:00:08', {exact: false})).toBeInTheDocument();  // Average run time value in the table//
    expect(screen.getAllByText('2')).toHaveLength(2); // value for Number of runs and number of errors is 2 //
  });
  test('should display the ellipsis menu icon in each row', async () => {
    initDashboardTabs('runningFlows');
    await userEvent.click(screen.getByText('Completed flows'));
    const element = document.querySelector('[aria-label="more"]');

    expect(element).toBeInTheDocument();
    await userEvent.click(element);
    expect(screen.getByText(/Run flow/i)).toBeInTheDocument();
    expect(screen.getByText(/Edit flow/i)).toBeInTheDocument();
  });
  test('should display the default no results message when no resources match the filter', () => {
    initDashboardTabs('runningFlows');
    expect(screen.getByText("You don't have any running flows.", {exact: false})).toBeInTheDocument();
  });
});

