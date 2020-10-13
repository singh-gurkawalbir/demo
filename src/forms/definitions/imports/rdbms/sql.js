export default {
  preSave: formValues => {
    const retValues = { ...formValues };
    const lookups = retValues['/rdbms/lookups'];
    const lookup =
      lookups &&
      lookups.find(
        l =>
          `${l.name}` === retValues['/rdbms/ignoreExtract'] ||
          `${l.name}` === retValues['/rdbms/updateExtract']
      );

    if (retValues['/rdbms/queryType'] === 'COMPOSITE') {
      retValues['/rdbms/query'] = [
        retValues['/rdbms/queryUpdate'],
        retValues['/rdbms/queryInsert'],
      ];
      retValues['/rdbms/queryType'] = ['UPDATE', 'INSERT'];
      retValues['/rdbms/ignoreLookupName'] = undefined;
      retValues['/rdbms/ignoreExtract'] = undefined;
      retValues['/ignoreExisting'] = false;
      retValues['/ignoreMissing'] = false;

      if (lookup) {
        retValues['/rdbms/updateLookupName'] =
          retValues['/rdbms/updateExtract'];
        retValues['/rdbms/updateExtract'] = undefined;
      } else {
        retValues['/rdbms/updateLookupName'] = undefined;
      }
    } else if (retValues['/rdbms/queryType'] === 'INSERT') {
      retValues['/rdbms/query'] = [retValues['/rdbms/query']];
      retValues['/rdbms/queryType'] = [retValues['/rdbms/queryType']];
      retValues['/ignoreMissing'] = false;
      retValues['/rdbms/updateLookupName'] = undefined;
      retValues['/rdbms/updateExtract'] = undefined;

      if (lookup) {
        retValues['/rdbms/ignoreLookupName'] =
          retValues['/rdbms/ignoreExtract'];
        retValues['/rdbms/ignoreExtract'] = undefined;
      } else {
        retValues['/rdbms/ignoreLookupName'] = undefined;
      }
    } else {
      retValues['/rdbms/query'] = [retValues['/rdbms/query']];
      retValues['/rdbms/queryType'] = [retValues['/rdbms/queryType']];
      retValues['/ignoreExisting'] = false;
      retValues['/rdbms/updateLookupName'] = undefined;
      retValues['/rdbms/updateExtract'] = undefined;

      if (lookup) {
        retValues['/rdbms/ignoreLookupName'] =
          retValues['/rdbms/ignoreExtract'];
        retValues['/rdbms/ignoreExtract'] = undefined;
      } else {
        retValues['/rdbms/ignoreLookupName'] = undefined;
      }
    }

    delete retValues['/rdbms/queryUpdate'];
    delete retValues['/rdbms/queryInsert'];

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    modelMetadata: { fieldId: 'modelMetadata', visible: false },
    'rdbms.lookups': { fieldId: 'rdbms.lookups', visible: false },
    apiIdentifier: { fieldId: 'apiIdentifier' },
    'rdbms.query': {
      fieldId: 'rdbms.query',
      required: true,
      defaultValue: r => r && r.rdbms && r.rdbms.query && r.rdbms.query[0],
    },
    'rdbms.queryInsert': {
      fieldId: 'rdbms.queryInsert',
      required: true,
      defaultValue: r => {
        if (!r || !r.rdbms || !r.rdbms.query) {
          return '';
        }

        if (r.rdbms.query.length > 1) {
          return r.rdbms.query && r.rdbms.query[1];
        }
      },
    },
    'rdbms.queryUpdate': {
      fieldId: 'rdbms.queryUpdate',
      required: true,
      defaultValue: r => {
        if (!r || !r.rdbms || !r.rdbms.query) {
          return '';
        }

        if (r.rdbms.query.length > 0) {
          return r.rdbms.query && r.rdbms.query[0];
        }

        return '';
      },
    },
    'rdbms.queryType': {
      fieldId: 'rdbms.queryType',
    },
    ignoreExisting: {
      fieldId: 'ignoreExisting',
      label: 'Ignore existing records',
      visibleWhen: [{ field: 'rdbms.queryType', is: ['INSERT'] }],
    },
    ignoreMissing: {
      fieldId: 'ignoreMissing',
      label: 'Ignore missing records',
      visibleWhen: [{ field: 'rdbms.queryType', is: ['UPDATE'] }],
    },
    'rdbms.ignoreExtract': {
      fieldId: 'rdbms.ignoreExtract',
      type: 'textwithflowsuggestion',
      showSuggestionsWithoutHandlebar: true,
    },
    'rdbms.updateExtract': {
      fieldId: 'rdbms.updateExtract',
      type: 'textwithflowsuggestion',
      showSuggestionsWithoutHandlebar: true,
    },
    dataMappings: { formId: 'dataMappings' },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['common', 'dataMappings', 'modelMetadata'],
      },
      {
        collapsed: true,
        label: 'How would you like the records imported?',
        fields: [
          'rdbms.queryType',
          'ignoreExisting',
          'ignoreMissing',
          'rdbms.ignoreExtract',
          'rdbms.updateExtract',
          'rdbms.lookups',
          'rdbms.query',
          'rdbms.queryInsert',
          'rdbms.queryUpdate',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['apiIdentifier'],
      },
    ],
  },
};
