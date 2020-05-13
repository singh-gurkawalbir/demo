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
  const { occurredAt, code, message, errorId } = error || {};
  const content = `
  Timestamp: ${occurredAt}

  Code: ${code}

  Message:
  ${message}

  Error ID: ${errorId}
  `;

  return content;
};
