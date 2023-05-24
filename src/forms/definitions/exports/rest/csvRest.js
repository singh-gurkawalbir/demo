import { isNewId } from '../../../../utils/resource';
import { safeParse } from '../../../../utils/string';

const restPreSave = formValues => {
  const retValues = { ...formValues };

  const restToHttpFieldMap = {
    '/rest/blobMethod': '/http/blobMethod',
    '/rest/headers': '/http/headers',
    '/rest/resourcePath': '/http/response/resourcePath',
    '/rest/blobFormat': '/http/response/blobFormat',
  };

  Object.keys(restToHttpFieldMap).forEach(restField => {
    const httpField = restToHttpFieldMap[restField];

    if (retValues[httpField]) {
      retValues[restField] = retValues[httpField];
    } else {
      retValues[restField] = undefined;
    }
    delete retValues[httpField];
  });

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
};
export default {
  preSave: (formValues, resource, options = {}) => {
    const retValues = { ...formValues };
    const { connection } = options;

    // For Edit cases, if resource was originally created as REST export or if connection has isHTTP as false, save it as REST export
    if ((resource?.adaptorType === 'RESTExport' && resource._id && !isNewId(resource._id)) ||
        (resource?.['/adaptorType'] === 'RESTExport' && resource['/_id'] && !isNewId(resource['/_id'])) ||
         connection?.isHTTP === false
    ) {
      return restPreSave(formValues);
    }

    retValues['/file/type'] = 'csv';
    retValues['/http/method'] = 'GET';

    if (retValues['/outputMode'] === 'blob') {
      retValues['/type'] = 'blob';
      retValues['/http/method'] = retValues['/http/blobMethod'];
    }
    retValues['/http/relativeURI'] = retValues['/rest/relativeURI'];
    delete retValues['/rest/relativeURI'];

    // set the successMediaType on Export according to the connection
    // the request media-type is always json/urlencoded for REST, others are not supported in REST
    // CSV/XML media type could be successMediaTypes for REST Export
    retValues['/http/successMediaType'] = connection?.http?.successMediaType || connection?.rest?.mediaType || 'json';
    if (retValues['/http/successMediaType'] === 'urlencoded') {
      retValues['/http/successMediaType'] = 'json';
    }

    retValues['/http/formType'] = 'rest';
    retValues['/adaptorType'] = 'HTTPExport';
    delete retValues['/outputMode'];
    delete retValues['/uploadFile'];
    delete retValues['/rest'];
    retValues['/mockOutput'] = safeParse(retValues['/mockOutput']);

    return {
      ...retValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'dataURITemplate' || fieldId === 'rest.relativeURI') {
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
      };
    }
  },
  fieldMap: {
    common: { formId: 'common' },
    outputMode: {
      id: 'outputMode',
      type: 'radiogroup',
      label: 'Output mode',
      required: true,
      visible: false,
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob keys', value: 'blob' },
          ],
        },
      ],
      defaultValue: r => {
        if (r.resourceType === 'lookupFiles' || r.type === 'blob') return 'blob';

        return 'records';
      },
    },
    'http.blobMethod': {
      fieldId: 'http.blobMethod',
    },
    'http.headers': { fieldId: 'http.headers' },
    'rest.relativeURI': {
      fieldId: 'rest.relativeURI',
      defaultValue: r => r?._rest?.relativeURI,
    },
    'http.response.resourcePath': {
      fieldId: 'http.response.resourcePath',
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
      placeholder: 'Sample file (that would be parsed)',
      options: 'csv',
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
      label: 'CSV parser helper',
      helpKey: 'file.csvParse',
      ignoreSortAndGroup: true,
      defaultValue: r => r?.file?.csv || {
        columnDelimiter: ',',
        rowDelimiter: '\n',
        hasHeaderRow: false,
        keyColumns: [],
        rowsToSkip: 0,
        trimSpaces: false,
      },
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'http.response.blobFormat': { fieldId: 'http.response.blobFormat' },
    exportOneToMany: { formId: 'exportOneToMany' },
    advancedSettings: {
      formId: 'advancedSettings',
    },
    formView: { fieldId: 'formView' },
    mockOutput: {fieldId: 'mockOutput'},
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['common', 'outputMode', 'exportOneToMany', 'formView'] },
      {
        collapsed: true,
        label: r => {
          if (r.resourceType === 'lookupFiles' || r.type === 'blob') return 'Where would you like to transfer from?';

          return 'What would you like to export?';
        },
        containers: [
          {
            fields: [
              'http.blobMethod',
              'rest.relativeURI',
              'http.headers',
              'uploadFile',
            ],
          },
          {
            type: 'indent',
            containers: [
              { fields: [
                'file.csv',
              ] },
            ],
          },
          {
            fields: [
              'http.response.blobFormat',
            ],
          },
        ],
      },
      {
        collapsed: true,
        label: 'Non-standard API response patterns',
        fields: ['http.response.resourcePath'],
      },
      {
        collapsed: true,
        actionId: 'mockOutput',
        label: 'Mock output',
        fields: ['mockOutput'],
      },
      { collapsed: 'true', label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
