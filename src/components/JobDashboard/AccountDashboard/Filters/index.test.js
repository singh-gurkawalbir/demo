/* global describe, test, beforeEach, expect, jest, afterEach */
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import { runServer } from '../../../../test/api/server';
import Filters from '.';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';

let initialStore;

async function initFilters({filterKey = 'completedFlows', completedJobs, dataRetentionPeriod}) {
  initialStore.getState().data.resources.integrations = [
    {
      _id: 'integration1',
      name: 'Integration',
      install: [{
        isClone: true,
      }],
    },
  ];
  initialStore.getState().data.completedJobs = completedJobs;
  initialStore.getState().data.accountSettings.dataRetentionPeriod = dataRetentionPeriod;
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

describe('Testsuite for Job Dashboard Filters', () => {
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
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('04 Dec 1995 00:00:00 GMT').getTime());
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    mockActionClick.mockClear();
    jest.useRealTimers();
  });
  test('should render the completed flows when there are no integrations data and click on refresh button', async () => {
    await initFilters({filterKey: 'completedFlows'});
    expect(screen.getByText(/completed date range:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /last 24 hours/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    const refreshButtonNode = screen.getByRole('button', { name: /refresh/i });

    expect(refreshButtonNode).toBeInTheDocument();
    userEvent.click(refreshButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'PATCH_FILTER',
      name: 'completedFlows',
      filter: { refreshAt: 818035200000, currentPage: 0 },
    });
  });
  test('should test the date range selector', async () => {
    await initFilters({filterKey: 'completedFlows'});
    expect(screen.getByText(/completed date range:/i)).toBeInTheDocument();
    const last24ButtonNode = screen.getByRole('button', {name: /last 24 hours/i});

    expect(last24ButtonNode).toBeInTheDocument();
    await userEvent.click(last24ButtonNode);
    expect(screen.getAllByRole('list')).toHaveLength(1);
    const todayButtonNode = screen.getByRole('button', {name: /today/i});

    expect(todayButtonNode).toBeInTheDocument();
    await userEvent.click(todayButtonNode);
    const applyButtonNode = screen.getByRole('button', {name: /apply/i});

    expect(applyButtonNode).toBeInTheDocument();
    userEvent.click(applyButtonNode);
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
    const resultPerPageButtonNode = screen.getByRole('button', {
      name: /50/i,
    });

    expect(resultPerPageButtonNode).toBeInTheDocument();
    await userEvent.click(resultPerPageButtonNode);
    const tenOptionNode = screen.getByRole('option', {name: /10/i});

    expect(tenOptionNode).toBeInTheDocument();
    await userEvent.click(tenOptionNode);
    await waitFor(() => expect(tenOptionNode).not.toBeInTheDocument());
    const nextPageButtonNode = document.querySelector('button[data-testid="nextPage"]');

    expect(nextPageButtonNode).toBeInTheDocument();
    userEvent.click(nextPageButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'PATCH_FILTER',
      name: 'completedFlows',
      filter: { paging: { rowsPerPage: 10, currPage: 1 } },
    });
  });
  test('should show corresponding options in the dateRange component based on the dataRetentionPeriod', () => {
    initFilters({filterKey: 'completedFlows', dataRetentionPeriod: 60});

    const last24ButtonNode = screen.getAllByRole('button', {name: 'Last 24 hours'});

    userEvent.click(last24ButtonNode[0]);
    expect(screen.getByRole('button', {name: 'Last 60 days'})).toBeInTheDocument();
  });
  test('should show corresponding options in the dateRange component based on the max dataRetentionPeriod selected', () => {
    initFilters({filterKey: 'completedFlows', dataRetentionPeriod: 180});

    const last24ButtonNode = screen.getAllByRole('button', {name: 'Last 24 hours'});

    userEvent.click(last24ButtonNode[0]);

    expect(screen.getByRole('button', {name: 'Last 60 days'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Last 90 days'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Last 180 days'})).toBeInTheDocument();
  });
  test('should be able to select new corresponding options in the dateRange component based on the max dataRetentionPeriod selected', () => {
    initFilters({filterKey: 'completedFlows', dataRetentionPeriod: 180});

    const last24ButtonNode = screen.getAllByRole('button', {name: 'Last 24 hours'});

    userEvent.click(last24ButtonNode[0]);

    expect(screen.getByRole('button', {name: 'Last 60 days'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Last 90 days'})).toBeInTheDocument();
    const last180daysMenuItemButtonNode = screen.getByRole('button', {name: 'Last 180 days'});

    expect(last180daysMenuItemButtonNode).toBeInTheDocument();
    userEvent.click(last180daysMenuItemButtonNode);
    const applyButtonNode = screen.getByRole('button', {name: /apply/i});

    expect(applyButtonNode).toBeInTheDocument();
    userEvent.click(applyButtonNode);

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
