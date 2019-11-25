import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
      retValues['/test'] = undefined;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
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
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
      delete retValues['/once/booleanField'];
      delete retValues['/http/once/relativeURI'];
      delete retValues['/http/once/body'];
      delete retValues['/http/once/method'];
    } else if (retValues['/type'] === 'delta') {
      retValues['/once'] = undefined;
      retValues['/test'] = undefined;
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

    if (retValues['/outputMode'] === 'blob') {
      retValues['/type'] = 'blob';
      retValues['/http/method'] = retValues['/http/blobMethod'];
    }

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
    }

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
    type: {
      id: 'type',
      type: 'select',
      label: 'Export Type',
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
    skipRetries: { fieldId: 'skipRetries' },
    advancedSettings: {
      formId: 'advancedSettings',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    exportOneToMany: { formId: 'exportOneToMany' },
    configureAsyncHelper: {
      fieldId: 'configureAsyncHelper',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'http._asyncHelperId': {
      fieldId: 'http._asyncHelperId',
    },
  },
  layout: {
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
      'http.response.errorPath',
      'type',
      'delta.dateFormat',
      'delta.lagOffset',
      'once.booleanField',
      'http.once.relativeURI',
      'http.once.method',
      'http.once.body',
      'http.response.blobFormat',
    ],
    type: 'collapse',
    containers: [
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
          'skipRetries',
          'configureAsyncHelper',
          'http._asyncHelperId',
        ],
      },
    ],
  },
};
