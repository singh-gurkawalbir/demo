export default {
  fieldMap: {
    'http.auth.cookie.method': {
      fieldId: 'http.auth.cookie.method',
      required: true,
    },
    'http.auth.cookie.body': {
      fieldId: 'http.auth.cookie.body',
      visibleWhenAll: [{ field: 'http.auth.cookie.method', is: ['POST'] }],
    },
    'http.auth.cookie.uri': { fieldId: 'http.auth.cookie.uri', required: true },
    'http.auth.cookie.successStatusCode': {
      fieldId: 'http.auth.cookie.successStatusCode',
    },
  },
  layout: {
    fields: [
      'http.auth.cookie.method',
      'http.auth.cookie.body',
      'http.auth.cookie.uri',
      'http.auth.cookie.successStatusCode',
    ],
  },
};
