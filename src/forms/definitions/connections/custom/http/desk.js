export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'desk',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/api/v2/cases',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${formValues['/http/deskSubdomain']}.desk.com`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.deskSubdomain': {
      type: 'text',
      id: 'http.deskSubdomain',
      helpText:
        "Enter your Desk subdomain. For example, in https://mycompany.desk.com 'mycompany' is the subdomain.",
      startAdornment: 'https://',
      endAdornment: '.desk.com',
      label: 'Subdomain:',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.desk.com')
          );

        return subdomain;
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpText: 'The username of your LiquidPlanner account',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpText: 'The password of your LiquidPlanner account',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.deskSubdomain',
      'http.auth.basic.username',
      'http.auth.basic.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
