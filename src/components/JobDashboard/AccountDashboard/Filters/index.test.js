
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import { runServer } from '../../../../test/api/server';
import Filters from '.';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

let initialStore;

async function initFilters({filterKey = 'completedFlows', completedJobs, dataRetentionPeriod, defaultAShareId}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [
      {
        _id: 'integration1',
        name: 'Integration',
        install: [{
          isClone: true,
        }],
      },
    ];
    draft.data.completedJobs = completedJobs;
    draft.data.accountSettings.dataRetentionPeriod = dataRetentionPeriod;
    draft.user.preferences.defaultAShareId = defaultAShareId || 'own';
    draft.user.org.accounts = [
      {
        accessLevel: 'owner',
        _id: 'own',
        ownerUser: {
          licenses: [
            {
              endpoint: {
                production: {},
                sandbox: {},
                apiManagement: true,
              },
              maxAllowedDataRetention: 180,
              supportTier: 'preferred',
              tier: 'enterprise',
              type: 'endpoint',
              _id: 'license1',
            },
          ],
        },
      },
      {
        accessLevel: 'manage',
        _id: 'user1',
        accepted: true,
        ownerUser: {
          licenses: [
            {
              endpoint: {
                production: {},
                sandbox: {},
                apiManagement: true,
              },
              maxAllowedDataRetention: 180,
              supportTier: 'preferred',
              tier: 'enterprise',
              type: 'endpoint',
              _id: 'license2',
            },
          ],
          dataRetentionPeriod: 60,
        },
      },
    ];
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/dashboard/${filterKey}`}]}
    >
      <Route
        path={`/dashboard/${filterKey}`}
        params={{ dashboardTab: `${filterKey}`}}
        >
        <Filters filterKey={filterKey} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
const mockActionClick = jest.fn();

describe('testsuite for Job Dashboard Filters', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    initialStore = getCreatedStore();
    // jest.useFakeTimers('modern');
    // jest.setSystemTime(new Date('04 Dec 1995 00:00:00 GMT').getTime());
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    mockActionClick.mockClear();
    // jest.useRealTimers();
  });
  test('should render the completed flows when there are no integrations data and click on refresh button', async () => {
    await initFilters({filterKey: 'completedFlows'});
    expect(screen.getByText(/completed date range:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /last 24 hours/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    waitFor(async () => {
      const refreshButtonNode = screen.getByRole('button', { name: /refresh/i });

      expect(refreshButtonNode).toBeInTheDocument();
      await userEvent.click(refreshButtonNode);
      expect(mockDispatchFn).toHaveBeenCalledWith({
        type: 'PATCH_FILTER',
        name: 'completedFlows',
        filter: { refreshAt: 818035200000, currentPage: 0 },
      });
    });
  });
  test('should test the date range selector', async () => {
    await initFilters({filterKey: 'completedFlows'});
    expect(screen.getByText(/completed date range:/i)).toBeInTheDocument();
    waitFor(async () => {
      const last24ButtonNode = screen.getByRole('button', {name: /last 24 hours/i});

      expect(last24ButtonNode).toBeInTheDocument();
      await userEvent.click(last24ButtonNode);
      expect(screen.getAllByRole('list')).toHaveLength(1);
    });
    waitFor(async () => {
      const todayButtonNode = screen.getByRole('button', {name: /today/i});

      expect(todayButtonNode).toBeInTheDocument();
      await userEvent.click(todayButtonNode);
    });
    waitFor(async () => {
      const applyButtonNode = screen.getByRole('button', {name: /apply/i});

      expect(applyButtonNode).toBeInTheDocument();
      await userEvent.click(applyButtonNode);
      expect(mockDispatchFn).toHaveBeenCalledWith({
        type: 'PATCH_FILTER',
        name: 'completedFlows',
        filter: {
          range: {
            startDate: moment().startOf('day').toDate(),
            endDate: moment().toDate(),
            preset: 'today',
          },
        },
      });
    });
  });
  test('should not render the completed date range dropdown when the filter key is not equal to completed flows', async () => {
    await initFilters({filterKey: 'runningFlows'});
    expect(screen.queryByText(/completed date range:/i)).not.toBeInTheDocument();
  });
  test('should test the pagination', async () => {
    await initFilters({filterKey: 'completedFlows',
      completedJobs: {completedJobs: Array.from(Array(20),
        (_, x) => ({
          _id: x,
        }))}});
    expect(screen.getByText(/results per page:/i)).toBeInTheDocument();
    waitFor(async () => {
      const resultPerPageButtonNode = screen.getByRole('button', {
        name: /50/i,
      });

      expect(resultPerPageButtonNode).toBeInTheDocument();
      await userEvent.click(resultPerPageButtonNode);
    });
    waitFor(async () => {
      const tenOptionNode = screen.getByRole('option', {name: /10/i});

      expect(tenOptionNode).toBeInTheDocument();
      await userEvent.click(tenOptionNode);
      expect(tenOptionNode).not.toBeInTheDocument();
      const nextPageButtonNode = document.querySelector('button[data-testid="nextPage"]');

      expect(nextPageButtonNode).toBeInTheDocument();
      await userEvent.click(nextPageButtonNode);
      expect(mockDispatchFn).toHaveBeenCalledWith({
        type: 'PATCH_FILTER',
        name: 'completedFlows',
        filter: { paging: { rowsPerPage: 10, currPage: 1 } },
      });
    });
  });
  test('should show corresponding options in the dateRange component based on the dataRetentionPeriod', async () => {
    initFilters({filterKey: 'completedFlows', dataRetentionPeriod: 60});

    waitFor(async () => {
      const last24ButtonNode = screen.getAllByRole('button', {name: 'Last 24 hours'});

      await userEvent.click(last24ButtonNode[0]);
      expect(screen.getByRole('button', {name: 'Last 60 days'})).toBeInTheDocument();
    });
  });
  test('should show corresponding options in the dateRange component based on the max dataRetentionPeriod selected', async () => {
    initFilters({filterKey: 'completedFlows', dataRetentionPeriod: 180});

    waitFor(async () => {
      const last24ButtonNode = screen.getAllByRole('button', {name: 'Last 24 hours'});

      await userEvent.click(last24ButtonNode[0]);

      expect(screen.getByRole('button', {name: 'Last 60 days'})).toBeInTheDocument();
      expect(screen.getByRole('button', {name: 'Last 90 days'})).toBeInTheDocument();
      expect(screen.getByRole('button', {name: 'Last 180 days'})).toBeInTheDocument();
    });
  });
  test('should be able to select new corresponding options in the dateRange component based on the max dataRetentionPeriod selected', async () => {
    initFilters({filterKey: 'completedFlows', dataRetentionPeriod: 180});

    waitFor(async () => {
      const last24ButtonNode = screen.getAllByRole('button', {name: 'Last 24 hours'});

      await userEvent.click(last24ButtonNode[0]);

      expect(screen.getByRole('button', {name: 'Last 60 days'})).toBeInTheDocument();
      expect(screen.getByRole('button', {name: 'Last 90 days'})).toBeInTheDocument();
    });
    waitFor(async () => {
      const last180daysMenuItemButtonNode = screen.getByRole('button', {name: 'Last 180 days'});

      expect(last180daysMenuItemButtonNode).toBeInTheDocument();
      await userEvent.click(last180daysMenuItemButtonNode);
    });
    waitFor(async () => {
      const applyButtonNode = screen.getByRole('button', {name: /apply/i});

      expect(applyButtonNode).toBeInTheDocument();
      await userEvent.click(applyButtonNode);

      expect(mockDispatchFn).toHaveBeenCalledWith({
        type: 'PATCH_FILTER',
        name: 'completedFlows',
        filter: {
          range: {
            startDate: moment().subtract(179, 'days').startOf('day').toDate(),
            endDate: moment().toDate(),
            preset: 'last180days',
          },
        },
      });
    });
  });
  test('should show corresponding options in the dateRange component based on the dataRetentionPeriod selected for a shared user', async () => {
    initFilters({filterKey: 'completedFlows', defaultAShareId: 'user1'});

    waitFor(async () => {
      const last24ButtonNode = screen.getAllByRole('button', {name: 'Last 24 hours'});

      await userEvent.click(last24ButtonNode[0]);

      expect(screen.queryByRole('button', {name: 'Last 60 days'})).toBeInTheDocument();
      expect(screen.queryByRole('button', {name: 'Last 90 days'})).not.toBeInTheDocument();
      expect(screen.queryByRole('button', {name: 'Last 180 days'})).not.toBeInTheDocument();
    });
  });
});
