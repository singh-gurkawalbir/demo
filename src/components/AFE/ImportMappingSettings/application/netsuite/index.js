import dateTimezones from '../../../../../utils/dateTimezones';
import dateFormats from '../../../../../utils/dateFormats';
import mappingUtil from '../../../../../utils/mapping';

export default {
  getMetaData: (params = {}) => {
    const {
      value,
      lookup = {},
      extractFields,
      generate,
      generateFields,
      options,
    } = params;
    const { connectionId, recordType } = options;
    const fieldId =
      generate && generate.indexOf('[*].') !== -1
        ? generate.split('[*].')[1]
        : generate;
    const fieldMetadata = generateFields.find(gen => gen.id === generate);
    let generateFieldType;

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
        dataType: {
          id: 'dataType',
          name: 'dataType',
          type: 'select',
          label: 'Data Type',
          defaultValue: value.dataType,
          options: [
            {
              items: [
                { label: 'String', value: 'string' },
                { label: 'Number', value: 'number' },
                { label: 'Boolean', value: 'boolean' },
                { label: 'Number Array', value: 'numberarray' },
                { label: 'String Array', value: 'stringarray' },
              ],
            },
          ],
        },
        discardIfEmpty: {
          id: 'discardIfEmpty',
          name: 'discardIfEmpty',
          type: 'checkbox',
          defaultValue: value.discardIfEmpty || false,
          label: 'Discard If Empty',
        },
        immutable: {
          id: 'immutable',
          name: 'immutable',
          type: 'checkbox',
          defaultValue: value.immutable || false,
          label: 'Immutable (Advanced)',
        },
        useAsAnInitializeValue: {
          id: 'useAsAnInitializeValue',
          name: 'useAsAnInitializeValue',
          type: 'checkbox',
          defaultValue: value.useAsAnInitializeValue || false,
          label: 'Use This Field During Record Initialization',
        },
        fieldMappingType: {
          id: 'fieldMappingType',
          name: 'fieldMappingType',
          type: 'radiogroup',
          label: 'Field Mapping Type',
          defaultValue: mappingUtil.getFieldMappingType(value),
          fullWidth: true,
          options: [
            {
              items: [
                { label: 'Standard', value: 'standard' },
                { label: 'Hard-Coded', value: 'hardCoded' },
                { label: 'Lookup', value: 'lookup' },
                { label: 'Multi-Field', value: 'multifield' },
              ],
            },
          ],
        },
        'lookup.mode': {
          id: 'lookup.mode',
          name: '_mode',
          type: 'radiogroup',
          label: '',
          fullWidth: true,
          visibleWhen: [{ field: 'fieldMappingType', is: ['lookup'] }],
          defaultValue: lookup.name && (lookup.map ? 'static' : 'dynamic'),
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
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
        },
        'lookup.expression': {
          id: 'lookup.expression',
          name: 'lookupExpression',
          type: 'netsuitelookupfilters',
          label: 'NS Filters',
          connectionId,
          refreshOptionsOnChangesTo: ['lookup.recordType'],
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
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
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
          defaultValue: lookup.expression,
        },
        'lookup.resultField': {
          id: 'lookup.resultField',
          name: 'resultField',
          type: 'refreshableselect',
          label: 'Value Field',
          defaultValue: lookup.resultField,
          /** savedRecordType is not being used with the intension of passing prop to the component.
           * But being used in reference to optionHandler.
           * RecordType field is a refreshableselect component and onFieldChange event is triggered after network call success.
           * When RecordType field is changed, we need to reset value of result field.
           * savedRecordType helps in storing recordType and check is made in option handler if to reset the value or not
           *
           * * */
          savedRecordType: lookup.recordType,
          connectionId,
          refreshOptionsOnChangesTo: ['lookup.recordType'],
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
        },
        'lookup.mapList': {
          id: 'lookup.mapList',
          name: '_mapList',
          type: 'staticMap',
          valueLabel: 'Import Field (NetSuite)',
          commMetaPath:
            fieldId &&
            `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}/selectFieldValues/${fieldId.substr(
              0,
              fieldId.indexOf('.internalid')
            )}`,
          connectionId: fieldId && connectionId,
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
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['static'] },
          ],
        },
        functions: {
          id: 'functions',
          name: 'functions',
          type: 'fieldexpressionselect',
          label: 'Function',
          visibleWhen: [{ field: 'fieldMappingType', is: ['multifield'] }],
        },
        extract: {
          id: 'extract',
          name: 'extract',
          type: 'select',
          label: 'Field',
          visibleWhen: [{ field: 'fieldMappingType', is: ['multifield'] }],
          options: [
            {
              items:
                (extractFields &&
                  extractFields.map(field => ({
                    label: field.name,
                    value: field.id,
                  }))) ||
                [],
            },
          ],
        },
        expression: {
          id: 'expression',
          name: 'expression',
          refreshOptionsOnChangesTo: ['functions', 'extract'],
          type: 'text',
          label: 'Expression',
          defaultValue: mappingUtil.getDefaultExpression(value),
          visibleWhen: [{ field: 'fieldMappingType', is: ['multifield'] }],
        },
        hardcodedAction: {
          id: 'hardcodedAction',
          name: 'hardcodedAction',
          type: 'radiogroup',
          defaultValue: mappingUtil.getHardCodedActionValue(value) || 'default',
          label: 'Options',
          options: [
            {
              items: [
                {
                  label: `Use Empty String as hardcoded Value`,
                  value: 'useEmptyString',
                },
                {
                  label: 'Use Null as hardcoded Value',
                  value: 'useNull',
                },
                {
                  label: 'Use Custom Value',
                  value: 'default',
                },
              ],
            },
          ],
          visibleWhen: [{ field: 'fieldMappingType', is: ['hardCoded'] }],
        },
        lookupAction: {
          id: 'lookupAction',
          name: 'lookupAction',
          type: 'radiogroup',
          defaultValue:
            mappingUtil.getDefaultLookupActionValue(value, lookup) ||
            'disallowFailure',
          label: 'Action to take if unique match not found',
          showOptionsVertically: true,
          options: [
            {
              items: [
                {
                  label: 'Fail Record',
                  value: 'disallowFailure',
                },
                {
                  label: 'Use Empty String as Default Value',
                  value: 'useEmptyString',
                },
                {
                  label: 'Use Null as Default Value',
                  value: 'useNull',
                },
                {
                  label: 'Use Custom Default Value',
                  value: 'default',
                },
              ],
            },
          ],
          visibleWhenAll: [
            { field: 'lookup.mode', is: ['dynamic', 'static'] },
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
        },
        hardcodedDefault: {
          id: 'hardcodedDefault',
          name: 'hardcodedDefault',
          type: 'text',
          label: 'Enter Default Value',
          placeholder: 'Enter Default Value',
          visibleWhenAll: [
            { field: 'hardcodedAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['hardCoded'] },
          ],
          defaultValue: value.hardCodedValue,
        },
        lookupDefault: {
          id: 'lookupDefault',
          name: 'lookupDefault',
          type: 'text',
          label: 'Enter Default Value',
          placeholder: 'Enter Default Value',
          visibleWhenAll: [
            { field: 'lookupAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
          defaultValue: lookup.default,
        },
        hardcodedSelect: {
          id: 'hardcodedSelect',
          name: 'hardcodedSelect',
          type: 'refreshableselect',
          label: 'Value',
          multiselect: generateFieldType === 'multiselect',
          defaultValue:
            generateFieldType === 'multiselect' && value.hardCodedValue
              ? value.hardCodedValue.split(',')
              : value.hardCodedValue,
          commMetaPath:
            fieldId &&
            `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}/selectFieldValues/${fieldId.substr(
              0,
              fieldId.indexOf('.internalid')
            )}`,
          connectionId,
          // refreshOptionsOnChangesTo: ['lookup.recordType'],
          visibleWhenAll: [{ field: 'fieldMappingType', is: ['hardCoded'] }],
        },
        hardcodedCheckbox: {
          id: 'hardcodedCheckbox',
          name: 'hardcodedCheckbox',
          type: 'radiogroup',
          label: 'Value',
          defaultValue: value.hardCodedValue,
          fullWidth: true,
          options: [
            {
              items: [
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
              ],
            },
          ],
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
          visibleWhen: [{ field: 'fieldMappingType', is: ['standard'] }],
        },
        extractDateTimezone: {
          id: 'extractDateTimezone',
          name: 'extractDateTimezone',
          type: 'select',
          label: 'Time Zone',
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
          visibleWhen: [{ field: 'fieldMappingType', is: ['standard'] }],
        },
      },
      layout: {
        fields: [
          'dataType',
          'discardIfEmpty',
          'immutable',
          'useAsAnInitializeValue',
          'fieldMappingType',
          'lookup.mode',
          'lookup.recordType',
          'lookup.expression',
          'lookup.expressionText',
          'lookup.resultField',
          'lookup.mapList',
          'functions',
          'extract',
          'expression',
          'hardcodedAction',
          'lookupAction',
          'hardcodedDefault',
          'lookupDefault',
          'hardcodedSelect',
          'hardcodedCheckbox',
          'extractDateFormat',
          'extractDateTimezone',
        ],
      },
      optionsHandler: (fieldId, fields) => {
        if (fieldId === 'expression') {
          const functionsField = fields.find(field => field.id === 'functions');
          const extractField = fields.find(field => field.id === 'extract');
          const expressionField = fields.find(
            field => field.id === 'expression'
          );
          let expressionValue = '';

          if (expressionField.value) expressionValue = expressionField.value;

          if (extractField.value) {
            const extractValue = extractField.value;

            expressionValue +=
              extractValue.indexOf(' ') > -1
                ? `{{[${extractValue}]}}`
                : `{{${extractValue}}}`;
            extractField.value = '';
          } else if (functionsField.value) {
            expressionValue += functionsField.value;
            functionsField.value = '';
          }

          return expressionValue;
        } else if (fieldId === 'lookup.recordType') {
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
    let { fields } = fieldMeta.layout;

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
        el => el !== 'hardcodedSelect' && el !== 'hardcodedCheckbox'
      );
    }

    if (
      fieldMetadata &&
      fieldMetadata.type !== 'date' &&
      fieldMetadata.type !== 'datetime'
    ) {
      delete fieldMeta.fieldMap.extractDateFormat;
      delete fieldMeta.fieldMap.extractDateTimezone;

      fields = fields.filter(
        el => el !== 'extractDateFormat' && el !== 'extractDateTimezone'
      );
    }

    fieldMeta.layout.fields = fields;

    return fieldMeta;
  },
};
