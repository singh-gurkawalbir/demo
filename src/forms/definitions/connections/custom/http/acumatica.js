export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'acumatica',
    '/http/auth/type': 'cookie',
    '/http/mediaType': 'json',
    '/isHTTP': false,
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/FinancialPeriod',
    '/http/baseURI': `${formValues['/instanceURI']}/entity/${
      formValues['/http/unencrypted/endpointName']
    }/${formValues['/http/unencrypted/endpointVersion']}`,
    '/http/auth/token/token': '',
    '/http/auth/cookie/method': 'POST',
    '/http/auth/cookie/successStatusCode': 204,
    '/http/auth/cookie/uri': `${formValues['/instanceURI']}/entity/auth/login`,
    '/http/auth/cookie/body': `{"name": "${
      formValues[`/http/unencrypted/username`]
    }","password": "${formValues[`/http/encrypted/password`]}","company": "${
      formValues[`/http/unencrypted/company`]
    }"}`,
    '/http/encrypted/cookieString': '',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    mode: {
      id: 'mode',
      type: 'radiogroup',
      label: 'Mode',
      defaultValue: r => (r && r._agentId ? 'onpremise' : 'cloud'),
      options: [
        {
          items: [
            { label: 'Cloud', value: 'cloud' },
            { label: 'On-Premise', value: 'onpremise' },
          ],
        },
      ],
    },
    _agentId: {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'mode', is: ['onpremise'] }],
    },
    instanceURI: {
      id: 'instanceURI',
      type: 'text',
      endAdornment: '/entity',
      label: 'Instance URI',
      required: true,
      helpKey: 'acumatica.connection.instanceURI',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri && baseUri.substring(0, baseUri.indexOf('/entity'));

        return subdomain;
      },
    },
    'http.unencrypted.endpointName': {
      id: 'http.unencrypted.endpointName',
      type: 'text',
      label: 'Endpoint Name',
      helpKey: 'acumatica.connection.http.unencrypted.endpointName',
      required: true,
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.unencrypted &&
          r.http.unencrypted.endpointName) ||
        'Default',
    },
    'http.unencrypted.endpointVersion': {
      id: 'http.unencrypted.endpointVersion',
      type: 'text',
      label: 'Endpoint Version',
      helpKey: 'acumatica.connection.http.unencrypted.endpointVersion',
      required: true,
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.unencrypted &&
          r.http.unencrypted.endpointVersion) ||
        '18.200.001',
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
      defaultValue: r =>
        r && r.http && r.http.unencrypted && r.http.unencrypted.username,
      helpKey: 'acumatica.connection.http.unencrypted.username',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      required: true,
      helpKey: 'acumatica.connection.http.encrypted.password',
    },
    'http.unencrypted.company': {
      id: 'http.unencrypted.company',
      type: 'text',
      label: 'Company',
      defaultValue: '',
      helpKey: 'acumatica.connection.http.unencrypted.company',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'mode',
      '_agentId',
      'instanceURI',
      'http.unencrypted.endpointName',
      'http.unencrypted.endpointVersion',
      'http.unencrypted.username',
      'http.encrypted.password',
      'http.unencrypted.company',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
