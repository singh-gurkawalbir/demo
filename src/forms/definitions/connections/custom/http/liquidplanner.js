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
      label: 'Authentication Type',
      defaultValue: r => r && r.http && r.http.auth && r.http.auth.type,
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
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'API Token',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.auth.type',
      'http.auth.basic.username',
      'http.auth.basic.password',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
