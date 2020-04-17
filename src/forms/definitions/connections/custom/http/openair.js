export default {
  preSave: formValues => {
    let baseURI = '';

    if (formValues['/environment'] === 'sandbox') {
      baseURI = `https://${formValues['/http/unencrypted/companyId']
        .split(' ')
        .join('-')}.app.sandbox.openair.com/api.pl`;
    } else if (formValues['/environment'] === 'production') {
      baseURI = `https://${formValues['/http/unencrypted/companyId']
        .split(' ')
        .join('-')
        .toLowerCase()}.app.openair.com/api.pl`;
    } else if (formValues['/environment'] === 'demo') {
      baseURI = `https://${formValues['/http/unencrypted/companyId']
        .split(' ')
        .join('-')}.app.demo.openair.com/api.pl`;
    }

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'openair',
      '/http/auth/type': 'custom',
      '/http/mediaType': 'xml',
      '/http/baseURI': baseURI,
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
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Environment',
      helpKey: 'openair.connection.environment',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
            { label: 'Demo', value: 'demo' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri) {
            if (baseUri.indexOf('demo.openair.com') !== -1) {
              return 'demo';
            } else if (baseUri.indexOf('sandbox.openair.com') !== -1) {
              return 'sandbox';
            }

            return 'production';
          }
        }

        return 'production';
      },
    },
    'http.unencrypted.companyId': {
      id: 'http.unencrypted.companyId',
      type: 'text',
      label: 'Company ID',
      required: true,
      helpKey: 'openair.connection.http.unencrypted.companyId',
    },
    'http.unencrypted.userId': {
      id: 'http.unencrypted.userId',
      type: 'text',
      label: 'User ID',
      required: true,
      helpKey: 'openair.connection.http.unencrypted.userId',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      label: 'Password',
      required: true,
      inputType: 'password',
      helpKey: 'openair.connection.http.encrypted.password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.unencrypted.namespace': {
      id: 'http.unencrypted.namespace',
      type: 'text',
      label: 'API namespace',
      defaultValue: r =>
        (r && r.http && r.http.unencrypted && r.http.unencrypted.namespace) ||
        'default',
      required: true,
    },
    'http.unencrypted.apiKey': {
      id: 'http.unencrypted.apiKey',
      type: 'text',
      label: 'API key',
      helpKey: 'openair.connection.http.unencrypted.apiKey',
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
