export default {
  getLookupMetadata: (lookup, isEdit, showDynamicLookupOnly) => {
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
          map: isEdit && lookup && lookup.map,
          visibleWhen: [
            {
              field: 'mode',
              is: ['static'],
            },
          ],
        },
      },
      layout: {
        fields: ['relativeURI', 'method', 'body', 'extract', 'mapList'],
      },
    };

    if (showDynamicLookupOnly) {
      delete fieldMeta.fieldMap.mode;
      delete fieldMeta.fieldMap.mapList;
      fieldMeta.layout.fields = fieldMeta.layout.fields.filter(
        el => el !== 'mode' && el !== 'mapList'
      );
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
  },
};
