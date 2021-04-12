import dateTimezones from '../../../../../utils/dateTimezones';
import mappingUtil, { wrapTextForSpecialChars } from '../../../../../utils/mapping';
import dateFormats from '../../../../../utils/dateFormats';
import {
  isProduction,
  conditionalLookupOptionsforRest,
  conditionalLookupOptionsforRestProduction,
} from '../../../../../forms/formFactory/utils';

const emptyObject = {};
export default {
  getMetaData: ({
    value = {},
    flowId,
    extractFields,
    lookups,
    importResource = {},
    isGroupedSampleData,
  }) => {
    const {generate, lookupName} = value;
    const {_connectionId: connectionId, name: resourceName, adaptorType, _id: resourceId } = importResource;

    const isComposite = !!((adaptorType === 'HTTPImport' && importResource?.http?.method && importResource.http.method.length > 1) || (adaptorType === 'RESTImport' && importResource?.rest?.method && importResource.rest.method.length > 1));
    const lookup = (lookupName && lookups.find(lookup => lookup.name === lookupName)) || emptyObject;

    let conditionalWhenOptions = isProduction()
      ? conditionalLookupOptionsforRestProduction
      : conditionalLookupOptionsforRest;

    if (!isComposite) {
      conditionalWhenOptions = conditionalWhenOptions.slice(
        2,
        conditionalWhenOptions.length + 1
      );
    }

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
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['standard'] },
          ],
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
          label: 'Options',
          fullWidth: true,
          defaultValue: lookup.name && (lookup.map ? 'static' : 'dynamic'),
          visibleWhen: [{ field: 'fieldMappingType', is: ['lookup'] }],
          helpKey: 'mapping.lookup.mode',
          options: [
            {
              items: [
                { label: 'Dynamic search', value: 'dynamic' },
                { label: 'Static: Value to value', value: 'static' },
              ],
            },
          ],
        },
        'lookup.relativeURI': {
          id: 'lookup.relativeURI',
          name: '_relativeURI',
          type: 'relativeuri',
          showLookup: false,
          connectionId,
          resourceId,
          flowId,
          resourceType: 'imports',
          label: 'Relative URI',
          placeholder: 'Relative URI',
          defaultValue: lookup.relativeURI,
          helpKey: 'mapping.relativeURI',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
        },
        'lookup.method': {
          id: 'lookup.method',
          name: '_method',
          type: 'select',
          label: 'HTTP method',
          required: true,
          defaultValue: lookup.method,
          options: [
            {
              heading: 'Select Http Method',
              items: [
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST' },
              ],
            },
          ],
          helpKey: 'mapping.lookup.method',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
        },
        'lookup.body': {
          id: 'lookup.body',
          name: '_body',
          type: 'httprequestbody',
          connectionId: r => r && r._connectionId,
          resourceId,
          flowId,
          resourceType: 'imports',
          defaultValue: lookup.body || lookup.postBody || '',
          required: true,
          label: 'HTTP request body',
          // helpText not present
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
            { field: 'lookup.method', is: ['POST'] },
          ],
        },
        'lookup.extract': {
          id: 'lookup.extract',
          name: '_extract',
          type: 'text',
          label: 'Resource identifier path',
          placeholder: 'Resource Identifier Path',
          defaultValue: lookup.extract,
          required: true,
          helpKey: 'mapping.lookup.extract',
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
          valueLabel: 'Import field (REST)',
          defaultValue:
            lookup.map &&
            Object.keys(lookup.map).map(key => ({
              export: key,
              import: lookup.map[key],
            })),
          map: lookup.map,
          // helpText not present
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
          helpKey: 'mapping.options',
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
          visibleWhenAll: [
            { field: 'lookup.mode', is: ['dynamic', 'static'] },
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
        },
        default: {
          id: 'default',
          name: 'default',
          type: 'text',
          label: 'Enter default value',
          placeholder: 'Enter Default Value',
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
          placeholder: 'Enter default value',
          required: true,
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
          label: 'Enter default value',
          placeholder: 'Enter default value',
          required: true,
          visibleWhenAll: [
            { field: 'lookupAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
          helpKey: 'mapping.lookupDefault',
          defaultValue: lookup.default,
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
        'conditional.when': {
          id: 'conditional.when',
          name: 'conditionalWhen',
          type: 'select',
          label: 'Only perform mapping when:',
          defaultValue: value.conditional && value.conditional.when,
          options: [{ items: conditionalWhenOptions }],
        },

        'conditional.lookupName': {
          id: 'conditional.lookupName',
          name: 'conditionalLookupName',
          label: 'Lookup name:',
          type: 'selectconditionallookup',
          flowId,
          importId: resourceId,
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
          'fieldMappingType',
          'lookup.mode',
          'lookup.relativeURI',
          'lookup.method',
          'lookup.body',
          'lookup.extract',
          'lookup.mapList',
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
            fields: ['conditional.when', 'conditional.lookupName'],
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
            const isGroupedField = extractField.value.indexOf('*.') === 0;
            const extractFieldValue = isGroupedField ? extractField.value.substring(2) : extractField.value;

            expressionValue += `{{${isGroupedField ? '*.' : ''}${wrapTextForSpecialChars(extractFieldValue)}}}`;
            extractField.value = '';
          } else if (functionsField.value) {
            expressionValue += functionsField.value;
            functionsField.value = '';
          }

          return expressionValue;
        }

        if (fieldId === 'lookup.relativeURI') {
          return { resourceName };
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
