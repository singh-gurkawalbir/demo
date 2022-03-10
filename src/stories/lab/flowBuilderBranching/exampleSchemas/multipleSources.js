export default {
  exports: [
    {
      _id: 'export1',
      name: 'The only export',
      connectorType: 'netsuite',
    },
    {
      _id: 'new-BeI7u6',
      connectorType: 'ftp',
      label: 'new-BeI7u6',
    },
    {
      _id: 'new-sDF_1r',
      connectorType: 'ftp',
      label: 'new-sDF_1r',
    },
  ],
  imports: [
    {
      _id: 'import1',
      name: 'import1 with long name',
      connectorType: 'ftp',
    },
  ],
  flows: [
    {
      _id: 'flow1',
      routers: [
        {
          _id: 'virtualRouter',
          branches: [
            {
              name: 'second branch',
              description: 'some description',
              inputFilter: {},
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'import',
                  _importId: 'import1',
                  id: 'import1',
                },
              ],
              _id: 'firstVirtualBranch',
            },
          ],
        },
      ],
      pageGenerators: [
        {
          _exportId: 'export1',
          skipRetries: true,
          id: 'export1',
        },
        {
          _exportId: 'new-BeI7u6',
          skipRetries: true,
          id: 'new-BeI7u6',
        },
        {
          _exportId: 'new-sDF_1r',
          skipRetries: true,
          id: 'new-sDF_1r',
        },
      ],
    },
  ],
};
