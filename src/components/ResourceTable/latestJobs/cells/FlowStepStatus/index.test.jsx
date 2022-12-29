
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
import FlowStepStatus from '.';
import { JOB_STATUS, JOB_TYPES } from '../../../../../constants';
import { renderWithProviders } from '../../../../../test/test-utils';

jest.mock('../../../../JobDashboard/JobStatus', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../JobDashboard/JobStatus'),
  default: props => <div>{`job = ${JSON.stringify(props.job)}`}</div>,
}));
const jobdata = {
  _exportId: '634b79db0cbd27707a2d5080',
  _id: '634cc85cc485937caa99e6a1',
  _importId: '634b7a130cbd27707a2d50a1',
  name: 'export data',
  status: JOB_STATUS.RUNNING,
  type: 'export',
  uiStatus: JOB_STATUS.COMPLETED,
};
const jobdata1 = {
  _exportId: '634b79db0cbd27707a2d5080',
  _id: '634cc85cc485937caa99e6a1',
  _importId: '634b7a130cbd27707a2d50a1',
  _integrationId: '56d6b23fe1fc35de53914730',
  numOpenError: 1,
  numPagesGenerated: 0,
  numPagesProcessed: 1,
  numResolved: 0,
  numSuccess: 0,
  status: JOB_STATUS.RUNNING,
  type: JOB_TYPES.RETRY,
};
const jobdata2 = {
  _id: '634cc85cc485937caa99e6a1',
  status: JOB_STATUS.RUNNING,
  type: 'export',
  uiStatus: JOB_STATUS.COMPLETED,
};

describe('uI test cases for FlowStepStatus', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should display job status when job type is not of retry', () => {
    renderWithProviders(<FlowStepStatus job={jobdata} />);
    const response = screen.getByText('In progress...');

    expect(response).toBeInTheDocument();
  });
  test('should display job status when job type is of retry', () => {
    renderWithProviders(<FlowStepStatus job={jobdata1} />);
    const response = screen.getByText('Retrying errors...');

    expect(response).toBeInTheDocument();
  });
  test('should display data of jobstatus component', () => {
    renderWithProviders(<FlowStepStatus job={jobdata2} />);
    expect(
      screen.getByText(
        /^job = {"_id":"634cc85cc485937caa99e6a1","status":"running","type":"export","uiStatus":"completed"}$/i
      )
    ).toBeInTheDocument();
  });
});
