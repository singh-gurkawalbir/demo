import getSettingsMetadata from './metadata';

describe('metadata test cases', () => {
  test('should pass test cases true values', () => {
    const response = getSettingsMetadata({
      flow: {
        _integrationId: 'integration_id',
        autoResolveMatchingTraceKeys: false,
      },
      nextDataFlows: [
        {
          _id: 'id_1',
          name: 'name',
        },
      ],
      isUserInErrMgtTwoDotZero: true,
      isFlowSubscribed: true,
    });

    expect(response.layout).toEqual({
      containers: [
        {
          type: 'collapse',
          containers: [
            {
              collapsed: true,
              label: 'General',
              fields: ['name', 'description', ...(['notifyOnFlowError', 'autoResolveMatchingTraceKeys']), '_runNextFlowIds'],
            },
            ({
              collapsed: false,
              label: 'Advanced settings',
              fields: ['manageAliases'],
            }),
          ],
        },
        {
          fields: ['settings'],
        },
      ],
    });
  });

  test('should pass test cases with false values', () => {
    const response = getSettingsMetadata({
      flow: {},
      nextDataFlows: [],
      isUserInErrMgtTwoDotZero: false,
      isFlowSubscribed: false,
    });

    expect(response.layout).toEqual({
      containers: [
        {
          type: 'collapse',
          containers: [
            {
              collapsed: true,
              label: 'General',
              fields: ['name', 'description', ...([]), '_runNextFlowIds'],
            },
            ({ }),
          ],
        },
        {
          fields: ['settings'],
        },
      ],
    });
  });
});
