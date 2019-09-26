export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'marketo',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/http/marketoSubdomain']}/rest`,
    '/http/ping/relativeURI': '/v1/activities/types.json',
    '/http/ping/successPath': 'success',
    '/http/ping/method': 'GET',
    '/http/ping/successValues': ['true'],
    '/http/auth/token/refreshRelativeURI': `https://${
      formValues['/http/marketoSubdomain']
    }/identity/oauth/token?grant_type=client_credentials&client_id=${
      formValues['/http/unencrypted/clientId']
    }&client_secret=${formValues['/http/encrypted/clientSecret']}`,
    '/http/auth/token/refreshMethod': 'GET',
    '/http/auth/token/refreshMediaType': 'json',
    '/http/auth/token/refreshTokenPath': 'access_token',
    '/http/auth/failPath': 'errors[0].code',
    '/http/auth/failValues': ['601', '602'],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.marketoSubdomain': {
      id: 'http.marketoSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '/rest',
      label: 'Subdomain',
      helpText:
        "Please enter your Marketo subdomain. For example, in https://591-vse-736.mktohttp.com/http/v1/activities/types.json '591-vse-736.mktohttp.com' is the subdomain.",
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
            baseUri.indexOf('/rest')
          );

        return subdomain;
      },
    },
    'http.unencrypted.clientId': {
      id: 'http.unencrypted.clientId',
      type: 'text',
      label: 'Client Id',
      required: true,
      helpText:
        'The Client ID will be found in the Admin > LaunchPoint menu by selecting the custom service, and clicking View Details.',
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      type: 'text',
      label: 'Client Secret',
      required: true,
      defaultValue: '',
      inputType: 'password',
      helpText:
        'The Client Secret will be found in the Admin > LaunchPoint menu by selecting the custom service, and clicking View Details. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.marketoSubdomain',
      'http.unencrypted.clientId',
      'http.encrypted.clientSecret',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
