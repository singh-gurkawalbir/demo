export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'channelape',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v1/analytics',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.channelape.com',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'X-Channel-Ape-Authorization-Token',
    '/http/auth/token/scheme': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'X-Channel-Ape-Authorization-Token',
      helpKey: 'channelape.connection.http.auth.token.token',
      required: true,
    },
    application: {
      fieldId: 'application',
    },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    'http.concurrencyLevel': {
      id: 'http.concurrencyLevel',
      name: '/http/concurrencyLevel',
      label: 'Concurrency level',
      type: 'select',
      options: [
        {
          items: [
            { label: '1', value: 1 },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
            { label: '4', value: 4 },
            { label: '5', value: 5 },
          ],
        },
      ],
      visibleWhen: [
        {
          field: '_borrowConcurrencyFromConnectionId',
          is: [''],
        },
      ],
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['_borrowConcurrencyFromConnectionId', 'http.concurrencyLevel'] },
    ],
  },
};
