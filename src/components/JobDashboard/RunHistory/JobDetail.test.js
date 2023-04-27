
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import JobDetail from './JobDetail';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';

let initialStore;

function initJobDetail({ job, flowData }) {
  mutateStore(initialStore, draft => {
    draft.data.resources.flows = [
      flowData,
    ];
  });

  const ui = (
    <MemoryRouter>
      <JobDetail job={job} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('testsuite for JobDetail', () => {
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
  });
  test('should render the Job details and click on dropdown button', async () => {
    const job = {
      numError: 1,
      numResolved: 0,
      numSuccess: 0,
      numIgnore: 0,
      numPagesGenerated: 0,
      _id: '12345',
      _flowId: '67890',
      startedAt: '2022-10-12T12:10:05.226Z',
      endedAt: '2022-10-12T12:10:05.469Z',
      status: 'failed',
      numOpenError: 1,
      numExport: 0,
      children: [
        {
          _id: '87654',
          type: 'export',
          _exportId: '65432',
          name: 'Test Export',
          status: 'failed',
          startedAt: '2022-10-27T06:05:53.713Z',
          endedAt: '2022-10-27T06:06:04.323Z',
          numError: 1,
          numExport: 0,
          numOpenError: 1,
          numPagesGenerated: 1,
        },
      ],
      type: 'flow',
      duration: '00:00:10',
      name: 'Test',
    };
    const flowData = {
      _id: '67890',
      name: 'Test Flow',
    };

    initJobDetail({ job, flowData });
    const jobDetailButtonNode = document.querySelector('button[data-test="toggleJobDetail"]');

    expect(jobDetailButtonNode).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.queryByText(/Test export/i)).not.toBeInTheDocument();
    await userEvent.click(jobDetailButtonNode);
    expect(screen.getByText(/Test export/i)).toBeInTheDocument();
  });
  test('should render the Job details and click on dropdown button when the child jobs are not loaded', async () => {
    const job = {
      numError: 1,
      numResolved: 0,
      numSuccess: 0,
      numIgnore: 0,
      numPagesGenerated: 0,
      _id: '12345',
      _flowId: '67890',
      startedAt: '2022-10-12T12:10:05.226Z',
      endedAt: '2022-10-12T12:10:05.469Z',
      status: 'failed',
      numOpenError: 1,
      numExport: 0,
      type: 'flow',
      duration: '00:00:10',
      name: 'Test',
    };
    const flowData = {
      _id: '67890',
      name: 'Test Flow',
    };

    initJobDetail({ job, flowData });
    const jobDetailButtonNode = document.querySelector('button[data-test="toggleJobDetail"]');

    expect(jobDetailButtonNode).toBeInTheDocument();
    expect(screen.queryByText(/Test export/i)).not.toBeInTheDocument();
    await userEvent.click(jobDetailButtonNode);
    expect(screen.getByRole('progressbar').className).toEqual(expect.stringContaining('MuiCircularProgress-'));
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'RUN_HISTORY_REQUEST_FAMILY', jobId: '12345' });
  });
  test('should render the Job details and click on dropdown button when name is not passed in the props and test the store flow name', async () => {
    const job = {
      numError: 1,
      numResolved: 0,
      numSuccess: 0,
      numIgnore: 0,
      numPagesGenerated: 0,
      _id: '12345',
      _flowId: '67890',
      startedAt: '2022-10-12T12:10:05.226Z',
      endedAt: '2022-10-12T12:10:05.469Z',
      status: 'failed',
      numOpenError: 1,
      numExport: 0,
      children: [
        {
          _id: '87654',
          type: 'export',
          _exportId: '65432',
          name: 'Test Export',
          status: 'failed',
          startedAt: '2022-10-27T06:05:53.713Z',
          endedAt: '2022-10-27T06:06:04.323Z',
          numError: 1,
          numExport: 0,
          numOpenError: 1,
          numPagesGenerated: 1,
        },
      ],
      type: 'flow',
      duration: '00:00:10',
    };
    const flowData = {
      _id: '67890',
      name: 'Test Flow',
    };

    initJobDetail({ job, flowData });
    const jobDetailButtonNode = document.querySelector('button[data-test="toggleJobDetail"]');

    expect(jobDetailButtonNode).toBeInTheDocument();
    expect(screen.getByText(/Test flow/i)).toBeInTheDocument();
    expect(screen.queryByText(/Test export/i)).not.toBeInTheDocument();
    await userEvent.click(jobDetailButtonNode);
    expect(screen.getByText(/Test export/i)).toBeInTheDocument();
  });
  test('should render the Job details and click on dropdown button when name is not passed in the props and test the prop flow id instead', async () => {
    const job = {
      numError: 1,
      numResolved: 0,
      numSuccess: 0,
      numIgnore: 0,
      numPagesGenerated: 0,
      _id: '12345',
      _flowId: '67890',
      startedAt: '2022-10-12T12:10:05.226Z',
      endedAt: '2022-10-12T12:10:05.469Z',
      status: 'failed',
      numOpenError: 1,
      numExport: 0,
      children: [
        {
          _id: '87654',
          type: 'export',
          _exportId: '65432',
          name: 'Test Export',
          status: 'failed',
          startedAt: '2022-10-27T06:05:53.713Z',
          endedAt: '2022-10-27T06:06:04.323Z',
          numError: 1,
          numExport: 0,
          numOpenError: 1,
          numPagesGenerated: 1,
        },
      ],
      type: 'flow',
      duration: '00:00:10',
    };
    const flowData = {
      _id: '67890',
    };

    initJobDetail({ job, flowData });
    const jobDetailButtonNode = document.querySelector('button[data-test="toggleJobDetail"]');

    expect(jobDetailButtonNode).toBeInTheDocument();
    expect(screen.getByText('67890')).toBeInTheDocument();
    expect(screen.queryByText(/Test export/i)).not.toBeInTheDocument();
    await userEvent.click(jobDetailButtonNode);
    expect(screen.getByText(/Test export/i)).toBeInTheDocument();
  });
});

