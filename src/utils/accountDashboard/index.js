import { addDays, startOfDay } from 'date-fns';
import { JOB_STATUS } from '../constants';
import { JOB_UI_STATUS } from '../jobdashboard';

export const FILTER_KEYS_AD = {
  RUNNING: 'runningFlows',
  COMPLETED: 'completedFlows',
};

export const DEFAULT_ROWS_PER_PAGE = 50;
export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export const DEFAULT_RANGE = {
  startDate: startOfDay(addDays(new Date(), -1)),
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
  {id: 'last24hours', label: 'Last 24 hours'},
  {id: 'last36hours', label: 'Last 36 hours'},
  {id: 'last7days', label: 'Last 7 Days'},
  {id: 'last15days', label: 'Last 15 Days'},
  {id: 'last30days', label: 'Last 30 Days'},
  {id: 'custom', label: 'Custom'},
];

export const RUNNNING_STATUS_OPTIONS = [{_id: 'all', name: 'All statuses'},
  {_id: JOB_STATUS.RUNNING, name: 'In progress'},
  {_id: JOB_STATUS.CANCELING, name: 'Canceling'},
  {_id: JOB_STATUS.QUEUED, name: 'Waiting in queue'}];

export const COMPLETED_STATUS_OPTIONS = [{_id: 'all', name: 'All statuses'},
  {_id: JOB_STATUS.CANCELED, name: JOB_UI_STATUS[JOB_STATUS.CANCELED]},
  {_id: JOB_STATUS.COMPLETED, name: JOB_UI_STATUS[JOB_STATUS.COMPLETED]},
  {_id: JOB_STATUS.FAILED, name: JOB_UI_STATUS[JOB_STATUS.FAILED]}];

export function getTimeString(timeInMs = 0, delim = ':') {
  const showWith0 = value => (value < 10 ? `0${value}` : value);
  const hours = showWith0(Math.floor((timeInMs / (1000 * 60 * 60)) % 60));
  const minutes = showWith0(Math.floor((timeInMs / (1000 * 60)) % 60));
  const seconds = showWith0(Math.floor((timeInMs / 1000) % 60));

  return `${hours}${delim}${minutes}${delim}${seconds}`;
}

