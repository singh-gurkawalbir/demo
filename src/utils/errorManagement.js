import { get } from 'lodash';

export default function getFilteredErrors(errors = [], options = {}) {
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
}

export const formatErrorDetails = error => {
  const { occurredAt, code, message, errorId, traceKey } = error || {};
  const content = `
  Timestamp: ${occurredAt}

  Code: ${code}

  Message:
  ${message}

  Error ID: ${errorId}
  ${traceKey ? `Trace key : ${traceKey} ` : ''}
  `;

  return content;
};

export const getErrorMapWithTotal = (errorList = [], resourceId) => {
  const errorMap = {};
  let totalCount = 0;

  errorList.forEach(error => {
    errorMap[error[resourceId]] = error.numError;
    totalCount += error.numError;
  });

  return {data: errorMap, total: totalCount};
};

export const getResourceIdsOfUpdatedErrors = (prevErrorMap = {}, currErrorMap = {}) => {
  const resourceIds = new Set();

  Object.keys(prevErrorMap).forEach(resourceId => {
    if (prevErrorMap[resourceId] !== currErrorMap[resourceId]) {
      resourceIds.add(resourceId);
    }
  });
  Object.keys(currErrorMap).forEach(resourceId => {
    if (prevErrorMap[resourceId] !== currErrorMap[resourceId] && !resourceIds.has(resourceId)) {
      resourceIds.add(resourceId);
    }
  });

  return Array.from(resourceIds);
};

