import MappingUtil from '../../../../../utils/mapping';
import dateTimezones from '../../../../../utils/dateTimezones';

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
    const {
      connectionId,
      // sObjectType
    } = options;
    const selectedGenerateObj = generateFields.find(
      field => field.id === generate
    );
    const fieldMeta = {
      fieldMap: {
        immutable: {
          id: 'immutable',
          name: 'immutable',
          type: 'checkbox',
          defaultValue: value.immutable || false,
          label: 'Immutable (Advanced)',
        },
        discardIfEmpty: {
          id: 'discardIfEmpty',
          name: 'discardIfEmpty',
          type: 'checkbox',
          defaultValue: value.discardIfEmpty || false,
          label: 'Discard If Empty',
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
          visibleWhen: [{ field: 'fieldMappingType', is: ['lookup'] }],
          defaultValue: lookup.map ? 'static' : 'dynamic',
          options: [
            {
              items: [
                { label: 'Dynamic: Salesforce Search', value: 'dynamic' },
                { label: 'Static: Value to Value', value: 'static' },
              ],
            },
          ],
        },
        'lookup.recordType': {
          id: 'lookup.recordType',
          name: 'recordType',
          mode: 'suitescript',
          defaultValue: '',
          type: 'refreshableselect',
          resourceType: 'recordTypes',
          label: 'Search Record Type',
          connectionId,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
        },
        'lookup.resultField': {
          id: 'lookup.resultField',
          name: 'resultField',
          mode: 'suitescript',
          defaultValue: '',
          filterKey: 'searchColumns',
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
          label: '',
          keyName: 'export',
          keyLabel: 'Export Field',
          valueName: 'import',
          valueLabel: 'Import Field (Salesforce)',
          map: lookup.map,
          // recordType,
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
          resetAfterSelection: true,
          visibleWhen: [{ field: 'fieldMappingType', is: ['multifield'] }],
        },
        extract: {
          id: 'extract',
          name: 'extract',
          type: 'select',
          label: 'Field',
          resetAfterSelection: true,
          visibleWhen: [{ field: 'fieldMappingType', is: ['multifield'] }],
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
          visibleWhen: [
            { field: 'fieldMappingType', is: ['standard'] },
            { field: 'fieldMappingType', is: ['multifield'] },
          ],
        },
        default: {
          id: 'default',
          name: 'default',
          type: 'text',
          label: 'Default Value',
          visibleWhenAll: [
            { field: 'standardAction', is: ['default'] },
            { field: 'fieldMappingType', isNot: ['hardCoded'] },
            { field: 'fieldMappingType', isNot: ['lookup'] },
          ],
          defaultValue: value.default,
        },
        defaultSelect: {
          id: 'defaultSelect',
          name: 'defaultSelect',
          type: 'select',
          label: 'Default Value',
          visibleWhenAll: [
            { field: 'standardAction', is: ['default'] },
            { field: 'fieldMappingType', isNot: ['hardCoded'] },
            { field: 'fieldMappingType', isNot: ['lookup'] },
          ],
          defaultValue: value.default,
          options: [
            {
              items: [],
            },
          ],
        },
        hardcodedAction: {
          id: 'hardcodedAction',
          name: 'hardcodedAction',
          type: 'radiogroup',
          defaultValue: MappingUtil.getHardCodedActionValue(value),
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
          defaultValue: MappingUtil.getDefaultLookupActionValue(value, lookup),
          label: 'Action to take if unique match not found',
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
          visibleWhen: [{ field: 'fieldMappingType', is: ['lookup'] }],
        },
        hardcodedDefault: {
          id: 'hardcodedDefault',
          name: 'hardcodedDefault',
          type: 'text',
          label: 'Value',
          placeholder: '',
          visibleWhenAll: [
            { field: 'hardcodedAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['hardCoded'] },
          ],
          defaultValue: value.hardCodedValue,
        },
        hardcodedSelect: {
          id: 'hardcodedSelect',
          name: 'hardcodedSelect',
          type: 'select',
          label: 'Value',
          placeholder: '',
          visibleWhenAll: [
            { field: 'hardcodedAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['hardCoded'] },
          ],
          options: [
            {
              items: [],
            },
          ],
          defaultValue: value.hardCodedValue,
        },
        lookupDefault: {
          id: 'lookupDefault',
          name: 'lookupDefault',
          type: 'text',
          label: 'Default Lookup Value',
          // placeholder: 'Enter Default Value',
          visibleWhenAll: [
            { field: 'lookupAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
          defaultValue: lookup.default,
        },
        lookupSelect: {
          id: 'lookupSelect',
          name: 'lookupSelect',
          type: 'select',
          label: 'Default Lookup Value',
          visibleWhenAll: [
            { field: 'lookupAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['lookup'] },
          ],
          options: [
            {
              items: [],
            },
          ],
          defaultValue: lookup.default,
        },
        dateFormat: {
          id: 'dateFormat',
          name: 'dateFormat',
          type: 'text',
          visibleWhen: [{ field: 'fieldMappingType', is: ['standard'] }],
        },
        timeZone: {
          id: 'timeZone',
          name: 'timeZone',
          type: 'select',
          label: 'Time Zone',
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
          'immutable',
          'discardIfEmpty',
          'fieldMappingType',
          'lookup.mode',
          'lookup.recordType',
          'lookup.resultField',
          'lookup.mapList',
          'functions',
          'extract',
          'expression',
          'standardAction',
          'default',
          'defaultSelect',
          'hardcodedAction',
          'lookupAction',
          'hardcodedDefault',
          'hardcodedSelect',
          'lookupDefault',
          'lookupSelect',
          'dateFormat',
          'dateFormat',
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
        } else if (fieldId === 'lookup.recordType') {
          return {
            resourceToFetch: 'recordTypes',
          };
        } else if (fieldId === 'lookup.resultField') {
          const recordTypeField = fields.find(
            field => field.id === 'lookup.recordType'
          );

          return {
            disableOptionsLoad: !(recordTypeField && recordTypeField.value),
            resourceToFetch:
              recordTypeField &&
              recordTypeField.value &&
              `recordTypes/${recordTypeField.value}/searchColumns`,
            resetValue: [],
          };
        }

        return null;
      },
    };
    let { fields } = fieldMeta.layout;

    if (selectedGenerateObj && selectedGenerateObj.type !== 'date') {
      delete fieldMeta.fieldMap.dateFormat;
      delete fieldMeta.fieldMap.timeZone;

      fields = fields.filter(el => el !== 'dateFormat' && el !== 'timeZone');
    }

    if (selectedGenerateObj && selectedGenerateObj.type === 'textarea') {
      fieldMeta.fieldMap.hardcodedDefault.type = 'textarea';
      fieldMeta.fieldMap.lookupDefault.type = 'textarea';
      fieldMeta.fieldMap.default.type = 'textarea';
      delete fieldMeta.fieldMap.hardcodedSelect;
      delete fieldMeta.fieldMap.lookupSelect;
      delete fieldMeta.fieldMap.defaultSelect;
      fields = fields.filter(
        el =>
          el !== 'hardcodedSelect' &&
          el !== 'lookupSelect' &&
          el !== 'defaultSelect'
      );
    }

    if (selectedGenerateObj && selectedGenerateObj.type === 'picklist') {
      delete fieldMeta.fieldMap.hardcodedDefault;
      delete fieldMeta.fieldMap.lookupDefault;
      delete fieldMeta.fieldMap.default;
      fields = fields.filter(
        el =>
          el !== 'hardcodedDefault' &&
          el !== 'lookupDefault' &&
          el !== 'default'
      );
    }

    fieldMeta.layout.fields = fields;

    return fieldMeta;
  },
};
