import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobStatus from './JobStatus';
import { renderWithProviders } from '../../test/test-utils';

async function initJobStatus({job}) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/integrations/${job.integrationId}/dashboard/runningFlows`}]}
    >
      <Route
        path={`/integrations/${job.integrationId}/dashboard/runningFlows`}
        params={{
          integrationId: '0987',
          dashboardTab: 'runningFlows',
        }}
      >
        <JobStatus job={job} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
describe('testsuite for JobStatus', () => {
  test('should test the Jobstatus when the status is in running', async () => {
    await initJobStatus({
      job: {
        id: 123,
        _flowId: 8765,
        integrationId: '0987',
        name: 'test name 1',
        type: 'flow',
        status: 'running',
        doneExporting: false,
        uiStatus: 'retrying',
      },
    });
    const spinnerNode = screen.getByRole('progressbar', {hidden: true});

    expect(spinnerNode.className).toEqual(expect.stringContaining('MuiCircularProgress'));
    const retryingButtonNode = screen.getByRole('button', {name: 'Retrying...'});

    expect(retryingButtonNode).toBeInTheDocument();
    await userEvent.click(retryingButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/0987/dashboard/runningFlows/flows/8765/queuedJobs');
  });
  test('should test the Jobstatus when the status is in running and doneExporting as true', async () => {
    await initJobStatus({
      job: {
        id: 123,
        _flowId: 8765,
        integrationId: '0987',
        name: 'test name 1',
        type: 'flow',
        status: 'running',
        doneExporting: true,
        uiStatus: 'retrying',
      },
    });
    const spinnerNode = screen.getByRole('progressbar', {hidden: true});

    expect(spinnerNode.className).toEqual(expect.stringContaining('MuiCircularProgress'));
    const retryingButtonNode = screen.getByText('Retrying...');

    expect(retryingButtonNode).toBeInTheDocument();
  });
  test('should test the Jobstatus when the status is in queued', async () => {
    await initJobStatus({
      job: {
        id: 123,
        _flowId: 8765,
        integrationId: '0987',
        name: 'test name 1',
        type: 'flow',
        status: 'queued',
        doneExporting: true,
        uiStatus: 'queued',
      },
    });
    const spinnerNode = screen.getByRole('progressbar', {hidden: true});

    expect(spinnerNode.className).toEqual(expect.stringContaining('MuiCircularProgress'));
    const retryingButtonNode = screen.getByRole('button', {name: 'Waiting in queue...'});

    expect(retryingButtonNode).toBeInTheDocument();
    await userEvent.click(retryingButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/0987/dashboard/runningFlows/flows/8765/queuedJobs');
  });
  test('should test the Jobstatus when the status is in completed', async () => {
    await initJobStatus({
      job: {
        id: 123,
        _flowId: 8765,
        integrationId: '0987',
        name: 'test name 1',
        type: 'flow',
        status: 'completed',
        doneExporting: true,
        uiStatus: 'completed',
      },
    });
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
  });
  test('should test the Jobstatus when the status is in queued duplicate', async () => {
    await initJobStatus({
      job: {
        id: 123,
        _flowId: 8765,
        integrationId: '0987',
        name: 'test name 1',
        type: 'flow',
        status: 'completed',
        doneExporting: true,
        uiStatus: 'queued',
      },
    });
    expect(screen.getByText('Waiting in queue...')).toBeInTheDocument();
  });
  test('should test the Jobstatus when there is no status', async () => {
    await initJobStatus({
      job: {
        id: 123,
        _flowId: 8765,
        integrationId: '0987',
        name: 'test name 1',
        type: 'flow',
        doneExporting: true,
      },
    });
    const spinnerNode = screen.getByRole('progressbar', {hidden: true});

    expect(spinnerNode.className).toEqual(expect.stringContaining('MuiCircularProgress'));
    const retryingButtonNode = screen.getByText('undefined');

    expect(retryingButtonNode).toBeInTheDocument();
  });
  test('should test the Jobstatus when there is no status and has ui status as completing', async () => {
    await initJobStatus({
      job: {
        id: 123,
        _flowId: 8765,
        integrationId: '0987',
        name: 'test name 1',
        type: 'flow',
        doneExporting: true,
        uiStatus: 'completing',
        percentComplete: 100,
      },
    });
    expect(screen.getByText(/Completing.../i)).toBeInTheDocument();
  });
  test('should display info of who canceled the job', async () => {
    await initJobStatus({
      job: {
        id: 123,
        _flowId: 8765,
        integrationId: '0987',
        name: 'test name 1',
        type: 'export',
        status: 'canceled',
        uiStatus: 'canceled',
        doneExporting: true,
        canceledBy: 'system',
      },
    });
    expect(screen.getByText('Canceled')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Canceled by system');
  });
});
