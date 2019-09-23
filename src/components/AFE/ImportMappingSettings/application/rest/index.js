import dateTimezones from '../../../../../utils/dateTimezones';
import MappingUtil from '../../../../../utils/mapping';

export default {
  getMetaData: (options = {}) => {
    const { value, lookup = {}, extractFields } = options;
    const fieldMeta = {
      fieldMap: {
        dataType: {
          id: 'dataType',
          name: 'dataType',
          type: 'select',
          label: 'Data Type',
          defaultValue: MappingUtil.getDefaultDataType(value),
          options: [
            {
              items: [
                { label: 'String', value: 'string' },
                { label: 'Number', value: 'number' },
                { label: 'Boolean', value: 'boolean' },
                { label: 'Date', value: 'date' },
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
        fieldMappingType: {
          id: 'fieldMappingType',
          name: 'fieldMappingType',
          type: 'radiogroup',
          label: 'Field Mapping Type',
          defaultValue: MappingUtil.getFieldMappingType(value),
          showOptionsHorizontally: true,
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
          showOptionsHorizontally: true,
          fullWidth: true,
          defaultValue: lookup.map ? 'static' : 'dynamic',
          visibleWhen: [{ field: 'fieldMappingType', is: ['lookup'] }],
          options: [
            {
              items: [
                { label: 'Dynamic Search', value: 'dynamic' },
                { label: 'Static: Value to Value', value: 'static' },
              ],
            },
          ],
        },
        'lookup.relativeURI': {
          id: 'lookup.relativeURI',
          name: '_relativeURI',
          type: 'text',
          label: 'Relative URI',
          placeholder: 'Relative URI',
          defaultValue: lookup.relativeURI,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
        },
        'lookup.method': {
          id: 'lookup.method',
          name: '_method',
          type: 'select',
          label: 'HTTP Method',
          placeholder: 'Required',
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
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
        },
        'lookup.body': {
          id: 'lookup.body',
          name: '_body',
          type: 'httprequestbody',
          label: 'Build HTTP Request Body',
          defaultValue: lookup.body || '',
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
          label: 'Resource Identifier Path',
          placeholder: 'Resource Identifier Path',
          defaultValue: lookup.extract,
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
          keyLabel: 'Export Field',
          valueName: 'import',
          valueLabel: 'Import Field (REST)',
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
        // TODO (Aditya) : resetting Field after selection
        extract: {
          id: 'extract',
          name: 'extract',
          type: 'select',
          label: 'Field',
          options: [
            {
              items:
                (extractFields &&
                  extractFields.map(field => ({
                    label: field,
                    value: field,
                  }))) ||
                [],
            },
          ],
          visibleWhen: [{ field: 'fieldMappingType', is: ['multifield'] }],
        },
        expression: {
          id: 'expression',
          name: 'expression',
          refreshOptionsOnChangesTo: ['functions', 'extract'],
          type: 'text',
          label: 'Expression',
          defaultValue: MappingUtil.getDefaultExpression(value),
          visibleWhen: [{ field: 'fieldMappingType', is: ['multifield'] }],
        },
        standardAction: {
          id: 'standardAction',
          name: 'standardAction',
          type: 'radiogroup',
          defaultValue: MappingUtil.getDefaultActionValue(value),
          refreshOptionsOnChangesTo: ['fieldMappingType'],
          label: 'Action to take if value not found',
          options: [
            {
              items: [
                {
                  label: 'Use Empty String as Default Value',
                  value: 'useEmptyString',
                },
                { label: 'Use Null as Default Value', value: 'useNull' },
                { label: 'Use Custom Default Value', value: 'default' },
              ],
            },
          ],
        },
        default: {
          id: 'default',
          name: 'default',
          type: 'text',
          label: 'Enter Default Value',
          placeholder: 'Enter Default Value',
          visibleWhen: [{ field: 'standardAction', is: ['default'] }],
          defaultValue: value.default,
        },
        exportDateFormat: {
          id: 'exportDateFormat',
          name: 'exportDateFormat',
          type: 'text',
          label: 'Export Date Format',
          placeholder: '',
          visibleWhen: [{ field: 'dataType', is: ['date'] }],
        },
        exportDateTimeZone: {
          id: 'exportDateTimeZone',
          name: 'exportDateTimeZone',
          type: 'select',
          label: 'Export Date TimeZone',
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
          visibleWhen: [{ field: 'dataType', is: ['date'] }],
        },
        importDateFormat: {
          id: 'importDateFormat',
          name: 'importDateFormat',
          type: 'text',
          label: 'Import Date Format',
          placeholder: '',
          visibleWhen: [{ field: 'dataType', is: ['date'] }],
        },
        importDateTimeZone: {
          id: 'importDateTimeZone',
          name: 'importDateTimeZone',
          type: 'select',
          label: 'Import Date TimeZone',
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
          visibleWhen: [{ field: 'dataType', is: ['date'] }],
        },
      },
      layout: {
        fields: [
          'dataType',
          'discardIfEmpty',
          'immutable',
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
          'default',
          'exportDateFormat',
          'exportDateTimeZone',
          'importDateFormat',
          'importDateTimeZone',
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

          if (extractField.value) expressionValue += extractField.value;

          if (functionsField.value) expressionValue += functionsField.value;

          return expressionValue;
        } else if (fieldId === 'standardAction') {
          const actionField = fields.find(
            field => field.id === 'fieldMappingType'
          );

          switch (actionField.value) {
            case 'hardCoded':
              return [
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
              ];
            case 'lookup':
              return [
                {
                  items: [
                    {
                      label: 'Fail Record',
                      value: 'disallowFailure',
                    },
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
              ];
            default:
              return [
                {
                  items: [
                    {
                      label: `Use Empty String as Default Value`,
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
              ];
          }
        }

        return null;
      },
    };

    return fieldMeta;
  },
};
