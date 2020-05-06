const getFailedRecordDefault = lookup => {
  if (!lookup || !lookup.allowFailures) {
    return 'disallowFailure';
  }

  switch (lookup.default) {
    case '':
      return 'useEmptyString';
    case null:
      return 'useNull';
    default:
      return 'default';
  }
};

const getLookupMetadata = ({
  lookup,
  showDynamicLookupOnly,
  connectionId,
  resourceId,
  resourceType,
  flowId,
}) => {
  const fieldMeta = {
    fieldMap: {
      mode: {
        id: 'mode',
        name: 'mode',
        type: 'radiogroup',
        label: '',
        defaultValue: lookup && (lookup.map ? 'static' : 'dynamic'),
        options: [
          {
            items: [
              { label: 'Dynamic Search', value: 'dynamic' },
              { label: 'Static: Value to Value', value: 'static' },
            ],
          },
        ],
      },
      relativeURI: {
        id: 'relativeURI',
        name: 'relativeURI',
        type: 'relativeuri',
        enableEditorV2: false,
        showLookup: false,
        label: 'Relative URI',
        connectionId,
        resourceId,
        resourceType,
        flowId,
        placeholder: 'Relative URI',
        defaultValue: lookup.relativeURI,
        visibleWhen: [
          {
            field: 'mode',
            is: ['dynamic'],
          },
        ],
      },
      method: {
        id: 'method',
        name: 'method',
        type: 'select',
        label: 'HTTP Method',
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
        visibleWhen: [
          {
            field: 'mode',
            is: ['dynamic'],
          },
        ],
      },
      body: {
        id: 'body',
        name: 'body',
        type: 'httprequestbody',
        enableEditorV2: false,
        connectionId,
        resourceId,
        resourceType,
        flowId,
        label: 'Build HTTP Request Body',
        defaultValue: lookup.body,
        visibleWhenAll: [
          {
            field: 'mode',
            is: ['dynamic'],
          },
          {
            field: 'method',
            is: ['POST'],
          },
        ],
      },
      extract: {
        id: 'extract',
        name: 'extract',
        type: 'text',
        label: 'Resource Identifier Path',
        placeholder: 'Resource Identifier Path',
        defaultValue: lookup.extract,
        visibleWhen: [
          {
            field: 'mode',
            is: ['dynamic'],
          },
        ],
      },

      mapList: {
        id: 'mapList',
        name: 'mapList',
        type: 'staticMap',
        label: '',
        keyName: 'export',
        keyLabel: 'Export Field',
        valueName: 'import',
        valueLabel: 'Import Field (HTTP)',
        map: lookup && lookup.map,
        visibleWhen: [
          {
            field: 'mode',
            is: ['static'],
          },
        ],
      },
      name: {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name',
        defaultValue: lookup.name,
        placeholder: 'Alphanumeric characters only please',
        helpText:
          'Name of the lookups that will be exposed to the mapping to refer.',
      },
      failRecord: {
        id: 'failRecord',
        name: 'failRecord',
        type: 'radiogroup',
        label: 'Action to take if unique match not found',
        showOptionsVertically: true,
        defaultValue: getFailedRecordDefault(lookup) || 'disallowFailure',
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
      },
      default: {
        id: 'default',
        name: 'default',
        type: 'text',
        label: 'Enter Default Value',
        defaultValue: lookup.default,
        placeholder: 'Enter Default Value',
        visibleWhen: [
          {
            field: 'failRecord',
            is: ['default'],
          },
        ],
      },
    },
    layout: {
      fields: [
        'mode',
        'relativeURI',
        'method',
        'body',
        'extract',
        'mapList',
        'name',
        'failRecord',
        'default',
      ],
    },
  };

  if (showDynamicLookupOnly) {
    const { fieldMap, layout } = fieldMeta;

    delete fieldMap.relativeURI.visibleWhen;
    delete fieldMap.method.visibleWhen;
    delete fieldMap.body.visibleWhenAll;
    delete fieldMap.extract.visibleWhen;
    delete fieldMeta.fieldMap.mode;
    delete fieldMeta.fieldMap.mapList;
    fieldMap.body.visibleWhen = [
      {
        field: 'method',
        is: ['POST'],
      },
    ];
    layout.fields = layout.fields.filter(
      el => el !== 'mode' && el !== 'mapList'
    );
  }

  return fieldMeta;
};

export default { getLookupMetadata };
