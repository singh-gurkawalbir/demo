
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { TableCell } from '@mui/material';
import userEvent from '@testing-library/user-event';
import JobDetail from './JobDetail';
import { renderWithProviders } from '../../test/test-utils';
import actions from '../../actions';

const mockCheckBox = props => {
  const mockFunction = () => props.onSelectChange(true, props.job._id);

  return (
    <button
      data-test="button"
      onClick={mockFunction}
      type="button"
    >
      Checkbox
    </button>
  );
};
const mockErrorCountCell = props => (
  <TableCell
    data-test={`view-job-${props.isError ? 'error' : 'resolved'}`}
    onClick={props.onClick}
    >
    {props.count}
  </TableCell>
);
const mockOnSelectChange = jest.fn();
const mockOnViewErrorsClick = jest.fn();

function initJobDetail({
  job,
  selectedJobs,
  onSelectChange,
  userPermissionsOnIntegration,
  onViewErrorsClick,
  integrationName,
  isFlowBuilderView,
}) {
  const ui = (
    <JobDetail
      job={job}
      selectedJobs={selectedJobs}
      onSelectChange={onSelectChange}
      userPermissionsOnIntegration={userPermissionsOnIntegration}
      onViewErrorsClick={onViewErrorsClick}
      integrationName={integrationName}
      isFlowBuilderView={isFlowBuilderView}
    />
  );

  return renderWithProviders(ui);
}

jest.mock('./JobActionsMenu', () => ({
  __esModule: true,
  ...jest.requireActual('./JobActionsMenu'),
  default: () => <div>Testing Mock Job Action Menu</div>,
}));
jest.mock('../DateTimeDisplay', () => ({
  __esModule: true,
  ...jest.requireActual('../DateTimeDisplay'),
  default: () => <div>Testing Mock Date Time Display</div>,
}));
jest.mock('./ChildJobDetail', () => ({
  __esModule: true,
  ...jest.requireActual('./ChildJobDetail'),
  default: props => mockCheckBox(props),
}));
jest.mock('./JobStatus', () => ({
  __esModule: true,
  ...jest.requireActual('./JobStatus'),
  default: () => <div>Testing Mock Job Status</div>,
}));
jest.mock('./ErrorCountCell', () => ({
  __esModule: true,
  ...jest.requireActual('./ErrorCountCell'),
  default: (props, event) => mockErrorCountCell(props, event),
}));
describe('testsuite for JobDetail', () => {
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
    mockDispatchFn.mockClear();
    mockOnViewErrorsClick.mockClear();
    mockOnSelectChange.mockClear();
  });
  test('should test the spinner when the child job status is in queued', async () => {
    initJobDetail({
      job: {
        numError: 3,
        numResolved: 0,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
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
      },
      selectedJobs: '',
      onSelectChange: mockOnSelectChange,
      userPermissionsOnIntegration: '',
      onViewErrorsClick: mockOnViewErrorsClick,
      integrationName: 'Test Integration',
      isFlowBuilderView: true,
    });
    const dropDownButtonNode = document.querySelector('button[data-test="toggleJobDetail"]');

    expect(dropDownButtonNode).toBeInTheDocument();
    await userEvent.click(dropDownButtonNode);
    expect(screen.getByRole('progressbar').className).toEqual(expect.stringContaining('MuiCircularProgress-'));
  });
  test('should test the job detail when there are no jobs', () => {
    initJobDetail({
      job: [],
      selectedJobs: '',
      onSelectChange: mockOnSelectChange,
      userPermissionsOnIntegration: '',
      onViewErrorsClick: mockOnViewErrorsClick,
      integrationName: 'Test Integration',
      isFlowBuilderView: true,
    });
    expect(screen.getByText(/testing mock job status/i)).toBeInTheDocument();
    expect(screen.getByText(/testing mock date time display/i)).toBeInTheDocument();
    expect(screen.getByText(/testing mock job action menu/i)).toBeInTheDocument();
  });
  test('should test the non rendered arrow button when the status is queued', () => {
    initJobDetail({
      job: {
        numError: 3,
        numResolved: 0,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
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
        uiStatus: 'queued',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
      },
      selectedJobs: '',
      onSelectChange: mockOnSelectChange,
      userPermissionsOnIntegration: '',
      onViewErrorsClick: mockOnViewErrorsClick,
      integrationName: 'Test Integration',
      isFlowBuilderView: true,
    });
    const dropDownButtonNode = document.querySelector('button[data-test="toggleJobDetail"]');

    expect(dropDownButtonNode).not.toBeInTheDocument();
  });
  test('should test the error count by clicking on it', async () => {
    initJobDetail({
      job: {
        numError: 3,
        numResolved: 1,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
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
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
      },
      selectedJobs: '',
      onSelectChange: mockOnSelectChange,
      userPermissionsOnIntegration: '',
      onViewErrorsClick: mockOnViewErrorsClick,
      integrationName: 'Test Integration',
      isFlowBuilderView: true,
    });
    const viewErrorJobsNode = document.querySelector('td[data-test="view-job-error"]');

    expect(viewErrorJobsNode).toBeInTheDocument();
    await userEvent.click(viewErrorJobsNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.requestFamily({ jobId: '321' }));
    expect(mockOnViewErrorsClick).toHaveBeenCalledWith({jobId: '321', showResolved: false});
  });
  test('should test the resolved count by clicking on it', async () => {
    initJobDetail({
      job: {
        numError: 3,
        numResolved: 1,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
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
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
      },
      selectedJobs: '',
      onSelectChange: mockOnSelectChange,
      userPermissionsOnIntegration: '',
      onViewErrorsClick: mockOnViewErrorsClick,
      integrationName: 'Test Integration',
      isFlowBuilderView: true,
    });
    const resolvedCountNode = document.querySelector('td[data-test="view-job-resolved"]');

    expect(resolvedCountNode).toBeInTheDocument();
    await userEvent.click(resolvedCountNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.requestFamily({ jobId: '321' }));
    expect(mockOnViewErrorsClick).toHaveBeenCalledWith({jobId: '321', showResolved: true});
  });
  test('should test the child job details by clicking on arrow button', async () => {
    initJobDetail({
      job: {
        numError: 3,
        numResolved: 1,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
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
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
      },
      selectedJobs: '',
      onSelectChange: mockOnSelectChange,
      userPermissionsOnIntegration: '',
      onViewErrorsClick: mockOnViewErrorsClick,
      integrationName: 'Test Integration',
      isFlowBuilderView: true,
    });
    const dropDownButtonNode = document.querySelector('button[data-test="toggleJobDetail"]');

    expect(dropDownButtonNode).toBeInTheDocument();
    await userEvent.click(dropDownButtonNode);
    const childButtonNode = document.querySelector('button[data-test="button"]');

    expect(childButtonNode).toBeInTheDocument();
    await userEvent.click(childButtonNode);
    expect(mockOnSelectChange).toHaveBeenCalledWith({flowDisabled: false, selected: true, selectedChildJobIds: [839]}, '321');
  });
});
