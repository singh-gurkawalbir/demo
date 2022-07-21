export default
{
  flows: [
    {
      _id: 'emptyFlowId',
      routers: [
        {
          id: 'virtualRouter',
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
  ],
  imports: [
    {
      _id: 'import1',
      name: 'import1 with long name',
      connectorType: 'ftp',
    },
  ],
};
