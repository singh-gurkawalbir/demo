export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'tsheets',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/http/tsheetsSubdomain']
    }.tsheets.com/api`,
    '/http/auth/oauth/authURI': 'https://rest.tsheets.com/api/v1/authorize',
    '/http/auth/oauth/tokenURI': 'https://rest.tsheets.com/api/v1/grant',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.tsheetsSubdomain': {
      id: 'http.tsheetsSubdomain',
      type: 'text',
      helpKey: 'tsheets.connection.http.tsheetsSubdomain',
      startAdornment: 'https://',
      endAdornment: '.tsheets.com/api',
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
            baseUri.indexOf('.tsheets.com/api')
          );

        return subdomain;
      },
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
        fields: ['http.tsheetsSubdomain'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
