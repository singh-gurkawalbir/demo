import { REVISION_STATUS, REVISION_TYPES } from '../constants';

export const DEFAULT_ROWS_PER_PAGE = 50;
export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export const REVISION_TYPE_OPTIONS = [{
  label: 'Pull',
  value: REVISION_TYPES.PULL,
}, {
  label: 'Revert',
  value: REVISION_TYPES.REVERT,
}, {
  label: 'Snapshot',
  value: REVISION_TYPES.SNAPSHOT,
}];

export const REVISION_STATUS_OPTIONS = [{
  label: 'In progress',
  value: REVISION_STATUS.IN_PROGRESS,
}, {
  label: 'Completed',
  value: REVISION_STATUS.COMPLETED,
}, {
  label: 'Failed',
  value: REVISION_STATUS.FAILED,
}, {
  label: 'Canceled',
  value: REVISION_STATUS.CANCELED,
}];
