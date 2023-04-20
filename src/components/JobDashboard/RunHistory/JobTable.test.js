
import { screen } from '@testing-library/react';
import React from 'react';
import JobTable from './JobTable';
import {renderWithProviders} from '../../../test/test-utils';

jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  TimeAgo: props => (
    <div>{props.date}</div>
  ),
}));

jest.mock('../../../utils/errorManagement', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/errorManagement'),
  getJobDuration: jest.fn().mockReturnValue('testing duration'),
}));

describe('testsuite for JobTable', () => {
  test('should render the Jobtable', () => {
    const jobsInCurrentPage = [
      {
        numError: 1,
        numResolved: 0,
        numSuccess: 0,
        numIgnore: 0,
        numPagesGenerated: 0,
        _id: '6346ae9b0e08c5314f4ba7ec',
        _flowId: '61de771504b4ad1da7fff7ca',
        startedAt: 'testing started at',
        endedAt: 'testing ended at',
        status: 'failed',
        numOpenError: 1,
        numExport: 0,
        children: [],
        duration: '00:00:00',
        name: 'Test',
      },
    ];

    renderWithProviders(
      <JobTable jobsInCurrentPage={jobsInCurrentPage} />
    );
    expect(screen.getAllByRole('columnheader')).toHaveLength(10);
    expect(screen.getByRole('columnheader', { name: /flow/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /duration/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /started/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /completed/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /success/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /ignored/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /errors/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /pages/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /actions/i })).toBeInTheDocument();
    expect(screen.getAllByRole('cell')).toHaveLength(10);
    expect(screen.getByRole('cell', { name: 'Test' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /failed/i })).toBeInTheDocument();
    expect(screen.getByText(/testing duration/i)).toBeInTheDocument();
    expect(screen.getByText(/testing started at/i)).toBeInTheDocument();
    expect(screen.getByText(/testing ended at/i)).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /1 error/i })).toBeInTheDocument();
  });
});
