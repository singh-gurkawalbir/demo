import { get } from 'lodash';

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

export const getSourceOptions = () => {
  const _sourceEnums = {
    INTERNAL: 'internal',
    APPLICATION: 'application',
    CONNECTION: 'connection',
    RESOURCE: 'resource',
    TRANSFORMATION: 'transformation',
    OUTPUT_FILTER: 'output_filter',
    INPUT_FILTER: 'input_filter',
    IMPORT_FILTER: 'import_filter',
    LOOKUP: 'lookup',
    MAPPING: 'mapping',
    RESPONSE_MAPPING: 'response_mapping',
    PRE_SAVE_PAGE_HOOK: 'pre_save_page_hook',
    PRE_MAP_HOOK: 'pre_map_hook',
    POST_MAP_HOOK: 'post_map_hook',
    POST_SUBMIT_HOOK: 'post_submit_hook',
    POST_RESPONE_MAP_HOOK: 'post_response_map_hook',
    POST_AGGREGATE_HOOK: 'post_aggregate_hook',
    // adding ss hooks here as well so as to check the response from restlets
    PRE_SEND_HOOK_SS: 'pre_send_hook_ss',
    PRE_MAP_HOOK_SS: 'pre_map_hook_ss',
    POST_MAP_HOOK_SS: 'post_map_hook_ss',
    POST_SUBMIT_HOOK_SS: 'post_submit_hook_ss',
  };
  const options = Object.values(_sourceEnums).map(source => ({_id: source, name: source}));

  return [{ _id: 'all', name: 'All sources'}, ...options];
};

