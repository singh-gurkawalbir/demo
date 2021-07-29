export default function getSettingsMetadata(props) {
  const { flow, nextDataFlows, isUserInErrMgtTwoDotZero, isFlowSubscribed} = props;

  return {
    fieldMap: {
      name: {
        id: 'name',
        name: 'name',
        type: 'text',
        helpKey: 'flow.name',
        label: 'Name',
        defaultValue: flow && flow.name,
        required: true,
      },
      description: {
        id: 'description',
        name: 'description',
        type: 'text',
        helpKey: 'flow.description',
        label: 'Description',
        multiline: true,
        defaultValue: flow && flow.description,
      },
      _runNextFlowIds: {
        id: '_runNextFlowIds',
        name: '_runNextFlowIds',
        type: 'multiselect',
        placeholder: 'Please select flow',
        helpKey: 'flow._runNextFlowIds',
        label: 'Next integration flow:',
        displayEmpty: true,
        defaultValue: (flow && flow._runNextFlowIds) || [],
        options: [
          {
            items: nextDataFlows.length
              ? nextDataFlows.map(i => ({ label: i.name, value: i._id }))
              : [
                {
                  label: "You don't have any other active flows",
                  disabled: true,
                  value: '',
                },
              ],
          },
        ],
      },
      notifyOnFlowError: {
        id: 'notifyOnFlowError',
        name: 'notifyOnFlowError',
        type: 'radiogroup',
        defaultValue: isFlowSubscribed ? 'true' : 'false',
        options: [
          {
            items: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ],
          },
        ],
        label: 'Notify me on flow errors',
      },
      autoResolveMatchingTraceKeys: {
        id: 'autoResolveMatchingTraceKeys',
        name: 'autoResolveMatchingTraceKeys',
        type: 'radiogroup',
        defaultValue: flow.autoResolveMatchingTraceKeys === false ? 'false' : 'true',
        options: [
          {
            items: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ],
          },
        ],
        helpKey: 'flow.autoResolveMatchingTraceKeys',
        label: 'Auto-resolve errors with matching trace key',
      },
      settings: {
        id: 'settings',
        name: 'settings',
        type: 'settings',
        label: 'Custom',
        defaultValue: flow && flow.settings,
      },
    },
    layout: {
      containers: [
        {
          type: 'collapse',
          containers: [
            {
              collapsed: true,
              label: 'General',
              fields: ['name', 'description', ...(isUserInErrMgtTwoDotZero ? ['notifyOnFlowError', 'autoResolveMatchingTraceKeys'] : []), '_runNextFlowIds'],
            },
          ],
        },
        {
          fields: ['settings'],
        },
      ],
    },
  };
}
