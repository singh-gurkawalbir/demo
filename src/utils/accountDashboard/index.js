export const FILTER_KEYS_AD = {
  RUNNING: 'runningFlows',
  COMPLETED: 'completedFlows',
};

export const DEFAULT_ROWS_PER_PAGE = 50;
export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export const DEFAULT_RANGE = {
  startDate: new Date(new Date().getTime() - (24 * 60 * 60 * 1000)),
  endDate: new Date(),
  preset: 'last24hours',
};

export const DEFAULTS_RUNNING_JOBS_FILTER = {
  sort: { order: 'asc', orderBy: 'startedAt' },
  paging: {
    rowsPerPage: 50,
    currPage: 0,
  },
};
export const DEFAULTS_COMPLETED_JOBS_FILTER = {
  sort: { order: 'desc', orderBy: 'lastExecutedAt' },
  paging: {
    rowsPerPage: 50,
    currPage: 0,
  },
};

export const ACCOUNT_DASHBOARD_COMPLETED_JOBS_RANGE_FILTERS = [
  {id: 'today', label: 'Today'},
  {id: 'yesterday', label: 'Yesterday'},
  {id: 'last24hours', label: 'Last 24 hours'},
  {id: 'last36hours', label: 'Last 36 hours'},
  {id: 'last7days', label: 'Last 7 Days'},
  {id: 'last15days', label: 'Last 15 Days'},
  {id: 'last30days', label: 'Last 30 Days'},
  {id: 'custom', label: 'Custom'},
];

export const RUNNNING_STATUS_OPTIONS = [{_id: 'all', name: 'All status'},
  {_id: 'running', name: 'In progress'},
  {_id: 'canceling', name: 'Canceling'},
  {_id: 'queued', name: 'Queued'}];

export const COMPLETED_STATUS_OPTIONS = [{_id: 'all', name: 'All status'},
  {_id: 'canceled', name: 'Canceled'},
  {_id: 'completed', name: 'Completed'},
  {_id: 'failed', name: 'failed'}];

