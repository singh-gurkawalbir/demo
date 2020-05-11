import getFailedRecordDefault from './util';

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
              { label: 'Dynamic search', value: 'dynamic' },
              { label: 'Static: value to value', value: 'static' },
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
        label: 'HTTP method',
        defaultValue: lookup.method,
        options: [
          {
            heading: 'Select HTTP method',
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
        supportLookup: false,
        connectionId,
        resourceId,
        resourceType,
        flowId,
        label: 'Build HTTP request body',
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
        label: 'Resource identifier path',
        placeholder: 'Resource identifier path',
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
        keyLabel: 'Export field',
        valueName: 'import',
        valueLabel: 'Import field (HTTP)',
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
        ],
      },
      _default: {
        id: '_default',
        name: '_default',
        type: 'text',
        label: 'Enter default value',
        defaultValue: lookup.default,
        placeholder: 'Enter default value',
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
