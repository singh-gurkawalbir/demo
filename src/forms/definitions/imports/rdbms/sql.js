export default {
  preSave: formValues => {
    const retValues = { ...formValues };

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

      if (retValues['/rdbms/updateLookupName']) {
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

      if (retValues['/rdbms/ignoreExistingLookupName']) {
        retValues['/rdbms/ignoreExtract'] = undefined;
        retValues['/rdbms/ignoreLookupName'] = retValues['/rdbms/ignoreExistingLookupName'];
      } else if (retValues['/rdbms/ignoreExistingExtract']) {
        retValues['/rdbms/ignoreLookupName'] = undefined;
        retValues['/rdbms/ignoreExtract'] = retValues['/rdbms/ignoreExistingExtract'];
      } else {
        retValues['/rdbms/ignoreLookupName'] = undefined;
        retValues['/rdbms/ignoreExtract'] = undefined;
      }
    } else {
      retValues['/rdbms/query'] = [retValues['/rdbms/query2']];
      retValues['/rdbms/queryType'] = [retValues['/rdbms/queryType']];
      retValues['/ignoreExisting'] = false;
      retValues['/rdbms/updateLookupName'] = undefined;
      retValues['/rdbms/updateExtract'] = undefined;

      if (retValues['/rdbms/ignoreMissingLookupName']) {
        retValues['/rdbms/ignoreExtract'] = undefined;
        retValues['/rdbms/ignoreLookupName'] = retValues['/rdbms/ignoreMissingLookupName'];
      } else if (retValues['/rdbms/ignoreMissingExtract']) {
        retValues['/rdbms/ignoreLookupName'] = undefined;
        retValues['/rdbms/ignoreExtract'] = retValues['/rdbms/ignoreMissingExtract'];
      } else {
        retValues['/rdbms/ignoreLookupName'] = undefined;
        retValues['/rdbms/ignoreExtract'] = undefined;
      }
    }
    delete retValues['/rdbms/ignoreMissingLookupName'];
    delete retValues['/rdbms/ignoreMissingExtract'];
    delete retValues['/rdbms/ignoreExistingLookupName'];
    delete retValues['/rdbms/ignoreExistingExtract'];
    delete retValues['/rdbms/lookupType'];

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
    'rdbms.ignoreExistingExtract': {
      fieldId: 'rdbms.ignoreExistingExtract',
      type: 'textwithflowsuggestion',
      showSuggestionsWithoutHandlebar: true,
    },
    'rdbms.ignoreMissingExtract': {
      fieldId: 'rdbms.ignoreMissingExtract',
      type: 'textwithflowsuggestion',
      showSuggestionsWithoutHandlebar: true,
    },
    'rdbms.updateExtract': {
      fieldId: 'rdbms.updateExtract',
      type: 'textwithflowsuggestion',
      showSuggestionsWithoutHandlebar: true,
    },
    'rdbms.lookupType': {
      fieldId: 'rdbms.lookupType',
    },
    'rdbms.ignoreExistingLookupName': {
      fieldId: 'rdbms.ignoreExistingLookupName',
    },
    'rdbms.ignoreMissingLookupName': {
      fieldId: 'rdbms.ignoreMissingLookupName',
    },
    'rdbms.updateLookupName': {
      fieldId: 'rdbms.updateLookupName',
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
          'rdbms.lookupType',
          'rdbms.updateLookupName',
          'rdbms.ignoreExistingExtract',
          'rdbms.ignoreMissingExtract',
          'rdbms.ignoreExistingLookupName',
          'rdbms.ignoreMissingLookupName',
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
