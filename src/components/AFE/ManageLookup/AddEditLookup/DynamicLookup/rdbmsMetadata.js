export default {
  getLookupMetadata: ({ lookup, showDynamicLookupOnly, sampleData }) => {
    const fieldMeta = {
      fieldMap: {
        query: {
          id: 'query',
          name: 'query',
          type: 'query',
          label: 'Query',
          sampleData,
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
