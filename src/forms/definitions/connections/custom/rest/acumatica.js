export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'acumatica',
    '/rest/authType': 'cookie',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/FinancialPeriod',
    '/rest/baseURI': `${formValues['/instanceURI']}/entity/${
      formValues['/endpointName']
    }/${formValues['/endpointVersion']}`,
    '/rest/bearerToken': '',
    '/rest/cookieAuth/method': 'POST',
    '/rest/cookieAuth/successStatusCode': 204,
    '/rest/cookieAuth/uri': `${formValues['/instanceURI']}/entity/${
      formValues['/endpointName']
    }/${formValues['/endpointVersion']}`,
    '/rest/cookieAuth/body': `{"name": "${
      formValues[`/username`]
    }","password": "${formValues[`/password`]}","company": "${
      formValues[`/username`]
    }"}`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'instanceURI',
      type: 'text',
      endAdornment: '/entity',
      label: 'Instance URI:',
      required: true,
      helpText:
        'Please enter URL of your instance with Acumatica. For example, http://try.acumatica.com/isv/entity/Default/6.00.001.',
      defaultValue: r => {
        const baseUri = r.rest.baseURI;
        const subdomain =
          baseUri && baseUri.substring(0, baseUri.indexOf('/entity'));

        return subdomain;
      },
    },
    {
      id: 'rest.unencrypted.endpointName',
      type: 'text',
      label: 'Endpoint Name:',
      helpText: 'Please enter endpoint name of your Acumatica account.',
      required: true,
      defaultValue: r =>
        (r &&
          r.rest &&
          r.rest.unencrypted &&
          r.rest.unencrypted.endpointName) ||
        'Default',
    },
    {
      id: 'rest.unencrypted.endpointVersion',
      type: 'text',
      label: 'Endpoint Version:',
      helpText: 'Please enter endpoint name of your Acumatica account.',
      required: true,
      defaultValue: r =>
        (r &&
          r.rest &&
          r.rest.unencrypted &&
          r.rest.unencrypted.endpointVersion) ||
        '18.200.001',
    },
    {
      id: 'rest.unencrypted.username',
      type: 'text',
      label: 'Username:',
      required: true,

      helpText: 'Please enter endpoint name of your Acumatica account.',
      defaultValue: r =>
        (r && r.rest && r.rest.unencrypted && r.rest.unencrypted.username) ||
        'Default',
    },
    {
      id: 'password',
      type: 'text',
      inputType: 'password',
      label: 'Password:',
      required: true,
      helpText: 'Please enter endpoint name of your Acumatica account.',
    },
    {
      id: 'rest.unencrypted.company',
      required: true,
      type: 'text',
      label: 'Company:',
      helpText: 'Please enter endpoint name of your Acumatica account.',
    },
  ],
};
