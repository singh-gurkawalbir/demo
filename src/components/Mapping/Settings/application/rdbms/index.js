import dateTimezones from '../../../../../utils/dateTimezones';
import mappingUtil, { wrapTextForSpecialChars } from '../../../../../utils/mapping';
import dateFormats from '../../../../../utils/dateFormats';

export default {
  getMetaData: ({
    value = {},
    extractFields,
    isGroupedSampleData,
  }) => {
    const {generate} = value;
    const extractfieldsOpts = [];

    if (extractFields) {
      if (isGroupedSampleData && generate.indexOf('[*].') !== -1) {
        extractFields.forEach(({name, id}) => {
          extractfieldsOpts.push({name: `*.${name}`, id: `*.${id}`});
        });
      }
      extractfieldsOpts.push(...extractFields);
    }
    const fieldMeta = {
      fieldMap: {
        dataType: {
          id: 'dataType',
          name: 'dataType',
          type: 'select',
          label: 'Data type',
          defaultValue: mappingUtil.getDefaultDataType(value),
          helpKey: 'mapping.dataType',
          options: [
            {
              items: [
                { label: 'String', value: 'string' },
                { label: 'Number', value: 'number' },
                { label: 'Boolean', value: 'boolean' },
                { label: 'Date', value: 'date' },
                { label: 'Number array', value: 'numberarray' },
                { label: 'String array', value: 'stringarray' },
                { label: 'JSON', value: 'json' },
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
                { label: 'Multi-Field', value: 'multifield' },
              ],
            },
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
          options: [
            {
              items:
                (extractfieldsOpts?.map(field => ({
                  label: field.name,
                  value: field.id,
                }))) ||
                [],
            },
          ],
          helpKey: 'mapping.extract',
          visibleWhen: [{ field: 'fieldMappingType', is: ['multifield'] }],
        },
        expression: {
          id: 'expression',
          name: 'expression',
          refreshOptionsOnChangesTo: ['functions', 'extract'],
          type: 'text',
          multiline: true,
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
          // helpText not present
          visibleWhen: [{ field: 'fieldMappingType', is: ['hardCoded'] }],
        },
        default: {
          id: 'default',
          name: 'default',
          type: 'text',
          label: 'Enter default value',
          placeholder: 'Enter default value',
          required: true,
          visibleWhenAll: [
            { field: 'standardAction', is: ['default'] },
            { field: 'fieldMappingType', isNot: ['hardCoded'] },
            { field: 'fieldMappingType', isNot: ['lookup'] },
          ],
          helpKey: 'mapping.default',
          defaultValue: value.default,
        },
        hardcodedDefault: {
          id: 'hardcodedDefault',
          name: 'hardcodedDefault',
          type: 'text',
          label: 'Enter default value',
          placeholder: 'Enter Default Value',
          required: true,
          visibleWhenAll: [
            { field: 'hardcodedAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['hardCoded'] },
          ],
          helpKey: 'mapping.hardcodedDefault',
          defaultValue: value.hardCodedValue,
        },
        extractDateFormat: {
          id: 'extractDateFormat',
          name: 'extractDateFormat',
          type: 'autosuggest',
          label: 'Export date format',
          placeholder: '',
          options: {
            suggestions: dateFormats,
          },
          labelName: 'name',
          valueName: 'value',
          defaultValue: value.extractDateFormat,
          helpKey: 'mapping.extractDateFormat',
          visibleWhenAll: [
            { field: 'dataType', is: ['date'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        extractDateTimezone: {
          id: 'extractDateTimezone',
          name: 'extractDateTimezone',
          type: 'select',
          defaultValue: value.extractDateTimezone,
          label: 'Export date time zone',
          options: [
            {
              items:
                (dateTimezones &&
                  dateTimezones.map(date => ({
                    label: date.label,
                    value: date.value,
                  }))) ||
                [],
            },
          ],
          helpkey: 'mapping.extractDateTimezone',
          visibleWhenAll: [
            { field: 'dataType', is: ['date'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        generateDateFormat: {
          id: 'generateDateFormat',
          name: 'generateDateFormat',
          type: 'autosuggest',
          defaultValue: value.generateDateFormat,
          label: 'Import date format',
          placeholder: '',
          options: {
            suggestions: dateFormats,
          },
          labelName: 'name',
          valueName: 'value',
          helpKey: 'mapping.generateDateFormat',
          visibleWhenAll: [
            { field: 'dataType', is: ['date'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        generateDateTimezone: {
          id: 'generateDateTimezone',
          name: 'generateDateTimezone',
          type: 'select',
          defaultValue: value.generateDateTimezone,
          label: 'Import date time zone',
          options: [
            {
              items:
                (dateTimezones &&
                  dateTimezones.map(date => ({
                    label: date.label,
                    value: date.value,
                  }))) ||
                [],
            },
          ],
          helpKey: 'mapping.generateDateTimezone',
          visibleWhenAll: [
            { field: 'dataType', is: ['date'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
      },
      layout: {
        fields: [
          'dataType',
          'discardIfEmpty',
          'immutable',
          'useFirstRow',
          'fieldMappingType',
          'functions',
          'extract',
          'expression',
          'standardAction',
          'hardcodedAction',
          'default',
          'hardcodedDefault',
          'extractDateFormat',
          'extractDateTimezone',
          'generateDateFormat',
          'generateDateTimezone',
        ],
        type: 'collapse',
        containers: [],
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
            const isGroupedField = extractField.value.indexOf('*.') === 0;
            const extractFieldValue = isGroupedField ? extractField.value.substring(2) : extractField.value;

            expressionValue += `{{${isGroupedField ? '*.' : ''}${wrapTextForSpecialChars(extractFieldValue)}}}`;
          } else if (functionsField.value) {
            expressionValue += functionsField.value;
            functionsField.value = '';
          }

          return expressionValue;
        }

        return null;
      },
    };
    let { fields } = fieldMeta.layout;

    if (!isGroupedSampleData || generate.indexOf('[*].') === -1) {
      delete fieldMeta.fieldMap.useFirstRow;
      fields = fields.filter(el => el !== 'useFirstRow');
    }

    fieldMeta.layout.fields = fields;

    return fieldMeta;
  },
};
