import { isNewId } from '../../../../utils/resource';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };

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
      retValues['/http/once'] = undefined;
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

    if (
      retValues['/http/response/successValues'] &&
      !retValues['/http/response/successValues'].length
    ) {
      retValues['/http/response/successValues'] = undefined;
    }

    if (retValues['/outputMode'] === 'blob') {
      retValues['/type'] = 'blob';
      retValues['/http/method'] = retValues['/http/blobMethod'];
    }

    delete retValues['/outputMode'];

    if (retValues['/http/paging/method'] === 'page') {
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/body'] = undefined;
      retValues['/http/paging/skip'] = undefined;
    } else if (retValues['/http/paging/method'] === 'url') {
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/body'] = undefined;
      retValues['/rest/paging/page'] = undefined;
      retValues['/http/paging/skip'] = undefined;
    } else if (retValues['/http/paging/method'] === 'relativeuri') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/body'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/skip'] = undefined;
    } else if (retValues['/http/paging/method'] === 'linkheader') {
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/body'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/skip'] = undefined;
    } else if (retValues['/http/paging/method'] === 'skip') {
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/body'] = undefined;
      retValues['/http/paging/page'] = undefined;
    } else if (retValues['/http/paging/method'] === 'token') {
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/body'] = undefined;
      retValues['/http/paging/skip'] = undefined;
    } else if (retValues['/http/paging/method'] === 'body') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/skip'] = undefined;
    } else {
      retValues['/http/paging/method'] = undefined;
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
      retValues['/http/paging/lastPageStatusCode'] = undefined;
      retValues['/http/paging/lastPagePath'] = undefined;
      retValues['/http/paging/lastPageValues'] = undefined;
    }

    // we need 2 separate UI fields for path for url and token paging methods
    // to have diff help texts and labels
    if (retValues['/http/paging/method'] === 'url') {
      retValues['/http/paging/path'] = retValues['/http/paging/urlPath'];
    } else if (retValues['/http/paging/method'] === 'token') {
      retValues['/http/paging/path'] = retValues['/http/paging/tokenPath'];
    }
    delete retValues['/http/paging/urlPath'];
    delete retValues['/http/paging/tokenPath'];

    // we need 2 separate UI fields for page argument for page number and token paging methods
    // to have diff help texts and labels
    if (retValues['/http/paging/method'] === 'token') {
      retValues['/http/paging/page'] = retValues['/http/paging/tokenPage'];
    }
    delete retValues['/http/paging/tokenPage'];

    return {
      ...retValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (
      fieldId === 'http.once.relativeURI' ||
      fieldId === 'dataURITemplate' ||
      fieldId === 'http.relativeURI' ||
      fieldId === 'http.once.body' ||
      fieldId === 'http.body' ||
      fieldId === 'http.paging.body'
    ) {
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
    'http.method': {
      fieldId: 'http.method',
    },
    'http.blobMethod': {
      fieldId: 'http.blobMethod',
    },
    'http.headers': { fieldId: 'http.headers' },
    'http.relativeURI': { fieldId: 'http.relativeURI' },
    'http.postBody': {
      fieldId: 'http.postBody',
      visibleWhen: [{ field: 'http.method', is: ['POST', 'PUT'] }],
    },
    'http.response.resourcePath': { fieldId: 'http.response.resourcePath' },
    'http.response.successPath': { fieldId: 'http.response.successPath' },
    'http.response.successValues': { fieldId: 'http.response.successValues' },
    'http.response.blobFormat': { fieldId: 'http.response.blobFormat' },
    type: {
      id: 'type',
      type: 'selectwithvalidations',
      label: 'Export type',
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
      required: true,
      options: [
        {
          items: [
            { label: 'All – always export all data', value: 'all' },
            { label: 'Delta – export only modified data',
              value: 'delta',
              regex: /.*{{.*lastExportDateTime.*}}/,
              description: 'Add {{lastExportDateTime}} to either the relative URI or HTTP request body to complete the setup.',
              helpKey: 'export.delta',
              fieldsToValidate: ['http.relativeURI', 'http.postBody'] },

            { label: 'Once – export records only once', value: 'once' },
            { label: 'Test – export only 1 record', value: 'test' },
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
    'once.booleanField': {
      id: 'once.booleanField',
      type: 'textwithconnectioncontext',
      label: 'Boolean field to mark records as exported',
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    'http.once.relativeURI': {
      fieldId: 'http.once.relativeURI',
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    'http.once.method': {
      fieldId: 'http.once.method',
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    'http.once.postBody': {
      fieldId: 'http.once.postBody',
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    'http.paging.method': { fieldId: 'http.paging.method' },
    'http.paging.urlPath': { fieldId: 'http.paging.urlPath' },
    'http.paging.tokenPath': { fieldId: 'http.paging.tokenPath' },
    'http.paging.linkHeaderRelation': { fieldId: 'http.paging.linkHeaderRelation' },
    'http.paging.skip': { fieldId: 'http.paging.skip' },
    'http.paging.relativeURI': { fieldId: 'http.paging.relativeURI' },
    'http.paging.page': { fieldId: 'http.paging.page' },
    'http.paging.token': { fieldId: 'http.paging.token' },
    'http.paging.body': { fieldId: 'http.paging.body' },
    'http.paging.maxPagePath': { fieldId: 'http.paging.maxPagePath' },
    'http.paging.maxCountPath': { fieldId: 'http.paging.maxCountPath' },
    'http.paging.lastPageStatusCode': { fieldId: 'http.paging.lastPageStatusCode' },
    'http.paging.lastPagePath': { fieldId: 'http.paging.lastPagePath' },
    'http.paging.lastPageValues': { fieldId: 'http.paging.lastPageValues' },
    exportOneToMany: { formId: 'exportOneToMany' },
    advancedSettings: {
      formId: 'advancedSettings',
    },
    formView: { fieldId: 'formView' },
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
        fields: [
          'http.method',
          'http.blobMethod',
          'http.relativeURI',
          'http.headers',
          'http.body',
          'http.blobFormat',
        ],
      },
      {
        collapsed: true,
        label: 'Configure export type',
        fields: [
          'type',
          'delta.dateFormat',
          'delta.lagOffset',
          'once.booleanField',
          'http.once.method',
          'http.once.relativeURI',
          'http.once.body',
        ],
      },
      {
        collapsed: true,
        label: 'Does this API use paging?',
        fields: [
          'http.paging.method',
          'http.paging.urlPath',
          'http.paging.tokenPath',
          'http.paging.linkHeaderRelation',
          'http.paging.skip',
          'http.paging.relativeURI',
          'http.paging.page',
          'http.paging.token',
          'http.paging.body',
          'http.paging.maxPagePath',
          'http.paging.maxCountPath',
          'http.paging.lastPageStatusCode',
          'http.paging.lastPagePath',
          'http.paging.lastPageValues',
        ],
      },
      {
        collapsed: true,
        label: 'Non-standard API response patterns',
        fields: [
          'http.response.resourcePath',
          'http.response.successPath',
          'http.response.successValues',
        ],
      },
      {
        collapsed: 'true',
        label: 'Advanced',
        fields: ['advancedSettings'],
      },
    ],
  },
};
