export default {
  flows: [{
    _id: '62b447261299e87d8072776b',
    lastModified: '2022-06-23T14:45:27.559Z',
    name: 'New flow',
    disabled: true,
    _integrationId: '625814fe18dbf7304df47d95',
    skipRetries: false,
    pageGenerators: [
      {
        setupInProgress: true,
        id: 'none-f-VmSW',
      },
      {
        setupInProgress: true,
        id: 'none--n6eZl',
      },
    ],
    createdAt: '2022-06-23T10:57:42.116Z',
    autoResolveMatchingTraceKeys: true,
    routers: [
      {
        routeRecordsUsing: 'input_filters',
        id: 'W-pB_e',
        routeRecordsTo: 'first_matching_branch',
        branches: [
          {
            name: 'Branch 1.0',
            nextRouterId: 'bGEhIY',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                setupInProgress: true,
                id: 'none-z5-QwC',
              },
            ],
          },
          {
            name: 'Branch 1.1',
            nextRouterId: 'bGEhIY',
            pageProcessors: [],
          },
          {
            name: 'Branch 1.2',
            nextRouterId: 'bGEhIY',
            pageProcessors: [],
          },
          {
            name: 'Branch 1.3',
            nextRouterId: 'bGEhIY',
            pageProcessors: [],
          },
        ],
        script: {
          function: 'router',
        },
      },
      {
        id: 'bGEhIY',
        branches: [
          {
            name: '',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                setupInProgress: true,
                id: 'none-WWcOB3',
              },
            ],
          },
        ],
      },
    ],
  }],
  exports: [],
  imports: [],
};
