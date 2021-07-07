export default {
  fieldMap: {
    'http.auth.wsse.username': {
      id: 'http.auth.wsse.username',
      type: 'text',
      label: 'Username',
      required: true,
      helpKey: 'connection.http.auth.basic.username',
      defaultValue: r => r?.http?.auth?.basic?.username,
    },
    'http.auth.wsse.password': {
      id: 'http.auth.wsse.password',
      type: 'text',
      label: 'Password',
      inputType: 'password',
      defaultValue: '',
      description: 'Note: for security reasons this field must always be re-entered.',
      required: true,
      helpKey: 'connection.http.auth.basic.password',
    },
    'http.auth.wsse.headerName': {
      id: 'http.auth.wsse.headerName',
      type: 'text',
      label: 'Header name',
      defaultValue: r => r?.http?.auth?.token?.headerName || 'X-WSSE',
      required: true,
    },
  },
  layout: { fields: ['http.auth.wsse.username', 'http.auth.wsse.password', 'http.auth.wsse.headerName'] },
};
