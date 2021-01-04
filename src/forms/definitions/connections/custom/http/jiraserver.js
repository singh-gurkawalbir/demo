export default {
  preSave: formValues => {
    const newValues = { ...formValues};

    if (newValues['/mode'] === 'cloud') {
      newValues['/_agentId'] = undefined;
    }

    return {
      ...newValues,
      '/type': 'http',
      '/assistant': 'jiraserver',
      '/http/auth/type': 'basic',
      '/http/mediaType': 'json',
      '/http/ping/relativeURI': '/rest/api/2/customFields',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    _agentId: {
      fieldId: '_agentId',
      required: true,
    },
    'http.baseURI': {
      fieldId: 'http.baseURI',
      helpKey: 'jiraserver.connection.http.baseURI',
      required: true,
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'jiraserver.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'jiraserver.connection.http.auth.basic.password',
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application', '_agentId'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.baseURI',
          'http.auth.basic.username',
          'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

