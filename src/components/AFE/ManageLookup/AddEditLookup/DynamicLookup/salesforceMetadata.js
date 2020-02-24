// Same code is being used in Mapping settings also. This code should be refactored.

export default {
  getLookupMetadata: ({
    lookup = {},
    connectionId,

    extractFields,
  }) => {
    const fieldMeta = {
      fieldMap: {
        'lookup.mode': {
          id: 'lookup.mode',
          name: '_mode',
          type: 'radiogroup',
          label: '',
          fullWidth: true,
          defaultValue: lookup.name && lookup.map ? 'static' : 'dynamic',
          helpKey: 'mapping.lookup.mode',
          options: [
            {
              items: [
                { label: 'Dynamic: Salesforce Search', value: 'dynamic' },
                { label: 'Static: Value to Value', value: 'static' },
              ],
            },
          ],
        },
        'lookup.sObjectType': {
          id: 'lookup.sObjectType',
          name: 'sObjectType',
          defaultValue: lookup.sObjectType,
          type: 'refreshableselect',
          filterKey: 'salesforce-sObjects',
          commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes`,
          label: 'SObject Type',
          connectionId,
          helpKey: 'mapping.salesforce.lookup.sObjectType',
          visibleWhenAll: [{ field: 'lookup.mode', is: ['dynamic'] }],
        },
        'lookup.whereClause': {
          id: 'lookup.whereClause',
          name: 'whereClause',
          type: 'salesforcelookupfilters',
          label: '',
          connectionId,
          filterKey: 'salesforce-recordType',
          refreshOptionsOnChangesTo: ['lookup.sObjectType'],
          visibleWhenAll: [{ field: 'lookup.mode', is: ['dynamic'] }],
          value: lookup.whereClause,
          data: extractFields,
        },
        'lookup.whereClauseText': {
          id: 'lookup.whereClauseText',
          name: 'whereClauseText',
          label: 'Where Clause',
          type: 'text',
          multiline: true,
          disableText: true,
          refreshOptionsOnChangesTo: ['lookup.whereClause'],
          helpKey: 'mapping.salesforce.lookup.whereClauseText',
          visibleWhenAll: [{ field: 'lookup.mode', is: ['dynamic'] }],
          defaultValue: lookup.whereClause,
        },
        'lookup.resultField': {
          id: 'lookup.resultField',
          name: 'resultField',
          type: 'refreshableselect',
          filterKey: 'salesforce-recordType',
          savedSObjectType: lookup.sObjectType,
          defaultValue: lookup.resultField,
          connectionId,
          refreshOptionsOnChangesTo: ['lookup.sObjectType'],
          helpKey: 'mapping.salesforce.lookup.resultField',
          visibleWhenAll: [{ field: 'lookup.mode', is: ['dynamic'] }],
        },
        'lookup.mapList': {
          id: 'lookup.mapList',
          name: '_mapList',
          type: 'staticMap',
          label: '',
          keyName: 'export',
          keyLabel: 'Export Field',
          valueName: 'import',
          valueLabel: 'Import Field (Salesforce)',
          defaultValue:
            lookup.map &&
            Object.keys(lookup.map).map(key => ({
              export: key,
              import: lookup.map[key],
            })),
          map: lookup.map,
          visibleWhenAll: [{ field: 'lookup.mode', is: ['static'] }],
        },
      },
      layout: {
        fields: [
          'lookup.mode',
          'lookup.sObjectType',
          'lookup.whereClause',
          'lookup.whereClauseText',
          'lookup.resultField',
          'lookup.mapList',
        ],
      },
      optionsHandler: (fieldId, fields) => {
        if (fieldId === 'lookup.whereClause') {
          const sObjectTypeField = fields.find(
            field => field.id === 'lookup.sObjectType'
          );

          return {
            disableFetch: !(sObjectTypeField && sObjectTypeField.value),
            commMetaPath: sObjectTypeField
              ? `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectTypeField.value}`
              : '',
          };
        } else if (fieldId === 'lookup.whereClauseText') {
          const whereClauseField = fields.find(
            field => field.id === 'lookup.whereClause'
          );
          const whereClauseTextField = fields.find(
            field => field.id === 'lookup.whereClauseText'
          );

          whereClauseTextField.value = whereClauseField.value;
        } else if (fieldId === 'lookup.resultField') {
          const sObjectTypeField = fields.find(
            field => field.id === 'lookup.sObjectType'
          );
          const sObjectType = sObjectTypeField.value;
          const resultField = fields.find(
            field => field.id === 'lookup.resultField'
          );

          if (resultField.savedSObjectType !== sObjectType) {
            resultField.savedSObjectType = sObjectType;
            resultField.value = '';
          }

          return {
            disableFetch: !sObjectType,
            commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectTypeField.value}`,
          };
        }

        return null;
      },
    };

    return fieldMeta;
  },
};
