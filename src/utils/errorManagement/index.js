import { get, sortBy } from 'lodash';
import moment from 'moment';
import { convertUtcToTimezone } from '../date';

export const MAX_ERRORS_TO_RETRY_OR_RESOLVE = 1000;

export const FILTER_KEYS = {
  OPEN: 'openErrors',
  RESOLVED: 'resolvedErrors',
  RUN_HISTORY: 'runHistory',
  RETRIES: 'retries',
};

export const DEFAULT_FILTERS = {
  OPEN: {
    searchBy: ['message', 'source', 'classification', 'code', 'occurredAt', 'traceKey', 'errorId'],
  },
  RESOLVED: {
    searchBy: ['message', 'source', 'classification', 'code', 'occurredAt', 'traceKey', 'errorId', 'resolvedAt', 'resolvedBy'],
  },
  RETRIES: {
    selectedUsers: ['all'],
  },
};

export const DEFAULT_ROWS_PER_PAGE = 50;

export const ERROR_MANAGEMENT_RANGE_FILTERS = [
  {id: 'today', label: 'Today'},
  {id: 'yesterday', label: 'Yesterday'},
  {id: 'last24hours', label: 'Last 24 hours'},
  {id: 'last7days', label: 'Last 7 days'},
  {id: 'last15days', label: 'Last 15 days'},
  {id: 'last30days', label: 'Last 30 days'},
  {id: 'custom', label: 'Custom'},
];
const ERROR_MANAGEMENT_2_DATE_FIELDS = ['occurredAt', 'resolvedAt'];
export const getFilteredErrors = (errors = [], options = {}, preferences = {}, timezone) => {
  const { keyword, searchBy = [] } = options;

  function searchKey(resource, key) {
    let value = get(resource, key);

    if (ERROR_MANAGEMENT_2_DATE_FIELDS.includes(key)) {
      value = `${value}|${convertUtcToTimezone(value, preferences.dateFormat, preferences.timeFormat, timezone)}`;
    }

    return typeof value === 'string' ? value : '';
  }

  const errorFilter = r => {
    if (!keyword) return true;

    const searchableText = `${searchBy
      .map(key => searchKey(r, key))
      .join('|')}`;

    return searchableText.toUpperCase().indexOf(keyword.toUpperCase()) >= 0;
  };

  return errors.filter(errorFilter);
};

export const formatErrorDetails = (error = {}) => {
  const { occurredAt, code, message, errorId, traceKey, source, classification } = error;

  const splitMessage = message && message.split('\n');
  let formattedMessage = '';

  splitMessage?.forEach(str => {
    formattedMessage = formattedMessage.concat(`  ${str}\n`);
  });

  return `
  Message: 
  ${formattedMessage}
  Code: ${code}

  Source: ${source}
  
  Timestamp: ${occurredAt}

  Error ID: ${errorId}
  ${classification ? `\n  Classification : ${classification}\n` : ''}
  ${traceKey ? `Trace key : ${traceKey} ` : ''}
  `;
};

export const getErrorMapWithTotal = (errorList = [], resourceId) => {
  const errorMap = {};
  let totalCount = 0;

  errorList.forEach(error => {
    if (resourceId && error[resourceId]) {
      errorMap[error[resourceId]] = error.numError;
      totalCount += error.numError;
    }
  });

  return {data: errorMap, total: totalCount};
};

export const getOpenErrorDetailsMap = (errorList = [], resourceId) => {
  const errorMap = {};

  errorList.forEach(error => {
    if (resourceId && error[resourceId]) {
      errorMap[error[resourceId]] = error;
    }
  });

  return errorMap;
};

