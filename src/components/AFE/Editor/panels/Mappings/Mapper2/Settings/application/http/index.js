import dateTimezones from '../../../../../../../../../utils/dateTimezones';
import mappingUtil, {ARRAY_DATA_TYPES, MAPPING_DATA_TYPES} from '../../../../../../../../../utils/mapping';
import dateFormats from '../../../../../../../../../utils/dateFormats';

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

const emptyObject = {};
export default {
  getMetaData: ({
    node,
    flowId,
    lookups,
    importResource = {},
  }) => {
    const {lookupName, dataType: propDataType, copySource } = node;

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
          label: 'Destination data type',
          defaultValue: propDataType,
          helpKey: 'mapping.dataType',
          noApi: true,
          options: [
            {
              items: [
                { label: 'String', value: 'string' },
                { label: 'Number', value: 'number' },
                { label: 'Boolean', value: 'boolean' },
                { label: 'String array', value: 'stringarray' },
                { label: 'Number array', value: 'numberarray' },
                { label: 'Boolean array', value: 'booleanarray' },
                { label: 'Object', value: 'object' },
                { label: 'Object array', value: 'objectarray' },
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
          helpKey: 'mapping.fieldMappingType',
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
          noApi: true,
          label: 'Destination record field is date field',
          visibleWhenAll: [
            { field: 'dataType', is: ['string', 'number'] },
          ],
        },
        extractDateFormat: {
          id: 'extractDateFormat',
          name: 'extractDateFormat',
          type: 'autosuggest',
          label: 'Source record field date format',
          placeholder: '',
          options: {
            suggestions: dateFormats, // todo ashu add more options
          },
          labelName: 'name',
          valueName: 'value',
          defaultValue: node.extractDateFormat,
          helpKey: 'mapping.extractDateFormat',
          noApi: true,
          visibleWhenAll: [
            { field: 'useDate', is: [true] },
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
          helpKey: 'mapping.extractDateTimezone',
          noApi: true,
          visibleWhenAll: [
            { field: 'useDate', is: [true] },
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
          helpKey: 'mapping.generateDateFormat',
          noApi: true,
          visibleWhenAll: [
            { field: 'useDate', is: [true] },
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
          helpKey: 'mapping.generateDateTimezone',
          noApi: true,
          visibleWhenAll: [
            { field: 'useDate', is: [true] },
          ],
        },
        standardAction: {
          id: 'standardAction',
          name: 'standardAction',
          type: 'select',
          defaultValue: mappingUtil.getV2DefaultActionValue(node),
          refreshOptionsOnChangesTo: ['dataType'],
          label: 'Action to take if source record field has no value',
          helpKey: 'mapping.standardAction',
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
          placeholder: 'Custom Value',
          required: true,
          visibleWhenAll: [
            { field: 'standardAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['standard'] },
            { field: 'dataType', isNot: ['object', 'objectarray'] },
          ],
          helpKey: 'mapping.default',
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
          helpKey: 'mapping.standardAction',
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
          helpKey: 'mapping.options',
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
          helpKey: 'mapping.hardcodedDefault',
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
          showLookup: false,
          multiline: true,
          label: 'Handlebars expression',
          defaultValue: mappingUtil.getDefaultExpression(node),
          helpKey: 'mapping.expression',
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
          helpKey: 'mapping.standardAction',
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
          placeholder: 'Custom Value',
          required: true,
          visibleWhenAll: [
            { field: 'multifieldAction', is: ['default'] },
            { field: 'fieldMappingType', is: ['multifield'] },
            { field: 'dataType', isNot: ['object', 'objectarray'] },
          ],
          helpKey: 'mapping.default',
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
          helpKey: 'mapping.lookup.mode',
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
          // helpText not present
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
          connectionId,
          resourceId,
          flowId,
          resourceType: 'imports',
          label: 'Relative URI',
          placeholder: 'Relative URI',
          defaultValue: lookup.relativeURI,
          helpKey: 'mapping.relativeURI',
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
          helpKey: 'mapping.lookup.method',
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
          resourceType: 'imports',
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
          helpKey: 'mapping.lookup.extract',
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
          helpKey: 'import.lookups.name',
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
          helpKey: 'mapping.lookupAction',
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
          helpKey: 'mapping.lookupDefault',
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
        }

        return null;
      },
    };

    return fieldMeta;
  },
};
