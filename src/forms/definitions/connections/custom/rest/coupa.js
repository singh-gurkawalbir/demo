export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'coupa',
    '/rest/authType': 'token',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/accounts',
    '/rest/baseURI': `https://${
      formValues['/rest/coupaSubdomain']
    }.coupacloud.com/api`,
    '/rest/pingMethod': 'GET',
    '/rest/tokenLocation': 'header',
    '/rest/authHeader': 'X-COUPA-API-KEY',
    '/rest/authScheme': ' ',
    '/rest/headers': [
      {
        name: 'ACCEPT',
        value: 'application/json',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.coupaSubdomain': {
      type: 'text',
      id: 'rest.coupaSubdomain',
      startAdornment: 'https://',
      helpText:
        'Please enter the subdomain of your account here which can be obtained from the login url.',
      endAdornment: '.coupacloud.com',
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
            baseUri.indexOf('.coupacloud.com')
          );

        return subdomain;
      },
    },
    'rest.bearerToken': {
      fieldId: 'rest.bearerToken',
      required: true,
      label: 'API Key:',
      helpText:
        'Please enter your API token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API token safe. A token can be created from the API Keys section of the Administration tab by an admin user. The token is a 40-character long case-sensitive alphanumeric code.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.coupaSubdomain', 'rest.bearerToken'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
