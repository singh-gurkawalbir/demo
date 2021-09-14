export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'braintree',
    '/http/auth/type': 'basic',
    '/http/baseURI': `https://payments${
      formValues['/http/unencrypted/environment'] === 'sandbox' ? '.sandbox' : ''
    }.braintree-api.com/graphql`,
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/',
    '/http/ping/method': 'POST',
    '/http/ping/body': '{ "query": "query { ping }" }',
    '/http/ping/failPath': 'errors[0].message',
    '/http/ping/errorPath': 'errors[0].message',
    '/http/headers': [{
      name: 'Braintree-Version',
      value: '2021-03-19',
    }],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    application: {
      fieldId: 'application',
    },
    'http.unencrypted.environment': {
      id: 'http.unencrypted.environment',
      type: 'select',
      label: 'Environment',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      helpKey: 'braintree.connection.http.unencrypted.environment',
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'Public key',
      helpKey: 'braintree.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'Private key',
      helpKey: 'braintree.connection.http.auth.basic.password',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.environment', 'http.auth.basic.username', 'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
