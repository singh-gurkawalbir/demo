export default {
  fields: [
    { fieldId: 'hookType', defaultValue: 'script' },
    {
      fieldId: 'hooks.preSavePage.function',
    },
    {
      fieldId: 'hooks.preSavePage._scriptId',

      visibleWhen: [
        {
          field: 'hookType',
          is: ['script'],
        },
      ],
    },
    {
      fieldId: 'hooks.preSavePage._stackId',
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
