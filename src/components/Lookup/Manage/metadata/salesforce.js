// TODO Ashok: Same code is being used in Mapping settings also. This code should be refactored.

export default {
  getLookupMetadata: ({
    lookup = {},
    connectionId,
    opts = {},
    extractFields,
  }) => {
    const fieldMeta = {
      fieldMap: {
        _mode: {
          id: '_mode',
          name: '_mode',
          type: 'radiogroup',
          label: '',
          fullWidth: true,
          defaultValue: lookup.name && lookup.map ? 'static' : 'dynamic',
          helpKey: 'mapping.lookup.mode',
          options: [
            {
              items: [
                { label: 'Dynamic: Salesforce search', value: 'dynamic' },
                { label: 'Static: Value to value', value: 'static' },
              ],
            },
          ],
        },
        _sObjectType: {
          id: '_sObjectType',
          name: '_sObjectType',
          defaultValue: lookup.sObjectType,
          type: 'refreshableselect',
          filterKey: 'salesforce-sObjects',
          required: true,
          commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes`,
          label: 'SObject type',
          connectionId,
          helpKey: 'mapping.salesforce.lookup.sObjectType',
          visibleWhenAll: [{ field: '_mode', is: ['dynamic'] }],
        },
        _whereClause: {
          id: '_whereClause',
          name: '_whereClause',
          type: 'salesforcelookupfilters',
          label: '',
          connectionId,
          required: true,
          filterKey: 'salesforce-recordType',
          refreshOptionsOnChangesTo: ['_sObjectType'],
          visibleWhenAll: [{ field: '_mode', is: ['dynamic'] }],
          value: lookup.whereClause,
          data: extractFields,
          opts,
        },
        _whereClauseText: {
          id: '_whereClauseText',
          name: '_whereClauseText',
          label: 'Where clause',
          required: true,
          type: 'text',
          multiline: true,
          disableText: true,
          refreshOptionsOnChangesTo: ['_whereClause'],
          helpKey: 'mapping.salesforce.lookup.whereClauseText',
          visibleWhenAll: [{ field: '_mode', is: ['dynamic'] }],
          defaultValue: lookup.whereClause,
        },
        _resultField: {
          id: '_resultField',
          name: '_resultField',
          required: true,
          type: 'refreshableselect',
          filterKey: 'salesforce-recordType',
          savedSObjectType: lookup.sObjectType,
          defaultValue: lookup.resultField,
          connectionId,
          refreshOptionsOnChangesTo: ['_sObjectType'],
          helpKey: 'mapping.salesforce.lookup.resultField',
          visibleWhenAll: [{ field: '_mode', is: ['dynamic'] }],
        },
        _mapList: {
          id: '_mapList',
          name: '_mapList',
          type: 'staticMap',
          label: '',
          keyName: 'export',
          keyLabel: 'Export field',
          valueName: 'import',
          valueLabel: 'Import field (Salesforce)',
          defaultValue:
            lookup.map &&
            Object.keys(lookup.map).map(key => ({
              export: key,
              import: lookup.map[key],
            })),
          map: lookup.map,
          visibleWhenAll: [{ field: '_mode', is: ['static'] }],
        },
      },
      layout: {
        fields: [
          '_mode',
          '_sObjectType',
          '_whereClause',
          '_whereClauseText',
          '_resultField',
          '_mapList',
        ],
      },
      optionsHandler: (fieldId, fields) => {
        if (fieldId === '_whereClause') {
          const sObjectTypeField = fields.find(
            field => field.id === '_sObjectType'
          );

          return {
            disableFetch: !(sObjectTypeField && sObjectTypeField.value),
            commMetaPath: sObjectTypeField
              ? `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectTypeField.value}`
              : '',
          };
        }
        if (fieldId === '_whereClauseText') {
          const whereClauseField = fields.find(
            field => field.id === '_whereClause'
          );
          const whereClauseTextField = fields.find(
            field => field.id === '_whereClauseText'
          );

          whereClauseTextField.value = whereClauseField.value;
        } else if (fieldId === '_resultField') {
          const sObjectTypeField = fields.find(
            field => field.id === '_sObjectType'
          );
          const sObjectType = sObjectTypeField.value;
          const resultField = fields.find(field => field.id === '_resultField');

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
