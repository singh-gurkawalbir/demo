import { get, sortBy } from 'lodash';

export const FILTER_KEYS = {
  OPEN: 'openErrors',
  RESOLVED: 'resolvedErrors',
};

export const DEFAULT_FILTERS = {
  OPEN: {
    searchBy: ['message', 'source', 'code', 'occurredAt', 'traceKey', 'errorId'],
  },
  RESOLVED: {
    searchBy: ['message', 'source', 'code', 'occurredAt', 'traceKey', 'errorId', 'resolvedAt', 'resolvedBy'],
  },
};

export const getFilteredErrors = (errors = [], options = {}) => {
  const { keyword, searchBy = [] } = options;

  function searchKey(resource, key) {
    const value = get(resource, key);

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
  const { occurredAt, code, message, errorId, traceKey, source } = error;

  const content = `
  Message: 
  ${message}
  
  Code: ${code}

  Source: ${source}
  
  Timestamp: ${occurredAt}

  Error ID: ${errorId}

  ${traceKey ? `Trace key : ${traceKey} ` : ''}
  `;

  return content;
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

export const getSourceOptions = (sourceList = [], applicationName) => {
  const sourceLabelsMap = {
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
  };
  const options = sourceList.map(sourceId => ({_id: sourceId, name: sourceLabelsMap[sourceId] || sourceId}));
  const sortedOptions = sortBy(options, s => s.name);

  return [{ _id: 'all', name: 'All sources'}, ...sortedOptions];
};
