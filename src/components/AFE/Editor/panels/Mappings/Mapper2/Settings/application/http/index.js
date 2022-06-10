import dateTimezones from '../../../../../../../../../utils/dateTimezones';
import mappingUtil, {ARRAY_DATA_TYPES, MAPPING_DATA_TYPES} from '../../../../../../../../../utils/mapping';
import dateFormats from '../../../../../../../../../utils/dateFormats';
import { emptyObject } from '../../../../../../../../../constants';

const conditionalOptions = [
  {
    label: 'Creating a record',
    value: 'record_created',
  },
  {
    label: 'Updating a record',
    value: 'record_updated',
  },
];

const getDefaultActionOptions = (mappingType, dataType) => {
  const defaultOptions = [
    {
      items: [
        { label: 'Do nothing', value: 'discardIfEmpty' },
        { label: 'Use null as default value', value: 'useNull' },
        { label: 'Use custom default value', value: 'default' },
        {
          label: 'Use empty string as default value',
          value: 'useEmptyString',
        },
      ],
    },
  ];

  if (dataType === MAPPING_DATA_TYPES.OBJECT || dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
    return [
      {
        items: [
          { label: 'Do nothing', value: 'discardIfEmpty' },
          { label: 'Use null as default value', value: 'useNull' },
        ],
      },
    ];
  }
  if (dataType === MAPPING_DATA_TYPES.BOOLEAN) {
    defaultOptions[0].items.pop();
  }
  if (mappingType === 'hardcodedAction') {
    defaultOptions[0].items.shift();
  } else if (mappingType === 'lookupAction') {
    defaultOptions[0].items.push({
      label: 'Fail record',
      value: 'disallowFailure',
    });
  }

  return defaultOptions;
};

const containers = [
  {
    collapsed: true,
    label: 'Advanced',
    fields: ['conditional.when', 'conditional.lookupName'],
  },
];

