import arrayUtil from '../array';

export const preSaveValidate = ({ editor = {}, enquesnackbar }) => {
  if (editor.processor === 'transform') {
    const duplicates = arrayUtil.getDuplicateValues(
      editor.rule,
      editor.duplicateKeyToValidate
    );

    if (duplicates && duplicates.length) {
      enquesnackbar({
        message: `You have duplicate mappings for the field(s): ${duplicates.join(
          ','
        )}`,
        variant: 'error',
      });

      return false;
    }
    // validation other transform editors to be added here
  }

  return true;
};

export function dataAsString(data) {
  return typeof data === 'string'
    ? data
    : JSON.stringify(data, null, 2);
}

export const getUniqueFieldId = fieldId => {
  if (!fieldId) { return ''; }

  // some field types have same field ids
  switch (fieldId) {
    case 'rdbms.queryInsert':
      return 'rdbms.query.1';
    case 'rdbms.queryUpdate':
      return 'rdbms.query.0';
    case 'http.bodyCreate':
      return 'http.body.1';
    case 'http.bodyUpdate':
      return 'http.body.0';
    case 'http.relativeURIUpdate':
      return 'http.relativeURI.0';
    case 'http.relativeURICreate':
      return 'http.relativeURI.1';
    case 'rest.relativeURIUpdate':
      return 'rest.relativeURI.0';
    case 'rest.relativeURICreate':
      return 'rest.relativeURI.1';
    case 'rest.bodyUpdate':
      return 'rest.body.0';
    case 'rest.bodyCreate':
      return 'rest.body.1';

    default:
      return fieldId;
  }
};

export default { preSaveValidate };
