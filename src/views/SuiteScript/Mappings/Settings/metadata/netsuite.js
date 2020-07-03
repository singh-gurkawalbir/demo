import dateTimezones from '../../../../../utils/dateTimezones';
import dateFormats from '../../../../../utils/dateFormats';
import mappingUtil from '../../../../../utils/mapping';

const getNetsuiteSelectFieldValueUrl = ({
  fieldMetadata,
  ssLinkedConnectionId,
  fieldId,
  recordType,
}) =>
  `netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/${recordType}/${
    fieldMetadata && fieldMetadata.sublist
      ? `sublists/${fieldMetadata.sublist}/`
      : ''
  }selectFieldValues/${fieldId.substr(0, fieldId.indexOf('.internalid'))}`;

export default {
  getMetaData: (params = {}) => {
    const {
      value,
      lookup = {},
      generate,
      generateFields,
      ssLinkedConnectionId,
      connectionId,
      recordType,
      isGroupedSampleData = false,
    } = params;
    const fieldId =
      generate && generate.indexOf('[*].') !== -1
        ? generate.split('[*].')[1]
        : generate;
    const fieldMetadata =
      generateFields && generateFields.find(gen => gen.id === generate);
    let generateFieldType;
    const fieldOptions = [];

    if (
      fieldMetadata &&
      fieldMetadata.id === 'item[*].item.internalid' &&
      fieldMetadata.type === 'select'
    ) {
      fieldMetadata.type = 'integer';
      generateFieldType = 'integer';
    }

    if (
      fieldMetadata &&
      (fieldMetadata.type === 'select' ||
        fieldMetadata.type === 'multiselect') &&
      !generateFieldType
    ) {
      generateFieldType = fieldMetadata.type;
    } else if (
      fieldMetadata &&
      (fieldMetadata.type === 'checkbox' || fieldMetadata.type === 'radio') &&
      !generateFieldType
    ) {
      generateFieldType = 'checkbox';
    }

    const fieldMeta = {
      fieldMap: {
        useFirstRow: {
          id: 'useFirstRow',
          name: 'useFirstRow',
          type: 'checkbox',
          defaultValue: value.useFirstRow || false,
          // helpText not present
          label: 'Use first row',
        },

        fieldMappingType: {
          id: 'fieldMappingType',
          name: 'fieldMappingType',
          type: 'radiogroup',
          label: 'Field mapping type',
          defaultValue: mappingUtil.getFieldMappingType(value),
          fullWidth: true,
          helpKey: 'mapping.fieldMappingType',
          options: [
            {
              items: [
                { label: 'Standard', value: 'standard' },
                { label: 'Hard-Coded', value: 'hardCoded' },
                { label: 'Lookup', value: 'lookup' },
              ],
            },
          ],
        },
        isKey: {
          id: 'isKey',
          name: 'isKey',
          type: 'checkbox',
          label: 'Use as a key field to find existing lines',
          visibleWhen: [
            { field: 'fieldMappingType', is: ['standard'] },
            { field: 'lookup.mode', is: ['static', 'dynamic'] },
          ],
          // helpText not present
          defaultValue: value.isKey,
        },
        'lookup.mode': {
          id: 'lookup.mode',
          name: '_mode',
          type: 'radiogroup',
          label: 'Options',
          fullWidth: true,
          visibleWhen: [{ field: 'fieldMappingType', is: ['lookup'] }],
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
        'lookup.recordType': {
          id: 'lookup.recordType',
          name: 'recordType',
          filterKey: 'suitescript-recordTypes',
          commMetaPath: `netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes`,
          defaultValue: lookup.recordType,
          type: 'refreshableselect',
          label: 'Search record type',
          connectionId,
          helpKey: 'mapping.netsuite.lookup.recordType',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
        },
        'lookup.searchField': {
          id: 'lookup.searchField',
          name: 'searchField',
          type: 'refreshableselect',
          label: 'Search Field',
          defaultValue: lookup.searchField,
          savedRecordType: lookup.recordType,
          connectionId,
          refreshOptionsOnChangesTo: ['lookup.recordType'],
          helpKey: 'mapping.suitescript.netsuite.lookup.searchField',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
        },
        'lookup.resultField': {
          id: 'lookup.resultField',
          name: 'resultField',
          type: 'refreshableselect',
          label: 'Value field',
          defaultValue: lookup.resultField,
          savedRecordType: lookup.recordType,
          connectionId,
          refreshOptionsOnChangesTo: ['lookup.recordType'],
          helpKey: 'mapping.netsuite.lookup.resultField',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
        },

        'lookup.mapList': {
          id: 'lookup.mapList',
          name: '_mapList',
          type: 'staticMap',
          valueLabel: 'Import field (NetSuite)',
          commMetaPath:
            fieldId &&
            getNetsuiteSelectFieldValueUrl({
              fieldMetadata,
              ssLinkedConnectionId,
              fieldId,
              recordType,
            }),
          connectionId: fieldId && connectionId,
          label: '',
          keyOptions:
            fieldOptions && fieldOptions.length ? fieldOptions : undefined,
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
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['static'] },
          ],
        },
        'lookup.failIfMatchNotFound': {
          id: 'lookup.failIfMatchNotFound',
          name: 'lookupFailIfMatchNotFound',
          label: 'Fail If Unique Match Not Found',
          type: 'checkbox',
          required: true,
          helpKey: 'mapping.suitescript.lookup.failWhenUniqueMatchNotFound',
          defaultValue: !(lookup.allowFailures),
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
          ]
        },
        hardcodedDefault: {
          id: 'hardcodedDefault',
          name: 'hardcodedDefault',
          type: 'text',
          required: true,
          label: 'Enter default value',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['hardCoded'] },
          ],
          helpKey: 'mapping.hardcodedDefault',
          defaultValue: value.hardCodedValue,
        },
        hardcodedSelect: {
          id: 'hardcodedSelect',
          name: 'hardcodedSelect',
          type: 'refreshableselect',
          label: 'Value',
          required: true,
          multiselect: generateFieldType === 'multiselect',
          defaultValue:
            generateFieldType === 'multiselect' && value.hardCodedValue
              ? value.hardCodedValue.split(',')
              : value.hardCodedValue,
          commMetaPath:
            fieldId &&
            getNetsuiteSelectFieldValueUrl({
              fieldMetadata,
              connectionId,
              fieldId,
              recordType,
            }),
          connectionId,
          // refreshOptionsOnChangesTo: ['lookup.recordType'],
          visibleWhenAll: [{ field: 'fieldMappingType', is: ['hardCoded'] }],
        },
        hardcodedCheckbox: {
          id: 'hardcodedCheckbox',
          name: 'hardcodedCheckbox',
          type: 'radiogroup',
          label: 'Value',
          defaultValue: value.hardCodedValue || false,
          fullWidth: true,
          options: [
            {
              items: [
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
              ],
            },
          ],
          helpKey: 'mapping.hardcodedDefault',
          visibleWhenAll: [{ field: 'fieldMappingType', is: ['hardCoded'] }],
        },

        extractDateFormat: {
          id: 'extractDateFormat',
          name: 'extractDateFormat',
          type: 'autosuggest',
          options: {
            suggestions: dateFormats,
          },
          labelName: 'name',
          valueName: 'value',
          label: 'Date format',
          defaultValue: value.extractDateFormat,
          helpKey: 'mapping.extractDateFormat',
          visibleWhen: [{ field: 'fieldMappingType', is: ['standard'] }],
        },
        extractDateTimezone: {
          id: 'extractDateTimezone',
          name: 'extractDateTimezone',
          type: 'select',
          label: 'Time zone',
          defaultValue: value.extractDateTimezone,
          options: [
            {
              items:
                (dateTimezones &&
                  dateTimezones.map(date => ({
                    label: date.value,
                    value: date.name,
                  }))) ||
                [],
            },
          ],
          helpKey: 'mapping.extractDateTimezone',
          visibleWhen: [{ field: 'fieldMappingType', is: ['standard'] }],
        },
      },
      layout: {
        fields: [
          'useFirstRow',
          'fieldMappingType',
          'lookup.mode',
          'lookup.recordType',
          'lookup.searchField',
          'lookup.resultField',
          'lookup.mapList',
          'hardcodedDefault',
          'hardcodedSelect',
          'hardcodedCheckbox',
          'extractDateFormat',
          'extractDateTimezone',
          'lookup.failIfMatchNotFound',
          'isKey',
        ],
      },

      optionsHandler: (fieldId, fields) => {
        if (fieldId === 'lookup.recordType') {
          return {
            resourceToFetch: 'recordTypes',
          };
        }
        if (fieldId === 'lookup.resultField') {
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
            commMetaPath: `netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/${recordType}/searchColumns?includeJoinFilters=true`,
          };
        }
        if (fieldId === 'lookup.searchField') {
          const recordTypeField = fields.find(
            field => field.id === 'lookup.recordType'
          );
          const recordType = recordTypeField.value;
          const searchField = fields.find(
            field => field.id === 'lookup.searchField'
          );

          if (searchField.savedRecordType !== recordType) {
            searchField.savedRecordType = recordType;
            searchField.value = '';
          }

          return {
            disableFetch: !recordType,
            commMetaPath: `netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/${recordType}/searchFilters?includeJoinFilters=true`,
          };
        }
        return null;
      },
    };
    const { fieldMap, layout } = fieldMeta;
    let { fields } = layout;

    if (!isGroupedSampleData || generate.indexOf('[*].') === -1) {
      delete fieldMeta.fieldMap.useFirstRow;
      fields = fields.filter(el => el !== 'useFirstRow');
    }

    if (generate.indexOf('[*].') === -1) {
      delete fieldMeta.fieldMap.isKey;
      fields = fields.filter(el => el !== 'isKey');
    }

    if (
      recordType &&
      fieldId.indexOf('.internalid') !== -1 &&
      (generateFieldType === 'select' || generateFieldType === 'multiselect')
    ) {
      delete fieldMeta.fieldMap.hardcodedAction;
      delete fieldMeta.fieldMap.hardcodedDefault;
      delete fieldMeta.fieldMap.hardcodedCheckbox;
      fields = fields.filter(
        el =>
          el !== 'hardcodedAction' &&
          el !== 'hardcodedDefault' &&
          el !== 'hardcodedCheckbox'
      );
    } else if (generateFieldType === 'checkbox') {
      delete fieldMeta.fieldMap.hardcodedAction;
      delete fieldMeta.fieldMap.hardcodedDefault;
      delete fieldMeta.fieldMap.hardcodedSelect;
      delete fieldMeta.fieldMap['lookup.mapList'].commMetaPath;
      delete fieldMeta.fieldMap['lookup.mapList'].connectionId;

      fields = fields.filter(
        el =>
          el !== 'hardcodedAction' &&
          el !== 'hardcodedDefault' &&
          el !== 'hardcodedSelect'
      );
    } else {
      delete fieldMeta.fieldMap.hardcodedSelect;
      delete fieldMeta.fieldMap.hardcodedCheckbox;
      delete fieldMeta.fieldMap['lookup.mapList'].commMetaPath;
      delete fieldMeta.fieldMap['lookup.mapList'].connectionId;

      fields = fields.filter(
        el =>
          el !== 'hardcodedSelect' &&
          el !== 'hardcodedCheckbox' &&
          el !== 'lookupSelect' &&
          el !== 'lookupCheckbox'
      );
    }

    if (
      !fieldMetadata ||
      (fieldMetadata &&
      !['date', 'datetimetz', 'datetime'].includes(fieldMetadata.type))
    ) {
      delete fieldMeta.fieldMap.extractDateFormat;
      delete fieldMeta.fieldMap.extractDateTimezone;

      fields = fields.filter(
        el => el !== 'extractDateFormat' && el !== 'extractDateTimezone'
      );
    }

    fieldMeta.fieldMap = fieldMap;
    fieldMeta.layout.fields = fields;

    return fieldMeta;
  },
};
