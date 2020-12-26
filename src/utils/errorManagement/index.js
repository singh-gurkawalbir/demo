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
  // Ref: https://github.com/celigo/integrator-adaptor/blob/master/util/errorUtil.js#L68
  const sourceOptions = {
    internal: 'Internal',
    application: 'Application',
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
    // PRE_SEND_HOOK_SS: 'pre_send_hook_ss',
    // PRE_MAP_HOOK_SS: 'pre_map_hook_ss',
    // POST_MAP_HOOK_SS: 'post_map_hook_ss',
    // POST_SUBMIT_HOOK_SS: 'post_submit_hook_ss',
  };
  const options = Object.keys(sourceOptions).map(sourceId => ({_id: sourceId, name: sourceOptions[sourceId]}));

  return [{ _id: 'all', name: 'All sources'}, ...options];
};