export default {
  getMetaData: ({
    node,
    flowId,
    lookups,
    importResource = {},
  }) => {
    const {key, lookupName, dataType: propDataType, copySource } = node;

    const {_connectionId: connectionId, adaptorType, _id: resourceId } = importResource;

    const isComposite = !!((adaptorType === 'HTTPImport' && importResource?.http?.method && importResource.http.method.length > 1) || (adaptorType === 'RESTImport' && importResource?.rest?.method && importResource.rest.method.length > 1));
    const lookup = (lookupName && lookups.find(lookup => lookup.name === lookupName)) || emptyObject;

    const conditionalWhenOptions = (isComposite && conditionalOptions) || [];

    const fieldMeta = {
      fieldMap: {
        dataType: {
          id: 'dataType',
          name: 'dataType',
          type: 'select',
          skipSort: true,
          label: 'Destination data type',
          defaultValue: propDataType,
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
          label: propDataType === MAPPING_DATA_TYPES.OBJECT
            ? 'Copy an object from the source record as-is?'
            : 'Copy an object array from the source record as-is?',
          fullWidth: true,
          defaultValue: copySource || 'no',
          visibleWhenAll: [{ field: 'dataType', is: ['object', 'objectarray'] }],
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
          defaultValue: mappingUtil.getFieldMappingType(node),
          helpKey: 'mapping.v2.fieldMappingType',
          noApi: true,
          skipSort: true,
          refreshOptionsOnChangesTo: ['dataType'],
          visibleWhenAll: [
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
          label: 'Destination record field is date field',
          visibleWhenAll: [
            { field: 'dataType', is: ['string', 'number'] },
            { field: 'fieldMappingType', is: ['standard'] },
          ],
        },
        extractDateFormat: {
          id: 'extractDateFormat',
          name: 'extractDateFormat',
          type: 'autosuggest',
          label: 'Source record field date format',
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
          label: 'Source record field date time zone',
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
          label: 'Destination record field date format',
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
          label: 'Destination record field date time zone',
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
        standardAction: {
          id: 'standardAction',
          name: 'standardAction',
          type: 'select',
          defaultValue: mappingUtil.getV2DefaultActionValue(node),
          refreshOptionsOnChangesTo: ['dataType'],
          label: 'Action to take if source record field has no value',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['standard'] },
            { field: 'dataType', isNot: ['object', 'objectarray'] },
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
            { field: 'dataType', isNot: ['object', 'objectarray'] },
          ],
          helpKey: 'mapping.v2.default',
          noApi: true,
          defaultValue: node.default,
        },
        objectAction: {
          id: 'objectAction',
          name: 'objectAction',
          type: 'select',
          defaultValue: mappingUtil.getV2DefaultActionValue(node) || '',
          refreshOptionsOnChangesTo: ['dataType'],
          label: 'Action to take if source record field has no value',
          helpKey: 'mapping.v2.objectAction',
          noApi: true,
          visibleWhenAll: [
            { field: 'dataType', is: ['object', 'objectarray'] },
            { field: 'copySource', is: ['yes'] },
          ],
        },
        hardcodedAction: {
          id: 'hardcodedAction',
          name: 'hardcodedAction',
          type: 'select',
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
            { field: 'dataType', isNot: ['object', 'objectarray'] },
          ],
          helpKey: 'mapping.v2.default',
          noApi: true,
          defaultValue: node.hardCodedValue,
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
            { field: 'dataType', isNot: ['object', 'objectarray'] },
          ],
        },
        multifieldAction: {
          id: 'multifieldAction',
          name: 'multifieldAction',
          type: 'select',
          defaultValue: mappingUtil.getV2DefaultActionValue(node),
          label: 'Action to take if handlebars expression returns an empty value',
          refreshOptionsOnChangesTo: ['dataType'],
          helpKey: 'mapping.v2.multifieldAction',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['multifield'] },
            { field: 'dataType', isNot: ['object', 'objectarray'] },
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
            { field: 'dataType', isNot: ['object', 'objectarray'] },
          ],
          helpKey: 'mapping.v2.default',
          noApi: true,
          defaultValue: node.default,
        },
        'lookup.mode': {
          id: 'lookup.mode',
          name: '_mode',
          type: 'radiogroup',
          label: 'Lookup type',
          required: true,
          fullWidth: true,
          defaultValue: lookup.name && (lookup.map ? 'static' : 'dynamic'),
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'dataType', isNot: ['object', 'objectarray'] },
          ],
          helpKey: 'mapping.v2.lookup.mode',
          noApi: true,
          options: [
            {
              items: [
                { label: 'Dynamic', value: 'dynamic' },
                { label: 'Static', value: 'static' },
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
          keyLabel: 'Source record field value',
          valueName: 'import',
          valueLabel: 'Destination record field value',
          defaultValue:
              lookup.map &&
              Object.keys(lookup.map).map(key => ({
                export: key,
                import: lookup.map[key],
              })),
          map: lookup.map,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['static'] },
            { field: 'dataType', isNot: ['object', 'objectarray'] },
          ],
        },
        'lookup.relativeURI': {
          id: 'lookup.relativeURI',
          name: '_relativeURI',
          type: 'relativeuri',
          showLookup: false,
          showExtract: false,
          connectionId,
          resourceId,
          flowId,
          mapper2RowKey: key,
          resourceType: 'imports',
          label: 'Relative URI',
          placeholder: 'Relative URI',
          defaultValue: lookup.relativeURI,
          helpKey: 'mapping.v2.relativeURI',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
            { field: 'dataType', isNot: ['object', 'objectarray'] },
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
              items: [
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST' },
              ],
            },
          ],
          helpKey: 'mapping.v2.lookup.method',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
            { field: 'dataType', isNot: ['object', 'objectarray'] },
          ],
        },
        'lookup.body': {
          id: 'lookup.body',
          name: '_body',
          type: 'httprequestbody',
          connectionId: r => r && r._connectionId,
          resourceId,
          flowId,
          mapper2RowKey: key,
          stage: 'importMappingExtract',
          resourceType: 'imports',
          helpKey: 'mapping.v2.lookup.body',
          noApi: true,
          defaultValue: lookup.body || lookup.postBody || '',
          required: true,
          label: 'HTTP request body',
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
            { field: 'lookup.method', is: ['POST'] },
            { field: 'dataType', isNot: ['object', 'objectarray'] },
          ],
        },
        'lookup.extract': {
          id: 'lookup.extract',
          name: '_extract',
          type: 'text',
          label: 'Resource identifier path',
          placeholder: 'Resource identifier path',
          defaultValue: lookup.extract,
          required: true,
          helpKey: 'mapping.v2.lookup.extract',
          noApi: true,
          visibleWhenAll: [
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'lookup.mode', is: ['dynamic'] },
            { field: 'dataType', isNot: ['object', 'objectarray'] },
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
            { field: 'lookup.mode', is: ['dynamic', 'static'] },
            { field: 'dataType', isNot: ['object', 'objectarray'] },
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
          defaultValue:
            mappingUtil.getV2DefaultLookupActionValue(node, lookup),
          label: 'If lookup fails',
          refreshOptionsOnChangesTo: ['dataType'],
          helpKey: 'mapping.v2.lookupAction',
          noApi: true,
          visibleWhenAll: [
            { field: 'lookup.mode', is: ['dynamic', 'static'] },
            { field: 'fieldMappingType', is: ['lookup'] },
            { field: 'dataType', isNot: ['object', 'objectarray'] },
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
            { field: 'dataType', isNot: ['object', 'objectarray'] },
          ],
          helpKey: 'mapping.v2.default',
          noApi: true,
          defaultValue: lookup.default,
        },
        'conditional.when': {
          id: 'conditional.when',
          name: 'conditionalWhen',
          type: 'select',
          label: 'Only perform mapping when:',
          defaultValue: node.conditional && (node.conditional.when === 'record_created' || node.conditional.when === 'record_updated') ? node.conditional.when : '',
          options: [{ items: conditionalWhenOptions }],
        },
        description: {
          id: 'description',
          name: 'description',
          type: 'text',
          label: 'Description',
          defaultValue: node.description,
          noApi: true,
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
                  'objectAction',
                  'standardAction',
                  'default',
                  'hardcodedAction',
                  'hardcodedDefault',
                  'expression',
                  'multifieldAction',
                  'multifieldDefault',
                  'lookup.mode',
                  'lookup.relativeURI',
                  'lookup.method',
                  'lookup.body',
                  'lookup.extract',
                  'lookup.mapList',
                  'lookup.name',
                  'lookupAction',
                  'lookupDefault',
                ],
              },
            ],
          },
          {
            type: 'collapse',
            containers: (isComposite && containers) || [],
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
                { label: 'Lookup', value: 'lookup' },
                { label: 'Handlebars expression', value: 'multifield' },
              ],
            },
          ];
        }

        if (fieldId === 'copySource') {
          const copySourceField = fields.find(
            field => field.id === 'copySource'
          );

          copySourceField.label = dataTypeField?.value === MAPPING_DATA_TYPES.OBJECT
            ? 'Copy an object from the source record as-is?'
            : 'Copy an object array from the source record as-is?';
          copySourceField.helpKey = dataTypeField?.value === MAPPING_DATA_TYPES.OBJECT
            ? 'mapping.v2.copyObject'
            : 'mapping.v2.copyObjectArray';
        }

        return null;
      },
    };

    return fieldMeta;
  },
};
