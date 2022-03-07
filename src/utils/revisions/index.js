import { REVISION_STATUS, REVISION_TYPES } from '../constants';
import { comparer } from '../sort';

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

export const getRevisionFilterKey = integrationId => `${integrationId}-revisions`;

export const DEFAULT_OPTION = 'all';

export const DEFAULT_REVISION_FILTERS = {
  createdAt: undefined,
  status: DEFAULT_OPTION,
  user: DEFAULT_OPTION,
  type: DEFAULT_OPTION,
  paging: {
    currPage: 0,
    rowsPerPage: 25,
  },
};

export const getFilteredRevisions = (revisions = [], filters = {}) => {
  const { createdAt, status, user, type, sort = {} } = filters;

  const filteredRevisions = revisions.filter(revision => {
    if (status !== DEFAULT_OPTION && revision.status !== status) return false;
    if (type !== DEFAULT_OPTION && revision.type !== type) return false;
    if (user !== DEFAULT_OPTION && revision._byUserId !== user) return false;
    if (createdAt?.startDate && revision.createdAt < createdAt.startDate.toISOString()) return false;
    if (createdAt?.endDate && revision.createdAt > createdAt.endDate.toISOString()) return false;

    return true;
  });

  return filteredRevisions.sort(comparer(sort));
};

