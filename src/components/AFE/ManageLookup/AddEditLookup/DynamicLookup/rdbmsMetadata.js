export default {
  getLookupMetadata: ({ lookup, showDynamicLookupOnly, sampleData }) => {
    const fieldMeta = {
      fieldMap: {
        query: {
          id: 'query',
          name: 'query',
          type: 'query',
          label: 'Query',
          helpText: 'The query that fetches records to be exported.',
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
          helpText:
            'When integrator.io runs this lookup it will read the column named in this field from the SQL result set and return that single value as the result of the lookup. Please make sure this field contains a valid column name from your database table.',
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
