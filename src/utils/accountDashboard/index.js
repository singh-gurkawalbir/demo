import { addDays, startOfDay } from 'date-fns';
import { JOB_STATUS } from '../../constants';

export const FILTER_KEYS_AD = {
  RUNNING: 'runningFlows',
  COMPLETED: 'completedFlows',
  DASHBOARD: 'dashboard',
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

export const RUNNNING_STATUS_OPTIONS = [{_id: 'all', name: 'All statuses'},
  {_id: JOB_STATUS.RUNNING, name: 'In progress'},
  {_id: JOB_STATUS.CANCELING, name: 'Canceling'},
  {_id: JOB_STATUS.QUEUED, name: 'Waiting in queue'}];

export function getTimeString(timeInMs = 0, delim = ':') {
  const showWith0 = value => (value < 10 ? `0${value}` : value);
  const hours = showWith0(Math.floor((timeInMs / (1000 * 60 * 60)) % 60));
  const minutes = showWith0(Math.floor((timeInMs / (1000 * 60)) % 60));
  const seconds = showWith0(Math.floor((timeInMs / 1000) % 60));

  return `${hours}${delim}${minutes}${delim}${seconds}`;
}

export const RUN_HISTORY_STATUS_OPTIONS = [
  ['all', 'Select status'],
  ['error', 'Contains error'],
  ['canceled', 'Canceled'],
  ['completed', 'Completed'],
  ['failed', 'Failed']];

export const getDashboardIntegrationId = (integrationId, childId, isIntegrationAppV1) => {
  if (childId) {
    if (isIntegrationAppV1) {
      return `store${childId}pid${integrationId}`;
    }

    return childId;
  }

  return integrationId;
};

