import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import RunHistory from './index';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';

let initialStore;

function initRunHistory({ flowId, runHistoryData, filterData, dataRetentionPeriod, defaultAShareId }) {
  mutateStore(initialStore, draft => {
    draft.session.errorManagement = {
      runHistory: {
        [flowId]: runHistoryData,
      },
    };
    draft.session.filters = {
      runHistory: filterData,
    };
    draft.data.accountSettings.dataRetentionPeriod = dataRetentionPeriod;
    draft.user.preferences.defaultAShareId = defaultAShareId || 'own';
    draft.user.org.accounts = [
      {
        accessLevel: 'owner',
        _id: 'own',
        ownerUser: {
          licenses: [
            {
              endpoint: {
                production: {},
                sandbox: {},
                apiManagement: true,
              },
              maxAllowedDataRetention: 180,
              supportTier: 'preferred',
              tier: 'enterprise',
              type: 'endpoint',
              _id: 'user1',
            },
          ],
        },
      },
      {
        accessLevel: 'manage',
        _id: 'user1',
        accepted: true,
        ownerUser: {
          licenses: [
            {
              endpoint: {
                production: {},
                sandbox: {},
                apiManagement: true,
              },
              maxAllowedDataRetention: 180,
              supportTier: 'preferred',
              tier: 'enterprise',
              type: 'endpoint',
              _id: 'license2',
            },
          ],
          dataRetentionPeriod: 60,
        },
      },
    ];
    draft.user.org.users = [{
      _id: 'sampleId',
      accessLevel: 'administrator',
      sharedWithUser: {
        _id: '626user1',
        name: 'Sample name',
      },
    }];
  });
  const ui = (
    <RunHistory flowId={flowId} />
  );

  return renderWithProviders(ui, { initialStore });
}

