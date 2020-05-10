// TODO Ashok: Same code is being used in Mapping settings also. This code should be refactored.
const getNetsuiteSelectFieldValueUrl = ({
  fieldMetadata,
  connectionId,
  fieldId,
  recordType,
}) =>
  `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}/${
    fieldMetadata && fieldMetadata.sublist
      ? `sublists/${fieldMetadata.sublist}/`
      : ''
  }selectFieldValues/${fieldId.substr(0, fieldId.indexOf('.internalid'))}`;

export default {
  getLookupMetadata: ({
    lookup = {},
    connectionId,
    extractFields,
    fieldMetadata,
    fieldId,
    recordType,
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
                { label: 'Dynamic: NetSuite Search', value: 'dynamic' },
                { label: 'Static: Value to Value', value: 'static' },
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
          label: 'Search Record Type',
          connectionId,
          helpKey: 'mapping.netsuite.lookup.recordType',
          visibleWhenAll: [{ field: '_mode', is: ['dynamic'] }],
        },
        _expression: {
          id: '_expression',
          name: '_expression',
          type: 'netsuitelookupfilters',
          label: 'NS Filters',
          connectionId,
          refreshOptionsOnChangesTo: ['_recordType'],
          visibleWhenAll: [{ field: '_mode', is: ['dynamic'] }],
          value: lookup.expression,
          data: extractFields,
        },
        _expressionText: {
          id: '_expressionText',
          name: '_expressionText',
          type: 'text',
          label: 'Lookup Filter Expression',
          multiline: true,
          disableText: true,
          refreshOptionsOnChangesTo: ['_expression'],
          visibleWhenAll: [{ field: '_mode', is: ['dynamic'] }],
          helpKey: 'mapping.netsuite.lookup.expressionText',
          defaultValue: lookup.expression,
        },
        _resultField: {
          id: '_resultField',
          name: '_resultField',
          type: 'refreshableselect',
          label: 'Value Field',
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
          valueLabel: 'Import Field (NetSuite)',
          commMetaPath:
            fieldId &&
            getNetsuiteSelectFieldValueUrl({
              fieldMetadata,
              connectionId,
              fieldId,
              recordType,
            }),
          connectionId,
          label: '',
          keyName: 'export',
          keyLabel: 'Export Field',
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
      },
      layout: {
        fields: [
          '_mode',
          '_recordType',
          '_expression',
          '_expressionText',
          '_resultField',
          '_mapList',
        ],
      },
      optionsHandler: (fieldId, fields) => {
        if (fieldId === '_recordType') {
          return {
            resourceToFetch: 'recordTypes',
          };
        } else if (fieldId === '_expressionText') {
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
