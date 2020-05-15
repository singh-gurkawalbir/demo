import dateTimezones from '../../../../../utils/dateTimezones';
import dateFormats from '../../../../../utils/dateFormats';
import mappingUtil from '../../../../../utils/mapping';
import {
  isProduction,
  conditionalLookupOptionsforNetsuite,
  conditionalLookupOptionsforNetsuiteProduction,
} from '../../../../../forms/utils';

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
  getMetaData: (params = {}) => {
    const {
      value,
      lookup = {},
      extractFields,
      generate,
      generateFields,
      options,
      lookups,
      isCategoryMapping,
    } = params;
    const {
      resourceId,
      flowId,
      connectionId,
      recordType,
      isComposite,
      isGroupedSampleData = false,
    } = options;
    const fieldId =
      generate && generate.indexOf('[*].') !== -1
        ? generate.split('[*].')[1]
        : generate;
    const fieldMetadata =
      generateFields && generateFields.find(gen => gen.id === generate);
    let generateFieldType;
    let fieldOptions = [];
    let conditionalWhenOptions = isProduction()
      ? conditionalLookupOptionsforNetsuiteProduction
      : conditionalLookupOptionsforNetsuite;

    if (!isComposite) {
      conditionalWhenOptions = conditionalWhenOptions.slice(
        2,
        conditionalWhenOptions.length + 1
      );
    }

    if (isCategoryMapping && fieldMetadata && fieldMetadata.type === 'select') {
      fieldOptions = fieldMetadata.options;
    }

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
          label: 'Data type',
          defaultValue: value.dataType,
          helpKey: 'mapping.dataType',
          options: [
            {
              items: [
                { label: 'String', value: 'string' },
                { label: 'Number', value: 'number' },
                { label: 'Boolean', value: 'boolean' },
                { label: 'Number array', value: 'numberarray' },
                { label: 'String array', value: 'stringarray' },
              ],
            },
          ],
        },
        discardIfEmpty: {
          id: 'discardIfEmpty',
          name: 'discardIfEmpty',
          type: 'checkbox',
          defaultValue: value.discardIfEmpty || false,
          helpKey: 'mapping.discardIfEmpty',
          label: 'Discard if empty',
        },
        immutable: {
          id: 'immutable',
          name: 'immutable',
          type: 'checkbox',
          defaultValue: value.immutable || false,
          helpKey: 'mapping.immutable',
          label: 'Immutable (Advanced)',
        },
        useFirstRow: {
          id: 'useFirstRow',
          name: 'useFirstRow',
          type: 'checkbox',
          defaultValue: value.useFirstRow || false,
          // helpText not present
          label: 'Use first row',
        },
        useAsAnInitializeValue: {
          id: 'useAsAnInitializeValue',
          name: 'useAsAnInitializeValue',
          type: 'checkbox',
          defaultValue: value.useAsAnInitializeValue || false,
          // helpText not present
          // TODO check when this field is hidden
          label: 'Use this field during record initialization',
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
                { label: 'Multi-Field', value: 'multifield' },
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
            { field: 'fieldMappingType', is: ['multifield'] },
            { field: 'lookup.mode', is: ['static', 'dynamic'] },
          ],
          // helpText not present
          defaultValue: value.isKey,
        },
        'lookup.mode': {
          id: 'lookup.mode',
          name: '_mode',
          type: 'radiogroup',
          label: '',
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
          commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes`,
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
        'lookup.expression': {
          id: 'lookup.expression',
          name: 'lookupExpression',
          type: 'netsuitelookupfilters',
          label: 'NS filters',
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
          label: 'Lookup filter expression',
          multiline: true,
          disableText: true,
          refreshOptionsOnChangesTo: ['lookup.expression'],
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
          helpKey: 'mapping.netsuite.lookup.expressionText',
          defaultValue: lookup.expression,
        },
        'lookup.resultField': {
          id: 'lookup.resultField',
          name: 'resultField',
          type: 'refreshableselect',
          label: 'Value field',
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
              connectionId,
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
          visibleWhenAll: isCategoryMapping
            ? [{ field: 'fieldMappingType', is: ['lookup'] }]
            : [
                { field: 'fieldMappingType', is: ['lookup'] },
                { field: 'lookup.mode', is: ['static'] },
              ],
        },
        functions: {
          id: 'functions',
          name: 'functions',
          type: 'fieldexpressionselect',
          label: 'Function',
          helpKey: 'mapping.functions',
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
          helpKey: 'mapping.extract',
        },
        expression: {
          id: 'expression',
          name: 'expression',
          refreshOptionsOnChangesTo: ['functions', 'extract'],
          type: 'text',
          label: 'Expression',
          defaultValue: mappingUtil.getDefaultExpression(value),
          helpKey: 'mapping.expression',
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
                  label: `Use empty string as hardcoded Value`,
                  value: 'useEmptyString',
                },
                {
                  label: 'Use null as hardcoded Value',
                  value: 'useNull',
                },
                {
                  label: 'Use custom value',
                  value: 'default',
                },
              ],
            },
          ],
          helpKey: 'mapping.options',
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
          refreshOptionsOnChangesTo: ['lookup.mode'],
          visibleWhenAll: isCategoryMapping
            ? [{ field: 'fieldMappingType', is: ['lookup'] }]
            : [
                { field: 'lookup.mode', is: ['dynamic', 'static'] },
                { field: 'fieldMappingType', is: ['lookup'] },
              ],
          helpKey: 'mapping.lookupAction',
        },
        hardcodedDefault: {
          id: 'hardcodedDefault',
          name: 'hardcodedDefault',
          type: 'text',
          required: true,
          label: 'Enter default value',
          placeholder: 'Enter Default Value',
          visibleWhenAll: [
            { field: 'hardcodedAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['hardCoded'] },
          ],
          helpKey: 'mapping.hardcodedDefault',
          defaultValue: value.hardCodedValue,
        },
        lookupDefault: {
          id: 'lookupDefault',
          name: 'lookupDefault',
          type: 'text',
          required: true,
          label: 'Enter default value',
          placeholder: 'Enter Default Value',
          visibleWhenAll: [
            {
              field: 'lookupAction',
              is: ['default', 'useDefaultOnMultipleMatches'],
            },
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
          helpKey: 'mapping.lookupDefault',
          defaultValue: lookup.default,
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
        lookupSelect: {
          id: 'lookupSelect',
          name: 'lookupSelect',
          type: 'refreshableselect',
          label: 'Value',
          required: true,
          multiselect: generateFieldType === 'multiselect',
          defaultValue:
            generateFieldType === 'multiselect' && lookup.default
              ? lookup.default.split(',')
              : lookup.default,
          commMetaPath:
            fieldId &&
            getNetsuiteSelectFieldValueUrl({
              fieldMetadata,
              connectionId,
              fieldId,
              recordType,
            }),
          connectionId,
          visibleWhenAll: [
            {
              field: 'lookupAction',
              is: ['default', 'useDefaultOnMultipleMatches'],
            },
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
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

        lookupCheckbox: {
          id: 'lookupCheckbox',
          name: 'lookupCheckbox',
          type: 'radiogroup',
          label: 'Value',
          defaultValue: lookup.default || false,
          fullWidth: true,
          options: [
            {
              items: [
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
              ],
            },
          ],
          helpKey: 'mapping.lookupDefault',
          visibleWhenAll: [
            {
              field: 'lookupAction',
              is: ['default', 'useDefaultOnMultipleMatches'],
            },
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
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
        'conditional.when': {
          id: 'conditional.when',
          name: 'conditionalWhen',
          type: 'select',
          label: 'Only perform mapping when:',
          helpKey: 'mapping.conditional.when',
          defaultValue: value.conditional && value.conditional.when,
          options: [
            {
              items: conditionalWhenOptions,
            },
          ],
        },
        lookups: {
          name: 'lookups',
          id: 'lookups',
          fieldId: 'lookups',
          visible: false,
          defaultValue: lookups,
        },

        'conditional.lookupName': {
          id: 'conditional.lookupName',
          name: 'conditionalLookupName',
          label: 'Lookup name',
          type: 'selectlookup',
          flowId,
          resourceId,
          refreshOptionsOnChangesTo: ['lookups'],
          defaultValue: value.conditional && value.conditional.lookupName,
          visibleWhen: [
            {
              field: 'conditional.when',
              is: ['lookup_not_empty', 'lookup_empty'],
            },
          ],
          required: true,
        },
      },
      layout: {
        fields: [
          'dataType',
          'discardIfEmpty',
          'immutable',
          'useFirstRow',
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
          'lookupSelect',
          'lookupCheckbox',
          'extractDateFormat',
          'extractDateTimezone',
          'isKey',
        ],
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'Advanced',
            fields: ['lookups', 'conditional.when', 'conditional.lookupName'],
          },
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
        } else if (fieldId === 'lookupAction') {
          const lookupModeField = fields.find(
            field => field.id === 'lookup.mode'
          );
          const options = [
            {
              items: [
                {
                  label: 'Fail record',
                  value: 'disallowFailure',
                },
                {
                  label: 'Use empty string as default value',
                  value: 'useEmptyString',
                },
                {
                  label: 'Use null as default value',
                  value: 'useNull',
                },
                {
                  label: 'Use custom default value',
                  value: 'default',
                },
              ],
            },
          ];

          if (lookupModeField && lookupModeField.value === 'dynamic') {
            options[0].items.splice(1, 0, {
              label: 'Use default on multiple matches',
              value: 'useDefaultOnMultipleMatches',
            });
          }

          return options;
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
        } else if (fieldId === 'conditional.lookupName') {
          const lookupField = fields.find(field => field.fieldId === 'lookups');

          return {
            lookups: {
              fieldId: 'lookups',
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
    } else {
      // delete useAsAnInitializeValue for list items
      delete fieldMeta.fieldMap.useAsAnInitializeValue;
      fields = fields.filter(el => el !== 'useAsAnInitializeValue');
    }

    if (
      recordType &&
      fieldId.indexOf('.internalid') !== -1 &&
      (generateFieldType === 'select' || generateFieldType === 'multiselect')
    ) {
      delete fieldMeta.fieldMap.hardcodedAction;
      delete fieldMeta.fieldMap.hardcodedDefault;
      delete fieldMeta.fieldMap.hardcodedCheckbox;
      delete fieldMeta.fieldMap.lookupDefault;
      delete fieldMeta.fieldMap.lookupCheckbox;
      fields = fields.filter(
        el =>
          el !== 'hardcodedAction' &&
          el !== 'hardcodedDefault' &&
          el !== 'hardcodedCheckbox' &&
          el !== 'lookupDefault' &&
          el !== 'lookupCheckbox'
      );
    } else if (generateFieldType === 'checkbox') {
      delete fieldMeta.fieldMap.hardcodedAction;
      delete fieldMeta.fieldMap.hardcodedDefault;
      delete fieldMeta.fieldMap.hardcodedSelect;
      delete fieldMeta.fieldMap.lookupDefault;
      delete fieldMeta.fieldMap.lookupSelect;
      delete fieldMeta.fieldMap['lookup.mapList'].commMetaPath;
      delete fieldMeta.fieldMap['lookup.mapList'].connectionId;

      fields = fields.filter(
        el =>
          el !== 'hardcodedAction' &&
          el !== 'hardcodedDefault' &&
          el !== 'hardcodedSelect' &&
          el !== 'lookupDefault' &&
          el !== 'lookupSelect'
      );
    } else {
      delete fieldMeta.fieldMap.hardcodedSelect;
      delete fieldMeta.fieldMap.hardcodedCheckbox;
      delete fieldMeta.fieldMap.lookupSelect;
      delete fieldMeta.fieldMap.lookupCheckbox;
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
      fieldMetadata &&
      !['date', 'datetimetz', 'datetime'].includes(fieldMetadata.type)
    ) {
      delete fieldMeta.fieldMap.extractDateFormat;
      delete fieldMeta.fieldMap.extractDateTimezone;

      fields = fields.filter(
        el => el !== 'extractDateFormat' && el !== 'extractDateTimezone'
      );
    }

    if (isCategoryMapping) {
      fields = fields.filter(
        el =>
          ![
            'lookup.mode',
            'lookup.recordType',
            'lookup.expression',
            'lookup.expressionText',
            'lookup.resultField',
          ].includes(el)
      );
      const fieldMappingTypeField = fieldMap.fieldMappingType;

      fieldMappingTypeField.options = [
        {
          items: [
            { label: 'Standard', value: 'standard' },
            { label: 'Hard-Coded', value: 'hardCoded' },
            {
              label: 'Static - Lookup',
              value: 'lookup',
            },
          ],
        },
      ];
    }

    fieldMeta.fieldMap = fieldMap;
    fieldMeta.layout.fields = fields;

    return fieldMeta;
  },
};
