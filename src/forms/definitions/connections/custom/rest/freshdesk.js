export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'freshdesk',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': 'ticket_fields.json',
    '/rest/baseURI': `https://${
      formValues['/rest/freshdeskSubdomain']
    }.freshdesk.com/`,
    '/rest/pingFailurePath': 'require_login',
    '/rest/pingFailureValues': [true],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.freshdeskSubdomain': {
      type: 'text',
      id: 'rest.freshdeskSubdomain',
      helpText:
        "Enter your Freshdesk subdomain. For example, in https://mycompany.freshdesk.com 'mycompany' is the subdomain.",
      startAdornment: 'https://',
      endAdornment: '.freshdesk.com',
      label: 'Subdomain:',
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
            baseUri.indexOf('.freshdesk.com')
          );

        return subdomain;
      },
    },
    'rest.basicAuth.username': {
      fieldId: 'rest.basicAuth.username',
      helpText:
        'Username can be either your Freshdesk account email used to login to your Freshdesk account, or the API key associated with your account, depending on preference.',
    },
    'rest.basicAuth.password': {
      fieldId: 'rest.basicAuth.password',
      helpText: 'The password of your Freshdesk account.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'rest.freshdeskSubdomain',
      'rest.basicAuth.username',
      'rest.basicAuth.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
