
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import Filters from '.';
import { getCreatedStore } from '../../../store';
import {mutateStore, renderWithProviders} from '../../../test/test-utils';
import { runServer } from '../../../test/api/server';

let initialStore;

async function initFilters({
  integrationId,
  flowId,
  filterKey,
  onActionClick,
  numJobsSelected,
  numRetriableJobsSelected,
  disableRetry,
  disableResolve,
  isFlowBuilderView,
  filtersData,
}) {
  mutateStore(initialStore, draft => {
    draft.session.filters = filtersData;
  });
  const ui = (
    <MemoryRouter>
      <Filters
        integrationId={integrationId}
        filterKey={filterKey}
        flowId={flowId}
        onActionClick={onActionClick}
        numJobsSelected={numJobsSelected}
        numRetriableJobsSelected={numRetriableJobsSelected}
        disableResolve={disableResolve}
        disableRetry={disableRetry}
        isFlowBuilderView={isFlowBuilderView}
    />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

const mockActionClick = jest.fn();

describe('testsuite for Job Dashboard Filters', () => {
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
    // jest.useFakeTimers('modern');
    // jest.setSystemTime(new Date('04 Dec 1995 00:12:00 GMT').getTime());
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    mockActionClick.mockClear();
    // jest.useRealTimers();
  });
  test('should test the disabled retry and disabled resolve button by setting disableRetry and disableResolve as true', async () => {
    const mockActionClick = jest.fn();

    await initFilters({
      integrationId: '1234',
      filterKey: 'jobs',
      flowId: '9876',
      onActionClick: mockActionClick,
      disableRetry: true,
      disableResolve: true,
    });
    const retryButtonNode = screen.getByRole('button', { name: /retry/i});

    expect(retryButtonNode).toBeInTheDocument();
    expect(retryButtonNode.className).toEqual(expect.stringContaining('disabled'));
    const resolveButtonNode = screen.getByRole('button', { name: /resolve/i});

    expect(resolveButtonNode).toBeInTheDocument();
    expect(resolveButtonNode.className).toEqual(expect.stringContaining('disabled'));
  });
  test('should test the enabled retry button by setting disableRetry as false and isFlowBuilderView as false and by clicking on it', async () => {
    await initFilters({
      integrationId: '1234',
      filterKey: 'jobs',
      flowId: '9876',
      onActionClick: mockActionClick,
      disableRetry: false,
    });
    const retryButtonNode = screen.getByRole('button', { name: /retry/i});

    expect(retryButtonNode).toBeInTheDocument();
    await userEvent.click(retryButtonNode);
    const allEnabledFlowJobsNode = screen.getByRole('option', {
      name: /all enabled flow jobs/i,
    });

    expect(allEnabledFlowJobsNode).toBeInTheDocument();
    expect(allEnabledFlowJobsNode.className).not.toEqual(expect.stringContaining('disabled'));

    const selectedEnabledFlowJobsNode = screen.getByRole('option', {
      name: /0 selected enabled flow jobs/i,
    });

    expect(selectedEnabledFlowJobsNode).toBeInTheDocument();
    expect(selectedEnabledFlowJobsNode.className).toEqual(expect.stringContaining('disabled'));

    await userEvent.click(allEnabledFlowJobsNode);
    expect(mockActionClick).toHaveBeenCalledTimes(1);
  });
  test('should test the enabled retry button by setting disableRetry as false and isFlowBuilderView as true and by clicking on it', async () => {
    await initFilters({
      integrationId: '1234',
      filterKey: 'jobs',
      flowId: '9876',
      onActionClick: mockActionClick,
      disableRetry: false,
      isFlowBuilderView: true,
      numRetriableJobsSelected: 1,
    });
    const retryButtonNode = screen.getByRole('button', { name: /retry/i});

    expect(retryButtonNode).toBeInTheDocument();
    await userEvent.click(retryButtonNode);
    const allJobsNode = screen.getByRole('option', {
      name: /all jobs/i,
    });

    expect(allJobsNode).toBeInTheDocument();
    const selectedJobsNode = screen.getByRole('option', {
      name: /1 selected jobs/i,
    });

    expect(selectedJobsNode).toBeInTheDocument();
    expect(selectedJobsNode.className).not.toEqual(expect.stringContaining('disabled'));
    await userEvent.click(allJobsNode);
    expect(mockActionClick).toHaveBeenCalledTimes(1);
  });
  test('should test the resolve button by setting disableResolve by false and with no jobs', async () => {
    await initFilters({
      integrationId: '1234',
      filterKey: 'jobs',
      flowId: '9876',
      onActionClick: mockActionClick,
      disableResolve: false,
      isFlowBuilderView: true,
      numJobsSelected: 0,
    });
    const resolveButtonNode = screen.getByRole('button', {
      name: /resolve/i,
    });

    expect(resolveButtonNode).toBeInTheDocument();
    await userEvent.click(resolveButtonNode);
    const allJobsNode = screen.getByRole('option', {
      name: /all jobs/i,
    });

    expect(allJobsNode).toBeInTheDocument();
    expect(allJobsNode.className).not.toEqual(expect.stringContaining('disabled'));
    const zeroSelectedJobsButtonNode = screen.getByRole('option', {
      name: /0 selected jobs/i,
    });

    expect(zeroSelectedJobsButtonNode).toBeInTheDocument();
    expect(zeroSelectedJobsButtonNode.className).toEqual(expect.stringContaining('disabled'));
    await userEvent.click(allJobsNode);
    expect(mockActionClick).toHaveBeenCalledTimes(1);
  });
  test('should test the resolve button by setting disableResolve by false and with jobs', async () => {
    await initFilters({
      integrationId: '1234',
      filterKey: 'jobs',
      flowId: '9876',
      onActionClick: mockActionClick,
      disableResolve: false,
      isFlowBuilderView: true,
      numJobsSelected: 1,
    });
    const resolveButtonNode = screen.getByRole('button', {
      name: /resolve/i,
    });

    expect(resolveButtonNode).toBeInTheDocument();
    await userEvent.click(resolveButtonNode);
    const allJobsNode = screen.getByRole('option', {
      name: /all jobs/i,
    });

    expect(allJobsNode).toBeInTheDocument();
    expect(allJobsNode.className).not.toEqual(expect.stringContaining('disabled'));
    const oneSelectedJobsButtonNode = screen.getByRole('option', {
      name: /1 selected jobs/i,
    });

    expect(oneSelectedJobsButtonNode).toBeInTheDocument();
    expect(oneSelectedJobsButtonNode.className).not.toEqual(expect.stringContaining('disabled'));
    await userEvent.click(allJobsNode);
    expect(mockActionClick).toHaveBeenCalledTimes(1);
  });
  test('should test the resolve button by setting disableResolve by false and with jobs duplicate', async () => {
    await initFilters({
      integrationId: '1234',
      filterKey: 'jobs',
      flowId: '9876',
      onActionClick: mockActionClick,
      disableResolve: false,
      isFlowBuilderView: true,
      numJobsSelected: 1,
    });
    const resolveButtonNode = screen.getByRole('button', {
      name: /resolve/i,
    });

    expect(resolveButtonNode).toBeInTheDocument();
    await userEvent.click(resolveButtonNode);
    const allJobsNode = screen.getByRole('option', {
      name: /all jobs/i,
    });

    expect(allJobsNode).toBeInTheDocument();
    expect(allJobsNode.className).not.toEqual(expect.stringContaining('disabled'));
    const oneSelectedJobsButtonNode = screen.getByRole('option', {
      name: /1 selected jobs/i,
    });

    expect(oneSelectedJobsButtonNode).toBeInTheDocument();
    expect(oneSelectedJobsButtonNode.className).not.toEqual(expect.stringContaining('disabled'));
    await userEvent.click(allJobsNode);
    expect(mockActionClick).toHaveBeenCalledTimes(1);
  });
  test('should test the filter button when it has flows', async () => {
    await initFilters({
      integrationId: '1234',
      filterKey: 'jobs',
      flowId: '9876',
      onActionClick: mockActionClick,
      disableResolve: false,
      isFlowBuilderView: true,
      numJobsSelected: 0,
    });
    expect(screen.getByText(/Filter by:/i)).toBeInTheDocument();
    const selectStatusNode = screen.getByRole('button', {name: /select status/i});

    expect(selectStatusNode).toBeInTheDocument();
    await userEvent.click(selectStatusNode);
    const selectStatusListBoxNode = screen.getByRole('listbox');

    expect(selectStatusListBoxNode).toBeInTheDocument();
    const selectStatusOptionNode = screen.getByRole('option', {name: /select status/i});

    expect(selectStatusOptionNode).toBeInTheDocument();
    const containsErrorOptionNode = screen.getByRole('option', {name: /contains error/i});

    expect(containsErrorOptionNode).toBeInTheDocument();
    const containsResolvedOptionNode = screen.getByRole('option', {name: /contains resolved/i});

    expect(containsResolvedOptionNode).toBeInTheDocument();
    const inProgressOptionNode = screen.getByRole('option', {name: /in progress/i});

    expect(inProgressOptionNode).toBeInTheDocument();
    const retryingOptionNode = screen.getByRole('option', {name: /retrying/i});

    expect(retryingOptionNode).toBeInTheDocument();
    const queuedOptionNode = screen.getByRole('option', {name: /queued/i});

    expect(queuedOptionNode).toBeInTheDocument();
    const canceledOptionNode = screen.getByRole('option', {name: /canceled/i});

    expect(canceledOptionNode).toBeInTheDocument();
    const completedOptionNode = screen.getByRole('option', {name: /completed/i});

    expect(completedOptionNode).toBeInTheDocument();
    const failedOptionNode = screen.getByRole('option', {name: /failed/i});

    expect(failedOptionNode).toBeInTheDocument();
    await userEvent.click(containsErrorOptionNode);
    await waitFor(() => expect(containsErrorOptionNode).not.toBeInTheDocument());
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'PATCH_FILTER',
      name: 'jobs',
      filter: { status: 'error', currentPage: 0 },
    });
  });
  test('should test the filter button when it has no flow id and select a flow', async () => {
    await initFilters({
      integrationId: '1234',
      filterKey: 'jobs',
      onActionClick: mockActionClick,
      disableResolve: false,
      isFlowBuilderView: true,
      numJobsSelected: 0,
      filtersData: {
        jobs: {
          flowId: 9876,
          currentPage: 0,
        },
      },
    });
    const flowidButtonNode = document.querySelector('div > div > div > div:nth-child(5) > div');

    expect(flowidButtonNode).toBeInTheDocument();
    await userEvent.click(flowidButtonNode);
    const selectFlowsOptionNode = screen.getByRole('option', {
      name: /select flow/i,
    });

    expect(selectFlowsOptionNode).toBeInTheDocument();
    await userEvent.click(selectFlowsOptionNode);
    await waitFor(() => expect(selectFlowsOptionNode).not.toBeInTheDocument());
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'PATCH_FILTER',
      name: 'jobs',
      filter: { flowId: '', currentPage: 0 },
    });
  });
  test('should test the refresh button and test the run now text', async () => {
    await initFilters({
      integrationId: '1234',
      flowId: '9876',
      filterKey: 'jobs',
      onActionClick: mockActionClick,
      disableResolve: false,
      isFlowBuilderView: true,
      numJobsSelected: 0,
    });
    expect(screen.getByRole('button', {name: /run now/i})).toBeInTheDocument();
    waitFor(async () => {
      const refreshButtonNode = screen.getByRole('button', {name: /refresh/i});

      expect(refreshButtonNode).toBeInTheDocument();
      await userEvent.click(refreshButtonNode);
      expect(mockDispatchFn).toHaveBeenCalledWith({
        type: 'PATCH_FILTER',
        name: 'jobs',
        filter: { refreshAt: 818035920000, currentPage: 0 },
      });
    });
  });
  test('should test the hide empty box checkbox', async () => {
    await initFilters({
      integrationId: '1234',
      flowId: '9876',
      filterKey: 'jobs',
      onActionClick: mockActionClick,
      disableResolve: false,
      isFlowBuilderView: true,
      numJobsSelected: 0,
    });
    waitFor(async () => {
      const hideEmptyJobsCheckboxNode = screen.getByRole('checkbox', {name: /Hide empty jobs/i});

      expect(hideEmptyJobsCheckboxNode).toBeInTheDocument();
      expect(hideEmptyJobsCheckboxNode).not.toBeChecked();
      await userEvent.click(hideEmptyJobsCheckboxNode);
      expect(mockDispatchFn).toHaveBeenCalledWith({
        type: 'PATCH_FILTER',
        name: 'jobs',
        filter: { hideEmpty: true, currentPage: 0 },
      });
    });
  });
});
