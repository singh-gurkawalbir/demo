import mappingUtil from '../../../../../utils/mapping';
import dateTimezones from '../../../../../utils/dateTimezones';
import dateFormats from '../../../../../utils/dateFormats';
import {
  isProduction,
  conditionalLookupOptionsforSalesforce,
  conditionalLookupOptionsforSalesforceProduction,
} from '../../../../../forms/utils';

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
    } = params;
    const { connectionId, flowId, resourceId } = options;
    const selectedGenerateObj =
      generateFields && generateFields.find(field => field.id === generate);
    const fieldMeta = {
      fieldMap: {
        immutable: {
          id: 'immutable',
          name: 'immutable',
          type: 'checkbox',
          defaultValue: value.immutable || false,
          helpKey: 'mapping.immutable',
          label: 'Immutable (Advanced)',
        },
        discardIfEmpty: {
          id: 'discardIfEmpty',
          name: 'discardIfEmpty',
          type: 'checkbox',
          defaultValue: value.discardIfEmpty || false,
          helpKey: 'mapping.discardIfEmpty',
          label: 'Discard if empty',
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
        'lookup.mode': {
          id: 'lookup.mode',
          name: '_mode',
          type: 'radiogroup',
          label: '',
          fullWidth: true,
          visibleWhen: [{ field: 'fieldMappingType', is: ['lookup'] }],
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
        'lookup.sObjectType': {
          id: 'lookup.sObjectType',
          name: 'sObjectType',
          defaultValue: lookup.sObjectType,
          type: 'refreshableselect',
          filterKey: 'salesforce-sObjects',
          commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes`,
          label: 'SObject type',
          connectionId,
          helpKey: 'mapping.salesforce.lookup.sObjectType',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
        },
        'lookup.whereClause': {
          id: 'lookup.whereClause',
          name: 'whereClause',
          type: 'salesforcelookupfilters',
          label: '',
          connectionId,
          filterKey: 'salesforce-recordType',
          refreshOptionsOnChangesTo: ['lookup.sObjectType'],
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
          value: lookup.whereClause,
          data: extractFields,
          opts: options,
        },
        'lookup.whereClauseText': {
          id: 'lookup.whereClauseText',
          name: 'whereClauseText',
          label: 'Where clause',
          type: 'text',
          multiline: true,
          disableText: true,
          refreshOptionsOnChangesTo: ['lookup.whereClause'],
          helpKey: 'mapping.salesforce.lookup.whereClauseText',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
          defaultValue: lookup.whereClause,
        },
        'lookup.resultField': {
          id: 'lookup.resultField',
          name: 'resultField',
          type: 'refreshableselect',
          label: 'Value field',
          filterKey: 'salesforce-recordType',
          savedSObjectType: lookup.sObjectType,
          defaultValue: lookup.resultField,
          connectionId,
          refreshOptionsOnChangesTo: ['lookup.sObjectType'],
          helpKey: 'mapping.salesforce.lookup.resultField',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
        },
        'lookup.mapList': {
          id: 'lookup.mapList',
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
          // Todo (surya) 15533 : help text
          helpKey: 'mapping.functions',
          visibleWhen: [{ field: 'fieldMappingType', is: ['multifield'] }],
        },
        extract: {
          id: 'extract',
          name: 'extract',
          type: 'select',
          label: 'Field',
          visibleWhen: [{ field: 'fieldMappingType', is: ['multifield'] }],
          helpKey: 'mapping.extract',
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
          helpKey: 'mapping.expression',
          visibleWhen: [{ field: 'fieldMappingType', is: ['multifield'] }],
        },
        standardAction: {
          id: 'standardAction',
          name: 'standardAction',
          type: 'radiogroup',
          defaultValue: mappingUtil.getDefaultActionValue(value),
          label: 'Action to take if value not found',
          showOptionsVertically: true,
          options: [
            {
              items: [
                {
                  label: 'Use empty string as default value',
                  value: 'useEmptyString',
                },
                { label: 'Use null as default value', value: 'useNull' },
                { label: 'Use custom default value', value: 'default' },
              ],
            },
          ],
          helpKey: 'mapping.standardAction',
          visibleWhen: [
            { field: 'fieldMappingType', is: ['standard'] },
            { field: 'fieldMappingType', is: ['multifield'] },
          ],
        },
        default: {
          id: 'default',
          name: 'default',
          type: 'text',
          label: 'Default value',
          required: true,
          visibleWhenAll: [
            { field: 'standardAction', is: ['default'] },
            { field: 'fieldMappingType', isNot: ['hardCoded'] },
            { field: 'fieldMappingType', isNot: ['lookup'] },
          ],
          helpKey: 'mapping.default',
          defaultValue: value.default,
        },
        defaultSFSelect: {
          id: 'defaultSFSelect',
          name: 'defaultSFSelect',
          type: 'select',
          label: 'Default value',
          required: true,
          visibleWhenAll: [
            { field: 'standardAction', is: ['default'] },
            { field: 'fieldMappingType', isNot: ['hardCoded'] },
            { field: 'fieldMappingType', isNot: ['lookup'] },
          ],
          defaultValue: value.default,
          helpKey: 'mapping.default',
          options: [
            {
              items: selectedGenerateObj && selectedGenerateObj.options,
            },
          ],
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
                  label: 'Use empty string as hardcoded Value',
                  value: 'useEmptyString',
                },
                {
                  label: 'Use null as hardcoded value',
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
          options: [
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
          ],
          helpKey: 'mapping.lookupAction',
          visibleWhenAll: [
            { field: 'lookup.mode', is: ['dynamic', 'static'] },
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
        },
        hardcodedDefault: {
          id: 'hardcodedDefault',
          name: 'hardcodedDefault',
          type: 'text',
          label: 'Value',
          placeholder: '',
          required: true,
          visibleWhenAll: [
            { field: 'hardcodedAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['hardCoded'] },
          ],
          helpKey: 'mapping.hardcodedDefault',
          defaultValue: value.hardCodedValue,
        },
        hardcodedSFSelect: {
          id: 'hardcodedSFSelect',
          name: 'hardcodedSFSelect',
          type: 'select',
          label: 'Value',
          placeholder: '',
          required: true,
          visibleWhenAll: [
            { field: 'hardcodedAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['hardCoded'] },
          ],
          options: [
            {
              items: selectedGenerateObj && selectedGenerateObj.options,
            },
          ],
          helpKey: 'mapping.hardcodedDefault',
          defaultValue: value.hardCodedValue,
        },
        hardcodedCheckbox: {
          id: 'hardcodedCheckbox',
          name: 'hardcodedCheckbox',
          type: 'radiogroup',
          label: 'Value',
          fullWidth: true,
          defaultValue: value.hardCodedValue || false,
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
        lookupDefault: {
          id: 'lookupDefault',
          name: 'lookupDefault',
          type: 'text',
          label: 'Default lookup value',
          required: true,
          visibleWhenAll: [
            { field: 'lookupAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
          helpKey: 'mapping.lookupDefault',
          defaultValue: lookup.default,
        },
        lookupSFSelect: {
          id: 'lookupSFSelect',
          name: 'lookupSFSelect',
          type: 'select',
          label: 'Default lookup value',
          required: true,
          visibleWhenAll: [
            { field: 'lookupAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
          options: [
            {
              items: selectedGenerateObj && selectedGenerateObj.options,
            },
          ],
          helpKey: 'mapping.lookupDefault',
          defaultValue: lookup.default,
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
          defaultValue: value.conditional && value.conditional.when,
          // Todo (surya) 15533 : help text needed
          helpText: 'only perform mapping helptext will come here',
          options: [
            {
              items: isProduction()
                ? conditionalLookupOptionsforSalesforceProduction
                : conditionalLookupOptionsforSalesforce,
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
          type: 'selectlookup',
          // Todo (surya) 15533 : help text needed
          helpText: 'conditional lookup helptext content should display here',
          flowId,
          resourceId,
          importType: 'salesforce',
          refreshOptionsOnChangesTo: ['lookups'],
          label: 'Lookup name:',
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
          'immutable',
          'discardIfEmpty',
          'fieldMappingType',
          'lookup.mode',
          'lookup.sObjectType',
          'lookup.whereClause',
          'lookup.whereClauseText',
          'lookup.resultField',
          'lookup.mapList',
          'functions',
          'extract',
          'expression',
          'standardAction',
          'default',
          'defaultSFSelect',
          'hardcodedAction',
          'lookupAction',
          'hardcodedDefault',
          'hardcodedSFSelect',
          'hardcodedCheckbox',
          'lookupDefault',
          'lookupSFSelect',
          'extractDateFormat',
          'extractDateTimezone',
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
        }
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
        }
        if (fieldId === 'lookup.whereClauseText') {
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
    let { fields } = fieldMeta.layout;

    if (
      selectedGenerateObj &&
      selectedGenerateObj.type !== 'date' &&
      selectedGenerateObj.type !== 'datetime'
    ) {
      delete fieldMeta.fieldMap.extractDateFormat;
      delete fieldMeta.fieldMap.extractDateTimezone;

      fields = fields.filter(
        el => el !== 'extractDateFormat' && el !== 'extractDateTimezone'
      );
    }

    if (selectedGenerateObj && selectedGenerateObj.type === 'boolean') {
      delete fieldMeta.fieldMap.hardcodedDefault;
      delete fieldMeta.fieldMap.hardcodedSFSelect;
      delete fieldMeta.fieldMap.lookupSFSelect;
      delete fieldMeta.fieldMap.defaultSFSelect;
      delete fieldMeta.fieldMap.default;
      delete fieldMeta.fieldMap.hardcodedAction;

      fields = fields.filter(
        el =>
          el !== 'hardcodedDefault' &&
          el !== 'hardcodedSFSelect' &&
          el !== 'lookupSFSelect' &&
          el !== 'defaultSFSelect' &&
          el !== 'default' &&
          el !== 'hardcodedAction'
      );
    } else if (selectedGenerateObj && selectedGenerateObj.type !== 'picklist') {
      delete fieldMeta.fieldMap.hardcodedSFSelect;
      delete fieldMeta.fieldMap.lookupSFSelect;
      delete fieldMeta.fieldMap.defaultSFSelect;
      delete fieldMeta.fieldMap.hardcodedCheckbox;

      fields = fields.filter(
        el =>
          el !== 'hardcodedCheckbox' &&
          el !== 'hardcodedSFSelect' &&
          el !== 'lookupSFSelect' &&
          el !== 'defaultSFSelect'
      );
    } else {
      delete fieldMeta.fieldMap.hardcodedDefault;
      delete fieldMeta.fieldMap.lookupDefault;
      delete fieldMeta.fieldMap.default;
      delete fieldMeta.fieldMap.hardcodedCheckbox;

      fields = fields.filter(
        el =>
          el !== 'hardcodedCheckbox' &&
          el !== 'hardcodedDefault' &&
          el !== 'lookupDefault' &&
          el !== 'default'
      );
    }

    if (selectedGenerateObj && selectedGenerateObj.type === 'textarea') {
      fieldMeta.fieldMap.hardcodedDefault.type = 'textarea';
      fieldMeta.fieldMap.lookupDefault.type = 'textarea';
      fieldMeta.fieldMap.default.type = 'textarea';
    }

    fieldMeta.layout.fields = fields;

    return fieldMeta;
  },
};
