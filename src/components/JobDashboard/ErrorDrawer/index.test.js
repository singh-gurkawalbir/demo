
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import ErrorDrawer from '.';
import { getCreatedStore } from '../../../store';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { runServer } from '../../../test/api/server';

let initialStore;

async function initErrorDrawer({
  height,
  jobId,
  includeAll,
  parentJobId,
  showResolved,
  numError,
  numResolved,
  onClose,
  integrationName,
  flowJobsChildrens,
  jobErrors,
  jobRetryObjects,
}) {
  mutateStore(initialStore, draft => {
    draft.data.jobs = {
      flowJobs: [
        {
          numError: 1,
          numResolved: 0,
          numSuccess: 0,
          numIgnore: 0,
          numPagesGenerated: 1,
          numPagesProcessed: 0,
          _id: '12345',
          type: 'flow',
          _integrationId: '09876',
          _exportId: '67890',
          _flowId: '54321',
          startedAt: '2022-10-26T06:05:56.495Z',
          endedAt: '2022-10-26T06:06:12.549Z',
          lastExecutedAt: '2022-10-26T06:06:26.689Z',
          status: 'completed',
          numOpenError: 1,
          numExport: 0,
          doneExporting: true,
          createdAt: '2022-10-26T06:05:54.535Z',
          lastModified: '2022-10-26T06:06:26.691Z',
          children: flowJobsChildrens,
        },
      ],
      paging: {
        rowsPerPage: 10,
        currentPage: 0,
      },
      bulkRetryJobs: [
        {
          _id: '73573',
          type: 'bulk_retry',
          _integrationId: '09876',
          _flowId: '54321',
          endedAt: '2022-10-23T03:45:49.043Z',
          lastExecutedAt: '2022-10-23T03:45:49.043Z',
          status: 'completed',
          numError: 0,
          numResolved: 0,
          numOpenError: 0,
          numSuccess: 2,
          numExport: 2,
          numIgnore: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 0,
          createdAt: '2022-10-23T03:11:16.983Z',
          lastModified: '2022-10-23T03:45:49.043Z',
        },
      ],
      errors: jobErrors,
      retryObjects: jobRetryObjects,
    };
    draft.data.resources.exports = [{
      _id: '67890',
      name: 'Test exports',
    }];
    draft.data.resources.imports = [{
      _id: '45678',
      name: 'Test imports',
    }];
    draft.data.resources.flows = [{
      _id: '54321',
      name: 'Test flows',
      _integrationId: '09876',
      numImports: 1,
      disabled: false,
    }];
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/integrations/09876/flowBuilder/54321/viewErrors'}]}
    >
      <Route
        path="/integrations/09876/flowBuilder/54321"
        params={{ _integrationId: '09876', _flowId: '54321'}}
      >
        <ErrorDrawer
          height={height}
          jobId={jobId}
          includeAll={includeAll}
          parentJobId={parentJobId}
          showResolved={showResolved}
          numError={numError}
          numResolved={numResolved}
          onClose={onClose}
          integrationName={integrationName}
    />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

const mockOnClose = jest.fn();

jest.mock('../RetryDrawer', () => ({
  __esModule: true,
  ...jest.requireActual('../RetryDrawer'),
  default: props => (
    <>
      <div> RetryDrawer JobId Prop = {props.jobId} </div>
      <div> RetryDrawer FlowJobId Prop = {props.flowJobId} </div>
      <div> RetryDrawer height prop = {props.height}</div>
    </>
  ),
}));
jest.mock('../JobErrorTable', () => ({
  __esModule: true,
  ...jest.requireActual('../JobErrorTable'),
  default: props => (
    <>
      <div> JobErrorTable JobErrors prop = {JSON.stringify(props.jobErrors)} </div>
      <div> JobErrorTable errorCount prop = {props.errorCount} </div>
      <div> jobErrorTable job data prop = {props.job._id} </div>
    </>
  )}));
describe('testsuite for ErrorDrawer', () => {
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
    mockOnClose.mockClear();
  });
  test('should test the spinner when child jobs are loading and click on close button', async () => {
    await initErrorDrawer({
      jobId: '12345',
      onClose: mockOnClose,
      integrationName: 'Test Integration',
    });
    expect(screen.getByRole('heading', { name: /test integration > test flows/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar').className).toEqual(expect.stringContaining('MuiCircularProgress-'));
    expect(screen.getByText(/Loading child jobs.../i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {name: /close/i});

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockOnClose).toHaveBeenCalled();
  });
  test('should test the spinner and inprogress message of loading child jobs', async () => {
    await initErrorDrawer({
      jobId: '12345',
      onClose: mockOnClose,
      integrationName: 'Test Integration',
      showResolved: true,
      flowJobsChildrens: [
        {
          numError: 0,
          numResolved: 0,
          numSuccess: 0,
          numIgnore: 0,
          numPagesGenerated: 1,
          numPagesProcessed: 0,
          _flowId: '54321',
          _integrationId: '09876',
          parentStartedAt: '2022-10-26T07:35:07.551Z',
          _id: '32e798',
          type: 'export',
          _exportId: '67890',
          _flowJobId: '12345',
          startedAt: '2022-10-26T07:35:10.223Z',
          endedAt: '2022-10-26T07:35:15.666Z',
          lastExecutedAt: '2022-10-26T07:35:15.666Z',
          status: 'running',
          numOpenError: 0,
          numExport: 0,
          oIndex: 0,
          createdAt: '2022-10-26T07:35:10.223Z',
          lastModified: '2022-10-26T07:35:15.716Z',
        },
        {
          numError: 1,
          numResolved: 0,
          numSuccess: 0,
          numIgnore: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 1,
          _flowId: '54321',
          _integrationId: '09876',
          parentStartedAt: '2022-10-26T07:35:07.551Z',
          _id: '7eyd7',
          type: 'import',
          _importId: '45678',
          _flowJobId: '12345',
          startedAt: '2022-10-26T07:35:10.228Z',
          endedAt: '2022-10-26T07:35:20.759Z',
          lastExecutedAt: '2022-10-26T07:35:20.759Z',
          status: 'running',
          numOpenError: 1,
          numExport: 0,
          oIndex: 1,
          retriable: true,
          createdAt: '2022-10-26T07:35:10.228Z',
          lastModified: '2022-10-26T07:35:36.482Z',
          errorFile: {
            id: '7wdyhwh',
            host: 's3',
          },
        },
      ],
    });
    expect(screen.getByRole('heading', { name: /test integration > test flows/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar').className).toEqual(expect.stringContaining('MuiCircularProgress-'));
    expect(screen.getByText(/Child jobs are still in progress and the errors will be shown as soon as the child jobs are completed./i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'JOB_REQUEST_IN_PROGRESS_JOBS_STATUS' });
  });
  test('should test the error drawer when jobs has no errors with integration name as null', async () => {
    await initErrorDrawer({
      jobId: '12345',
      onClose: mockOnClose,
      flowJobsChildrens: [
        {
          numError: 0,
          numResolved: 0,
          numSuccess: 0,
          numIgnore: 0,
          numPagesGenerated: 1,
          numPagesProcessed: 0,
          _flowId: '54321',
          _integrationId: '09876',
          parentStartedAt: '2022-10-26T07:35:07.551Z',
          _id: '32e798',
          type: 'export',
          _exportId: '67890',
          _flowJobId: '12345',
          startedAt: '2022-10-26T07:35:10.223Z',
          endedAt: '2022-10-26T07:35:15.666Z',
          lastExecutedAt: '2022-10-26T07:35:15.666Z',
          status: 'completed',
          numOpenError: 0,
          numExport: 0,
          oIndex: 0,
          createdAt: '2022-10-26T07:35:10.223Z',
          lastModified: '2022-10-26T07:35:15.716Z',
        },
        {
          numError: 0,
          numResolved: 0,
          numSuccess: 1,
          numIgnore: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 1,
          _flowId: '54321',
          _integrationId: '09876',
          parentStartedAt: '2022-10-26T07:35:07.551Z',
          _id: '7eyd7',
          type: 'import',
          _importId: '45678',
          _flowJobId: '12345',
          startedAt: '2022-10-26T07:35:10.228Z',
          endedAt: '2022-10-26T07:35:20.759Z',
          lastExecutedAt: '2022-10-26T07:35:20.759Z',
          status: 'completed',
          numOpenError: 0,
          numExport: 0,
          oIndex: 1,
          retriable: true,
          createdAt: '2022-10-26T07:35:10.228Z',
          lastModified: '2022-10-26T07:35:36.482Z',
        },
      ],
      integrationName: null,
    });
    expect(screen.getByText(/Standalone flows > Test flows/i)).toBeInTheDocument();
    expect(screen.getByText(/no jobs with errors/i)).toBeInTheDocument();
  });
  test('should test the error job data by passing parent job id', async () => {
    const retryObjectId = 'trf34t';

    await initErrorDrawer({
      parentJobId: '12345',
      onClose: mockOnClose,
      integrationName: 'Test Integration',
      showResolved: false,
      flowJobsChildrens: [
        {
          numError: 0,
          numResolved: 0,
          numSuccess: 0,
          numIgnore: 0,
          numPagesGenerated: 1,
          numPagesProcessed: 0,
          _flowId: '54321',
          _integrationId: '09876',
          parentStartedAt: '2022-10-26T07:35:07.551Z',
          _id: '32e798',
          type: 'export',
          _exportId: '67890',
          _parentJobId: '12345',
          startedAt: '2022-10-26T07:35:10.223Z',
          endedAt: '2022-10-26T07:35:15.666Z',
          lastExecutedAt: '2022-10-26T07:35:15.666Z',
          status: 'running',
          numOpenError: 0,
          numExport: 0,
          oIndex: 0,
          createdAt: '2022-10-26T07:35:10.223Z',
          lastModified: '2022-10-26T07:35:15.716Z',
        },
        {
          numError: 1,
          numResolved: 0,
          numSuccess: 0,
          numIgnore: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 1,
          _flowId: '54321',
          _integrationId: '09876',
          parentStartedAt: '2022-10-26T07:35:07.551Z',
          _id: '7eyd7',
          type: 'import',
          _importId: '45678',
          _parentJobId: '12345',
          startedAt: '2022-10-26T07:35:10.228Z',
          endedAt: '2022-10-26T07:35:20.759Z',
          lastExecutedAt: '2022-10-26T07:35:20.759Z',
          status: 'running',
          numOpenError: 1,
          numExport: 0,
          oIndex: 1,
          retriable: true,
          createdAt: '2022-10-26T07:35:10.228Z',
          lastModified: '2022-10-26T07:35:36.482Z',
          errorFile: {
            id: '7wdyhwh',
            host: 's3',
          },
        },
      ],
      jobErrors: [
        {
          _id: 'dyyew',
          _retryId: 'trf34t',
          _jobId: '7eyd7',
          message: 'Testing Error Message',
        },
      ],
      jobRetryObjects: {
        [retryObjectId]: {
          _id: retryObjectId,
          type: 'object',
          _jobId: '7eyd7',
        },
      },
    });
    expect(screen.getByRole('heading', { name: /test integration > test flows > test imports/i })).toBeInTheDocument();
    expect(screen.getByText(/retrydrawer jobid prop = 7eyd7/i)).toBeInTheDocument();
    expect(screen.getByText(/retrydrawer flowjobid prop = 12345/i)).toBeInTheDocument();
    expect(screen.getByText(/retrydrawer height prop = tall/i)).toBeInTheDocument();
    expect(screen.getByText(/joberrortable errorcount prop = 1/i)).toBeInTheDocument();
    expect(screen.getByText(/joberrortable job data prop = 7eyd7/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'JOB_ERROR_REQUEST_COLLECTION',
      jobType: undefined,
      jobId: '7eyd7',
      parentJobId: undefined,
    });
  });
  test('should test the error job data by passing flow job id', async () => {
    const retryObjectId = 'trf34t';

    await initErrorDrawer({
      jobId: '12345',
      onClose: mockOnClose,
      integrationName: 'Test Integration',
      showResolved: false,
      flowJobsChildrens: [
        {
          numError: 0,
          numResolved: 0,
          numSuccess: 0,
          numIgnore: 0,
          numPagesGenerated: 1,
          numPagesProcessed: 0,
          _flowId: '54321',
          _integrationId: '09876',
          parentStartedAt: '2022-10-26T07:35:07.551Z',
          _id: '32e798',
          type: 'export',
          _exportId: '67890',
          _flowJobId: '12345',
          startedAt: '2022-10-26T07:35:10.223Z',
          endedAt: '2022-10-26T07:35:15.666Z',
          lastExecutedAt: '2022-10-26T07:35:15.666Z',
          status: 'running',
          numOpenError: 0,
          numExport: 0,
          oIndex: 0,
          createdAt: '2022-10-26T07:35:10.223Z',
          lastModified: '2022-10-26T07:35:15.716Z',
        },
        {
          numError: 1,
          numResolved: 0,
          numSuccess: 0,
          numIgnore: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 1,
          _flowId: '54321',
          _integrationId: '09876',
          parentStartedAt: '2022-10-26T07:35:07.551Z',
          _id: '7eyd7',
          type: 'import',
          _importId: '45678',
          _flowJobId: '12345',
          startedAt: '2022-10-26T07:35:10.228Z',
          endedAt: '2022-10-26T07:35:20.759Z',
          lastExecutedAt: '2022-10-26T07:35:20.759Z',
          status: 'running',
          numOpenError: 1,
          numExport: 0,
          oIndex: 1,
          retriable: true,
          createdAt: '2022-10-26T07:35:10.228Z',
          lastModified: '2022-10-26T07:35:36.482Z',
          errorFile: {
            id: '7wdyhwh',
            host: 's3',
          },
        },
      ],
      jobErrors: [
        {
          _id: 'dyyew',
          _retryId: 'trf34t',
          _jobId: '7eyd7',
          message: 'Testing Error Message',
        },
      ],
      jobRetryObjects: {
        [retryObjectId]: {
          _id: retryObjectId,
          type: 'object',
          _jobId: '7eyd7',
        },
      },
    });
    expect(screen.getByRole('heading', { name: /test integration > test flows > test imports/i })).toBeInTheDocument();
    expect(screen.getByText(/retrydrawer jobid prop = 7eyd7/i)).toBeInTheDocument();
    expect(screen.getByText(/retrydrawer flowjobid prop = 12345/i)).toBeInTheDocument();
    expect(screen.getByText(/retrydrawer height prop = tall/i)).toBeInTheDocument();
    expect(screen.getByText(/joberrortable errorcount prop = 1/i)).toBeInTheDocument();
    expect(screen.getByText(/joberrortable job data prop = 7eyd7/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'JOB_ERROR_REQUEST_COLLECTION',
      jobType: undefined,
      jobId: '7eyd7',
      parentJobId: undefined,
    });
  });
});
