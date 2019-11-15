export default {
  preSave: formValues => {
    const pingBody = {
      Store_Code: '{{{connection.http.unencrypted.Store_Code}}}',
      Function: 'AvailabilityGroupList_Load_Query',
    };

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'miva',
      '/http/auth/type': 'custom',
      '/http/mediaType': 'json',
      '/http/baseURI': `https://${formValues['/http/apiEndpoint']}`,
      '/http/ping/relativeURI': '/json.mvc',
      '/http/ping/method': 'POST',
      '/http/ping/body': JSON.stringify(pingBody),
      '/http/ping/successPath': 'success',
      '/http/ping/successValues': ['1'],
      '/http/headers': [
        {
          name: 'X-Miva-API-Authorization',
          value: `MIVA ${formValues['/xMivaAPIToken']}`,
        },
      ],
      // '/xMivaAPIToken': undefined,
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.apiEndpoint': {
      id: 'http.apiEndpoint',
      type: 'text',
      startAdornment: 'https://',
      label: 'API Endpoint',
      required: true,
      helpText:
        'Please enter the API Endpoint. Under Domain Settings > Site Configuration> Base URL for Graphics we will get the Domain Name. Every store has its own unique API endpoint associated with the domain name. The format will be as follows: https://www.domain.com/mm5/',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri && baseUri.substring(baseUri.indexOf('https://') + 8);

        return subdomain;
      },
    },
    'http.unencrypted.Store_Code': {
      id: 'http.unencrypted.Store_Code',
      type: 'text',
      label: 'Store Code',
      helpText:
        'Please enter the Store Code. Under store settings, we will get the store code.',
      required: true,
    },
    xMivaAPIToken: {
      id: 'xMivaAPIToken',
      type: 'text',
      label: 'API Token',
      helpText:
        'Please enter the API token of your account. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. The token is generated in the Miva admin under Users > API Tokens. Note: When we are generating token we should select the Accept Requests Without Signature, Accept Requests Without Timestamp and also we should provide IP Address as 0.0.0.0/0 and also we should provide required permissions for groups and functions.',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.apiEndpoint',
      'http.unencrypted.Store_Code',
      'xMivaAPIToken',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
