/* eslint-disable import/no-extraneous-dependencies */
/* global describe, test, beforeEach, jest, expect, afterEach */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import QueuedJobsDrawer from './QueuedJobsDrawer';
import { renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';

let initialStore;

function initQueuedJobsDrawer({integrationId, sessionConnectionData, queueSize}) {
  initialStore.getState().user.preferences = {environment: 'production'};
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
    queueSize,
  }, {
    _id: 'fghijk',
    name: 'Test connection 2',
    _integrationId: '12345',
    queueSize,
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
  initialStore.getState().session.connections = sessionConnectionData;
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/dashboard/runningFlows/flows/67890/queuedJobs'}]}
    >
      <Route
        path="/dashboard/:dashboardTab"
        params={{dashboardTab: 'runningFlows'}}
      >
        <QueuedJobsDrawer integrationId={integrationId} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
const mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));
jest.mock('../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../LoadResources'),
  default: props => (
    props.children
  ),
}));
jest.mock('../../../utils/jobdashboard', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/jobdashboard'),
  getStatus: jest.fn().mockReturnValue('Mocking get Status'),
  getPages: jest.fn().mockReturnValue('Mocking get Pages'),
}));
describe('Testsuite for Queued Jobs Drawer', () => {
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
    mockHistoryGoBack.mockClear();
  });

  test('should test the queued jobs drawer by changing the connection and click on close', async () => {
    await initQueuedJobsDrawer({integrationId: '12345', connectionId: 'fghijk'});
    expect(screen.getByText(/Queued Jobs: Test connection 1/i)).toBeInTheDocument();
    const testConnection1ButtonNode = screen.getByRole('button', {name: /Test connection 1/i});

    expect(testConnection1ButtonNode).toBeInTheDocument();
    await userEvent.click(testConnection1ButtonNode);
    const connection2MenuItemNode = screen.getByRole('menuitem', {name: /Test connection 2/i});

    expect(connection2MenuItemNode).toBeInTheDocument();
    await userEvent.click(connection2MenuItemNode);
    await waitFor(() => expect(connection2MenuItemNode).not.toBeInTheDocument());
    expect(screen.getByText(/Queued Jobs: Test connection 2/i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {name: /close/i});

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockHistoryGoBack).toHaveBeenCalledTimes(1);
  });
  test('should test the queued jobs drawer by having queued jobs', async () => {
    const connectionId = 'abcde';

    await initQueuedJobsDrawer({integrationId: '12345',
      sessionConnectionData: {
        queuedJobs: {
          [connectionId]: [
            {
              _id: '7fyg',
              _integrationId: {name: 'Test Integration'},
              _flowId: {name: 'Test Flow'},
              type: 'flow',
              status: 'queued',
              percentComplete: 50,
              numSuccess: 0,
              numIgnore: 0,
              numError: 1,
            },
          ],
        },
      },
      queueSize: '1',
    });
    expect(screen.getByRole('heading', { name: /queued jobs: test connection 1/i })).toBeInTheDocument();
    const columnHeaderNode = screen.getAllByRole('columnheader');

    expect(columnHeaderNode).toHaveLength(8);
    const cellNode = screen.getAllByRole('cell');

    expect(cellNode).toHaveLength(8);
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'QUEUED_JOBS_REQUEST_POLL', connectionId: 'abcde' });
    screen.debug(null, Infinity);
  });
  test('should test the queued jobs drawer by clicking on action button and canceling the queued job', async () => {
    const connectionId = 'abcde';

    await initQueuedJobsDrawer({integrationId: '12345',
      sessionConnectionData: {
        queuedJobs: {
          [connectionId]: [
            {
              _id: '7fyg',
              _integrationId: {name: 'Test Integration'},
              _flowId: {name: 'Test Flow'},
              type: 'flow',
              status: 'queued',
              percentComplete: 50,
              numSuccess: 0,
              numIgnore: 0,
              numError: 1,
            },
          ],
        },
      },
      queueSize: '1',
    });
    const moreButtonNode = screen.getByRole('button', {name: /more/i});

    expect(moreButtonNode).toBeInTheDocument();
    await userEvent.click(moreButtonNode);
    const closeMenuItemNode = document.querySelector('li[data-test="cancel"]');

    expect(closeMenuItemNode).toBeInTheDocument();
    await userEvent.click(closeMenuItemNode);
    expect(closeMenuItemNode).not.toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'QUEUED_JOB_CANCEL', jobId: '7fyg' });
  });
});
