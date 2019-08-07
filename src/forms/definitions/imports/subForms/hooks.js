export default {
  fields: [
    { fieldId: 'hookType', defaultValue: 'script' },
    {
      fieldId: 'hooks.preMap.function',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.preMap._scriptId',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.preMap.configuration',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['stack'],
        },
      ],
    },
    {
      fieldId: 'hooks.preMap._stackId',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['stack'],
        },
      ],
    },
    {
      fieldId: 'hooks.postMap.function',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.postMap._scriptId',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.postMap.configuration',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['stack'],
        },
      ],
    },
    {
      fieldId: 'hooks.postMap._stackId',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['stack'],
        },
      ],
    },
    {
      fieldId: 'hooks.postSubmit.function',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.postSubmit._scriptId',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.postSubmit.configuration',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['stack'],
        },
      ],
    },
    {
      fieldId: 'hooks.postSubmit._stackId',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['stack'],
        },
      ],
    },
    {
      fieldId: 'hooks.postAggregate.function',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.postAggregate._scriptId',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.postAggregate.configuration',
      visibleWhen: [
        {
          field: 'hookType',
          is: ['stack'],
        },
      ],
    },
    {
      fieldId: 'hooks.postAggregate._stackId',
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
