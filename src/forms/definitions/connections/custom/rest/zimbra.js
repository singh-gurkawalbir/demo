export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'zimbra',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': `/${
      formValues['/rest/unencrypted/userAccount']
    }/inbox?fmt=json`,
    '/rest/baseURI': `${formValues['/rest/baseURI']}/home`,
    '/rest/headers': [
      { name: 'Accept', value: 'application/json' },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.baseURI',
      endAdornment: '/home',
      label: 'Base URI:',
      helpText:
        'Please enter URL of your instance with Acumatica. For example, http://try.acumatica.com/isv/entity/Default/6.00.001.',
      defaultValue: r => {
        const baseUri = r.rest.baseURI;
        const subdomain =
          baseUri && baseUri.substring(0, baseUri.indexOf('/home'));

        return subdomain;
      },
    },
    {
      id: 'rest.unencrypted.userAccount',
      type: 'text',
      label: 'User Account:',
      helpText: 'Please enter endpoint name of your Acumatica account.',
      required: true,
    },
  ],
};
