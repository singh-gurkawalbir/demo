export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'snapfulfil',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'api/Receipts',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${formValues['/http/subdomain']}.snapfulfil.net/`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.subdomain': {
      type: 'text',
      id: 'http.subdomain',
      startAdornment: 'https://',
      endAdornment: '.snapfulfil.net/',
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
            baseUri.indexOf('.snapfulfil.net/')
          );

        return subdomain;
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.subdomain',
      'http.auth.basic.username',
      'http.auth.basic.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
