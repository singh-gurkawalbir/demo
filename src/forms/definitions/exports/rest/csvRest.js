import { isNewId } from '../../../../utils/resource';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    retValues['/file/type'] = 'csv';
    retValues['/rest/method'] = 'GET';

    if (retValues['/outputMode'] === 'blob') {
      retValues['/type'] = 'blob';
      retValues['/rest/method'] = retValues['/rest/blobMethod'];
    }

    delete retValues['/outputMode'];

    return {
      ...retValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (
      fieldId === 'rest.once.relativeURI' ||
      fieldId === 'dataURITemplate' ||
      fieldId === 'rest.relativeURI' ||
      fieldId === 'rest.once.postBody' ||
      fieldId === 'rest.postBody' ||
      fieldId === 'rest.pagingPostBody'
    ) {
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
      };
    }
  },
  fieldMap: {
    common: { formId: 'common' },
    exportData: {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    outputMode: {
      id: 'outputMode',
      type: 'radiogroup',
      label: 'Output Mode',
      required: true,
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob Keys', value: 'blob' },
          ],
        },
      ],
      defaultDisabled: r => {
        const isNew = isNewId(r._id);

        if (!isNew) return true;

        return false;
      },
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return 'records';

        const output = r && r.type;

        if (output === 'blob') return 'blob';

        return 'records';
      },
    },
    'rest.blobMethod': {
      fieldId: 'rest.blobMethod',
    },
    'rest.headers': { fieldId: 'rest.headers' },
    'rest.relativeURI': { fieldId: 'rest.relativeURI' },
    'rest.resourcePath': {
      fieldId: 'rest.resourcePath',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['blob'],
        },
      ],
    },
    uploadFile: {
      id: 'uploadFile',
      type: 'uploadfile',
      label: 'Sample File (that would be imported)',
      mode: r => r && r.file && r.file.type,
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'file.csv': {
      id: 'file.csv',
      type: 'csvparse',
      label: 'Configure CSV Parse Options',
      defaultValue: r =>
        (r.file && r.file.csv) || {
          rowsToSkip: 0,
          trimSpaces: true,
          columnDelimiter: ',',
          hasHeaderRow: false,
          rowDelimiter: '\n',
        },
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'rest.blobFormat': { fieldId: 'rest.blobFormat' },
    exportOneToMany: { formId: 'exportOneToMany' },
    advancedSettings: {
      formId: 'advancedSettings',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
  },
  layout: {
    fields: [
      'common',
      'outputMode',
      'exportOneToMany',
      'exportData',
      'rest.blobMethod',
      'rest.relativeURI',
      'rest.headers',
      'uploadFile',
      'file.csv',
      'rest.resourcePath',
      'rest.blobFormat',
    ],
    type: 'collapse',
    containers: [
      { collapsed: 'true', label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
