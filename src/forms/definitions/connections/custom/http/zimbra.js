export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'zimbra',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': `/${
      formValues['/http/unencrypted/userAccount']
    }/inbox?fmt=json`,
    '/http/ping/method': 'GET',
    '/http/baseURI': `${formValues['/http/baseURI']}/home`,
    '/http/headers': [
      { name: 'Accept', value: 'application/json' },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.baseURI': {
      fieldId: 'http.baseURI',
      endAdornment: '/home',
      label: 'Base URI',
      helpKey: 'zimbra.connection.http.baseURI',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri && baseUri.substring(0, baseUri.indexOf('/home'));

        return subdomain;
      },
    },
    'http.unencrypted.userAccount': {
      id: 'http.unencrypted.userAccount',
      type: 'text',
      helpKey: 'zimbra.connection.http.unencrypted.userAccount',
      label: 'User account',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.baseURI', 'http.unencrypted.userAccount'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
