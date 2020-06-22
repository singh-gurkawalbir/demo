import mappingUtil from '../../../../../utils/mapping';
import dateTimezones from '../../../../../utils/dateTimezones';
import dateFormats from '../../../../../utils/dateFormats';

export default {
  getMetaData: (params = {}) => {
    const {
      value,
      lookup = {},
      extractFields,
      generate,
      generateFields,
      ssLinkedConnectionId,
      connectionId,
      isGroupedSampleData,
    } = params;

    const selectedGenerateObj =
      generateFields && generateFields.find(field => field.id === generate);
    let picklistOptions = [];

    if (selectedGenerateObj && selectedGenerateObj.type === 'picklist') {
      picklistOptions = selectedGenerateObj.options;
    }
    const fieldMeta = {
      fieldMap: {

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
          commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${connectionId}/sObjectTypes`,
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
          opts: {isGroupedSampleData},
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
          // Todo (Aditya): label is needed
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
          valueOptions: picklistOptions && picklistOptions.length ? picklistOptions : undefined,
          map: lookup.map,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['static'] },
          ],
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
        hardcodedDefault: {
          id: 'hardcodedDefault',
          name: 'hardcodedDefault',
          type: 'text',
          label: 'Value',
          placeholder: '',
          required: true,
          visibleWhenAll: [
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
        'lookup.failIfMatchNotFound': {
          id: 'lookup.failIfMatchNotFound',
          name: 'lookupFailIfMatchNotFound',
          label: 'Fail If Unique Match Not Found',
          type: 'checkbox',
          required: true,
          helpKey: 'mapping.suitescript.lookup.failWhenUniqueMatchNotFound',
          defaultValue: !(lookup.allowFailures),
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
          ]
        },
        'lookup.useNull': {
          id: 'lookup.useNull',
          name: 'lookupUseNull',
          label: 'Use Null as Default Value',
          type: 'checkbox',
          required: true,
          helpKey: 'mapping.suitescript.lookup.useNull',
          defaultValue: lookup.default === null,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.failIfMatchNotFound', is: [false] },
          ]
        },
        'lookup.useEmptyString': {
          id: 'lookup.useEmptyString',
          name: 'lookupUseEmptyString',
          label: 'Use Empty String as Default Value',
          type: 'checkbox',
          required: true,
          helpKey: 'mapping.suitescript.lookup.useEmptyString',
          defaultValue: lookup.default === '',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.failIfMatchNotFound', is: [false] },
          ]
        },
        lookupDefault: {
          id: 'lookupDefault',
          name: 'lookupDefault',
          type: 'text',
          label: 'Default lookup value',
          required: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.failIfMatchNotFound', is: [false] },
            { field: 'lookup.useNull', is: [false] },
            { field: 'lookup.useEmptyString', is: [false] },
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
      },
      layout: {
        fields: [
          'fieldMappingType',
          'lookup.mode',
          'lookup.sObjectType',
          'lookup.whereClause',
          'lookup.whereClauseText',
          'lookup.resultField',
          'lookup.mapList',
          'defaultSFSelect',
          'hardcodedDefault',
          'hardcodedSFSelect',
          'hardcodedCheckbox',
          'lookup.failIfMatchNotFound',
          'lookup.useNull',
          'lookup.useEmptyString',
          'lookupDefault',
          'lookupSFSelect',
          'extractDateFormat',
          'extractDateTimezone',
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
              ? `suitescript/connections/${ssLinkedConnectionId}/connections/${connectionId}/sObjectTypes/${sObjectTypeField.value}`
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
            commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${connectionId}/sObjectTypes/${sObjectTypeField.value}`,
          };
        }

        return null;
      },
    };
    let { fields } = fieldMeta.layout;

    if (
      !selectedGenerateObj ||
      (selectedGenerateObj && selectedGenerateObj.type !== 'date' &&
      selectedGenerateObj.type !== 'datetime')
    ) {
      delete fieldMeta.fieldMap.extractDateFormat;
      delete fieldMeta.fieldMap.extractDateTimezone;

      fields = fields.filter(
        el => el !== 'extractDateFormat' && el !== 'extractDateTimezone'
      );
    }

    if (!selectedGenerateObj) {
      delete fieldMeta.fieldMap.hardcodedCheckbox;
      delete fieldMeta.fieldMap.hardcodedSFSelect;
      delete fieldMeta.fieldMap.lookupSFSelect;
      delete fieldMeta.fieldMap.defaultSFSelect;

      fields = fields.filter(
        el =>
          el !== 'hardcodedCheckbox' &&
          el !== 'hardcodedSFSelect' &&
          el !== 'lookupSFSelect' &&
          el !== 'defaultSFSelect'
      );
    } else if (selectedGenerateObj && selectedGenerateObj.type === 'boolean') {
      delete fieldMeta.fieldMap.hardcodedDefault;
      delete fieldMeta.fieldMap.hardcodedSFSelect;
      delete fieldMeta.fieldMap.lookupSFSelect;
      delete fieldMeta.fieldMap.defaultSFSelect;

      fields = fields.filter(
        el =>
          el !== 'hardcodedDefault' &&
          el !== 'hardcodedSFSelect' &&
          el !== 'lookupSFSelect' &&
          el !== 'defaultSFSelect'
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
      delete fieldMeta.fieldMap.hardcodedCheckbox;

      fields = fields.filter(
        el =>
          el !== 'hardcodedCheckbox' &&
          el !== 'hardcodedDefault' &&
          el !== 'lookupDefault'
      );
    }

    if (selectedGenerateObj && selectedGenerateObj.type === 'textarea') {
      fieldMeta.fieldMap.hardcodedDefault.type = 'textarea';
      fieldMeta.fieldMap.lookupDefault.type = 'textarea';
    }

    fieldMeta.layout.fields = fields;

    return fieldMeta;
  },
};
