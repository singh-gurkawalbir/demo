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
      _mode: {
        id: '_mode',
        name: '_mode',
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
      _relativeURI: {
        id: '_relativeURI',
        name: '_relativeURI',
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
            field: '_mode',
            is: ['dynamic'],
          },
        ],
      },
      _method: {
        id: '_method',
        name: '_method',
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
            field: '_mode',
            is: ['dynamic'],
          },
        ],
      },
      _body: {
        id: '_body',
        name: '_body',
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
            field: '_mode',
            is: ['dynamic'],
          },
          {
            field: '_method',
            is: ['POST'],
          },
        ],
      },
      _extract: {
        id: '_extract',
        name: '_extract',
        type: 'text',
        label: 'Resource Identifier Path',
        placeholder: 'Resource Identifier Path',
        defaultValue: lookup.extract,
        visibleWhen: [
          {
            field: '_mode',
            is: ['dynamic'],
          },
        ],
      },

      _mapList: {
        id: '_mapList',
        name: '_mapList',
        type: 'staticMap',
        label: '',
        keyName: 'export',
        keyLabel: 'Export Field',
        valueName: 'import',
        valueLabel: 'Import Field (HTTP)',
        map: lookup && lookup.map,
        visibleWhen: [
          {
            field: '_mode',
            is: ['static'],
          },
        ],
      },
      _name: {
        id: '_name',
        name: '_name',
        type: 'text',
        label: 'Name',
        defaultValue: lookup.name,
        placeholder: 'Alphanumeric characters only please',
        helpText:
          'Name of the lookups that will be exposed to the mapping to refer.',
      },
      _failRecord: {
        id: '_failRecord',
        name: '_failRecord',
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
      _default: {
        id: '_default',
        name: '_default',
        type: 'text',
        label: 'Enter Default Value',
        defaultValue: lookup.default,
        placeholder: 'Enter Default Value',
        visibleWhen: [
          {
            field: '_failRecord',
            is: ['default'],
          },
        ],
      },
    },
    layout: {
      fields: [
        '_mode',
        '_relativeURI',
        '_method',
        '_body',
        '_extract',
        '_mapList',
        '_name',
        '_failRecord',
        '_default',
      ],
    },
  };

  if (showDynamicLookupOnly) {
    const { fieldMap, layout } = fieldMeta;

    delete fieldMap._relativeURI.visibleWhen;
    delete fieldMap._method.visibleWhen;
    delete fieldMap._body.visibleWhenAll;
    delete fieldMap._extract.visibleWhen;
    delete fieldMeta.fieldMap._mode;
    delete fieldMeta.fieldMap._mapList;
    fieldMap._body.visibleWhen = [
      {
        field: '_method',
        is: ['POST'],
      },
    ];
    layout.fields = layout.fields.filter(
      el => el !== '_mode' && el !== '_mapList'
    );
  }

  return fieldMeta;
};

export default { getLookupMetadata };
