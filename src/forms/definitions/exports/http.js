import { isNewId } from '../../../utils/resource';
import { isLookupResource } from '../../../utils/flows';

export default {
  init: (fieldMeta, resource = {}, flow) => {
    const exportPanelField = fieldMeta.fieldMap.exportPanel;

    if (isLookupResource(flow, resource)) {
      exportPanelField.visible = false;
    }

    return fieldMeta;
  },
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/successMediaType'] === 'csv') {
      retValues['/file/type'] = 'csv';
    } else if (
      retValues['/http/successMediaType'] === 'json' ||
      retValues['/http/successMediaType'] === 'xml'
    ) {
      retValues['/file/csv'] = undefined;
      retValues['/file'] = undefined;
      delete retValues['/file/type'];
      delete retValues['/file/csv/rowsToSkip'];
      delete retValues['/file/csv/trimSpaces'];
      delete retValues['/file/csv/columnDelimiter'];
    }

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
      retValues['/test'] = undefined;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      retValues['/http/once'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
      delete retValues['/once/booleanField'];
      delete retValues['/http/once/relativeURI'];
      delete retValues['/http/once/body'];
      delete retValues['/http/once/method'];
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      retValues['/http/once'] = undefined;
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
      delete retValues['/once/booleanField'];
      delete retValues['/http/once/relativeURI'];
      delete retValues['/http/once/body'];
      delete retValues['/http/once/method'];
    } else if (retValues['/type'] === 'delta') {
      retValues['/once'] = undefined;
      retValues['/test'] = undefined;
      retValues['/http/once'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/once/booleanField'];
      delete retValues['/http/once/relativeURI'];
      delete retValues['/http/once/body'];
      delete retValues['/http/once/method'];
    } else if (retValues['/type'] === 'once') {
      retValues['/delta'] = undefined;
      retValues['/test'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
    }

    if (
      retValues['/http/response/successValues'] &&
      !retValues['/http/response/successValues'].length
    ) {
      retValues['/http/response/successValues'] = undefined;
    }

    if (retValues['/http/response/successPath'] === '') {
      retValues['/http/response/successPath'] = undefined;
    }

    if (
      retValues['/http/response/failValues'] &&
      !retValues['/http/response/failValues'].length
    ) {
      retValues['/http/response/failValues'] = undefined;
    }

    if (retValues['/http/response/failPath'] === '') {
      retValues['/http/response/failPath'] = undefined;
    }

    if (
      retValues['/http/response/successValues'] === undefined &&
      retValues['/http/response/successPath'] === undefined &&
      retValues['/http/response/failValues'] === undefined &&
      retValues['/http/response/failPath'] === undefined &&
      retValues['/http/response/resourcePath'] === '' &&
      retValues['/http/response/errorPath'] === ''
    ) {
      retValues['/http/response'] = undefined;
      delete retValues['/http/response/resourcePath'];
      delete retValues['/http/response/successValues'];
      delete retValues['/http/response/successPath'];
      delete retValues['/http/response/failValues'];
      delete retValues['/http/response/failPath'];
      delete retValues['/http/response/errorPath'];
    }

    if (retValues['/outputMode'] === 'blob') {
      retValues['/type'] = 'blob';
      retValues['/http/method'] = retValues['/http/blobMethod'];
    }

    delete retValues['/http/blobMethod'];
    delete retValues['/outputMode'];

    if (retValues['/http/paging/method'] === 'page') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'url') {
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'relativeuri') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'linkheader') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'skip') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'token') {
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'body') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
    } else {
      retValues['/http/paging'] = undefined;
      delete retValues['/http/paging/method'];
      delete retValues['/http/paging/path'];
      delete retValues['/http/paging/relativeURI'];
      delete retValues['/http/paging/resourcePath'];
      delete retValues['/http/paging/token'];
      delete retValues['/http/paging/linkHeaderRelation'];
      delete retValues['/http/paging/skip'];
      delete retValues['/http/paging/pathAfterFirstRequest'];
      delete retValues['/http/paging/page'];
      delete retValues['/http/paging/maxPagePath'];
      delete retValues['/http/paging/maxCountPath'];
      delete retValues['/http/paging/body'];
      delete retValues['/http/paging/lastPageStatusCode'];
      delete retValues['/http/paging/lastPagePath'];
      delete retValues['/http/paging/lastPageValues'];
    }

    retValues['/statusExport'] = undefined;

    return {
      ...retValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'http.relativeURI' || fieldId === 'http.body') {
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
      };
    }
  },
  fieldMap: {
    common: { formId: 'common' },
    exportData: {
      id: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to export?',
    },
    outputMode: {
      id: 'outputMode',
      type: 'mode',
      label: 'Output mode',
      required: true,
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob keys', value: 'blob' },
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
    'http.method': { fieldId: 'http.method' },
    'http.blobMethod': { fieldId: 'http.blobMethod' },
    'http.headers': { fieldId: 'http.headers' },
    'http.relativeURI': { fieldId: 'http.relativeURI' },
    'http.body': { fieldId: 'http.body' },
    'http.successMediaType': { fieldId: 'http.successMediaType' },
    'http.errorMediaType': { fieldId: 'http.errorMediaType' },
    'http.response.resourcePath': { fieldId: 'http.response.resourcePath' },
    'http.response.successPath': { fieldId: 'http.response.successPath' },
    'http.response.successValues': {
      fieldId: 'http.response.successValues',
    },
    'http.response.errorPath': { fieldId: 'http.response.errorPath' },
    'http.response.failPath': { fieldId: 'http.response.failPath' },
    'http.response.failValues': { fieldId: 'http.response.failValues' },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export type',
      required: true,
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return '';
        const output = r && r.type;

        return output || 'all';
      },
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
      options: [
        {
          items: [
            { label: 'All', value: 'all' },
            { label: 'Test', value: 'test' },
            { label: 'Delta', value: 'delta' },
            { label: 'Once', value: 'once' },
          ],
        },
      ],
    },
    'delta.dateFormat': {
      fieldId: 'delta.dateFormat',
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
    },
    'http.once.relativeURI': {
      fieldId: 'http.once.relativeURI',
    },
    'http.once.body': {
      fieldId: 'http.once.body',
    },
    'http.once.method': {
      fieldId: 'http.once.method',
    },
    'once.booleanField': {
      fieldId: 'once.booleanField',
    },
    'http.paging.method': { fieldId: 'http.paging.method' },
    'http.paging.skip': { fieldId: 'http.paging.skip' },
    'http.paging.page': { fieldId: 'http.paging.page' },
    'http.paging.token': { fieldId: 'http.paging.token' },
    'http.paging.path': { fieldId: 'http.paging.path' },
    'http.paging.body': { fieldId: 'http.paging.body' },
    'http.paging.relativeURI': { fieldId: 'http.paging.relativeURI' },
    'http.paging.linkHeaderRelation': {
      fieldId: 'http.paging.linkHeaderRelation',
    },
    'http.paging.pathAfterFirstRequest': {
      fieldId: 'http.paging.pathAfterFirstRequest',
    },
    'http.paging.resourcePath': { fieldId: 'http.paging.resourcePath' },
    'http.paging.maxPagePath': { fieldId: 'http.paging.maxPagePath' },
    'http.paging.maxCountPath': { fieldId: 'http.paging.maxCountPath' },
    'http.paging.lastPageStatusCode': {
      fieldId: 'http.paging.lastPageStatusCode',
    },
    'http.paging.lastPagePath': { fieldId: 'http.paging.lastPagePath' },
    'http.paging.lastPageValues': { fieldId: 'http.paging.lastPageValues' },
    'http.response.blobFormat': { fieldId: 'http.response.blobFormat' },
    advancedSettings: {
      formId: 'advancedSettings',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'file.csv': {
      id: 'file.csv',
      type: 'csvparse',
      label: 'Configure CSV parse options',
      defaultValue: r =>
        (r.file && r.file.csv) || {
          rowsToSkip: 0,
          trimSpaces: false,
          columnDelimiter: ',',
          hasHeaderRow: false,
          rowDelimiter: '\n',
        },
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
        {
          field: 'http.successMediaType',
          is: ['csv'],
        },
      ],
    },
    exportOneToMany: { formId: 'exportOneToMany' },
    configureAsyncHelper: {
      fieldId: 'configureAsyncHelper',
      defaultValue: r => !!(r && r.http && r.http._asyncHelperId),
      visible: r => !(r && r.statusExport),
      visibleWhen: r => {
        if (r && r.statusExport) return [];

        return [
          {
            field: 'outputMode',
            is: ['records'],
          },
        ];
      },
    },
    'http._asyncHelperId': {
      fieldId: 'http._asyncHelperId',
    },
    exportPanel: {
      fieldId: 'exportPanel',
    },
  },

  layout: {
    type: 'column',
    containers: [
      {
        fields: [
          'common',
          'outputMode',
          'exportOneToMany',
          'exportData',
          'http.method',
          'http.blobMethod',
          'http.headers',
          'http.relativeURI',
          'http.body',
          'http.successMediaType',
          'http.errorMediaType',
          'http.response.resourcePath',
          'http.response.successPath',
          'http.response.successValues',
          'http.response.failPath',
          'http.response.failValues',
          'http.response.errorPath',
          'file.csv',
          'type',
          'delta.dateFormat',
          'delta.lagOffset',
          'http.response.blobFormat',
        ],
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'Configure Once',
            fields: [
              'once.booleanField',
              'http.once.relativeURI',
              'http.once.method',
              'http.once.body',
            ],
          },
          {
            collapsed: true,
            label: 'Does this API support paging?',
            fields: [
              'http.paging.method',
              'http.paging.skip',
              'http.paging.page',
              'http.paging.token',
              'http.paging.path',
              'http.paging.relativeURI',
              'http.paging.linkHeaderRelation',
              'http.paging.pathAfterFirstRequest',
              'http.paging.body',
              'http.paging.resourcePath',
              'http.paging.maxPagePath',
              'http.paging.maxCountPath',
              'http.paging.lastPageStatusCode',
              'http.paging.lastPagePath',
              'http.paging.lastPageValues',
            ],
          },
          {
            collapsed: true,
            label: 'Advanced',
            fields: [
              'advancedSettings',
              'configureAsyncHelper',
              'http._asyncHelperId',
            ],
          },
        ],
      },
      {
        fields: ['exportPanel'],
      },
    ],
  },
};
