import dateTimezones from '../../../../../utils/dateTimezones';
import mappingUtil from '../../../../../utils/mapping';
import dateFormats from '../../../../../utils/dateFormats';

const emptyObject = {};
export default {
  getMetaData: ({
    value,
    extractFields,
    lookups,
    isGroupedSampleData,
    importResource,
  }) => {
    const { generate, lookupName, extract } = value;
    const lookup = (lookupName && lookups.find(lookup => lookup.name === lookupName)) || emptyObject;
    const extractfieldsOpts = [];

    if (extractFields) {
      if (isGroupedSampleData && (mappingUtil.isCsvOrXlsxResource(importResource) || generate.indexOf('[*].') !== -1)) {
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
          noApi: true,
          options: [
            {
              items: [
                { label: 'String', value: 'string' },
                { label: 'Number', value: 'number' },
                { label: 'Boolean', value: 'boolean' },
                { label: 'Date', value: 'date' },
                { label: 'Number array', value: 'numberarray' },
                { label: 'String array', value: 'stringarray' },
              ],
            },
          ],
        },
        useFirstRow: {
          id: 'useFirstRow',
          name: 'useFirstRow',
          type: 'checkbox',
          helpKey: 'mapping.useFirstRow',
          noApi: true,
          defaultValue: value.useFirstRow || false,
          // helpText not present
          label: 'Use first row',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        discardIfEmpty: {
          id: 'discardIfEmpty',
          name: 'discardIfEmpty',
          type: 'checkbox',
          defaultValue: value.discardIfEmpty || false,
          helpKey: 'mapping.discardIfEmpty',
          noApi: true,
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
          noApi: true,
          options: [
            {
              items: [
                { label: 'Standard', value: 'standard' },
                { label: 'Hard-Coded', value: 'hardCoded' },
                { label: 'Static-Lookup', value: 'lookup' },
                { label: 'Multi-Field', value: 'multifield' },
              ],
            },
          ],
        },
        'lookup.mapList': {
          id: 'lookup.mapList',
          name: '_mapList',
          type: 'staticMap',
          label: '',
          keyName: 'export',
          keyLabel: 'Export field value',
          valueName: 'import',
          valueLabel: 'Import field value',
          defaultValue:
            lookup.map &&
            Object.keys(lookup.map).map(key => ({
              export: key,
              import: lookup.map[key],
            })),
          map: lookup.map,
          // helpText not present
          visibleWhenAll: [{ field: 'fieldMappingType', is: ['lookup'] }],
        },
        'lookup.name': {
          id: 'lookup.name',
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
          defaultValue: lookup.name,
          placeholder: 'Alphanumeric characters only please',
          helpKey: 'import.lookups.name',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
          validWhen: {
            matchesRegEx: {
              pattern: '^[\\S]+$',
              message: 'Name should not contain spaces.',
            },
          },
        },
        functions: {
          id: 'functions',
          name: 'functions',
          type: 'fieldexpressionselect',
          label: 'Function',
          helpKey: 'mapping.functions',
          noApi: true,
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
          noApi: true,
          visibleWhen: [{ field: 'fieldMappingType', is: ['multifield'] }],
        },
        expression: {
          id: 'expression',
          name: 'expression',
          type: 'multifieldexpression',
          multiline: true,
          label: 'Expression',
          defaultValue: mappingUtil.getDefaultExpression(value),
          helpKey: 'mapping.expression',
          noApi: true,
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
          noApi: true,
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
          helpKey: 'mapping.options',
          noApi: true,
          visibleWhen: [{ field: 'fieldMappingType', is: ['hardCoded'] }],
        },
        lookupAction: {
          id: 'lookupAction',
          name: 'lookupAction',
          type: 'radiogroup',
          defaultValue:
            mappingUtil.getDefaultLookupActionValue(lookup),
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
                { label: 'Use null as default value', value: 'useNull' },
                { label: 'Use custom default value', value: 'default' },
              ],
            },
          ],
          helpKey: 'mapping.lookupAction',
          noApi: true,
          visibleWhen: [{ field: 'fieldMappingType', is: ['lookup'] }],
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
          noApi: true,
          defaultValue: value.default,
        },
        hardcodedDefault: {
          id: 'hardcodedDefault',
          name: 'hardcodedDefault',
          type: 'text',
          label: 'Enter default value',
          placeholder: 'Enter default value',
          required: true,
          visibleWhenAll: [
            { field: 'hardcodedAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['hardCoded'] },
          ],
          helpKey: 'mapping.hardcodedDefault',
          noApi: true,
          defaultValue: value.hardCodedValue,
        },
        lookupDefault: {
          id: 'lookupDefault',
          name: 'lookupDefault',
          type: 'text',
          label: 'Enter default value',
          required: true,
          placeholder: 'Enter default value',
          visibleWhenAll: [
            { field: 'lookupAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
          helpKey: 'mapping.lookupDefault',
          noApi: true,
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
          label: 'Export date format',
          defaultValue: value.extractDateFormat,
          placeholder: '',
          helpKey: 'mapping.extractDateFormat',
          noApi: true,
          visibleWhenAll: [
            { field: 'dataType', is: ['date'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        extractDateTimezone: {
          id: 'extractDateTimezone',
          name: 'extractDateTimezone',
          type: 'select',
          label: 'Export date time zone',
          defaultValue: value.extractDateTimezone,
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
          helpKey: 'mapping.extractDateTimezone',
          noApi: true,
          visibleWhenAll: [
            { field: 'dataType', is: ['date'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        generateDateFormat: {
          id: 'generateDateFormat',
          name: 'generateDateFormat',
          type: 'autosuggest',
          options: {
            suggestions: dateFormats,
          },
          labelName: 'name',
          valueName: 'value',
          label: 'Import date format',
          defaultValue: value.generateDateFormat,
          placeholder: '',
          helpKey: 'mapping.generateDateFormat',
          noApi: true,
          visibleWhenAll: [
            { field: 'dataType', is: ['date'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        generateDateTimezone: {
          id: 'generateDateTimezone',
          name: 'generateDateTimezone',
          type: 'select',
          label: 'Import date time zone',
          defaultValue: value.generateDateTimezone,
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
          noApi: true,
          visibleWhenAll: [
            { field: 'dataType', is: ['date'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        'conditional.when': {
          id: 'conditional.when',
          name: 'conditionalWhen',
          type: 'select',
          label: 'Only perform mapping when:',
          defaultValue: value.conditional && value.conditional.when,
          options: [
            {
              items: [
                {
                  label: 'Source record has a value',
                  value: 'extract_not_empty',
                },
              ],
            },
          ],
        },
      },
      layout: {
        fields: [
          'dataType',
          'useFirstRow',
          'discardIfEmpty',
          'fieldMappingType',
          'lookup.mapList',
          'lookup.name',
          'functions',
          'extract',
          'expression',
          'standardAction',
          'hardcodedAction',
          'lookupAction',
          'default',
          'hardcodedDefault',
          'lookupDefault',
          'extractDateFormat',
          'extractDateTimezone',
          'generateDateFormat',
          'generateDateTimezone',
        ],
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'Advanced',
            fields: ['conditional.when'],
          },
        ],
      },
    };
    let { fields } = fieldMeta.layout;

    if (!isGroupedSampleData || extract?.indexOf('[*].') > -1) {
      delete fieldMeta.fieldMap.useFirstRow;
      fields = fields.filter(el => el !== 'useFirstRow');
    }

    fieldMeta.layout.fields = fields;

    return fieldMeta;
  },
};
