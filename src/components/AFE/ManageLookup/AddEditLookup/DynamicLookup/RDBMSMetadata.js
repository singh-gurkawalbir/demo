export default {
  getLookupMetadata: (lookup, isEdit, showDynamicLookupOnly) => {
    const fieldMeta = {
      fieldMap: {
        query: {
          id: 'query',
          name: 'query',
          type: 'text',
          label: 'Query',
          defaultValue: lookup.query,
          visibleWhen: [
            {
              field: 'mode',
              is: ['dynamic'],
            },
          ],
        },
        extract: {
          id: 'extract',
          name: 'extract',
          type: 'text',
          label: 'Column',
          defaultValue: lookup.extract,
          visibleWhen: [
            {
              field: 'mode',
              is: ['dynamic'],
            },
          ],
        },
      },
      layout: {
        fields: ['query', 'extract'],
      },
    };

    if (showDynamicLookupOnly) {
      const { query, extract } = fieldMeta.fieldMap;

      delete query.visibleWhenAll;
      delete extract.visibleWhen;

      // body.visibleWhen = [
      //   {
      //     field: 'method',
      //     is: ['POST'],
      //   },
      // ];
    }

    return fieldMeta;
  },
};
