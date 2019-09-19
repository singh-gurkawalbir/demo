import dateTimezones from '../../../../../utils/dateTimezones';
import fieldExpressions from '../../../../../utils/fieldExpressions';
import utilityFunctions from '../../../../../utils/utilityFunctions';

export default {
  getMetaData: (options = {}) => {
    const { value, lookup = {}, extractFields, defaultUtil = {} } = options;
    const fieldMeta = {
      fields: [
        {
          id: 'dataType',
          name: 'dataType',
          type: 'select',
          label: 'Data Type',
          defaultValue:
            defaultUtil.getDefaultDataType &&
            defaultUtil.getDefaultDataType(value),
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
        {
          id: 'discardIfEmpty',
          name: 'discardIfEmpty',
          type: 'checkbox',
          defaultValue: value.discardIfEmpty || false,
          label: 'Discard If Empty',
        },
        {
          id: 'immutable',
          name: 'immutable',
          type: 'checkbox',
          defaultValue: value.immutable || false,
          label: 'Immutable (Advanced)',
        },
        {
          id: 'restImportFieldMappingSettings',
          name: 'restImportFieldMappingSettings',
          type: 'radiogroup',
          label: 'Field Mapping Type',
          defaultValue:
            defaultUtil.getFieldMappingType &&
            defaultUtil.getFieldMappingType(value),
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
        {
          id: 'lookup.mode',
          name: '_mode',
          type: 'radiogroup',
          label: '',
          showOptionsHorizontally: true,
          fullWidth: true,
          defaultValue: lookup.map ? 'static' : 'dynamic',
          visibleWhen: [
            {
              field: 'restImportFieldMappingSettings',
              is: ['lookup'],
            },
          ],
          options: [
            {
              items: [
                { label: 'Dynamic Search', value: 'dynamic' },
                { label: 'Static: Value to Value', value: 'static' },
              ],
            },
          ],
        },
        {
          id: 'lookup.relativeURI',
          name: '_relativeURI',
          type: 'text',
          label: 'Relative URI',
          placeholder: 'Relative URI',
          defaultValue: lookup.relativeURI,
          visibleWhenAll: [
            {
              field: 'restImportFieldMappingSettings',
              is: ['lookup'],
            },
            {
              field: 'lookup.mode',
              is: ['dynamic'],
            },
          ],
        },
        {
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
                {
                  label: 'GET',
                  value: 'GET',
                },
                {
                  label: 'POST',
                  value: 'POST',
                },
              ],
            },
          ],
          visibleWhenAll: [
            {
              field: 'restImportFieldMappingSettings',
              is: ['lookup'],
            },
            {
              field: 'lookup.mode',
              is: ['dynamic'],
            },
          ],
        },
        {
          id: 'lookup.body',
          name: '_body',
          type: 'httprequestbody',
          label: 'Build HTTP Request Body',
          defaultValue: lookup.body || '',
          visibleWhenAll: [
            {
              field: 'restImportFieldMappingSettings',
              is: ['lookup'],
            },
            {
              field: 'lookup.mode',
              is: ['dynamic'],
            },
            {
              field: 'lookup.method',
              is: ['POST'],
            },
          ],
        },
        {
          id: 'lookup.extract',
          name: '_extract',
          type: 'text',
          label: 'Resource Identifier Path',
          placeholder: 'Resource Identifier Path',
          defaultValue: lookup.extract,
          visibleWhenAll: [
            {
              field: 'restImportFieldMappingSettings',
              is: ['lookup'],
            },
            {
              field: 'lookup.mode',
              is: ['dynamic'],
            },
          ],
        },

        {
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
            {
              field: 'restImportFieldMappingSettings',
              is: ['lookup'],
            },
            {
              field: 'lookup.mode',
              is: ['static'],
            },
          ],
        },
        // TODO (Aditya) : resetting function after selection
        {
          id: 'functions',
          name: 'functions',
          type: 'select',
          label: 'Function',
          options: [
            {
              items:
                (fieldExpressions &&
                  fieldExpressions.map(field => ({
                    label: field[1],
                    value: field[0],
                  }))) ||
                [],
            },
          ],
          visibleWhen: [
            {
              field: 'restImportFieldMappingSettings',
              is: ['multifield'],
            },
          ],
        },
        // TODO (Aditya) : resetting Field after selection
        {
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
          visibleWhen: [
            {
              field: 'restImportFieldMappingSettings',
              is: ['multifield'],
            },
          ],
        },
        {
          id: 'expression',
          name: 'expression',
          refreshOptionsOnChangesTo: ['functions', 'extract'],
          type: 'text',
          label: 'Expression',
          defaultValue:
            defaultUtil.getDefaultExpression &&
            defaultUtil.getDefaultExpression(value),
          visibleWhen: [
            {
              field: 'restImportFieldMappingSettings',
              is: ['multifield'],
            },
          ],
        },
        {
          id: 'standardAction',
          name: 'standardAction',
          type: 'radiogroup',
          defaultValue:
            defaultUtil.getDefaultValue && defaultUtil.getDefaultValue(value),
          refreshOptionsOnChangesTo: ['restImportFieldMappingSettings'],
          label: 'Action to take if value not found',
          options: [
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
          ],
        },
        {
          id: 'default',
          name: 'default',
          type: 'text',
          label: 'Enter Default Value',
          placeholder: 'Enter Default Value',
          defaultValue: value.default,
          visibleWhen: [
            {
              field: 'standardAction',
              is: ['default'],
            },
          ],
        },
        {
          id: 'exportDateFormat',
          name: 'exportDateFormat',
          type: 'text',
          label: 'Export Date Format',
          placeholder: '',
          visibleWhen: [
            {
              field: 'dataType',
              is: ['date'],
            },
          ],
        },
        {
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
          visibleWhen: [
            {
              field: 'dataType',
              is: ['date'],
            },
          ],
        },
        {
          id: 'importDateFormat',
          name: 'importDateFormat',
          type: 'text',
          label: 'Import Date Format',
          placeholder: '',
          visibleWhen: [
            {
              field: 'dataType',
              is: ['date'],
            },
          ],
        },
        {
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
          visibleWhen: [
            {
              field: 'dataType',
              is: ['date'],
            },
          ],
        },
      ],
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

          if (functionsField.value)
            expressionValue += utilityFunctions.getHandlebarHelperFormat(
              functionsField.value
            );

          return expressionValue;
        } else if (fieldId === 'standardAction') {
          const actionField = fields.find(
            field => field.id === 'restImportFieldMappingSettings'
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
