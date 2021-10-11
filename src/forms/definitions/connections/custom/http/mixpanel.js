export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'mixpanel',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': `/import?strict=1&project_id=${formValues['/http/unencrypted/projectId']}`,
    '/http/ping/method': 'POST',
    '/http/baseURI': 'https://api.mixpanel.com',
    '/http/ping/body': '[ { "properties": {"$insert_id":"TestCeligoEvent","distinct_id":"TestCeligoUser","time": {{{dateFormat \'X\'}}} },"event":"Test event from Celigo" } ]',

  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.projectId': {
      id: 'http.unencrypted.projectId',
      required: true,
      type: 'text',
      label: 'Project ID',
      helpKey: 'mixpanel.connection.http.unencrypted.projectId',
    },
    'http.encrypted.projectToken': {
      id: 'http.encrypted.projectToken',
      required: true,
      type: 'text',
      inputType: 'password',
      label: 'Project token',
      defaultValue: '',
      helpKey: 'mixpanel.connection.http.encrypted.projectToken',
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'Username',
      helpKey: 'mixpanel.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'Secret',
      helpKey: 'mixpanel.connection.http.auth.basic.password',
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: [
          'http.auth.basic.username',
          'http.auth.basic.password',
          'http.encrypted.projectToken',
          'http.unencrypted.projectId',
        ] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
