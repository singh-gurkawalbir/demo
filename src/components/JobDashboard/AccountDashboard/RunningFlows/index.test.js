/* global describe, beforeEach, test, jest, expect, afterEach */
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import RunningFlows from '.';
import { getCreatedStore } from '../../../../store';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders } from '../../../../test/test-utils';

let initialStore;

async function initRunningFlows(dashboardTab, runningJobsStatus, runningJobsData) {
  initialStore.getState().data.runningJobs = {runningJobs: runningJobsData, status: runningJobsStatus};
  initialStore.getState().session.filters = {
    runningFlows: {
      sort: {
        order: 'asc',
        orderBy: 'startedAt',
      },
      selected: {},
      isAllSelected: false,
      paging: {
        rowsPerPage: 50,
        currPage: 0,
      },
    },
  };
  initialStore.getState().data.resources.integrations = [{
    _id: '12345',
    name: 'Test integration name',
  }];
  initialStore.getState().data.resources.flows = [{
    _id: '67890',
    name: 'Test flow name 1',
    _integrationId: '12345',
    disabled: false,
    pageProcessors: [
      {
        type: 'import',
        _importId: 'nxksnn',
      },
    ],
    pageGenerators: [
      {
        _exportId: 'xsjxks',
      },
    ],
  }];
  initialStore.getState().data.resources.connections = [{
    _id: 'abcde',
    name: 'Test connection 1',
    _integrationId: '12345',
  }, {
    _id: 'fghijk',
    name: 'Test connection 2',
    _integrationId: '12345',
  }];
  initialStore.getState().data.resources.exports = [{
    _id: 'xsjxks',
    name: 'Test export',
    _connectionId: 'abcde',
    _integrationId: '12345',
  }];
  initialStore.getState().data.resources.imports = [{
    _id: 'nxksnn',
    name: 'Test import',
    _connectionId: 'fghijk',
    _integrationId: '12345',
  }];
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/dashboard/${dashboardTab}`}]}
    >
      <Route
        path={`/dashboard/${dashboardTab}`}
        params={{ dashboardTab: `${dashboardTab}`}}
    >
        <RunningFlows />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../Filters', () => ({
  __esModule: true,
  ...jest.requireActual('../Filters'),
  default: props => (
    <div>filterKey = {props.filterKey}</div>
  ),
}));
jest.mock('../../../ResourceTable', () => ({
  __esModule: true,
  ...jest.requireActual('../../../ResourceTable'),
  default: props => (
    <div>Resource Table Resources = {JSON.stringify(props.resources)}</div>
  ),
}));

describe('Testsuite for Running flows', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
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
    mockDispatchFn.mockClear();
  });
  test('should render the empty integartions data in the resource table', async () => {
    await initRunningFlows('runningFlows', 'success', []);

    expect(screen.getByText(/filterkey = runningflows/i)).toBeInTheDocument();
    expect(screen.getByText(/resource table resources =/i)).toBeInTheDocument();

    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'JOB_DASHBOARD_RUNNING_REQUEST_IN_PROGRESS_JOBS_STATUS' });

    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'JOB_DASHBOARD_RUNNING_REQUEST_COLLECTION',
      nextPageURL: undefined,
      integrationId: undefined,
    });
    expect(screen.getByText(/You don't have any running flows./i)).toBeInTheDocument();
  });
  test('should load the spinner when the data is in loading state', async () => {
    await initRunningFlows('runningFlows', 'loading', []);
    expect(screen.getByRole('progressbar').className).toEqual(expect.stringContaining('MuiCircularProgress-'));
  });
  test('should render the data when there are jobs', async () => {
    const runningJobsData =
      [{
        _id: 123,
      }];

    await initRunningFlows('runningFlows', 'success', runningJobsData);
    expect(screen.getByText(/filterkey = runningflows/i)).toBeInTheDocument();
    expect(screen.getByText(
      /resource table resources = \[\{"_id":123,"doneexporting":false,"numpagesprocessed":0,"percentcomplete":0\}\]/i
    )).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'JOB_DASHBOARD_RUNNING_CLEAR' });
  });
});

