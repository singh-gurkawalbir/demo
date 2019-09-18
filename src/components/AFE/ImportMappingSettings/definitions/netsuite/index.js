import fieldExpressions from '../../../../../utils/fieldExpressions';
import utilityFunctions from '../../../../../utils/utilityFunctions';

const getFieldMappingType = value => {
  if (value.lookupName) {
    return 'lookup';
  } else if ('hardCodedValue' in value) {
    return 'hardCoded';
  } else if (value.extract && value.extract.indexOf('{{') !== -1) {
    return 'multifield';
  }

  return 'standard';
};

const getDefaultValue = value => {
  if ('default' in value || 'hardCodedValue' in value) {
    const defaultVal = value.default || value.hardCodedValue;

    switch (defaultVal) {
      case '':
        return 'useEmptyString';
      case null:
        return 'useNull';
      default:
        return 'default';
    }
  }
};

const getDefaultExpression = value => {
  if (value.extract && value.extract.indexOf('{{') !== -1) {
    return value.extract;
  }
};

export default {
  getMetaData: (options = {}) => {
    const { value, lookup = {}, extractFields } = options;
    const fieldMeta = {
      fields: [
        {
          id: 'dataType',
          name: 'dataType',
          type: 'select',
          label: 'Data Type:',
          defaultValue: value.dataType,
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
          label: 'Discard If Empty:',
        },

        {
          id: 'immutable',
          name: 'immutable',
          type: 'checkbox',
          defaultValue: value.immutable || false,
          label: 'Immutable (Advanced):',
        },
        {
          id: 'useAsAnInitializeValue',
          name: 'useAsAnInitializeValue',
          type: 'checkbox',
          defaultValue: value.useAsAnInitializeValue || false,
          label: 'Use This Field During Record Initialization:',
        },
        {
          id: 'restImportFieldMappingSettings',
          name: 'restImportFieldMappingSettings',
          type: 'radiogroup',
          label: 'Field Mapping Type:',
          defaultValue: getFieldMappingType(value),
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
          defaultValue: lookup && lookup.map ? 'static' : 'dynamic',
          visibleWhen: [
            {
              field: 'restImportFieldMappingSettings',
              is: ['lookup'],
            },
          ],
          options: [
            {
              items: [
                { label: 'Dynamic: NetSuite Search', value: 'dynamic' },
                { label: 'Static: Value to Value', value: 'static' },
              ],
            },
          ],
        },
        // TODO

        // {
        //   id: 'lookup.recordType',
        //   name: '_recordType',
        //   label: 'Search Record Type:',
        //   type: 'refreshableselect',
        //   mode: 'suitescript',
        //   resourceType: 'recordTypes',
        //   connectionId: '5c88a4bb26a9676c5d706324',
        //   // TODO
        //   defaultValue: '',
        //   visibleWhenAll: [
        //     {
        //       field: 'restImportFieldMappingSettings',
        //       is: ['lookup'],
        //     },
        //     {
        //       field: 'lookup.mode',
        //       is: ['dynamic'],
        //     },
        //   ],
        // },
        // {
        //   id: 'lookup.queryBuilder',
        //   name: '_queryBuilder',
        //   label: '',
        //   type: 'queryBuilder',
        //   visibleWhenAll: [
        //     {
        //       field: 'restImportFieldMappingSettings',
        //       is: ['lookup'],
        //     },
        //     {
        //       field: 'lookup.mode',
        //       is: ['dynamic'],
        //     },
        //   ],
        // },
        // {
        //   id: 'lookup.expression',
        //   name: '_expression',
        //   label: 'Lookup Filter Expression:',
        //   type: 'text',

        //   visibleWhenAll: [
        //     {
        //       field: 'restImportFieldMappingSettings',
        //       is: ['lookup'],
        //     },
        //     {
        //       field: 'lookup.mode',
        //       is: ['dynamic'],
        //     },
        //   ],
        // },
        // {
        //   id: 'lookup.resultField',
        //   name: '_resultField',
        //   label: 'Value Field:',
        //   refreshOptionsOnChangesTo: ['lookup.recordType'],
        //   type: 'refreshableselect',
        //   mode: 'suitescript',
        //   resourceType: 'recordTypes',
        //   connectionId: '5c88a4bb26a9676c5d706324',
        //   filterKey: 'myFilter',
        //   defaultValue: '',
        //   visibleWhenAll: [
        //     {
        //       field: 'restImportFieldMappingSettings',
        //       is: ['lookup'],
        //     },
        //     {
        //       field: 'lookup.mode',
        //       is: ['dynamic'],
        //     },
        //   ],
        // },
        {
          id: 'lookup.mapList',
          name: '_mapList',
          type: 'staticMap',
          label: '',
          keyName: 'export',
          keyLabel: 'Export Field',
          valueName: 'import',
          valueLabel: 'Import Field (HTTP)',
          map: lookup && lookup.map,
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
        {
          id: 'functions',
          name: 'functions',
          type: 'select',
          label: 'Function:',
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
        {
          id: 'extract',
          name: 'extract',
          type: 'select',
          label: 'Field:',
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
          label: 'Expression:',
          defaultValue: getDefaultExpression(value),
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
          defaultValue: getDefaultValue(value),
          refreshOptionsOnChangesTo: ['restImportFieldMappingSettings'],
          label: '',
          visibleWhen: [
            {
              field: 'restImportFieldMappingSettings',
              is: ['hardCoded'],
            },
            {
              field: 'restImportFieldMappingSettings',
              is: ['lookup'],
            },
          ],
        },
        {
          id: 'default',
          name: 'default',
          type: 'text',
          label: 'Enter Default Value:',
          placeholder: 'Enter Default Value',
          defaultValue: value.default,
          visibleWhen: [
            {
              field: 'standardAction',
              is: ['default'],
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
        } else if (fieldId === 'lookup.resultField') {
          const recordTypeField = fields.find(
            field => field.id === 'lookup.recordType'
          );

          return {
            resourceToFetch:
              recordTypeField &&
              recordTypeField.value &&
              `recordTypes/${recordTypeField.value}/searchColumns`,
            resetValue: [],
          };
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
          }
        }

        return null;
      },
    };

    return fieldMeta;
  },
  // getFormattedValue: value => {
  //   const formattedObj = {};

  //   formattedObj.generateFieldSelectOptions = {};
  //   formattedObj.wsGenerateFieldSelectOptions = { options: {} };
  // },
};
