
export const FILTER_KEYS = {
  RUNNING: 'runningFlows',
  COMPLETED: 'completedFlows',
};

export const DEFAULT_ROWS_PER_PAGE = 50;

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