describe('testsuite for RunHistory', () => {
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
    initialStore = getCreatedStore();
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('29 Oct 2022 00:00:00 GMT').getTime());
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    jest.useRealTimers();
  });
  test('should test the spinner when the data is still loading', async () => {
    initRunHistory({
      flowId: '12345',
      runHistoryData: {
        status: 'requested',
      },
    });
    expect(screen.getByRole('progressbar').className).toEqual(expect.stringContaining('MuiCircularProgress-'));
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'RUN_HISTORY_REQUEST', flowId: '12345' });
  });
  test('should test the no data message when there is no run history', async () => {
    initRunHistory({
      flowId: '12345',
      runHistoryData: {
        status: 'completed',
        data: [
        ],
      },
    });
    expect(screen.getByText(/You don't have any run history./i)).toBeInTheDocument();
  });
  test('should test the date range selector and set the preset to today', async () => {
    initRunHistory({
      flowId: '12345',
      runHistoryData: {
        status: 'completed',
        data: [
          {
            _id: 'ud8d9',
          },
        ],
      },
      filterData: {
        range: {
          preset: null,
          startDate: '2022-10-29T00:00:00.000Z',
          endDate: '2022-10-28T23:59:99.999Z',
        },
      },
    });
    const selectRangeButtonNode = screen.getByRole('button', { name: /select range/i });

    expect(selectRangeButtonNode).toBeInTheDocument();
    userEvent.click(selectRangeButtonNode);
    const todayMenuItemButtonNode = screen.getByRole('button', { name: /today/i });

    expect(todayMenuItemButtonNode).toBeInTheDocument();
    await userEvent.click(todayMenuItemButtonNode);
    const applyButtonNode = screen.getByRole('button', { name: /apply/i });

    expect(applyButtonNode).toBeInTheDocument();
    await userEvent.click(applyButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'PATCH_FILTER',
      name: 'runHistory',
      filter: {
        range: {
          startDate: moment().startOf('day').toDate(),
          endDate: moment().toDate(),
          preset: 'today',
        },
      },
    });
  });
  test('should test the date range selector by checking presets available for a given dataRetentionPeriod', async () => {
    await initRunHistory({
      flowId: '12345',
      runHistoryData: {
        status: 'completed',
        data: [
          {
            _id: 'ud8d9',
          },
        ],
      },
      filterData: {
        range: {
          preset: null,
          startDate: '2022-10-29T00:00:00.000Z',
          endDate: '2022-10-28T23:59:99.999Z',
        },
      },
      dataRetentionPeriod: 180,
    });

    const selectRangeButtonNode = screen.getByRole('button', { name: /select range/i });

    expect(selectRangeButtonNode).toBeInTheDocument();
    userEvent.click(selectRangeButtonNode);
    expect(screen.getByRole('button', { name: 'Last 60 days' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Last 90 days' })).toBeInTheDocument();
    const last180daysMenuItemButtonNode = screen.getByRole('button', { name: 'Last 180 days' });

    expect(last180daysMenuItemButtonNode).toBeInTheDocument();
    userEvent.click(last180daysMenuItemButtonNode);
    const applyButtonNode = screen.getByRole('button', { name: /apply/i });

    expect(applyButtonNode).toBeInTheDocument();
    userEvent.click(applyButtonNode);

    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'PATCH_FILTER',
      name: 'runHistory',
      filter: {
        range: {
          startDate: moment().subtract(179, 'days').startOf('day').toDate(),
          endDate: moment().toDate(),
          preset: 'last180days',
        },
      },
    });
  });
  test('should show corresponding options in the dateRange component based on the dataRetentionPeriod selected for a shared user', async () => {
    await initRunHistory({
      flowId: '12345',
      runHistoryData: {
        status: 'completed',
        data: [
          {
            _id: 'ud8d9',
          },
        ],
      },
      filterData: {
        range: {
          preset: null,
          startDate: '2022-10-29T00:00:00.000Z',
          endDate: '2022-10-28T23:59:99.999Z',
        },
      },
      defaultAShareId: 'user1',
    });

    const selectRangeButtonNode = screen.getByRole('button', { name: /select range/i });

    expect(selectRangeButtonNode).toBeInTheDocument();
    userEvent.click(selectRangeButtonNode);
    expect(screen.queryByRole('button', { name: 'Last 60 days' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Last 90 days' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Last 180 days' })).not.toBeInTheDocument();
  });
  test('should test the date range selector by clearing the preset and restoring it it to default', async () => {
    initRunHistory({
      flowId: '12345',
      runHistoryData: {
        status: 'completed',
        data: [
          {
            _id: 'ud8d9',
          },
        ],
      },
      filterData: {
        range: {
          startDate: '2022-10-28T18:30:00.000Z',
          endDate: '2022-10-29T00:00:00.000Z',
          preset: 'today',
        },
      },
    });
    const todayButtonNode = screen.getByRole('button', { name: /today/i });

    expect(todayButtonNode).toBeInTheDocument();
    userEvent.click(todayButtonNode);
    const clearButtonNode = screen.getByRole('button', { name: /clear/i });

    expect(clearButtonNode).toBeInTheDocument();
    await userEvent.click(clearButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'PATCH_FILTER',
      name: 'runHistory',
      filter: {
        range: {
          startDate: moment(new Date('2022-09-30')).startOf('day').toDate(),
          endDate: moment(new Date('2022-10-29')).endOf('day').toDate(),
          preset: null,
        },
      },
    });
  });
  test('should test the select status drop-down', async () => {
    initRunHistory({
      flowId: '12345',
      runHistoryData: {
        status: 'completed',
        data: [
          {
            _id: 'ud8d9',
          },
        ],
      },
      filterData: {
        range: {
          startDate: '2022-10-28T18:30:00.000Z',
          endDate: '2022-10-29T00:00:00.000Z',
          preset: 'today',
        },
      },
    });
    const selectStatusNode = screen.getByRole('button', { name: /select status/i });

    expect(selectStatusNode).toBeInTheDocument();
    await userEvent.click(selectStatusNode);
    const containsErrorOption = screen.getByRole('option', { name: /Contains error/i });

    expect(containsErrorOption).toBeInTheDocument();
    await userEvent.click(containsErrorOption);
    await waitFor(() => expect(containsErrorOption).not.toBeInTheDocument());
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'PATCH_FILTER',
      name: 'runHistory',
      filter: { status: 'error' },
    });
  });
  test('should test the hide empty runs checkbox', async () => {
    initRunHistory({
      flowId: '12345',
      runHistoryData: {
        status: 'completed',
        data: [
          {
            _id: 'ud8d9',
          },
        ],
      },
    });
    const hideEmptyRunsCheckboxNode = screen.getByRole('checkbox', { name: /hide empty runs/i });

    expect(hideEmptyRunsCheckboxNode).toBeInTheDocument();
    expect(hideEmptyRunsCheckboxNode).not.toBeChecked();
    await userEvent.click(hideEmptyRunsCheckboxNode);
    expect(hideEmptyRunsCheckboxNode).toBeChecked();
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'PATCH_FILTER',
      name: 'runHistory',
      filter: { hideEmpty: true },
    });
  });
  test('should test the refresh button', async () => {
    initRunHistory({
      flowId: '12345',
      runHistoryData: {
        status: 'completed',
        data: [
          {
            _id: 'ud8d9',
          },
        ],
      },
    });
    const refreshButtonNode = screen.getByRole('button', { name: /refresh/i });

    expect(refreshButtonNode).toBeInTheDocument();
    userEvent.click(refreshButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'RUN_HISTORY_REQUEST', flowId: '12345' });
  });

  test('should show the filter to select canceled by upon selecting status filter as canceled', async () => {
    initRunHistory({
      flowId: '12345',
      runHistoryData: {
        status: 'received',
        data: [
          {
            _id: 'ud8d9',
            type: 'flow',
          },
        ],
      },
      filterData: { status: 'canceled' },
    });
    const canceledByFilter = screen.getByRole('button', { name: 'Select canceled by' });

    expect(canceledByFilter).toBeEnabled();
    await userEvent.click(canceledByFilter);
    expect(screen.getByRole('checkbox', {name: 'All users'})).toBeChecked();
    expect(screen.getByRole('checkbox', {name: 'System'})).toBeInTheDocument();
  });

  test('should test the no data message when there is no run history after applying canceledBy filter', async () => {
    initRunHistory({
      flowId: '12345',
      runHistoryData: {
        status: 'received',
        data: [
          {
            _id: 'ud8d9',
            type: 'flow',
          },
        ],
      },
      filterData: { status: 'canceled' },
    });
    expect(screen.queryByText(/You don't have any run history./i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Select canceled by' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'System' }));
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.getByText(/You don't have any run history./i)).toBeInTheDocument();
  });

  test('select canceled by filter should be disabled if there are no canceled flows', () => {
    initRunHistory({
      flowId: '12345',
      runHistoryData: {
        status: 'received',
        data: [
        ],
      },
      filterData: { status: 'canceled' },
    });
    const canceledByFilter = screen.getByRole('button', { name: 'Select canceled by' });

    expect(canceledByFilter).toBeDisabled();
  });

  test('should be able to filter canceled flows according to selected users', async () => {
    initRunHistory({
      flowId: '12345',
      runHistoryData: {
        status: 'received',
        data: [
          {
            _id: 'ud8d9',
            type: 'flow',
            canceledBy: '626user1',
          },
        ],
      },
      filterData: { status: 'canceled' },
    });
    const canceledByFilter = screen.getByRole('button', { name: 'Select canceled by' });

    expect(canceledByFilter).toBeEnabled();
    await userEvent.click(canceledByFilter);

    const userFilter = screen.getByRole('checkbox', { name: 'Sample name' });

    expect(userFilter).toBeInTheDocument();
    await userEvent.click(userFilter);
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.queryByText(/You don't have any run history./i)).not.toBeInTheDocument();
  });
});
