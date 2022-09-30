import dateTimezones from '../../../../../../../../../utils/dateTimezones';
import mappingUtil, {ARRAY_DATA_TYPES, MAPPING_DATA_TYPES, getCombinedExtract} from '../../../../../../../../../utils/mapping';
import dateFormats from '../../../../../../../../../utils/dateFormats';
import { emptyObject } from '../../../../../../../../../constants';
import { getDefaultActionOptions } from '../http';

export default {
  getMetaData: ({
    node,
    flowId,
    lookups,
    importResource = {},
  }) => {
    const {key, lookupName, dataType: propDataType, copySource, isRequired, extractsArrayHelper, extract, hardCodedValue, disabled} = node;

    const {_connectionId: connectionId, _id: resourceId } = importResource;

    const lookup = (lookupName && lookups.find(lookup => lookup.name === lookupName)) || emptyObject;
    const formattedLookup = mappingUtil.getV2DefaultStaticMapValue(lookup.map);

    const fieldMeta = {
      fieldMap: {
        dataType: {
          id: 'dataType',
          name: 'dataType',
          type: 'selectforsetfields',
          setFieldIds: ['fieldMappingType'],
          skipSort: true,
          label: 'Destination data type',
          defaultValue: propDataType,
          defaultDisabled: isRequired,
          description: isRequired ? 'Data type of a required field cannot be edited.' : '',
          helpKey: 'mapping.v2.dataType',
          noApi: true,
          options: [
            {
              items: [
                { label: 'string', value: 'string' },
                { label: 'number', value: 'number' },
                { label: 'boolean', value: 'boolean' },
                { label: 'object', value: 'object' },
                { label: '[string]', value: 'stringarray' },
                { label: '[number]', value: 'numberarray' },
                { label: '[boolean]', value: 'booleanarray' },
                { label: '[object]', value: 'objectarray' },
              ],
            },
          ],
        },
        copySource: {
          id: 'copySource',
          name: 'copySource',
          type: 'radiogroup',
          refreshOptionsOnChangesTo: ['dataType'],
          label: 'Copy an object from the source as-is?',
          helpKey: 'mapping.v2.copyObject',
          fullWidth: true,
          defaultValue: copySource || 'no',
          visibleWhen: [{ field: 'dataType', is: ['object'] }],
          noApi: true,
          options: [
            {
              items: [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
              ],
            },
          ],
        },
        fieldMappingType: {
          id: 'fieldMappingType',
          name: 'fieldMappingType',
          type: 'select',
          label: 'Field mapping type',
          defaultValue: mappingUtil.getV2FieldMappingType(node),
          helpKey: 'mapping.v2.fieldMappingType',
          noApi: true,
          skipSort: true,
          refreshOptionsOnChangesTo: ['dataType'],
          visibleWhen: [
            { field: 'dataType', isNot: ['object', 'objectarray'] },
          ],
        },
        useDate: {
          id: 'useDate',
          name: 'useDate',
          type: 'checkbox',
          defaultValue: !!(node.extractDateFormat || node.extractDateTimezone || node.generateDateFormat || node.generateDateFormat),
          helpKey: 'mapping.v2.useDate',
          noApi: true,
          label: 'Destination field is date field',
          visibleWhenAll: [
            { field: 'dataType', is: ['string', 'number'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        extractDateFormat: {
          id: 'extractDateFormat',
          name: 'extractDateFormat',
          type: 'autosuggest',
          label: 'Source field date format',
          placeholder: '',
          options: {
            suggestions: dateFormats,
          },
          labelName: 'name',
          valueName: 'value',
          defaultValue: node.extractDateFormat,
          helpKey: 'mapping.v2.extractDateFormat',
          noApi: true,
          visibleWhenAll: [
            { field: 'useDate', is: [true] },
            { field: 'dataType', is: ['string', 'number'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        extractDateTimezone: {
          id: 'extractDateTimezone',
          name: 'extractDateTimezone',
          type: 'select',
          defaultValue: node.extractDateTimezone,
          label: 'Source field date time zone',
          options: [
            {
              items:
                    dateTimezones?.map(date => ({
                      label: date.label,
                      value: date.value,
                    })) || [],
            },
          ],
          helpKey: 'mapping.v2.extractDateTimezone',
          noApi: true,
          visibleWhenAll: [
            { field: 'useDate', is: [true] },
            { field: 'dataType', is: ['string', 'number'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        generateDateFormat: {
          id: 'generateDateFormat',
          name: 'generateDateFormat',
          type: 'autosuggest',
          defaultValue: node.generateDateFormat,
          label: 'Destination field date format',
          placeholder: '',
          options: {
            suggestions: dateFormats,
          },
          labelName: 'name',
          valueName: 'value',
          helpKey: 'mapping.v2.generateDateFormat',
          noApi: true,
          visibleWhenAll: [
            { field: 'useDate', is: [true] },
            { field: 'dataType', is: ['string', 'number'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        generateDateTimezone: {
          id: 'generateDateTimezone',
          name: 'generateDateTimezone',
          type: 'select',
          defaultValue: node.generateDateTimezone,
          label: 'Destination field date time zone',
          options: [
            {
              items:
                    dateTimezones?.map(date => ({
                      label: date.label,
                      value: date.value,
                    })) || [],
            },
          ],
          helpKey: 'mapping.v2.generateDateTimezone',
          noApi: true,
          visibleWhenAll: [
            { field: 'useDate', is: [true] },
            { field: 'dataType', is: ['string', 'number'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        sourceField: {
          id: 'sourceField',
          name: 'sourceField',
          type: 'mapper2sourcefield',
          defaultValue: getCombinedExtract(extractsArrayHelper).join(',') || extract || (hardCodedValue ? `"${hardCodedValue}"` : undefined),
          label: 'Source field',
          noApi: true,
          nodeKey: key,
          disabled,
          resourceId,
        },
        sourceDataType: {
          id: 'sourceDataType',
          name: 'sourceDataType',
          type: 'select',
          skipSort: true,
          skipDefault: true,
          label: 'Source data type',
          defaultValue: node.sourceDataType || 'string',
          helpKey: 'mapping.v2.sourceDataType',
          noApi: true,
          visibleWhenAll: [
            { field: 'dataType', isNot: ['object', 'objectarray', 'stringarray', 'numberarray', 'booleanarray'] },
            { field: 'fieldMappingType', isNot: ['hardCoded', 'multifield'] },
          ],
          options: [
            {
              items: [
                { label: 'string', value: 'string' },
                { label: 'number', value: 'number' },
                { label: 'boolean', value: 'boolean' },
                { label: 'object', value: 'object' },
                { label: '[string]', value: 'stringarray' },
                { label: '[number]', value: 'numberarray' },
                { label: '[boolean]', value: 'booleanarray' },
                { label: '[object]', value: 'objectarray' },
              ],
            },
          ],
        },
        objectSourceDataType: {
          id: 'objectSourceDataType',
          name: 'objectSourceDataType',
          type: 'select',
          skipSort: true,
          skipDefault: true,
          label: 'Source data type',
          defaultValue: node.sourceDataType || 'string',
          helpKey: 'mapping.v2.sourceDataType',
          noApi: true,
          visibleWhenAll: [
            { field: 'dataType', is: ['object'] },
            { field: 'copySource', is: ['yes'] },
          ],
          options: [
            {
              items: [
                { label: 'string', value: 'string' },
                { label: 'number', value: 'number' },
                { label: 'boolean', value: 'boolean' },
                { label: 'object', value: 'object' },
                { label: '[string]', value: 'stringarray' },
                { label: '[number]', value: 'numberarray' },
                { label: '[boolean]', value: 'booleanarray' },
                { label: '[object]', value: 'objectarray' },
              ],
            },
          ],
        },
        extractsArrayHelper: {
          id: 'extractsArrayHelper',
          name: 'extractsArrayHelper',
          type: 'mapper2tabbedextracts',
          defaultValue: node.extractsArrayHelper || [],
          nodeKey: key,
          visibleWhen: [
            { field: 'dataType', is: ['stringarray', 'numberarray', 'booleanarray', 'objectarray'] },
          ],
        },
        standardAction: {
          id: 'standardAction',
          name: 'standardAction',
          type: 'select',
          skipDefault: true,
          defaultValue: mappingUtil.getV2DefaultActionValue(node) || 'discardIfEmpty',
          refreshOptionsOnChangesTo: ['dataType'],
          label: 'Action to take if source field has no value',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['standard'] },
            { field: 'dataType', isNot: ['object', 'objectarray', 'stringarray', 'numberarray', 'booleanarray'] },
          ],
        },
        default: {
          id: 'default',
          name: 'default',
          type: 'text',
          label: 'Custom value',
          placeholder: 'Custom value',
          required: true,
          visibleWhenAll: [
            { field: 'standardAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['standard'] },
            { field: 'dataType', isNot: ['boolean', 'object', 'objectarray', 'stringarray', 'numberarray', 'booleanarray'] },
          ],
          helpKey: 'mapping.v2.default',
          noApi: true,
          defaultValue: node.default,
        },
        boolDefault: {
          id: 'boolDefault',
          name: 'boolDefault',
          type: 'select',
          label: 'Custom value',
          skipDefault: true,
          skipSort: true,
          required: true,
          visibleWhenAll: [
            { field: 'standardAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['standard'] },
            { field: 'dataType', is: ['boolean'] },
          ],
          helpKey: 'mapping.v2.default',
          noApi: true,
          defaultValue: node.default || 'true',
          options: [
            {
              items: [
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
              ],
            },
          ],
        },
        objectAction: {
          id: 'objectAction',
          name: 'objectAction',
          type: 'select',
          skipDefault: true,
          defaultValue: mappingUtil.getV2DefaultActionValue(node) || 'discardIfEmpty',
          refreshOptionsOnChangesTo: ['dataType'],
          label: 'Action to take if source field has no value',
          helpKey: 'mapping.v2.objectAction',
          noApi: true,
          visibleWhenAll: [
            { field: 'dataType', is: ['object'] },
            { field: 'copySource', is: ['yes'] },
          ],
        },
        hardcodedAction: {
          id: 'hardcodedAction',
          name: 'hardcodedAction',
          type: 'select',
          skipDefault: true,
          defaultValue: mappingUtil.getHardCodedActionValue(node) || 'default',
          refreshOptionsOnChangesTo: ['dataType'],
          label: 'How would you like to hard-code the value?',
          helpKey: 'mapping.v2.hardcodedAction',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['hardCoded'] },
            { field: 'dataType', isNot: ['object', 'objectarray'] },
          ],
        },
        hardcodedDefault: {
          id: 'hardcodedDefault',
          name: 'hardcodedDefault',
          type: 'text',
          label: 'Custom value',
          placeholder: 'Custom value',
          required: true,
          visibleWhenAll: [
            { field: 'hardcodedAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['hardCoded'] },
            { field: 'dataType', isNot: ['boolean', 'object', 'objectarray'] },
          ],
          helpKey: 'mapping.v2.default',
          noApi: true,
          defaultValue: node.hardCodedValue,
        },
        boolHardcodedDefault: {
          id: 'boolHardcodedDefault',
          name: 'boolHardcodedDefault',
          type: 'select',
          label: 'Custom value',
          skipDefault: true,
          skipSort: true,
          required: true,
          visibleWhenAll: [
            { field: 'hardcodedAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['hardCoded'] },
            { field: 'dataType', is: ['boolean'] },
          ],
          helpKey: 'mapping.v2.default',
          noApi: true,
          defaultValue: node.hardCodedValue || 'true',
          options: [
            {
              items: [
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
              ],
            },
          ],
        },
        expression: {
          id: 'expression',
          name: 'expression',
          type: 'uri',
          connectionId,
          resourceType: 'imports',
          resourceId,
          flowId,
          mapper2RowKey: key,
          showLookup: false,
          showExtract: false,
          multiline: true,
          label: 'Handlebars expression',
          defaultValue: mappingUtil.getV2DefaultExpression(node),
          helpKey: 'mapping.v2.expression',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['multifield'] },
            { field: 'dataType', is: ['string', 'number', 'boolean'] },
          ],
        },
        multifieldAction: {
          id: 'multifieldAction',
          name: 'multifieldAction',
          type: 'select',
          skipDefault: true,
          defaultValue: mappingUtil.getV2DefaultActionValue(node) || 'discardIfEmpty',
          label: 'Action to take if handlebars expression returns an empty value',
          refreshOptionsOnChangesTo: ['dataType'],
          helpKey: 'mapping.v2.multifieldAction',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['multifield'] },
            { field: 'dataType', is: ['string', 'number', 'boolean'] },
          ],
        },
        multifieldDefault: {
          id: 'multifieldDefault',
          name: 'multifieldDefault',
          type: 'text',
          label: 'Custom value',
          placeholder: 'Custom value',
          required: true,
          visibleWhenAll: [
            { field: 'multifieldAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['multifield'] },
            { field: 'dataType', is: ['string', 'number'] },
          ],
          helpKey: 'mapping.v2.default',
          noApi: true,
          defaultValue: node.default,
        },
        boolMultifieldDefault: {
          id: 'boolMultifieldDefault',
          name: 'boolMultifieldDefault',
          type: 'select',
          label: 'Custom value',
          skipDefault: true,
          skipSort: true,
          required: true,
          visibleWhenAll: [
            { field: 'multifieldAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['multifield'] },
            { field: 'dataType', is: ['boolean'] },
          ],
          helpKey: 'mapping.v2.default',
          noApi: true,
          defaultValue: node.default || 'true',
          options: [
            {
              items: [
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
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
          keyLabel: 'Source field value',
          valueName: 'import',
          valueLabel: 'Destination field value',
          columns: [
            {
              id: 'import',
              label: 'Destination field value',
              required: false,
              type: 'input',
              supportsRefresh: false,
            },
            {
              id: 'export',
              label: 'Source field value',
              required: false,
              type: 'input',
              supportsRefresh: false,
            },
          ],
          defaultValue: Object.keys(formattedLookup).map(key => ({
            export: key,
            import: formattedLookup[key],
          })),
          map: formattedLookup,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'dataType', is: ['string', 'number', 'boolean'] },
          ],
        },
        'lookup.name': {
          id: 'lookup.name',
          name: 'name',
          type: 'text',
          label: 'Lookup name',
          required: true,
          defaultValue: lookup.name,
          placeholder: 'Alphanumeric characters only',
          helpKey: 'import.v2.lookup.name',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'dataType', is: ['string', 'number', 'boolean'] },
          ],
          validWhen: {
            matchesRegEx: {
              pattern: '^[\\S]+$',
              message: 'Name should not contain spaces.',
            },
          },
        },
        lookupAction: {
          id: 'lookupAction',
          name: 'lookupAction',
          type: 'select',
          skipDefault: true,
          defaultValue:
            mappingUtil.getV2DefaultLookupActionValue(node, lookup) || 'discardIfEmpty',
          label: 'If lookup fails',
          refreshOptionsOnChangesTo: ['dataType'],
          helpKey: 'mapping.v2.staticLookupAction',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'dataType', is: ['string', 'number', 'boolean'] },
          ],
        },
        lookupDefault: {
          id: 'lookupDefault',
          name: 'lookupDefault',
          type: 'text',
          label: 'Custom value',
          placeholder: 'Custom value',
          required: true,
          visibleWhenAll: [
            { field: 'lookupAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'dataType', is: ['string', 'number', 'boolean'] },
          ],
          helpKey: 'mapping.v2.default',
          noApi: true,
          defaultValue: lookup.default,
        },
        description: {
          id: 'description',
          name: 'description',
          type: 'text',
          label: 'Settings description',
          defaultValue: node.description,
          noApi: true,
          helpKey: 'mapping.v2.description',
        },
      },
      layout: {
        containers: [
          {
            fields: [
              'dataType',
              'copySource',
              'fieldMappingType',
              'useDate',
            ],
          },
          {
            type: 'indent',
            containers: [
              {
                fields: [
                  'extractDateFormat',
                  'extractDateTimezone',
                  'generateDateFormat',
                  'generateDateTimezone',
                  'hardcodedAction',
                  'hardcodedDefault',
                  'boolHardcodedDefault',
                  'expression',
                  'multifieldAction',
                  'multifieldDefault',
                  'boolMultifieldDefault',
                  'lookup.mapList',
                  'lookup.name',
                  'lookupAction',
                  'lookupDefault',
                ],
              },
            ],
          },
          {
            fields: [
              'sourceField',
              'sourceDataType',
              'objectSourceDataType',
              'extractsArrayHelper',
            ],
          },
          {
            type: 'indent',
            containers: [
              {
                fields: [
                  'objectAction',
                  'standardAction',
                  'default',
                  'boolDefault',
                ],
              },
            ],
          },
          {
            fields: [
              'description',
            ],
          },
        ],
      },
      optionsHandler: (fieldId, fields) => {
        const dataTypeField = fields.find(
          field => field.id === 'dataType'
        );

        if (fieldId === 'standardAction') {
          const standardActionField = fields.find(
            field => field.id === 'standardAction'
          );

          standardActionField.helpKey = dataTypeField?.value === MAPPING_DATA_TYPES.BOOLEAN
            ? 'mapping.v2.boolStandardAction'
            : 'mapping.v2.standardAction';
        }

        if (fieldId === 'standardAction' ||
        fieldId === 'objectAction' ||
        fieldId === 'hardcodedAction' ||
        fieldId === 'multifieldAction' ||
        fieldId === 'lookupAction') {
          const options = getDefaultActionOptions(fieldId, dataTypeField?.value);

          return options;
        }

        if (fieldId === 'fieldMappingType') {
          if (ARRAY_DATA_TYPES.includes(dataTypeField?.value)) {
            return [
              {
                items: [
                  { label: 'Standard', value: 'standard' },
                  { label: 'Hard-coded', value: 'hardCoded' },
                ],
              },
            ];
          }

          return [
            {
              items: [
                { label: 'Standard', value: 'standard' },
                { label: 'Hard-coded', value: 'hardCoded' },
                { label: 'Lookup - static', value: 'lookup' },
                { label: 'Handlebars expression', value: 'multifield' },
              ],
            },
          ];
        }

        return null;
      },
    };

    return fieldMeta;
  },
};
