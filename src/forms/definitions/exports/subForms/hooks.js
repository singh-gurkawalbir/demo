export default {
  fieldMap: {
    hookType: {
      fieldId: 'hookType',
      // Example mark fields that need to be visible during development mode
      // showOnDeveloperMode: true,
    },
    'hooks.preSavePage.function': { fieldId: 'hooks.preSavePage.function' },
    'hooks.preSavePage._scriptId': {
      fieldId: 'hooks.preSavePage._scriptId',
      visibleWhen: [{ field: 'hookType', is: ['script'] }],
    },
    'hooks.preSavePage._stackId': {
      fieldId: 'hooks.preSavePage._stackId',
      visibleWhen: [{ field: 'hookType', is: ['stack'] }],
    },
  },
  layout: {
    fields: [
      'hookType',
      'hooks.preSavePage.function',
      'hooks.preSavePage._scriptId',
      'hooks.preSavePage._stackId',
    ],
  },
};
