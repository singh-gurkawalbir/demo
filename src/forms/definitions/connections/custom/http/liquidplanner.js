export default {
  preSubmit: formValues => {
    const retValues = { ...formValues };

    if (retValues['/authType'] === 'basic') {
      retValues['/http/auth/token'] = undefined;
    } else {
      retValues['/http/auth/basic'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'liquidplanner',
      '/http/auth/type': `${formValues['/authType']}`,
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://app.liquidplanner.com/',
      '/http/ping/relativeURI': '/api/workspaces',
      '/http/ping/method': 'GET',
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'authType',
      required: true,
      type: 'select',
      label: 'Authentication Type:',
      defaultValue: r => r && r.http && r.http.auth && r.http.auth.type,
      helpText: 'Please select Authentication Type',
      options: [
        {
          items: [
            { label: 'Basic', value: 'basic' },
            { label: 'Token', value: 'token' },
          ],
        },
      ],
    },
    {
      fieldId: 'http.auth.basic.username',
      helpText: 'Enter Username of your registered LiquidPlanner account.',
      visibleWhen: [
        {
          field: 'authType',
          is: ['basic'],
        },
      ],
    },
    {
      fieldId: 'http.auth.basic.password',
      helpText:
        'Enter Password of your registered LiquidPlanner account. The Passeord is created when the account is created.',
      visibleWhen: [
        {
          field: 'authType',
          is: ['basic'],
        },
      ],
    },
    {
      fieldId: 'http.auth.token.token',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'API Token:',
      helpText:
        'The API Token of your LiquidPlanner account when using the Token authentication.',
      visibleWhen: [
        {
          field: 'authType',
          is: ['token'],
        },
      ],
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
