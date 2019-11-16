export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'target',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/accType'] === 'sandbox' ? 'stage-' : ''
    }api.target.com`,
    '/http/ping/relativeURI': `sellers/v1/sellers/${
      formValues['/http/unencrypted/x-seller-id']
    }/distribution_centers`,
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'x-api-key',
        value: '{{{connection.http.unencrypted.x-api-key}}}',
      },
      {
        name: 'x-seller-id',
        value: '{{{connection.http.unencrypted.x-seller-id}}}',
      },
      {
        name: 'x-seller-token',
        value: '{{{connection.http.encrypted.x-seller-token}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    accType: {
      id: 'accType',
      type: 'select',
      label: 'Account Type',
      required: true,
      helpText:
        'Please select your account type here. Select Sandbox if your API Endpoint starts with https://staging-api.target.com. Select Production if your API Endpoint starts with https://api.target.com',
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
        }

        return 'production';
      },
    },
    'http.unencrypted.x-api-key': {
      id: 'http.unencrypted.x-api-key',
      type: 'text',
      label: 'X-API-KEY',
      helpText:
        'The x-api-key will be generated after creating an app in the developer portal.',
      required: true,
    },
    'http.unencrypted.x-seller-id': {
      id: 'http.unencrypted.x-seller-id',
      type: 'text',
      label: 'X-SELLER-ID',
      helpText: 'Please enter the x-seller-id will be provided by Target.',
      required: true,
    },
    'http.encrypted.x-seller-token': {
      id: 'http.encrypted.x-seller-token',
      type: 'text',
      label: 'X-SELLER-TOKEN',
      helpText:
        'The x-seller-token will be provided by Target.Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.',
      required: true,
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'accType',
      'http.unencrypted.x-api-key',
      'http.unencrypted.x-seller-id',
      'http.encrypted.x-seller-token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
