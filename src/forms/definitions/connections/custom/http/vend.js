export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'vend',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/http/subdomain']}.vendhq.com`,
    '/http/auth/oauth/authURI': 'https://secure.vendhq.com/connect',
    '/http/auth/oauth/tokenURI': `https://${
      formValues['/http/subdomain']
    }.vendhq.com/api/1.0/token`,
    '/http/auth/oauth/accessTokenPath': 'access_token',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.subdomain': {
      id: 'http.subdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.vendhq.com',
      label: 'Subdomain',
      required: true,
      helpKey: 'vend.connection.http.subdomain',
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
            baseUri.indexOf('.vendhq.com')
          );

        return subdomain;
      },
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.subdomain'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
