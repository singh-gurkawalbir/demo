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
      helpText: 'Please enter Region for URI.',
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
        'Please enter your private key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your private key safe. The private key is secret and is similar to a password. Only you and Paycor should have your private key. The shared secret allows access to your sensitive data.',
      required: true,
    },
    xMivaAPIToken: {
      id: 'xMivaAPIToken',
      type: 'text',
      label: 'API Token',
      helpText:
        'Please enter your public key here. Your public key identifies you to our system. This is similar to a username. You will include your public key every time you send request to Paycor. This is not secret information.',
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
