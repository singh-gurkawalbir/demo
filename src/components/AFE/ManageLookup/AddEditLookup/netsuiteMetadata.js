// import dynamicMetadata from './DynamicLookup/metadata';
// import dateTimezones from '../../../../utils/dateTimezones';
// import dateFormats from '../../../../utils/dateFormats';
// import mappingUtil from '../../../../utils/mapping';

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
// const getFailedRecordDefault = lookup => {
//   if (!lookup || !lookup.allowFailures) {
//     return 'disallowFailure';
//   }

//   switch (lookup.default) {
//     case '':
//       return 'useEmptyString';
//     case null:
//       return 'useNull';
//     default:
//       return 'default';
//   }
// };

export default {
  getLookupMetadata: ({
    lookup = {},
    // sampleData,
    connectionId,
    // resourceId,
    // resourceType,
    // flowId,
    // resourceName,
    extractFields,
    fieldMetadata,
    fieldId,
    recordType,
  }) => {
    const fieldMeta = {
      fieldMap: {
        'lookup.mode': {
          id: 'lookup.mode',
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
        'lookup.recordType': {
          id: 'lookup.recordType',
          name: 'recordType',
          filterKey: 'suitescript-recordTypes',
          commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes`,
          defaultValue: lookup.recordType,
          type: 'refreshableselect',
          label: 'Search Record Type',
          connectionId,
          helpKey: 'mapping.netsuite.lookup.recordType',
          visibleWhenAll: [{ field: 'lookup.mode', is: ['dynamic'] }],
        },
        'lookup.expression': {
          id: 'lookup.expression',
          name: 'lookupExpression',
          type: 'netsuitelookupfilters',
          label: 'NS Filters',
          connectionId,
          refreshOptionsOnChangesTo: ['lookup.recordType'],
          visibleWhenAll: [{ field: 'lookup.mode', is: ['dynamic'] }],
          value: lookup.expression,
          data: extractFields,
        },
        'lookup.expressionText': {
          id: 'lookup.expressionText',
          name: 'expressionText',
          type: 'text',
          label: 'Lookup Filter Expression',
          multiline: true,
          disableText: true,
          refreshOptionsOnChangesTo: ['lookup.expression'],
          visibleWhenAll: [{ field: 'lookup.mode', is: ['dynamic'] }],
          helpKey: 'mapping.netsuite.lookup.expressionText',
          defaultValue: lookup.expression,
        },
        'lookup.resultField': {
          id: 'lookup.resultField',
          name: 'resultField',
          type: 'refreshableselect',
          label: 'Value Field',
          defaultValue: lookup.resultField,

          savedRecordType: lookup.recordType,
          connectionId,
          refreshOptionsOnChangesTo: ['lookup.recordType'],
          helpKey: 'mapping.netsuite.lookup.resultField',
          visibleWhenAll: [{ field: 'lookup.mode', is: ['dynamic'] }],
        },
        'lookup.mapList': {
          id: 'lookup.mapList',
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
          visibleWhenAll: [{ field: 'lookup.mode', is: ['static'] }],
        },
      },
      layout: {
        fields: [
          'lookup.mode',
          'lookup.recordType',
          'lookup.expression',
          'lookup.expressionText',
          'lookup.resultField',
          'lookup.mapList',
        ],
      },
      optionsHandler: (fieldId, fields) => {
        if (fieldId === 'lookup.recordType') {
          return {
            resourceToFetch: 'recordTypes',
          };
        } else if (fieldId === 'lookup.expressionText') {
          const lookupExpressionField = fields.find(
            field => field.id === 'lookup.expression'
          );
          const lookupExpressionTextField = fields.find(
            field => field.id === 'lookup.expressionText'
          );

          lookupExpressionTextField.value = lookupExpressionField.value;
        } else if (fieldId === 'lookup.expression') {
          const recordTypeField = fields.find(
            field => field.id === 'lookup.recordType'
          );

          return {
            disableFetch: !(recordTypeField && recordTypeField.value),
            commMetaPath: recordTypeField
              ? `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordTypeField.value}/searchFilters?includeJoinFilters=true`
              : '',
          };
        } else if (fieldId === 'lookup.resultField') {
          const recordTypeField = fields.find(
            field => field.id === 'lookup.recordType'
          );
          const recordType = recordTypeField.value;
          const resultField = fields.find(
            field => field.id === 'lookup.resultField'
          );

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
