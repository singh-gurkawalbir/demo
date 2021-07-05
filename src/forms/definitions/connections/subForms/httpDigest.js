export default {
  fieldMap: {
    'http.auth.digest.username': {
      id: 'http.auth.digest.username',
      type: 'text',
      label: 'Username',
      required: true,
      helpKey: 'connection.http.auth.basic.username',
      defaultValue: r => r?.http?.auth?.basic?.username,
    },
    'http.auth.digest.password': {
      id: 'http.auth.digest.password',
      type: 'text',
      label: 'Password',
      inputType: 'password',
      defaultValue: '',
      description: 'Note: for security reasons this field must always be re-entered.',
      required: true,
      helpKey: 'connection.http.auth.basic.password',
    },
  },
  layout: { fields: ['http.auth.digest.username', 'http.auth.digest.password'] },
};
