import rdbmsMetadata from './rdbmsMetadata';

const getDefaultMetadata = ({ lookup, showDynamicLookupOnly }) => {
  const fieldMeta = {
    fieldMap: {
      relativeURI: {
        id: 'relativeURI',
        name: 'relativeURI',
        type: 'text',
        label: 'Relative URI',
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
        connectionId: r => r && r._connectionId,
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
    },
    layout: {
      fields: ['relativeURI', 'method', 'body', 'extract'],
    },
  };

  if (showDynamicLookupOnly) {
    const { relativeURI, method, body, extract } = fieldMeta.fieldMap;

    delete relativeURI.visibleWhen;
    delete method.visibleWhen;
    delete body.visibleWhenAll;
    delete extract.visibleWhen;

    body.visibleWhen = [
      {
        field: 'method',
        is: ['POST'],
      },
    ];
  }

  return fieldMeta;
};

export default {
  getLookupMetadata: ({
    lookup,
    showDynamicLookupOnly,
    isSQLLookup,
    sampleData,
  }) => {
    if (isSQLLookup) {
      return rdbmsMetadata.getLookupMetadata({
        lookup,
        showDynamicLookupOnly,
        sampleData,
      });
    }

    return getDefaultMetadata({ lookup, showDynamicLookupOnly });
  },
};
