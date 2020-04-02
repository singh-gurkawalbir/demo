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
      required: true,
    },
    xMivaAPIToken: {
      id: 'xMivaAPIToken',
      type: 'text',
      label: 'API Token',
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
