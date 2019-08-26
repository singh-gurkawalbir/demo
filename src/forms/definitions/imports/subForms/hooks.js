export default {
  fields: [
    {
      fieldId: 'hookType',
      type: 'radiogroup',
      defaultValue: 'script',
      options: [
        {
          items: [
            { label: 'Script', value: 'script' },
            { label: 'Stack', value: 'stack' },
          ],
        },
      ],
    },
    {
      fieldId: 'hooks.preMap.function',
      type: 'text',
      label: 'Pre Map',
      placeholder: 'Function Name',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.preMap._scriptId',
      label: 'Pre Map Script',
      type: 'selectresource',
      resourceType: 'scripts',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.preMap.configuration',
      type: 'text',
      label: 'Pre Map',
      placeholder: 'Function Name',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['stack'],
        },
      ],
    },
    {
      fieldId: 'hooks.preMap._stackId',
      label: 'Pre Map Stack',
      type: 'selectresource',
      resourceType: 'stacks',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['stack'],
        },
      ],
    },
    {
      fieldId: 'hooks.postMap.function',
      type: 'text',
      label: 'Post Map',
      placeholder: 'Function Name',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.postMap._scriptId',
      label: 'Post Map Script',
      type: 'selectresource',
      resourceType: 'scripts',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.postMap.configuration',
      type: 'text',
      label: 'Post Map',
      placeholder: 'Function Name',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['stack'],
        },
      ],
    },
    {
      fieldId: 'hooks.postMap._stackId',
      label: 'Post Map Stack',
      type: 'selectresource',
      resourceType: 'stacks',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['stack'],
        },
      ],
    },
    {
      fieldId: 'hooks.postSubmit.function',
      type: 'text',
      label: 'Post Submit',
      placeholder: 'Function Name',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.postSubmit._scriptId',
      label: 'Post Submit Script',
      type: 'selectresource',
      resourceType: 'scripts',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.postSubmit.configuration',
      type: 'text',
      label: 'Post Submit',
      placeholder: 'Function Name',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['stack'],
        },
      ],
    },
    {
      fieldId: 'hooks.postSubmit._stackId',
      label: 'Post Submit Stack',
      type: 'selectresource',
      resourceType: 'stacks',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['stack'],
        },
      ],
    },
  ],
  fieldSets: [],
};
