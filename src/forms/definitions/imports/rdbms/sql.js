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
      retValues['/rdbms/query'] = [retValues['/rdbms/query1']];
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
      retValues['/rdbms/query'] = [retValues['/rdbms/query2']];
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

    delete retValues['/rdbms/query1'];
    delete retValues['/rdbms/query2'];
    delete retValues['/rdbms/queryUpdate'];
    delete retValues['/rdbms/queryInsert'];

    if (retValues['/oneToMany'] === 'false') {
      retValues['/pathToMany'] = undefined;
    }

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    modelMetadata: { fieldId: 'modelMetadata', visible: false },
    'rdbms.lookups': { fieldId: 'rdbms.lookups', visible: false },
    advancedSettings: { formId: 'advancedSettings' },
    'rdbms.query1': {
      fieldId: 'rdbms.query1',
      required: true,
      defaultValue: r => {
        if (!r?.rdbms?.query) {
          return '';
        }
        if (r.rdbms.query.length === 1 && r.rdbms.queryType?.[0] === 'INSERT') {
          return r.rdbms.query[0];
        }

        return '';
      },
    },
    'rdbms.query2': {
      fieldId: 'rdbms.query2',
      required: true,
      defaultValue: r => {
        if (!r?.rdbms?.query) {
          return '';
        }

        if (r.rdbms.query.length === 1 && r.rdbms.queryType?.[0] === 'UPDATE') {
          return r.rdbms.query[0];
        }

        return '';
      },
    },
    'rdbms.queryInsert': {
      fieldId: 'rdbms.queryInsert',
      required: true,
      defaultValue: r => {
        if (!r?.rdbms?.query) {
          return '';
        }

        if (r.rdbms.query.length > 1) {
          return r.rdbms.query[1];
        }

        return '';
      },
    },
    'rdbms.queryUpdate': {
      fieldId: 'rdbms.queryUpdate',
      required: true,
      defaultValue: r => {
        if (!r?.rdbms?.query) {
          return '';
        }

        if (r.rdbms.query.length > 1) {
          return r.rdbms.query[0];
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
          'rdbms.query1',
          'rdbms.query2',
          'rdbms.queryInsert',
          'rdbms.queryUpdate',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['advancedSettings'],
      },
    ],
  },
};
