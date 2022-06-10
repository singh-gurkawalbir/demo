export default
{
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
              //  _nextRouterId: 'firstRouter',
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
      ],
    },
  ],
  exports: [
    {
      _id: 'export1',
      name: 'The only export',
      connectorType: 'netsuite',
    },
    {
      _id: 'new-_KwofQ',
      connectorType: 'ftp',
      label: 'new-_KwofQ',
    },
  ],
  imports: [
    {
      _id: 'import1',
      name: 'import1 with long name',
      connectorType: 'ftp',
    },
  ],
};
