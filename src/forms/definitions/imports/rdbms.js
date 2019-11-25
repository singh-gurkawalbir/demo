export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/inputMode'] === 'blob') {
      retValues['/rdbms/queryType'] = retValues['/rdbms/queryType'];
    } else if (retValues['/rdbms/queryType'] === 'COMPOSITE') {
      retValues['/rdbms/query'] = [
        retValues['/rdbms/queryInsert'],
        retValues['/rdbms/queryUpdate'],
      ];
      retValues['/rdbms/queryType'] = ['UPDATE', 'INSERT'];
      retValues['/rdbms/ignoreLookupName'] = undefined;
      retValues['/rdbms/ignoreExtract'] = undefined;
      retValues['/ignoreExisting'] = false;
      retValues['/ignoreMissing'] = false;
    } else if (retValues['/rdbms/queryType'] === 'INSERT') {
      retValues['/rdbms/query'] = [retValues['/rdbms/query']];
      retValues['/rdbms/queryType'] = [retValues['/rdbms/queryType']];
      retValues['/rdbms/updateLookupName'] = undefined;
      retValues['/rdbms/updateExtract'] = undefined;
      retValues['/ignoreMissing'] = false;
    } else if (retValues['/rdbms/queryType'] === 'UPDATE') {
      retValues['/rdbms/query'] = [retValues['/rdbms/query']];
      retValues['/rdbms/queryType'] = [retValues['/rdbms/queryType']];
      retValues['/rdbms/ignoreLookupName'] = undefined;
      retValues['/rdbms/ignoreExtract'] = undefined;
      retValues['/ignoreExisting'] = false;
      retValues['/ignoreMissing'] = false;
    }

    delete retValues['/inputMode'];

    return {
      ...retValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'rdbms.query') {
      const lookupField = fields.find(
        field => field.fieldId === 'rdbms.lookups'
      );
      const queryTypeField = fields.find(
        field => field.fieldId === 'rdbms.queryType'
      );

      return {
        queryType: queryTypeField && queryTypeField.value,
        lookups: {
          // passing lookupId fieldId and data since we will be modifying lookups
          //  from 'Manage lookups' option inside 'SQL Query Builder'
          fieldId: lookupField.fieldId,
          data: lookupField && lookupField.value,
        },
      };
    }

    if (fieldId === 'rdbms.ignoreExtract' || 'rdbms.updateExtract') {
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

        if (r.rdbms.query.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (r.rdbms.query.length > 1) {
            return r.rdbms.query && r.rdbms.query[1];
          }

          return r.rdbms.query && r.rdbms.query[0];
        }

        return '';
      },
    },
    'rdbms.queryUpdate': {
      fieldId: 'rdbms.queryUpdate',
      defaultValue: r => {
        if (!r || !r.rdbms || !r.rdbms.query) {
          return '';
        }

        if (r.rdbms.query.length > 1 || r.ignoreMissing || r.ignoreExisting) {
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
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['rdbms.lookups', 'ignoreLookupname'],
    },
    'rdbms.updateExtract': {
      fieldId: 'rdbms.updateExtract',
      type: 'relativeuriwithlookup',
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['rdbms.lookups', 'updateLookupname'],
    },
    dataMappings: { formId: 'dataMappings' },
  },
  layout: {
    fields: [
      'common',
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
