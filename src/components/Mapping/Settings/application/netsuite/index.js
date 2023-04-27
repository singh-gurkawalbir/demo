import dateTimezones from '../../../../../utils/dateTimezones';
import dateFormats from '../../../../../utils/dateFormats';
import mappingUtil from '../../../../../utils/mapping';
import {
  isProduction,
  conditionalLookupOptionsforNetsuite,
  conditionalLookupOptionsforNetsuiteProduction,
} from '../../../../../forms/formFactory/utils';

const emptyObject = {};
const getNetsuiteSelectFieldValueUrl = ({
  fieldMetadata,
  connectionId,
  fieldId,
  recordType,
}) =>
  `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}/${
    fieldMetadata && fieldMetadata.sublist
      ? `sublists/${fieldMetadata.sublist}/`
      : ''
  }selectFieldValues/${fieldId.substr(0, fieldId.indexOf('.internalid'))}`;

export default {
  getMetaData: ({
    value,
    flowId,
    extractFields,
    generateFields,
    lookups,
    isCategoryMapping,
    recordType,
    importResource,
    isGroupedSampleData,
  }) => {
    const { generate, extract, lookupName } = value;

    const {_connectionId: connectionId, _id: resourceId } = importResource;
    const isComposite = importResource.netsuite_da?.operation === 'addupdate' || importResource.netsuite?.operation === 'addupdate';

    const lookup = (lookupName && lookups.find(lookup => lookup.name === lookupName)) || emptyObject;

    const fieldId =
      generate && generate.indexOf('[*].') !== -1
        ? generate.split('[*].')[1]
        : generate;
    const fieldMetadata =
      generateFields && generateFields.find(gen => gen.id === generate);
    let generateFieldType;
    let fieldOptions = [];
    let conditionalWhenOptions = isProduction()
      ? conditionalLookupOptionsforNetsuiteProduction
      : conditionalLookupOptionsforNetsuite;

    if (!isComposite) {
      conditionalWhenOptions = conditionalWhenOptions.slice(
        2,
        conditionalWhenOptions.length + 1
      );
    }

    if (isCategoryMapping && fieldMetadata && fieldMetadata.type === 'select') {
      fieldOptions = fieldMetadata.options;
    }

    if (
      fieldMetadata &&
      fieldMetadata.id === 'item[*].item.internalid' &&
      fieldMetadata.type === 'select'
    ) {
      fieldMetadata.type = 'integer';
      generateFieldType = 'integer';
    }

    if (
      fieldMetadata &&
      (fieldMetadata.type === 'select' ||
        fieldMetadata.type === 'multiselect') &&
      !generateFieldType
    ) {
      generateFieldType = fieldMetadata.type;
    } else if (
      fieldMetadata &&
      (fieldMetadata.type === 'checkbox' || fieldMetadata.type === 'radio') &&
      !generateFieldType
    ) {
      generateFieldType = 'checkbox';
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
          defaultValue: value.dataType,
          helpKey: 'mapping.dataType',
          noApi: true,
          options: [
            {
              items: [
                { label: 'String', value: 'string' },
                { label: 'Number', value: 'number' },
                { label: 'Boolean', value: 'boolean' },
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
          noApi: true,
          label: 'Discard if empty',
        },
        immutable: {
          id: 'immutable',
          name: 'immutable',
          type: 'checkbox',
          defaultValue: value.immutable || false,
          helpKey: 'mapping.immutable',
          noApi: true,
          label: 'Immutable (Advanced)',
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
        useAsAnInitializeValue: {
          id: 'useAsAnInitializeValue',
          name: 'useAsAnInitializeValue',
          type: 'checkbox',
          defaultValue: value.useAsAnInitializeValue || false,
          helpKey: 'mapping.useAsInitializeValue',
          noApi: true,
          // TODO check when this field is hidden
          label: 'Use this field for NetSuite record initialization',
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
        isKey: {
          id: 'isKey',
          name: 'isKey',
          type: 'checkbox',
          helpKey: 'mapping.isKey',
          noApi: true,
          label: 'Use as a key field to find existing lines',
          visibleWhen: [
            { field: 'fieldMappingType', is: ['standard'] },
            { field: 'fieldMappingType', is: ['multifield'] },
            { field: 'lookup.mode', is: ['static', 'dynamic'] },
          ],
          // helpText not present
          defaultValue: value.isKey,
        },
        'lookup.mode': {
          id: 'lookup.mode',
          name: '_mode',
          type: 'radiogroup',
          label: 'Options',
          fullWidth: true,
          visibleWhen: [{ field: 'fieldMappingType', is: ['lookup'] }],
          requiredWhen: isCategoryMapping ? [] : [{ field: 'fieldMappingType', is: ['lookup'] }],
          defaultValue: lookup.name && (lookup.map ? 'static' : 'dynamic'),
          helpKey: 'mapping.lookup.mode',
          noApi: true,
          options: [
            {
              items: [
                { label: 'Dynamic: NetSuite search', value: 'dynamic' },
                { label: 'Static: Value to value', value: 'static' },
              ],
            },
          ],
        },
        'lookup.recordType': {
          id: 'lookup.recordType',
          name: 'recordType',
          filterKey: 'restlet-recordTypes',
          commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes`,
          defaultValue: lookup.recordType,
          type: 'refreshableselect',
          label: 'Search record type',
          connectionId,
          required: true,
          helpKey: 'mapping.netsuite.lookup.recordType',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
        },
        'lookup.expression': {
          id: 'lookup.expression',
          name: 'lookupExpression',
          type: 'netsuitelookupfilters',
          label: 'NS filters',
          connectionId,
          required: true,
          recordTypeFieldId: 'lookup.recordType',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
            { field: 'lookup.recordType', isNot: [''] },
          ],
          value: lookup.expression,
          data: extractfieldsOpts,
        },
        'lookup.expressionText': {
          id: 'lookup.expressionText',
          name: 'expressionText',
          type: 'text',
          label: 'Lookup filter expression',
          multiline: true,
          required: true,
          disableText: true,
          refreshOptionsOnChangesTo: ['lookup.expression'],
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
            { field: 'lookup.recordType', isNot: [''] },
          ],
          helpKey: 'mapping.netsuite.lookup.expressionText',
          noApi: true,
          defaultValue: lookup.expression,
        },
        'lookup.resultField': {
          id: 'lookup.resultField',
          name: 'resultField',
          type: 'refreshableselect',
          label: 'Value field',
          required: true,
          defaultValue: lookup.resultField,
          /** savedRecordType is not being used with the intension of passing prop to the component.
           * But being used in reference to optionHandler.
           * RecordType field is a refreshableselect component and onFieldChange event is triggered after network call success.
           * When RecordType field is changed, we need to reset value of result field.
           * savedRecordType helps in storing recordType and check is made in option handler if to reset the value or not
           *
           * * */
          savedRecordType: lookup.recordType,
          connectionId,
          refreshOptionsOnChangesTo: ['lookup.recordType'],
          helpKey: 'mapping.netsuite.lookup.resultField',
          noApi: true,
          requiredWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
          ],
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
            { field: 'lookup.recordType', isNot: [''] },
          ],
        },
        'lookup.mapList': {
          id: 'lookup.mapList',
          name: '_mapList',
          type: 'staticMap',
          valueLabel: 'Import field value',
          // commMetaPath:  commMetaPath  to be added based on metadata type
          // connectionId:  connection  to be added based on metadata type
          label: '',
          keyOptions:
            fieldOptions && fieldOptions.length ? fieldOptions : undefined,
          keyName: 'export',
          keyLabel: 'Export field value',
          valueName: 'import',
          defaultValue:
            lookup.map &&
            Object.keys(lookup.map).map(key => ({
              export: key,
              import: lookup.map[key],
            })),
          map: lookup.map,
          visibleWhenAll: isCategoryMapping
            ? [{ field: 'fieldMappingType', is: ['lookup'] }]
            : [
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
          refreshOptionsOnChangesTo: ['lookup.mode'],
          visibleWhenAll: isCategoryMapping
            ? [{ field: 'fieldMappingType', is: ['lookup'] }]
            : [
              { field: 'lookup.mode', is: ['dynamic', 'static'] },
              { field: 'fieldMappingType', is: ['lookup'] },
            ],
          helpKey: 'mapping.lookupAction',
          noApi: true,
        },
        hardcodedDefault: {
          id: 'hardcodedDefault',
          name: 'hardcodedDefault',
          type: 'text',
          connectionId,
          required: true,
          label: 'Enter default value',
          placeholder: 'Enter Default Value',
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
          required: true,
          label: 'Enter default value',
          placeholder: 'Enter Default Value',
          visibleWhenAll: [
            {
              field: 'lookupAction',
              is: ['default', 'useDefaultOnMultipleMatches'],
            },
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
          helpKey: 'mapping.conditional.when',
          noApi: true,
          defaultValue: value.conditional && value.conditional.when,
          options: [
            {
              items: conditionalWhenOptions,
            },
          ],
        },
        'conditional.lookupName': {
          id: 'conditional.lookupName',
          name: 'conditionalLookupName',
          label: 'Lookup name',
          extractFields: extractfieldsOpts,
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
          'useAsAnInitializeValue',
          'fieldMappingType',
          'lookup.mode',
          'lookup.recordType',
          'lookup.expression',
          'lookup.expressionText',
          'lookup.resultField',
          'lookup.mapList',
          'lookup.name',
          'functions',
          'extract',
          'expression',
          'hardcodedAction',
          'lookupAction',
          'hardcodedDefault',
          'lookupDefault',
          'extractDateFormat',
          'extractDateTimezone',
          'isKey',
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
        if (fieldId === 'lookupAction') {
          const lookupModeField = fields.find(
            field => field.id === 'lookup.mode'
          );
          const options = [
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
          ];

          if (lookupModeField && lookupModeField.value === 'dynamic') {
            options[0].items.splice(1, 0, {
              label: 'Use default on multiple matches',
              value: 'useDefaultOnMultipleMatches',
            });
          }

          return options;
        }
        if (fieldId === 'lookup.recordType') {
          return {
            resourceToFetch: 'recordTypes',
          };
        }
        if (fieldId === 'lookup.expressionText') {
          const lookupExpressionField = fields.find(
            field => field.id === 'lookup.expression'
          );
          const lookupExpressionTextField = fields.find(
            field => field.id === 'lookup.expressionText'
          );

          lookupExpressionTextField.value = lookupExpressionField.value;
        } else if (fieldId === 'lookup.resultField') {
          const recordTypeField = fields.find(
            field => field.id === 'lookup.recordType'
          );
          const recordType = recordTypeField.value;
          const resultField = fields.find(
            field => field.id === 'lookup.resultField'
          );

          if (resultField.savedRecordType !== recordType) {
            resultField.savedRecordType = recordType;
            resultField.value = '';
          }

          return {
            disableFetch: !recordType,
            commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordTypeField.value}/searchColumns`,
          };
        }

        return null;
      },
    };
    const { fieldMap, layout } = fieldMeta;
    let { fields } = layout;

    // removing date field if not supported
    if (
      !fieldMetadata || !['date', 'datetimetz', 'datetime'].includes(fieldMetadata.type)
    ) {
      delete fieldMeta.fieldMap.extractDateFormat;
      delete fieldMeta.fieldMap.extractDateTimezone;

      fields = fields.filter(
        el => !['extractDateFormat', 'extractDateTimezone'].includes(el)
      );
    }

    // removing useFirstRow in case of non-grouped sample data or non-list field
    if (!isGroupedSampleData || generate.indexOf('[*].') === -1 || extract?.indexOf('[*].') > -1) {
      delete fieldMeta.fieldMap.useFirstRow;
      fields = fields.filter(el => el !== 'useFirstRow');
    }

    if (generate && generate.indexOf('[*].') === -1) {
      delete fieldMeta.fieldMap.isKey;
      fields = fields.filter(el => el !== 'isKey');
    } else {
      // delete useAsAnInitializeValue for list items
      delete fieldMeta.fieldMap.useAsAnInitializeValue;
      fields = fields.filter(el => el !== 'useAsAnInitializeValue');
    }
    if (['celigo_nlobjAttachedType', 'celigo_nlobjDetachedType'].includes(fieldId)) {
      delete fieldMeta.fieldMap.hardcodedAction;
      fields = fields.filter(el => el !== 'hardcodedAction');
      fieldMeta.fieldMap.hardcodedDefault = {
        ...fieldMeta.fieldMap.hardcodedDefault,
        filterKey: 'suitescript-recordTypes',
        commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes`,
        type: 'refreshableselect',
        label: 'Value',
        connectionId,
        placeholder: '',
      };
      fieldMeta.fieldMap.hardcodedDefault.visibleWhenAll = [{ field: 'fieldMappingType', is: ['hardCoded'] }];
    }

    if (
      recordType &&
      fieldId.indexOf('.internalid') !== -1 &&
      (generateFieldType === 'select' || generateFieldType === 'multiselect')
    ) {
      // hardcoded actions to be removed in case generate type is select
      delete fieldMeta.fieldMap.hardcodedAction;
      fields = fields.filter(el => el !== 'hardcodedAction');
      const commMetaPath = getNetsuiteSelectFieldValueUrl({
        fieldMetadata,
        connectionId,
        fieldId,
        recordType,
      });

      fieldMeta.fieldMap['lookup.mapList'].commMetaPath = commMetaPath;
      fieldMeta.fieldMap['lookup.mapList'].connectionId = connectionId;
      if (generateFieldType === 'select') { // applicable only for 'select'
        fieldMeta.fieldMap['lookup.mapList'].preferMapValueAsNum = true;
      }
      fieldMeta.fieldMap['conditional.lookupName'].staticLookupCommMetaPath = commMetaPath;
      // changing metadata for hardcodedDefault and lookupDefault
      ['hardcodedDefault', 'lookupDefault'].forEach(metaKey => {
        let fieldValue;

        if (metaKey === 'hardcodedDefault') {
          fieldValue = generateFieldType === 'multiselect' && value.hardCodedValue
            ? value.hardCodedValue.split(',')
            : value.hardCodedValue;
        } else {
          fieldValue = lookup.default;
        }
        fieldMeta.fieldMap[metaKey] = {
          ...fieldMeta.fieldMap[metaKey],
          type: 'netsuitedefaultvalue',
          label: 'Value',
          connectionId,
          multiselect: (generateFieldType === 'multiselect'),
          commMetaPath: getNetsuiteSelectFieldValueUrl({
            fieldMetadata,
            connectionId,
            fieldId,
            recordType,
          }),
          defaultValue: fieldValue,
        };
      });
      fieldMeta.fieldMap.hardcodedDefault.visibleWhenAll = [{ field: 'fieldMappingType', is: ['hardCoded'] }];
      fieldMeta.fieldMap.lookupDefault.visibleWhenAll = [
        {
          field: 'lookupAction',
          is: ['default', 'useDefaultOnMultipleMatches'],
        },
        { field: 'fieldMappingType', is: ['lookup'] },
      ];
    } else if (generateFieldType === 'checkbox') {
      // hardcoded actions to be removed in case generate type is checkbox
      delete fieldMeta.fieldMap.hardcodedAction;
      fields = fields.filter(el => el !== 'hardcodedAction');

      // changing metadata for hardcodedDefault and lookupDefault
      ['hardcodedDefault', 'lookupDefault'].forEach(metaKey => {
        fieldMeta.fieldMap[metaKey] = {
          ...fieldMeta.fieldMap[metaKey],
          type: 'radiogroup',
          label: 'Value',
          fullWidth: true,
          options: [
            {
              items: [
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
              ],
            },
          ],
          defaultValue: fieldMeta.fieldMap[metaKey].defaultValue || 'false',
        };
      });
      fieldMeta.fieldMap.hardcodedDefault.visibleWhenAll = [{ field: 'fieldMappingType', is: ['hardCoded'] }];
      fieldMeta.fieldMap.lookupDefault.visibleWhenAll = [
        {
          field: 'lookupAction',
          is: ['default', 'useDefaultOnMultipleMatches'],
        },
        { field: 'fieldMappingType', is: ['lookup'] },
      ];
    }

    if (isCategoryMapping) {
      fields = fields.filter(
        el =>
          ![
            'lookup.mode',
            'lookup.recordType',
            'lookup.expression',
            'lookup.expressionText',
            'lookup.resultField',
          ].includes(el)
      );
      const fieldMappingTypeField = fieldMap.fieldMappingType;

      fieldMappingTypeField.options = [
        {
          items: [
            { label: 'Standard', value: 'standard' },
            { label: 'Hard-Coded', value: 'hardCoded' },
            {
              label: 'Static - Lookup',
              value: 'lookup',
            },
          ],
        },
      ];
    }

    fieldMeta.fieldMap = fieldMap;
    fieldMeta.layout.fields = fields;

    return fieldMeta;
  },
};
