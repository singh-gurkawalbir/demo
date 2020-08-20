export default {
  getLookupMetadata: ({
    lookup = {},
    connectionId,
    extractFields = [],
    staticLookupCommMetaPath,
  }) => {
    const fieldMeta = {
      fieldMap: {
        _mode: {
          id: '_mode',
          name: '_mode',
          type: 'radiogroup',
          label: '',
          fullWidth: true,
          defaultValue: lookup.name && (lookup.map ? 'static' : 'dynamic'),
          helpKey: 'mapping.lookup.mode',
          options: [
            {
              items: [
                { label: 'Dynamic: NetSuite search', value: 'dynamic' },
                { label: 'Static: Value to value', value: 'static' },
              ],
            },
          ],
        },
        _recordType: {
          id: '_recordType',
          name: '_recordType',
          filterKey: 'suitescript-recordTypes',
          commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes`,
          defaultValue: lookup.recordType,
          type: 'refreshableselect',
          required: true,
          label: 'Search record type',
          connectionId,
          helpKey: 'mapping.netsuite.lookup.recordType',
          visibleWhenAll: [{ field: '_mode', is: ['dynamic'] }],
        },
        _expression: {
          id: '_expression',
          name: '_expression',
          type: 'netsuitelookupfilters',
          label: 'NS filters',
          required: true,
          connectionId,
          refreshOptionsOnChangesTo: ['_recordType'],
          visibleWhenAll: [
            { field: '_mode', is: ['dynamic'] },
            { field: '_recordType', isNot: [''] },
          ],
          value: lookup.expression,
          data: extractFields,
        },
        _expressionText: {
          id: '_expressionText',
          name: '_expressionText',
          type: 'text',
          label: 'Lookup filter expression',
          required: true,
          multiline: true,
          disableText: true,
          refreshOptionsOnChangesTo: ['_expression'],
          visibleWhenAll: [
            { field: '_mode', is: ['dynamic'] },
            { field: '_recordType', isNot: [''] },
          ],
          helpKey: 'mapping.netsuite.lookup.expressionText',
          defaultValue: lookup.expression,
        },
        _resultField: {
          id: '_resultField',
          name: '_resultField',
          type: 'refreshableselect',
          label: 'Value field',
          required: true,
          defaultValue: lookup.resultField,
          savedRecordType: lookup.recordType,
          connectionId,
          refreshOptionsOnChangesTo: ['_recordType'],
          helpKey: 'mapping.netsuite.lookup.resultField',
          visibleWhenAll: [{ field: '_mode', is: ['dynamic'] }],
        },
        _mapList: {
          id: '_mapList',
          name: '_mapList',
          type: 'staticMap',
          valueLabel: 'Import field (NetSuite)',
          commMetaPath: staticLookupCommMetaPath,
          connectionId: staticLookupCommMetaPath && connectionId,
          label: '',
          keyName: 'export',
          keyLabel: 'Export field',
          valueName: 'import',
          defaultValue:
            lookup.map &&
            Object.keys(lookup.map).map(key => ({
              export: key,
              import: lookup.map[key],
            })),
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
          helpText:
            'Name of the lookups that will be exposed to the mapping to refer.',
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
          '_recordType',
          '_expression',
          '_expressionText',
          '_resultField',
          '_mapList',
          '_name',
        ],
      },
      optionsHandler: (fieldId, fields) => {
        if (fieldId === '_recordType') {
          return {
            resourceToFetch: 'recordTypes',
          };
        }
        if (fieldId === '_expressionText') {
          const expressionField = fields.find(
            field => field.id === '_expression'
          );
          const expressionTextField = fields.find(
            field => field.id === '_expressionText'
          );

          expressionTextField.value = expressionField.value;
        } else if (fieldId === '_expression') {
          const recordTypeField = fields.find(
            field => field.id === '_recordType'
          );

          return {
            disableFetch: !(recordTypeField && recordTypeField.value),
            commMetaPath: recordTypeField
              ? `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordTypeField.value}/searchFilters?includeJoinFilters=true`
              : '',
          };
        } else if (fieldId === '_resultField') {
          const recordTypeField = fields.find(
            field => field.id === '_recordType'
          );
          const recordType = recordTypeField.value;
          const resultField = fields.find(field => field.id === '_resultField');

          if (resultField.savedRecordType !== recordType) {
            resultField.savedRecordType = recordType;
            resultField.value = '';
          }

          return {
            disableFetch: !recordType,
            commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordTypeField.value}/searchColumns`,
          };
        }

        return null;
      },
    };

    return fieldMeta;
  },
};
