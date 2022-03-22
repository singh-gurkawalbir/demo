import { REVISION_STATUS, REVISION_TYPES } from '../constants';
import { comparer, sortJsonByKeys } from '../sort';

export const DEFAULT_ROWS_PER_PAGE = 50;
export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export const VALID_REVERT_TO_QUERIES = ['toAfter', 'toBefore'];
export const VALID_REVISION_TYPES_FOR_CREATION = [
  REVISION_TYPES.PULL,
  REVISION_TYPES.REVERT,
  REVISION_TYPES.SNAPSHOT,
];
export const REVISION_DRAWER_MODES = {
  OPEN: 'open',
  REVIEW: 'review',
  INSTALL: 'install',
};
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

export const REVISION_TYPE_LABELS = {
  [REVISION_TYPES.PULL]: 'Pull',
  [REVISION_TYPES.REVERT]: 'Revert',
  [REVISION_TYPES.SNAPSHOT]: 'Snapshot',
};
export const REVISION_STATUS_LABELS = {
  [REVISION_STATUS.IN_PROGRESS]: 'In progress',
  [REVISION_STATUS.COMPLETED]: 'Completed',
  [REVISION_STATUS.FAILED]: 'Failed',
  [REVISION_STATUS.CANCELED]: 'Canceled',
};

export const REVISION_IN_PROGRESS_ERROR = 'You have a pull, snapshot, or revert in progress.';

export const REVISION_DIFF_ACTIONS = {
  ADD: 'add',
  NEW: 'new',
  DELETED: 'deleted',
  UPDATE: 'update',
  CONFLICT: 'conflict',
};

export const REVISION_DIFF_ACTION_LABELS = {
  [REVISION_DIFF_ACTIONS.ADD]: 'Add',
  [REVISION_DIFF_ACTIONS.NEW]: 'New',
  [REVISION_DIFF_ACTIONS.DELETED]: 'Deleted',
  [REVISION_DIFF_ACTIONS.UPDATE]: 'Update',
  [REVISION_DIFF_ACTIONS.CONFLICT]: 'Conflict',
};

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
  sort: {
    order: 'desc',
    orderBy: 'createdAt',
  },
};

const DIFF_TITLES_BY_TYPE = {
  pull: { before: 'Before pull', after: 'After pull'},
  revert: { before: 'Before revert', after: 'After revert'},
  details: { before: 'Before changes', after: 'After changes'},
};

export const getFilteredRevisions = (revisions = [], filters = {}) => {
  const { createdAt, status, user, type, sort = {}, paging = {} } = filters;
  const { currPage = 0, rowsPerPage = DEFAULT_ROWS_PER_PAGE } = paging;

  const filteredRevisions = revisions.filter(revision => {
    if (status !== DEFAULT_OPTION && revision.status !== status) return false;
    if (type !== DEFAULT_OPTION && revision.type !== type) return false;
    if (user !== DEFAULT_OPTION && revision._byUserId !== user) return false;
    if (createdAt?.startDate && revision.createdAt < createdAt.startDate.toISOString()) return false;
    if (createdAt?.endDate && revision.createdAt > createdAt.endDate.toISOString()) return false;

    return true;
  });

  filteredRevisions.sort(comparer(sort));

  return filteredRevisions.slice(currPage * rowsPerPage, (currPage + 1) * rowsPerPage);
};

const getDiffContent = (diff, type) => {
  const RESOURCE_DIFF_KEYS_BY_TYPE = {
    pull: ['current', 'merged'],
    revert: ['current', 'reverted'],
    details: ['before', 'after'],
  };

  const [beforeKey, afterKey] = RESOURCE_DIFF_KEYS_BY_TYPE[type] || ['before', 'after'];

  return {
    before: diff[beforeKey],
    after: diff[afterKey],
  };
};

export const getRevisionResourceLevelChanges = (overallDiff = {}, type, sortKeys = false) => {
  const { numConflicts } = overallDiff;
  const { before, after } = getDiffContent(overallDiff, type);
  const diffs = {};
  const resourcesTypes = Object.keys(after);
  // Ignore Sorting keys for now
  const NOOP = obj => obj;
  const sortFn = sortKeys ? sortJsonByKeys : NOOP;

  resourcesTypes.forEach(resourceType => {
    if (!diffs[resourceType]) {
      diffs[resourceType] = [];
    }
    const resources = after[resourceType];

    Object.keys(resources).forEach(id => {
      const [resourceId, action = REVISION_DIFF_ACTIONS.UPDATE] = id.split('.');
      const resourceDiff = { resourceId, action };
      const {$conflicts, ...rest} = after[resourceType][id];
      // TODO: confirm on script diffs - we do show script changes but not script name as of now
      const afterContent = resourceType === 'script' ? (rest['$blob.conflict'] || rest.$blob) : sortFn(rest);
      const beforeContent = resourceType === 'script' ? before[resourceType]?.[resourceId]?.$blob : sortFn(before[resourceType]?.[resourceId]);

      if (action === REVISION_DIFF_ACTIONS.NEW) {
        resourceDiff.after = afterContent;
      } else if (action === REVISION_DIFF_ACTIONS.DELETED) {
        resourceDiff.before = beforeContent;
      } else {
        if (action === REVISION_DIFF_ACTIONS.CONFLICT) {
          resourceDiff.conflicts = $conflicts;
        }
        resourceDiff.after = afterContent;
        resourceDiff.before = beforeContent;
      }
      diffs[resourceType].push(resourceDiff);
    });
  });

  return { numConflicts, diffs, titles: DIFF_TITLES_BY_TYPE[type] };
};

export const shouldShowReferences = resourceType => {
  const VALID_RESOURCE_TYPES_WITH_REFERENCES = ['exports', 'imports', 'connections'];

  return VALID_RESOURCE_TYPES_WITH_REFERENCES.includes(resourceType);
};