export const getErrorCountDiffMap = (prevErrorMap = {}, currErrorMap = {}) => {
  const resourceIdSet = new Set();

  Object.keys(prevErrorMap).forEach(resourceId => {
    if (prevErrorMap[resourceId] !== currErrorMap[resourceId]) {
      resourceIdSet.add(resourceId);
    }
  });
  Object.keys(currErrorMap).forEach(resourceId => {
    if (prevErrorMap[resourceId] !== currErrorMap[resourceId] && !resourceIdSet.has(resourceId)) {
      resourceIdSet.add(resourceId);
    }
  });

  const resourceIds = Array.from(resourceIdSet);
  const errorDiffMap = {};

  resourceIds.forEach(resourceId => {
    errorDiffMap[resourceId] = (currErrorMap[resourceId] || 0) - (prevErrorMap[resourceId] || 0);
  });

  return errorDiffMap;
};

export const sourceLabelsMap = applicationName => ({
  internal: 'Internal',
  application: `${applicationName || 'Application'}`,
  connection: 'Connection',
  resource: 'Resource',
  transformation: 'Transformation',
  output_filter: 'Output filter',
  input_filter: 'Input filter',
  import_filter: 'Import filter',
  lookup: 'Lookup',
  mapping: 'Mapping',
  response_mapping: 'Response mapping',
  pre_save_page_hook: 'Pre save page hook',
  pre_map_hook: 'Pre map hook',
  post_map_hook: 'Post map hook',
  post_submit_hook: 'Post submit hook',
  post_response_map_hook: 'Post response map hook',
  post_aggregate_hook: 'Post aggregate hook',
  pre_send_hook_ss: 'Pre send suitescript hook',
  pre_map_hook_ss: 'Pre map suitescript hook',
  post_map_hook_ss: 'Post map suitescript hook',
  post_submit_hook_ss: 'Post submit suitescript hook',
});

export const getSourceOptions = (sourceList = [], applicationName) => {
  if (!sourceList.length) return [];

  const options = sourceList.map(sourceId => ({_id: sourceId, name: sourceLabelsMap(applicationName)[sourceId] || sourceId}));
  const sortedOptions = sortBy(options, s => s.name);

  return [{ _id: 'all', name: 'All sources'}, ...sortedOptions];
};

export const CLASSIFICATION_LABELS_MAP = {
  connection: 'Connection',
  duplicate: 'Duplicate',
  governance: 'Governance',
  missing: 'Missing',
  parse: 'Parse',
  value: 'Value',
  intermittent: 'Intermittent',
};

export function getClassificationOptions(classificationList = []) {
  const options = classificationList
    .filter(classificationId => classificationId !== 'none')
    .map(classificationId => ({_id: classificationId, name: CLASSIFICATION_LABELS_MAP[classificationId] || classificationId}));
  const sortedOptions = sortBy(options, s => s.name);

  return [{ _id: 'all', name: 'All classifications'}, ...sortedOptions];
}

export function getJobDuration(job) {
  if (job?.startedAt && job?.endedAt) {
    const dtDiff = moment(moment(job.endedAt) - moment(job.startedAt)).utc();
    let duration = dtDiff.format('HH:mm:ss');

    if (dtDiff.date() > 1) {
      const durationParts = duration.split(':');

      durationParts[0] =
        parseInt(durationParts[0], 10) + (dtDiff.date() - 1) * 24;
      duration = durationParts.join(':');
    }

    return duration;
  }

  return undefined;
}
export function getMockHttpErrorDoc() {
  const MOCK_HTTP_BLOB_DOC = {
    headers: { 'content-type': 'application/json' },
    status: 200,
    bodyKey: 'blob-1234',
  };
  const MOCK_HTTP_DOC = {
    body: { test: 5, users: [] },
    headers: { 'content-type': 'application/json' },
    status: 200,
    url: 'http://www.testurl.com/api/v2/users',
  };

  const MOCK_HTTP_DOC_RESPONSE = {
    request: MOCK_HTTP_BLOB_DOC,
    response: MOCK_HTTP_DOC,
  };

  return MOCK_HTTP_DOC_RESPONSE;
}
