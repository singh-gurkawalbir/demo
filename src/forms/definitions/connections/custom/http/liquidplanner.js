export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'basic') {
      retValues['/http/auth/token/token'] = undefined;
    } else {
      retValues['/http/auth/basic/username'] = undefined;
      retValues['/http/auth/basic/password'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'liquidplanner',
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://app.liquidplanner.com/',
      '/http/ping/relativeURI': '/api/workspaces',
      '/http/ping/method': 'GET',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      id: 'http.auth.type',
      required: true,
      type: 'select',
      label: 'Authentication type',
      defaultValue: r => r && r.http && r.http.auth && r.http.auth.type,
      helpKey: 'liquidplanner.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'Basic', value: 'basic' },
            { label: 'Token', value: 'token' },
          ],
        },
      ],
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'liquidplanner.connection.http.auth.basic.username',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'liquidplanner.connection.http.auth.basic.password',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'API token',
      helpKey: 'liquidplanner.connection.http.auth.token.token',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.type',
          'http.auth.basic.username',
          'http.auth.basic.password',
          'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
