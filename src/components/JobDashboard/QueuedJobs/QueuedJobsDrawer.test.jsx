/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import QueuedJobsDrawer from './QueuedJobsDrawer';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';

let initialStore;

function initQueuedJobsDrawer({integrationId, sessionConnectionData, queueSize}) {
  mutateStore(initialStore, draft => {
    draft.user.preferences = {environment: 'production'};
    draft.data.resources.integrations = [{
      _id: '12345',
      name: 'Test integration name',
    }];
    draft.data.resources.flows = [{
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
    draft.data.resources.connections = [{
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
    draft.data.resources.exports = [{
      _id: 'xsjxks',
      name: 'Test export',
      _connectionId: 'abcde',
      _integrationId: '12345',
    }];
    draft.data.resources.imports = [{
      _id: 'nxksnn',
      name: 'Test import',
      _connectionId: 'fghijk',
      _integrationId: '12345',
    }];
    draft.session.connections = sessionConnectionData;
  });
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

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

describe('testsuite for Queued Jobs Drawer', () => {
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
    const rowHeader = screen.getAllByRole('rowheader');

    expect(rowHeader).toHaveLength(1);
    const cellNode = screen.getAllByRole('cell');

    expect(cellNode).toHaveLength(7);
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'QUEUED_JOBS_REQUEST_POLL', connectionId: 'abcde' });
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
