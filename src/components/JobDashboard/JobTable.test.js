/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import * as reactRedux from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox, TableCell, TableRow } from '@mui/material';
import { createMemoryHistory } from 'history';
import JobTable from './JobTable';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import { getCreatedStore } from '../../store';
import actions from '../../actions';

let initialStore;
const mockOnSelectChange = jest.fn();
const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();
const mockHistoryGoBack = jest.fn();

const mockJobDetail = props => (
  <TableRow key="1">
    <TableCell key="2">
      job = {JSON.stringify(props.job)}
    </TableCell>
    <TableCell key="3">
      <Checkbox
        data-test="checkbox"
        onClick={() => props.onSelectChange(props.job, props.job._id)}
  />
    </TableCell>
    <TableCell key="4">
      selected jobs = {JSON.stringify(props.selectedJobs)}
    </TableCell>
    <TableCell key="5">
      userPermissionsOnIntegration = {JSON.stringify(props.userPermissionsOnIntegration)}
    </TableCell>
    <TableCell
      key="6"
      data-test="viewError"
      onClick={() => props.onViewErrorsClick({jobId: props.job._id})}
>
      ViewError
    </TableCell>
    <TableCell key="7">
      integrationName = {props.integrationName}
    </TableCell>
    <TableCell key="8">
      isFlowBuilderView = {props.isFlowBuilderView}
    </TableCell>
  </TableRow>
);

