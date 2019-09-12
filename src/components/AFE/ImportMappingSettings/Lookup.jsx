const appendVisibleWhenRule = (fieldMeta, rule) => {
  fieldMeta.fields.flatMap(field => {
    const fieldTmp = field;

    fieldTmp.visibleWhenAll
      ? fieldTmp.visibleWhenAll.push(rule)
      : (fieldTmp.visibleWhenAll = [rule]);

    return fieldTmp;
  });

  return fieldMeta;
};

export default {
  getLookupMeta: (lookup = {}, application, parentVisibleRule) => {
    // application is to used when rendering lookup for different applications
    const fieldMeta = {
      fields: [
        {
          id: 'lookup.mode',
          name: '_mode',
          type: 'radiogroup',
          label: '',
          showOptionsHorizontally: true,
          fullWidth: true,
          defaultValue: lookup && lookup.map ? 'static' : 'dynamic',
          options: [
            {
              items: [
                { label: 'Dynamic Search', value: 'dynamic' },
                { label: 'Static: Value to Value', value: 'static' },
              ],
            },
          ],
        },
        {
          id: 'lookup.relativeURI',
          name: '_relativeURI',
          type: 'text',
          label: 'Relative URI:',
          placeholder: 'Relative URI',
          defaultValue: lookup.relativeURI,
          visibleWhenAll: [
            {
              field: 'lookup.mode',
              is: ['dynamic'],
            },
          ],
        },
        {
          id: 'lookup.method',
          name: '_method',
          type: 'select',
          label: 'HTTP Method:',
          placeholder: 'Required',
          defaultValue: lookup.method,
          options: [
            {
              heading: 'Select Http Method:',
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
          visibleWhenAll: [
            {
              field: 'lookup.mode',
              is: ['dynamic'],
            },
          ],
        },
        {
          id: 'lookup.body',
          name: '_body',
          type: 'httprequestbody',
          label: 'Build HTTP Request Body',
          defaultValue: lookup.body || '',
          visibleWhenAll: [
            {
              field: 'lookup.mode',
              is: ['dynamic'],
            },
            {
              field: 'lookup.method',
              is: ['POST'],
            },
          ],
        },
        {
          id: 'lookup.extract',
          name: '_extract',
          type: 'text',
          label: 'Resource Identifier Path:',
          placeholder: 'Resource Identifier Path',
          defaultValue: lookup.extract,
          visibleWhenAll: [
            {
              field: 'lookup.mode',
              is: ['dynamic'],
            },
          ],
        },

        {
          id: 'lookup.mapList',
          name: '_mapList',
          type: 'staticMap',
          label: '',
          keyName: 'export',
          keyLabel: 'Export Field',
          valueName: 'import',
          valueLabel: 'Import Field (HTTP)',
          map: lookup && lookup.map,
          visibleWhenAll: [
            {
              field: 'lookup.mode',
              is: ['static'],
            },
          ],
        },
      ],
    };

    if (parentVisibleRule) {
      const formattedFields = appendVisibleWhenRule(
        fieldMeta,
        parentVisibleRule
      );

      return formattedFields;
    }

    return fieldMeta;
  },
};
