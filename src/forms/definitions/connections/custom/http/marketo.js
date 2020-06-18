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
      required: true,
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
      label: 'Client ID',
      required: true,
      helpKey: 'marketo.connection.http.unencrypted.clientId',
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      type: 'text',
      label: 'Client secret',
      required: true,
      defaultValue: '',
      inputType: 'password',
      helpKey: 'marketo.connection.http.unencrypted.clientSecret',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
        fields: ['http.marketoSubdomain',
          'http.unencrypted.clientId',
          'http.encrypted.clientSecret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
