import { safeParse } from '../../../utils/string';

export default {
  preSave: formValues => {
    const retValues = {
      ...formValues,
    };

    if (retValues['/oneToMany'] === 'false') {
      retValues['/pathToMany'] = undefined;
    }
    retValues['/mockResponse'] = safeParse(retValues['/mockResponse']);

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: {
      formId: 'common',
    },
    advancedSettings: { formId: 'advancedSettings' },
    'mongodb.document': {
      fieldId: 'mongodb.document',
    },
    'mongodb.update': {
      fieldId: 'mongodb.update',
    },
    'mongodb.method': {
      fieldId: 'mongodb.method',
    },
    'mongodb.collection': {
      fieldId: 'mongodb.collection',
    },
    ignoreExisting: {
      fieldId: 'ignoreExisting',
      visibleWhen: [
        {
          field: 'mongodb.method',
          is: ['insertMany'],
        },
      ],
    },
    'mongodb.lookupType': {
      fieldId: 'mongodb.lookupType',
    },
    'mongodb.ignoreLookupFilter': {
      fieldId: 'mongodb.ignoreLookupFilter',
      removeWhenAll: [
        { field: 'mongodb.ignoreExtract', isNot: [''] },
        { field: 'mongodb.lookupType', is: ['source'] },
      ],
    },
    'mongodb.filter': {
      fieldId: 'mongodb.filter',
    },
    'mongodb.upsert': {
      fieldId: 'mongodb.upsert',
    },
    'mongodb.ignoreExtract': {
      fieldId: 'mongodb.ignoreExtract',
      removeWhenAll: [
        { field: 'mongodb.ignoreLookupFilter', isNot: [''] },
        { field: 'mongodb.lookupType', is: ['lookup'] },
      ],
    },
    dataMappings: {
      formId: 'dataMappings',
    },
    mockResponseSection: {formId: 'mockResponseSection'},
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['common', 'dataMappings'],
      },
      {
        collapsed: true,
        label: 'How would you like the records imported?',
        fields: [
          'mongodb.method',
          'mongodb.collection',
          'mongodb.filter',
          'mongodb.document',
          'ignoreExisting',
          'mongodb.lookupType',
          'mongodb.ignoreExtract',
          'mongodb.ignoreLookupFilter',
          'mongodb.update',
          'mongodb.upsert',
        ],
      },
      {
        actionId: 'mockResponse',
        collapsed: true,
        label: 'Mock response',
        fields: ['mockResponseSection'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['advancedSettings'],
      },
    ],
  },
};
