export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'acumatica',
    '/http/auth/type': 'cookie',
    '/http/mediaType': 'json',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/FinancialPeriod',
    '/http/baseURI': `${formValues['/instanceURI']}/entity/${
      formValues['/http/unencrypted/endpointName']
    }/${formValues['/http/unencrypted/endpointVersion']}`,
    '/http/auth/token/token': '',
    '/http/auth/cookie/method': 'POST',
    '/http/auth/cookie/successStatusCode': 204,
    '/http/auth/cookie/uri': `${formValues['/instanceURI']}//entity/auth/login`,
    '/http/auth/cookie/body': `{"name": "${
      formValues[`/http/unencrypted/username`]
    }","password": "${formValues[`/password`]}","company": "${
      formValues[`/http/unencrypted/company`]
    }"}`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'instanceURI',
      type: 'text',
      endAdornment: '/entity',
      label: 'Instance URI',
      required: true,
      helpText:
        'Please enter URL of your instance with Acumatica. For example, http://try.acumatica.com/isv/entity/Default/6.00.001.',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri && baseUri.substring(0, baseUri.indexOf('/entity'));

        return subdomain;
      },
    },
    {
      id: 'http.unencrypted.endpointName',
      type: 'text',
      label: 'Endpoint Name',
      helpText: 'Please enter endpoint name of your Acumatica account.',
      required: true,
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.unencrypted &&
          r.http.unencrypted.endpointName) ||
        'Default',
    },
    {
      id: 'http.unencrypted.endpointVersion',
      type: 'text',
      label: 'Endpoint Version',
      helpText: 'Please enter endpoint version of your Acumatica account.',
      required: true,
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.unencrypted &&
          r.http.unencrypted.endpointVersion) ||
        '18.200.001',
    },
    {
      id: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,

      helpText: 'Please enter username of your Acumatica account.',
      defaultValue: r =>
        r && r.http && r.http.unencrypted && r.http.unencrypted.username,
    },
    {
      id: 'password',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      required: true,
      helpText: 'Please enter password of your Acumatica account.',
    },
    {
      id: 'http.unencrypted.company',
      type: 'text',
      label: 'Company',
      helpText: 'Please enter company name of your Acumatica account.',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
