export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'marketo',
    '/rest/authType': 'token',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://${formValues['/rest/marketoSubdomain']}/rest`,
    '/rest/pingRelativeURI': '/v1/activities/types.json',
    '/rest/pingSuccessPath': 'success',
    '/rest/pingSuccessValues': ['true'],
    '/rest/refreshTokenURI': `https://${
      formValues['/rest/marketoSubdomain']
    }/identity/oauth/token?grant_type=client_credentials&client_id=${
      formValues['/rest/unencrypted/clientId']
    }&client_secret=${formValues['/rest/encrypted/clientSecret']}`,
    '/rest/refreshTokenMethod': 'GET',
    '/rest/refreshTokenMediaType': 'json',
    '/rest/refreshTokenPath': 'access_token',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.marketoSubdomain': {
      id: 'rest.marketoSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '/rest',
      label: 'Subdomain:',
      helpText:
        "Please enter your Marketo subdomain. For example, in https://591-vse-736.mktorest.com/rest/v1/activities/types.json '591-vse-736.mktorest.com' is the subdomain.",
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
            baseUri.indexOf('/rest')
          );

        return subdomain;
      },
    },
    'rest.unencrypted.clientId': {
      id: 'rest.unencrypted.clientId',
      type: 'text',
      label: 'Client Id:',
      required: true,
      helpText:
        'The Client ID will be found in the Admin > LaunchPoint menu by selecting the custom service, and clicking View Details.',
    },
    'rest.encrypted.clientSecret': {
      id: 'rest.encrypted.clientSecret',
      type: 'text',
      label: 'Client Secret:',
      required: true,
      inputType: 'password',
      helpText:
        'The Client Secret will be found in the Admin > LaunchPoint menu by selecting the custom service, and clicking View Details. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'rest.marketoSubdomain',
      'rest.unencrypted.clientId',
      'rest.encrypted.clientSecret',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
