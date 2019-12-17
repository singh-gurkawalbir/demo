export default {
  preSave: (formValues, resource) => {
    const retValues = { ...formValues };
    const lookup =
      resource.rdbms &&
      resource.rdbms.lookups &&
      resource.rdbms.lookups.find(
        l => `{{{${l.name}}}}` === retValues['/rdbms/ignoreExtract']
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
        retValues['/rdbms/updateExtract'];
        retValues['/rdbms/updateLookupName'] = undefined;
      }
    } else if (retValues['/rdbms/queryType'] === 'INSERT') {
      retValues['/rdbms/query'] = [retValues['/rdbms/query']];
      retValues['/rdbms/queryType'] = [retValues['/rdbms/queryType']];
      retValues['/ignoreMissing'] = false;

      if (lookup) {
        retValues['/rdbms/ignoreLookupName'] =
          retValues['/rdbms/ignoreExtract'];
        retValues['/rdbms/ignoreExtract'] = undefined;
      } else {
        retValues['/rdbms/ignoreExtract'];
        retValues['/rdbms/ignoreLookupName'] = undefined;
      }
    } else {
      retValues['/rdbms/query'] = [retValues['/rdbms/query']];
      retValues['/rdbms/queryType'] = [retValues['/rdbms/queryType']];
      retValues['/ignoreExisting'] = false;

      if (lookup) {
        retValues['/rdbms/updateLookupName'] =
          retValues['/rdbms/updateExtract'];
        retValues['/rdbms/updateExtract'] = undefined;
      } else {
        retValues['/rdbms/updateExtract'];
        retValues['/rdbms/updateLookupName'] = undefined;
      }
    }

    delete retValues['/inputMode'];
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

      return {
        queryType: queryTypeField && queryTypeField.value,
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

    if (
      fieldId === 'rdbms.ignoreExtract' ||
      fieldId === 'rdbms.updateExtract'
    ) {
      const lookupField = fields.find(
        field => field.fieldId === 'rdbms.lookups'
      );
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
        lookups: {
          fieldId: 'rdbms.lookups',
          data:
            (lookupField &&
              Array.isArray(lookupField.value) &&
              lookupField.value) ||
            [],
        },
      };
    }

    return null;
  },

  fieldMap: {
    common: { formId: 'common' },
    modelMetadata: { fieldId: 'modelMetadata', visible: false },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
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
      label: 'Ignore Existing Records',
      visibleWhen: [{ field: 'rdbms.queryType', is: ['INSERT'] }],
    },
    ignoreMissing: {
      fieldId: 'ignoreMissing',
      label: 'Ignore Missing Records',
      visibleWhen: [{ field: 'rdbms.queryType', is: ['UPDATE'] }],
    },
    'rdbms.ignoreExtract': {
      fieldId: 'rdbms.ignoreExtract',
      type: 'relativeuriwithlookup',
      adaptorType: r => r && r.adaptorType,
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['rdbms.lookups', 'name'],
    },
    'rdbms.updateExtract': {
      fieldId: 'rdbms.updateExtract',
      type: 'relativeuriwithlookup',
      adaptorType: r => r && r.adaptorType,
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['rdbms.lookups', 'name'],
    },
    dataMappings: { formId: 'dataMappings' },
  },
  layout: {
    fields: [
      'common',
      'modelMetadata',
      'importData',
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
    type: 'collapse',
    containers: [],
  },
};
