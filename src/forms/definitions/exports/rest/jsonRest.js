import { isNewId } from '../../../../utils/resource';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
      retValues['/test'] = undefined;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      retValues['/rest/once'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
      delete retValues['/once/booleanField'];
      delete retValues['/rest/once/relativeURI'];
      delete retValues['/rest/once/postBody'];
      delete retValues['/rest/once/method'];
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      retValues['/rest/once'] = undefined;
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
      delete retValues['/once/booleanField'];
      delete retValues['/rest/once/relativeURI'];
      delete retValues['/rest/once/postBody'];
      delete retValues['/rest/once/method'];
    } else if (retValues['/type'] === 'delta') {
      retValues['/once'] = undefined;
      retValues['/rest/once'] = undefined;
      retValues['/test'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/once/booleanField'];
      delete retValues['/rest/once/relativeURI'];
      delete retValues['/rest/once/postBody'];
      delete retValues['/rest/once/method'];
    } else if (retValues['/type'] === 'once') {
      retValues['/delta'] = undefined;
      retValues['/test'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
    }

    if (
      retValues['/rest/successValues'] &&
      !retValues['/rest/successValues'].length
    ) {
      retValues['/rest/successValues'] = undefined;
    }

    if (retValues['/outputMode'] === 'blob') {
      retValues['/type'] = 'blob';
      retValues['/rest/method'] = retValues['/rest/blobMethod'];
    }

    delete retValues['/outputMode'];

    if (retValues['/rest/pagingMethod'] === 'pageargument') {
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/nextPagePath'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
    } else if (retValues['/rest/pagingMethod'] === 'nextpageurl') {
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
    } else if (retValues['/rest/pagingMethod'] === 'relativeuri') {
      retValues['/rest/nextPagePath'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
    } else if (retValues['/rest/pagingMethod'] === 'linkheader') {
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/nextPagePath'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
    } else if (retValues['/rest/pagingMethod'] === 'skipargument') {
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/nextPagePath'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
    } else if (retValues['/rest/pagingMethod'] === 'token') {
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
    } else if (retValues['/rest/pagingMethod'] === 'postbody') {
      retValues['/rest/nextPagePath'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
    } else {
      retValues['/rest/pagingMethod'] = undefined;
      retValues['/rest/nextPagePath'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
      retValues['/rest/maxPagePath'] = undefined;
      retValues['/rest/maxCountPath'] = undefined;
      retValues['/rest/lastPageStatusCode'] = undefined;
      retValues['/rest/lastPagePath'] = undefined;
      retValues['/rest/lastPageValue'] = undefined;
    }

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
    'rest.method': {
      fieldId: 'rest.method',
    },
    'rest.blobMethod': {
      fieldId: 'rest.blobMethod',
    },
    'rest.headers': { fieldId: 'rest.headers' },
    'rest.relativeURI': { fieldId: 'rest.relativeURI' },
    'rest.postBody': {
      fieldId: 'rest.postBody',
      visibleWhen: [{ field: 'rest.method', is: ['POST', 'PUT'] }],
    },
    'rest.resourcePath': { fieldId: 'rest.resourcePath' },
    'rest.successPath': { fieldId: 'rest.successPath' },
    'rest.successValues': { fieldId: 'rest.successValues' },
    'rest.blobFormat': { fieldId: 'rest.blobFormat' },
    type: {
      id: 'type',
      type: 'select',
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
    'once.booleanField': {
      fieldId: 'once.booleanField',
    },
    'rest.once.relativeURI': {
      fieldId: 'rest.once.relativeURI',
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    'rest.once.method': {
      fieldId: 'rest.once.method',
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    'rest.once.postBody': {
      fieldId: 'rest.once.postBody',
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    'rest.pagingMethod': { fieldId: 'rest.pagingMethod' },
    'rest.nextPagePath': { fieldId: 'rest.nextPagePath' },
    'rest.linkHeaderRelation': { fieldId: 'rest.linkHeaderRelation' },
    'rest.skipArgument': { fieldId: 'rest.skipArgument' },
    'rest.nextPageRelativeURI': { fieldId: 'rest.nextPageRelativeURI' },
    'rest.pageArgument': { fieldId: 'rest.pageArgument' },
    'rest.pagingPostBody': { fieldId: 'rest.pagingPostBody' },
    'rest.maxPagePath': { fieldId: 'rest.maxPagePath' },
    'rest.maxCountPath': { fieldId: 'rest.maxCountPath' },
    'rest.lastPageStatusCode': { fieldId: 'rest.lastPageStatusCode' },
    'rest.lastPagePath': { fieldId: 'rest.lastPagePath' },
    'rest.lastPageValue': { fieldId: 'rest.lastPageValue' },
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
    formView: { fieldId: 'formView' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['common', 'outputMode', 'exportOneToMany', 'formView'] },
      {
        collapsed: true,
        label: r => {
          if (r.resourceType === 'lookupFiles' || r.type === 'blob') return 'What would you like to transfer?';

          return 'What would you like to export?';
        },
        fields: [
          'rest.method',
          'rest.blobMethod',
          'rest.headers',
          'rest.relativeURI',
          'rest.postBody',
          'rest.blobFormat',
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
          'rest.once.relativeURI',
          'rest.once.method',
          'rest.once.postBody',
        ],
      },
      {
        collapsed: true,
        label: 'Does this API support paging?',
        fields: [
          'rest.pagingMethod',
          'rest.nextPagePath',
          'rest.linkHeaderRelation',
          'rest.skipArgument',
          'rest.nextPageRelativeURI',
          'rest.pageArgument',
          'rest.pagingPostBody',
          'rest.maxPagePath',
          'rest.maxCountPath',
          'rest.lastPageStatusCode',
          'rest.lastPagePath',
          'rest.lastPageValue',
        ],
      },
      {
        collapsed: true,
        label: 'Non-standard API response patterns',
        fields: [
          'rest.resourcePath',
          'rest.successPath',
          'rest.successValues',
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
