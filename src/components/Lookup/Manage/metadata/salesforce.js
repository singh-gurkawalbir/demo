export default {
  getLookupMetadata: ({
    lookup = {},
    connectionId,
    picklistOptions,
    extractFields,
  }) => {
    const fieldMeta = {
      fieldMap: {
        _mode: {
          id: '_mode',
          name: '_mode',
          type: 'radiogroup',
          label: 'Select',
          required: true,
          helpKey: 'mapping.lookup.mode',
          defaultValue: lookup?.map ? 'static' : 'dynamic',
          isLoggable: true,
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
          label: 'sObject type',
          connectionId,
          helpKey: 'mapping.salesforce.lookup.sObjectType',
          isLoggable: true,
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
          sObjectTypeFieldId: '_sObjectType',
          isLoggable: true,
          visibleWhenAll: [
            { field: '_mode', is: ['dynamic'] },
            { field: '_sObjectType', isNot: [''] },
          ],
          value: lookup.whereClause,
          data: extractFields,
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
          isLoggable: true,
          helpKey: 'mapping.salesforce.lookup.whereClauseText',
          visibleWhenAll: [
            { field: '_mode', is: ['dynamic'] },
            { field: '_sObjectType', isNot: [''] },
          ],
          defaultValue: lookup.whereClause,
        },
        _resultField: {
          id: '_resultField',
          name: '_resultField',
          required: true,
          type: 'refreshableselect',
          filterKey: 'salesforce-recordType',
          label: 'Value field',
          isLoggable: true,
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
          keyLabel: 'Export field value',
          valueName: 'import',
          required: true,
          valueLabel: 'Import field value',
          isLoggable: true,
          defaultValue:
            lookup.map &&
            Object.keys(lookup.map).map(key => ({
              export: key,
              import: lookup.map[key],
            })),
          valueOptions: picklistOptions,

          map: lookup.map,
          visibleWhenAll: [{ field: '_mode', is: ['static'] }],
        },
        _name: {
          id: '_name',
          name: '_name',
          type: 'text',
          label: 'Name',
          required: true,
          defaultValue: lookup.name,
          placeholder: 'Alphanumeric characters only please',
          helpKey: 'import.lookups.name',
          isLoggable: true,
          validWhen: {
            matchesRegEx: {
              pattern: '^[\\S]+$',
              message: 'Name should not contain spaces.',
            },
          },
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
          '_name',
        ],
      },
      optionsHandler: (fieldId, fields) => {
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
