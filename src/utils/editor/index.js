import arrayUtil from '../array';

export const FLOW_STAGES = [
  'outputFilter',
  'exportFilter',
  'inputFilter',
  'transform',
  'sampleResponse',
];
export const HOOK_STAGES = [
  'postResponseMapHook',
  'preSavePage',
  'preMap',
  'postMap',
  'postSubmit',
  'postAggregate',
  'contentBasedFlowRouter',
  'handleRequest',
];

// todo: remove this when old AFE framework would be removed
// it is now part of processorLogic
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

export const getUniqueFieldId = (fieldId, resource) => {
  if (!fieldId) { return ''; }
  const { ignoreExisting, ignoreMissing } = resource || {};

  // some field types have same field ids
  switch (fieldId) {
    case 'rdbms.query1':
      return 'rdbms.query';
    case 'rdbms.query2':
      return 'rdbms.query';
    case 'rdbms.queryInsert':
      return 'rdbms.query.1';
    case 'rdbms.queryUpdate':
      return 'rdbms.query.0';
    case 'http.bodyCreate':
      if (ignoreExisting || ignoreMissing) { return 'http.body'; }

      return 'http.body.1';

    case 'http.bodyUpdate':
      if (ignoreExisting || ignoreMissing) { return 'http.body'; }

      return 'http.body.0';
    case 'http.relativeURIUpdate':
      if (ignoreExisting || ignoreMissing) { return 'http.relativeURI'; }

      return 'http.relativeURI.0';
    case 'http.relativeURICreate':
      if (ignoreExisting || ignoreMissing) { return 'http.relativeURI'; }

      return 'http.relativeURI.1';
    case 'rest.relativeURIUpdate':
      if (ignoreExisting || ignoreMissing) { return 'rest.relativeURI'; }

      return 'rest.relativeURI.0';
    case 'rest.relativeURICreate':
      if (ignoreExisting || ignoreMissing) { return 'rest.relativeURI'; }

      return 'rest.relativeURI.1';
    case 'rest.bodyUpdate':
      if (ignoreExisting || ignoreMissing) { return 'rest.body'; }

      return 'rest.body.0';
    case 'rest.bodyCreate':
      if (ignoreExisting || ignoreMissing) { return 'rest.body'; }

      return 'rest.body.1';

    default:
      return fieldId;
  }
};

export default { preSaveValidate };
