import mappingUtil from '../../../../../utils/mapping';
import dateTimezones from '../../../../../utils/dateTimezones';
import dateFormats from '../../../../../utils/dateFormats';
import {
  isProduction,
  conditionalLookupOptionsforSalesforce,
  conditionalLookupOptionsforSalesforceProduction,
} from '../../../../../forms/formFactory/utils';

const emptyObject = {};
export default {
  getMetaData: ({
    value,
    flowId,
    extractFields,
    generateFields,
    lookups,
    importResource,
  }) => {
    const {lookupName, generate} = value;
    const {_connectionId: connectionId, _id: resourceId } = importResource;
    const lookup = (lookupName && lookups.find(lookup => lookup.name === lookupName)) || emptyObject;
    const selectedGenerateObj =
      generateFields && generateFields.find(field => field.id === generate);
    let picklistOptions = [];

    if (selectedGenerateObj && selectedGenerateObj.type === 'picklist') {
      picklistOptions = selectedGenerateObj.options;
    }
    const fieldMeta = {
      fieldMap: {
        immutable: {
          id: 'immutable',
          name: 'immutable',
          type: 'checkbox',
          defaultValue: value.immutable || false,
          helpKey: 'mapping.immutable',
          noApi: true,
          label: 'Immutable (Advanced)',
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
          visibleWhen: [{ field: 'fieldMappingType', is: ['lookup'] }],
          defaultValue: lookup.name && lookup.map ? 'static' : 'dynamic',
          helpKey: 'mapping.lookup.mode',
          noApi: true,
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
          label: 'sObject type',
          required: true,
          connectionId,
          helpKey: 'mapping.salesforce.lookup.sObjectType',
          noApi: true,
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
          required: true,
          filterKey: 'salesforce-recordType',
          sObjectTypeFieldId: 'lookup.sObjectType',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
            { field: 'lookup.sObjectType', isNot: [''] },
          ],
          value: lookup.whereClause,
          data: extractFields,
        },
        'lookup.whereClauseText': {
          id: 'lookup.whereClauseText',
          name: 'whereClauseText',
          label: 'Where clause',
          type: 'text',
          multiline: true,
          disableText: true,
          required: true,
          refreshOptionsOnChangesTo: ['lookup.whereClause'],
          helpKey: 'mapping.salesforce.lookup.whereClauseText',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
            { field: 'lookup.sObjectType', isNot: [''] },
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
          required: true,
          refreshOptionsOnChangesTo: ['lookup.sObjectType'],
          helpKey: 'mapping.salesforce.lookup.resultField',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
            { field: 'lookup.sObjectType', isNot: [''] },
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
          valueOptions: picklistOptions?.length ? picklistOptions : undefined,
          map: lookup.map,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['static'] },
          ],
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
            { field: 'lookup.mode', is: ['dynamic', 'static'] },
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
          visibleWhen: [{ field: 'fieldMappingType', is: ['multifield'] }],
          helpKey: 'mapping.extract',
          noApi: true,
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
          noApi: true,
          defaultValue: value.default,
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
          noApi: true,
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
          noApi: true,
          defaultValue: value.hardCodedValue,
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
          label: 'Date format',
          defaultValue: value.extractDateFormat,
          helpKey: 'mapping.extractDateFormat',
          noApi: true,
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
          noApi: true,
          visibleWhen: [{ field: 'fieldMappingType', is: ['standard'] }],
        },
        'conditional.when': {
          id: 'conditional.when',
          name: 'conditionalWhen',
          type: 'select',
          label: 'Only perform mapping when:',
          defaultValue: value.conditional && value.conditional.when,
          helpKey: 'mapping.conditional.when',
          noApi: true,
          options: [
            {
              items: isProduction()
                ? conditionalLookupOptionsforSalesforceProduction
                : conditionalLookupOptionsforSalesforce,
            },
          ],
        },
        'conditional.lookupName': {
          id: 'conditional.lookupName',
          name: 'conditionalLookupName',
          type: 'selectconditionallookup',
          picklistOptions: picklistOptions && picklistOptions.length ? picklistOptions : undefined,
          extractFields,
          flowId,
          importId: resourceId,
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
          'lookup.name',
          'functions',
          'extract',
          'expression',
          'standardAction',
          'default',
          'hardcodedAction',
          'lookupAction',
          'hardcodedDefault',
          'lookupDefault',
          'extractDateFormat',
          'extractDateTimezone',
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
        }

        return null;
      },
    };
    let { fields } = fieldMeta.layout;

    if (!selectedGenerateObj || !['date', 'datetime'].includes(selectedGenerateObj.type)) {
      delete fieldMeta.fieldMap.extractDateFormat;
      delete fieldMeta.fieldMap.extractDateTimezone;

      fields = fields.filter(
        el => !['extractDateFormat', 'extractDateTimezone'].includes(el)
      );
    }

    if (selectedGenerateObj?.type === 'boolean') {
      fieldMeta.fieldMap.default.type = 'radiogroup';
      fieldMeta.fieldMap.hardcodedDefault.type = 'radiogroup';
      fieldMeta.fieldMap.lookupDefault.type = 'radiogroup';
      const options = [
        {
          items: [
            { label: 'True', value: 'true' },
            { label: 'False', value: 'false' },
          ],
        },
      ];

      fieldMeta.fieldMap.default.options = options;
      fieldMeta.fieldMap.hardcodedDefault.options = options;
      fieldMeta.fieldMap.lookupDefault.options = options;
      // show it set false to default
    } else if (selectedGenerateObj?.type === 'picklist') {
      fieldMeta.fieldMap.default.type = 'select';
      fieldMeta.fieldMap.hardcodedDefault.type = 'select';
      fieldMeta.fieldMap.lookupDefault.type = 'select';
      const options = [
        {
          items: selectedGenerateObj && selectedGenerateObj.options,
        },
      ];

      fieldMeta.fieldMap.default.options = options;
      fieldMeta.fieldMap.hardcodedDefault.options = options;
      fieldMeta.fieldMap.lookupDefault.options = options;
    } else if (selectedGenerateObj?.type === 'textarea') {
      fieldMeta.fieldMap.hardcodedDefault.multiline = true;
      fieldMeta.fieldMap.hardcodedDefault.rowsMax = 5;
      fieldMeta.fieldMap.lookupDefault.multiline = true;
      fieldMeta.fieldMap.lookupDefault.rowsMax = 5;
      fieldMeta.fieldMap.default.multiline = true;
      fieldMeta.fieldMap.default.rowsMax = 5;
    }

    fieldMeta.layout.fields = fields;

    return fieldMeta;
  },
};
