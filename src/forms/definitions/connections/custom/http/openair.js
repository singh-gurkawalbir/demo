export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'openair',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'xml',
    '/http/baseURI': `${
      formValues['/environment'] === 'sandbox'
        ? 'https://sandbox.openair.com/api.pl'
        : 'https://www.openair.com/api.pl'
    }`,
    '/http/ping/relativeURI': '/xml/v1/request.api',
    '/http/ping/successPath': '/response/Auth/@status',
    '/http/ping/successValues': ['0'],
    '/http/ping/errorPath': '/ErrorResponse/Error/Message/text()',
    '/http/ping/body':
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
      '<request API_version="1.0" client="test app" client_ver="1.1" namespace="{{{connection.http.unencrypted.namespace}}}" key="{{{connection.http.unencrypted.apiKey}}}">\n' +
      '  <Auth>\n' +
      '    <Login>\n' +
      '      <company>{{{connection.http.unencrypted.companyId}}}</company>\n' +
      '      <user>{{{connection.http.unencrypted.userId}}}</user>\n' +
      '      <password>{{{connection.http.encrypted.password}}}</password>\n' +
      '    </Login>\n' +
      '  </Auth>\n' +
      '</request>',
    '/http/ping/method': 'POST',
    '/http/rateLimit/failPath': '/response/Auth/@status',
    '/http/rateLimit/failValues': ['556'],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Environment:',
      helpText: 'Please select the environment of your OpenAir account.',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') === -1) {
            return 'sandbox';
          }

          return 'production';
        }

        return '';
      },
    },
    'http.unencrypted.companyId': {
      id: 'http.unencrypted.companyId',
      type: 'text',
      label: 'Company Id:',
      helpText: 'Please enter Company ID of your account.',
      required: true,
    },
    'http.unencrypted.userId': {
      id: 'http.unencrypted.userId',
      type: 'text',
      label: 'User Id:',
      helpText: 'Please enter User ID of your account.',
      required: true,
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      label: 'Password:',
      helpText:
        'Please enter Password of your account. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Password safe.',
      required: true,
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.unencrypted.namespace': {
      id: 'http.unencrypted.namespace',
      type: 'text',
      label: 'API Namespace:',
      helpText: 'Please enter the API Namespace of your account.',
      required: true,
    },
    'http.unencrypted.apiKey': {
      id: 'http.unencrypted.apiKey',
      type: 'text',
      label: 'API key:',
      helpText:
        'Please enter the API Key of your account. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe.',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'environment',
      'http.unencrypted.companyId',
      'http.unencrypted.userId',
      'http.encrypted.password',
      'http.unencrypted.namespace',
      'http.unencrypted.apiKey',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
