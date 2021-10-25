export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/unencrypted/signature'] === 'mivahmacsha256') {
      retValues['/http/headers'] = [
        {
          name: 'X-Miva-API-Authorization',
          value: `MIVA-HMAC-SHA256 ${formValues['/xMivaAPIToken']}:{{{hmac "sha256" connection.http.encrypted.privateKey "base64" hmacOptions.body "base64"}}}`,
        },
      ];
    } else if (retValues['/http/unencrypted/signature'] === 'mivahmacsha1') {
      retValues['/http/headers'] = [
        {
          name: 'X-Miva-API-Authorization',
          value: `MIVA-HMAC-SHA1 ${formValues['/xMivaAPIToken']}:{{{hmac "sha1" connection.http.encrypted.privateKey "base64" hmacOptions.body "base64"}}}`,
        },
      ];
    } else {
      retValues['/http/headers'] = [
        {
          name: 'X-Miva-API-Authorization',
          value: `MIVA ${formValues['/xMivaAPIToken']}`,
        },
      ];
    }
    const pingBody = {
      Store_Code: '{{{connection.http.unencrypted.Store_Code}}}',
      Function: 'CustomerList_Load_Query',
    };

    return {
      ...retValues,
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
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.apiEndpoint': {
      id: 'http.apiEndpoint',
      type: 'text',
      startAdornment: 'https://',
      label: 'API endpoint',
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
      label: 'Store code',
      required: true,
    },
    'http.unencrypted.signature': {
      id: 'http.unencrypted.signature',
      type: 'select',
      label: 'HMAC signature',
      required: true,
      helpKey: 'miva.connection.http.unencrypted.signature',
      defaultValue: r =>
        (r?.http?.unencrypted?.signature) || 'mivanohmac',
      options: [
        {
          items: [
            { label: 'MIVA-HMAC-SHA256', value: 'mivahmacsha256' },
            { label: 'MIVA-HMAC-SHA1', value: 'mivahmacsha1' },
            { label: 'MIVA (no hmac present)', value: 'mivanohmac' },
          ],
        },
      ],
    },
    'http.encrypted.privateKey': {
      id: 'http.encrypted.privateKey',
      type: 'text',
      label: 'Private key',
      inputType: 'password',
      required: true,
      helpKey: 'miva.connection.http.encrypted.privateKey',
      visibleWhen: [
        {
          field: 'http.unencrypted.signature',
          isNot: ['mivanohmac', ''],
        },
      ],
    },
    xMivaAPIToken: {
      id: 'xMivaAPIToken',
      type: 'text',
      label: 'API token',
      inputType: 'password',
      required: true,
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
        fields: ['http.apiEndpoint',
          'http.unencrypted.Store_Code',
          'http.unencrypted.signature',
          'http.encrypted.privateKey',
          'xMivaAPIToken'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
