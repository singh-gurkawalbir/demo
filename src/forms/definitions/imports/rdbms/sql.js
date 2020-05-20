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
  optionsHandler: (fieldId, fields) => {
    if (
      fieldId === 'rdbms.query' ||
      fieldId === 'rdbms.queryUpdate' ||
      fieldId === 'rdbms.queryInsert'
    ) {
      const lookupField = fields.find(
        field => field.fieldId === 'rdbms.lookups'
      );
      const queryTypeField = fields.find(
        field => field.fieldId === 'rdbms.queryType'
      );
      const modelMetadataField = fields.find(
        field => field.fieldId === 'modelMetadata'
      );
      let queryTypeVal;

      if (queryTypeField) {
        if (fieldId === 'rdbms.query') {
          queryTypeVal = queryTypeField && queryTypeField.value;
        } else if (fieldId === 'rdbms.queryUpdate') {
          queryTypeVal = 'UPDATE';
        } else if (fieldId === 'rdbms.queryInsert') {
          queryTypeVal = 'INSERT';
        }
      }

      return {
        queryType: queryTypeVal,
        modelMetadataFieldId: modelMetadataField.fieldId,
        modelMetadata: modelMetadataField && modelMetadataField.value,
        lookups: {
          // passing lookupId fieldId and data since we will be modifying lookups
          //  from 'Manage lookups' option inside 'SQL Query Builder'
          fieldId: lookupField.fieldId,
          data: lookupField && lookupField.value,
        },
      };
    }

    return null;
  },

  fieldMap: {
    common: { formId: 'common' },
    modelMetadata: { fieldId: 'modelMetadata', visible: false },
    'rdbms.lookups': { fieldId: 'rdbms.lookups', visible: false },
    'rdbms.query': {
      fieldId: 'rdbms.query',
      defaultValue: r => r && r.rdbms && r.rdbms.query && r.rdbms.query[0],
    },
    'rdbms.queryInsert': {
      fieldId: 'rdbms.queryInsert',
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
    fields: ['common', 'modelMetadata'],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'How would you like the data imported?',
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
          'dataMappings',
        ],
      },
    ],
  },
};