function initJobTable({
  onSelectChange,
  jobsInCurrentPage,
  selectedJobs,
  userPermissionsOnIntegration,
  integrationName,
  isFlowBuilderView,
  flowJobsData,
  history,
}) {
  mutateStore(initialStore, draft => {
    draft.data.jobs = flowJobsData;
  });

  const ui = (
    <Router history={history}>
      <Route
        path="/integrations/:integrationId/flowBuilder/:flowId"
      >
        <JobTable
          onSelectChange={onSelectChange}
          jobsInCurrentPage={jobsInCurrentPage}
          selectedJobs={selectedJobs}
          userPermissionsOnIntegration={userPermissionsOnIntegration}
          integrationName={integrationName}
          isFlowBuilderView={isFlowBuilderView}
        />
      </Route>
    </Router>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('./JobDetail', () => ({
  __esModule: true,
  ...jest.requireActual('./JobDetail'),
  default: props => mockJobDetail(props),
}));
jest.mock('./ErrorDrawer', () => ({
  __esModule: true,
  ...jest.requireActual('./ErrorDrawer'),
  default: props => (
    <>
      <div>
        Integration Name = {props.integrationName}
      </div>
      <div>
        jobId = {props.jobId}
      </div>
      <div>
        <button onClick={props.onClose} type="button" data-test="onclose">
          On Close
        </button>
      </div>
    </>
  ),
}));

describe('testsuite for JobTable', () => {
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
    mockOnSelectChange.mockClear();
    mockHistoryGoBack.mockClear();
    mockHistoryPush.mockClear();
    mockHistoryReplace.mockClear();
  });
  test('should test the spinner when flow jobs collection are in progress', () => {
    const history = createMemoryHistory({ initialEntries: ['/integrations/123/flowBuilder/456']});

    initJobTable({
      onSelectChange: mockOnSelectChange,
      jobsInCurrentPage: [],
      selectedJobs: '',
      userPermissionsOnIntegration: {
        accessLevel: 'owner',
        edit: true,
        delete: true,
        clone: true,
      },
      integrationName: 'Test Integration',
      isFlowBuilderView: true,
      flowJobsData: {status: 'loading'},
      history,
    });
    expect(screen.getByRole('progressbar').className).toEqual(expect.stringContaining('MuiCircularProgress-'));
  });
  test('should test job table by verifying the disabled checkbox and table head when there are no flow job collection and job status is completed', () => {
    const history = createMemoryHistory({ initialEntries: ['/integrations/123/flowBuilder/456']});

    initJobTable({
      onSelectChange: mockOnSelectChange,
      jobsInCurrentPage: [],
      selectedJobs: '',
      userPermissionsOnIntegration: {
        accessLevel: 'owner',
        edit: true,
        delete: true,
        clone: true,
      },
      integrationName: 'Test Integration',
      isFlowBuilderView: true,
      flowJobsData: {status: 'completed'},
      history,
    });
    const checkboxButtonNode = screen.getByRole('checkbox', {name: /select all jobs/i});

    expect(checkboxButtonNode).toBeInTheDocument();
    expect(checkboxButtonNode).toBeDisabled();
    expect(screen.getAllByRole('columnheader')).toHaveLength(11);
  });
  test('should test job table select all jobs checkbox when there are jobs', async () => {
    const history = createMemoryHistory({ initialEntries: ['/integrations/123/flowBuilder/456']});

    initJobTable({
      onSelectChange: mockOnSelectChange,
      jobsInCurrentPage: [{
        numError: 3,
        numResolved: 0,
        numSuccess: 132,
        numIgnore: 0,
        numPagesGenerated: 7,
        numPagesProcessed: 0,
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        files: [
          {
            id: '786',
            host: 's3',
            name: 'testcsv.csv',
          },
        ],
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
      }],
      selectedJobs: '',
      userPermissionsOnIntegration: {
        accessLevel: 'owner',
        edit: true,
        delete: true,
        clone: true,
      },
      integrationName: 'Test Integration',
      isFlowBuilderView: true,
      flowJobsData: {status: 'completed'},
      history,
    });
    const selectAllJobsCheckbox = screen.getByRole('checkbox', {
      name: /select all jobs/i,
    });

    expect(selectAllJobsCheckbox).toBeInTheDocument();
    await userEvent.click(selectAllJobsCheckbox);
    expect(mockOnSelectChange).toHaveBeenCalledWith({321: {flowDisabled: false, selected: true}});
  });
  test('should test job table by clicking on view errors and verify the path', async () => {
    const history = createMemoryHistory({ initialEntries: ['/integrations/123/flowBuilder/456']});

    history.push = mockHistoryPush;
    history.goBack = mockHistoryGoBack;

    initJobTable({
      onSelectChange: mockOnSelectChange,
      jobsInCurrentPage: [{
        numError: 3,
        numResolved: 0,
        numSuccess: 132,
        numIgnore: 0,
        numPagesGenerated: 7,
        numPagesProcessed: 0,
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        files: [
          {
            id: '786',
            host: 's3',
            name: 'testcsv.csv',
          },
        ],
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
      }],
      selectedJobs: '',
      userPermissionsOnIntegration: {
        accessLevel: 'owner',
        edit: true,
        delete: true,
        clone: true,
      },
      integrationName: 'Test Integration',
      isFlowBuilderView: true,
      flowJobsData: {status: 'completed'},
      history,
    });
    const viewErrorButtonNode = document.querySelector('td[data-test="viewError"]');

    expect(viewErrorButtonNode).toBeInTheDocument();
    await userEvent.click(viewErrorButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/123/flowBuilder/456/viewErrors');
  });
  test('should test job table onclose drawer button', async () => {
    const history = createMemoryHistory({ initialEntries: ['/integrations/123/flowBuilder/456']});

    history.goBack = mockHistoryGoBack;

    initJobTable({
      onSelectChange: mockOnSelectChange,
      jobsInCurrentPage: [{
        numError: 3,
        numResolved: 0,
        numSuccess: 132,
        numIgnore: 0,
        numPagesGenerated: 7,
        numPagesProcessed: 0,
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        files: [
          {
            id: '786',
            host: 's3',
            name: 'testcsv.csv',
          },
        ],
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
      }],
      selectedJobs: '',
      userPermissionsOnIntegration: {
        accessLevel: 'owner',
        edit: true,
        delete: true,
        clone: true,
      },
      integrationName: 'Test Integration',
      isFlowBuilderView: true,
      flowJobsData: {status: 'completed'},
      history,
    });
    const viewErrorButtonNode = document.querySelector('td[data-test="viewError"]');

    expect(viewErrorButtonNode).toBeInTheDocument();
    await userEvent.click(viewErrorButtonNode);
    const onCloseButtonNode = document.querySelector('button[data-test="onclose"]');

    expect(onCloseButtonNode).toBeInTheDocument();
    await userEvent.click(onCloseButtonNode);
    expect(onCloseButtonNode).not.toBeInTheDocument();
    expect(mockHistoryGoBack).toHaveBeenCalledTimes(1);
  });
  test('should test the job table when the bottom drawer page loaded when the flowJobId param which is passed in the URL', () => {
    const history = createMemoryHistory({ initialEntries: [{pathname: '/integrations/123/flowBuilder/456', search: '?_flowJobId=321'}]});

    history.replace = mockHistoryReplace;

    initJobTable({
      onSelectChange: mockOnSelectChange,
      jobsInCurrentPage: [{
        numError: 3,
        numResolved: 0,
        numSuccess: 132,
        numIgnore: 0,
        numPagesGenerated: 7,
        numPagesProcessed: 0,
        _id: 321,
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        files: [
          {
            id: '786',
            host: 's3',
            name: 'testcsv.csv',
          },
        ],
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
      }],
      selectedJobs: '',
      userPermissionsOnIntegration: {
        accessLevel: 'owner',
        edit: true,
        delete: true,
        clone: true,
      },
      integrationName: 'Test Integration',
      isFlowBuilderView: true,
      flowJobsData: {status: 'completed'},
      history,
    });
    expect(mockHistoryReplace).toHaveBeenCalledTimes(2);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.requestFamily({ jobId: '321' }));
  });
  test('should test job table individual select jobs checkbox when there are jobs', async () => {
    const history = createMemoryHistory({ initialEntries: ['/integrations/123/flowBuilder/456']});

    initJobTable({
      onSelectChange: mockOnSelectChange,
      jobsInCurrentPage: [{
        numError: 3,
        numResolved: 0,
        numSuccess: 132,
        numIgnore: 0,
        numPagesGenerated: 7,
        numPagesProcessed: 0,
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        files: [
          {
            id: '786',
            host: 's3',
            name: 'testcsv.csv',
          },
        ],
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
      }],
      selectedJobs: '',
      userPermissionsOnIntegration: {
        accessLevel: 'owner',
        edit: true,
        delete: true,
        clone: true,
      },
      integrationName: 'Test Integration',
      isFlowBuilderView: true,
      flowJobsData: {status: 'completed'},
      history,
    });
    const individualCheckBoxNode = document.querySelector('span[data-test="checkbox"]');

    expect(individualCheckBoxNode).toBeInTheDocument();
    await userEvent.click(individualCheckBoxNode);
    expect(mockOnSelectChange).toHaveBeenCalledTimes(1);
  });
});
