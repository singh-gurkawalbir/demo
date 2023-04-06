
import { screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import ChildJobDetail from './ChildJobDetail';
import { renderWithProviders } from '../../test/test-utils';

function initChildJobDetail({
  job,
  parentJob,
  onSelectChange,
  selectedJobs,
  userPermissionsOnIntegration,
  onViewErrorsClick,
  integrationName,
  isFlowBuilderView,
}) {
  const ui = (
    <ChildJobDetail
      job={job}
      parentJob={parentJob}
      onSelectChange={onSelectChange}
      selectedJobs={selectedJobs}
      userPermissionsOnIntegration={userPermissionsOnIntegration}
      onViewErrorsClick={onViewErrorsClick}
      integrationName={integrationName}
      isFlowBuilderView={isFlowBuilderView}
    />
  );

  return renderWithProviders(ui);
}

const mockOnSelectChange = jest.fn();
const mockOnViewErrorsClick = jest.fn();

jest.mock('./JobActionsMenu', () => ({
  __esModule: true,
  ...jest.requireActual('./JobActionsMenu'),
  default: props => (
    <>
      <div>Job = {JSON.stringify(props.job)}</div>
      <div>userPermissionsOnIntegration = {props.userPermissionsOnIntegration}</div>
      <div>integrationName = {props.integrationName}</div>
      <div>isFlowBuilderView = {props.isFlowBuilderView}</div>
    </>
  ),
}));
jest.mock('../DateTimeDisplay', () => ({
  __esModule: true,
  ...jest.requireActual('../DateTimeDisplay'),
  default: props => (
    <div>dateTime = {props.dateTime}</div>
  ),
}));
jest.mock('../../utils/jobdashboard', () => ({
  __esModule: true,
  ...jest.requireActual('../../utils/jobdashboard'),
  getPages: jest.fn().mockReturnValue('Testing Get Pages'),
  getSuccess: jest.fn().mockReturnValue('Testing Get Success'),
}));
jest.mock('./JobStatus', () => ({
  __esModule: true,
  ...jest.requireActual('./JobStatus'),
  default: jest.fn().mockReturnValue('Testing Job Status'),
}));

describe('testsuite for ChildJobDetail', () => {
  afterEach(() => {
    mockOnSelectChange.mockClear();
    mockOnViewErrorsClick.mockClear();
  });
  test('should test the checkbox by selecting the child job', async () => {
    initChildJobDetail({
      job: {_id: 123, type: 'export', numError: 1, numResolved: 0, retriable: true, endedAt: 'testing ended at', duration: 'Testing Duration', uiStatus: 'running', numIgnore: 0},
      parentJob: {_id: 234},
      selectedJobs: {234: {_name: 'Testing Selected Jobs', selected: false, selectedChildJobIds: []}},
      onSelectChange: mockOnSelectChange,
      userPermissionsOnIntegration: 'Testing User Permission on Integration',
      onViewErrorsClick: mockOnViewErrorsClick,
      integrationName: 'Test Integration',
      isFlowBuilderView: 'Testing Is Flow Builder View',
    });
    const checkBoxNode = screen.getByRole('checkbox');

    expect(checkBoxNode).toBeInTheDocument();
    await userEvent.click(checkBoxNode);
    expect(mockOnSelectChange).toHaveBeenCalledWith(true, 123);
  });
  test('should test the selected child job checkbox', () => {
    initChildJobDetail({
      job: {_id: 123, type: 'export', numError: 1, numResolved: 0, retriable: true, endedAt: 'testing ended at', duration: 'Testing Duration', uiStatus: 'running', numIgnore: 0},
      parentJob: {_id: 234},
      selectedJobs: {234: {_name: 'Testing Selected Jobs', selected: true}},
      onSelectChange: mockOnSelectChange,
      userPermissionsOnIntegration: 'Testing User Permission on Integration',
      onViewErrorsClick: mockOnViewErrorsClick,
      integrationName: 'Test Integration',
      isFlowBuilderView: 'Testing Is Flow Builder View',
    });
    expect(mockOnSelectChange).toHaveBeenCalledWith(true, 123, true);
    const checkBoxNode = screen.getByRole('checkbox');

    expect(checkBoxNode).toBeInTheDocument();
    expect(checkBoxNode).toBeChecked();
  });
  test('should test the mocked children components', () => {
    initChildJobDetail({
      job: {_id: 123, type: 'export', numError: 1, numResolved: 0, retriable: true, endedAt: 'testing ended at', duration: 'Testing Duration', uiStatus: 'running', numIgnore: 0},
      parentJob: {_id: 234},
      selectedJobs: {234: {_name: 'Testing Selected Jobs', selected: false, selectedChildJobIds: []}},
      onSelectChange: mockOnSelectChange,
      userPermissionsOnIntegration: 'Testing User Permission on Integration',
      onViewErrorsClick: mockOnViewErrorsClick,
      integrationName: 'Test Integration',
      isFlowBuilderView: 'Testing Is Flow Builder View',
    });
    expect(screen.getByText(/datetime = testing ended at/i)).toBeInTheDocument();
    expect(screen.getByText(
      /job = \{"_id":123,"type":"export","numerror":1,"numresolved":0,"retriable":true,"endedat":"testing ended at","duration":"testing duration","uistatus":"running","numignore":0\}/i
    )).toBeInTheDocument();
    expect(screen.getByText(/userpermissionsonintegration = testing user permission on integration/i)).toBeInTheDocument();
    expect(screen.getByText(/integrationname = test integration/i)).toBeInTheDocument();
    expect(screen.getByText(/isflowbuilderview = testing is flow builder view/i)).toBeInTheDocument();
  });
  test('should test the error jobs by clicking', async () => {
    initChildJobDetail({
      job: {_id: 123, type: 'import', numError: 1, numResolved: 1, endedAt: 'testing ended at', duration: 'Testing Duration', uiStatus: 'completed', numIgnore: 0},
      parentJob: {_id: 234},
      selectedJobs: {234: {_name: 'Testing Selected Jobs', selected: false}},
      onSelectChange: mockOnSelectChange,
      userPermissionsOnIntegration: 'Testing User Permission on Integration',
      onViewErrorsClick: mockOnViewErrorsClick,
      integrationName: 'Test Integration',
      isFlowBuilderView: 'Testing Is Flow Builder View',
    });
    const errorJobsNode = document.querySelector('td[data-test="view-job-error"]');

    expect(errorJobsNode).toBeInTheDocument();
    await userEvent.click(errorJobsNode);
    expect(mockOnViewErrorsClick).toHaveBeenCalledWith({jobId: 123, numError: 1, numResolved: 1, parentJobId: 234, showResolved: false});
  });
  test('should test the resolved jobs by clicking', async () => {
    initChildJobDetail({
      job: {_id: 123, type: 'import', numError: 0, numResolved: 1, endedAt: 'testing ended at', duration: 'Testing Duration', uiStatus: 'completed', numIgnore: 0},
      parentJob: {_id: 234},
      selectedJobs: {234: {_name: 'Testing Selected Jobs', selected: false}},
      onSelectChange: mockOnSelectChange,
      userPermissionsOnIntegration: 'Testing User Permission on Integration',
      onViewErrorsClick: mockOnViewErrorsClick,
      integrationName: 'Test Integration',
      isFlowBuilderView: 'Testing Is Flow Builder View',
    });
    const resolvedJobsNode = document.querySelector('td[data-test="view-job-resolved"]');

    expect(resolvedJobsNode).toBeInTheDocument();
    await userEvent.click(resolvedJobsNode);
    expect(mockOnViewErrorsClick).toHaveBeenCalledWith({jobId: 123, numError: 0, numResolved: 1, parentJobId: 234, showResolved: true});
  });
});
