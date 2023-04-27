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
          label: 'Select',
          required: true,
          helpKey: 'mapping.lookup.mode',
          defaultValue: lookup?.map ? 'static' : 'dynamic',
          options: [
            {
              items: [
                { label: 'Dynamic: NetSuite search', value: 'dynamic' },
                { label: 'Static: Value to value', value: 'static' },
              ],
            },
          ],
          isLoggable: true,
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
          isLoggable: true,
        },
        _expression: {
          id: '_expression',
          name: '_expression',
          type: 'netsuitelookupfilters',
          label: 'NS filters',
          required: true,
          connectionId,
          recordTypeFieldId: '_recordType',
          visibleWhenAll: [
            { field: '_mode', is: ['dynamic'] },
            { field: '_recordType', isNot: [''] },
          ],
          value: lookup.expression,
          data: extractFields,
          isLoggable: true,
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
          isLoggable: true,
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
          // can this be loggable?
          isLoggable: true,
        },
        _mapList: {
          id: '_mapList',
          name: '_mapList',
          type: 'staticMap',
          valueLabel: 'Import field value',
          commMetaPath: staticLookupCommMetaPath,
          connectionId: staticLookupCommMetaPath && connectionId,
          label: '',
          required: true,
          keyName: 'export',
          keyLabel: 'Export field value',
          valueName: 'import',
          defaultValue:
            lookup.map &&
            Object.keys(lookup.map).map(key => ({
              export: key,
              import: lookup.map[key],
            })),
          map: lookup.map,
          isLoggable: true,
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
          isLoggable: false,
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
