export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'zendesk',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/api/v2/users.json',
    '/rest/baseURI': `https://${
      formValues['/rest/zendeskSubdomain']
    }.zendesk.com`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.zendeskSubdomain': {
      id: 'rest.zendeskSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.zendesk.com',
      label: 'Subdomain:',
      helpText:
        'Please enter your team name here which you configured while signing up for a new Zendesk account.',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.zendesk.com')
          );

        return subdomain;
      },
    },
    'rest.basicAuth.username': { fieldId: 'rest.basicAuth.username' },
    restAdvanced: { formId: 'restAdvanced' },
    'rest.basicAuth.password': {
      fieldId: 'rest.basicAuth.password',
    },
  },
  layout: {
    fields: [
      'name',
      'rest.zendeskSubdomain',
      'rest.basicAuth.username',
      'rest.basicAuth.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
