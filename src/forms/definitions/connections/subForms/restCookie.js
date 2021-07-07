export default {
  fieldMap: {
    'rest.cookieAuth.method': {
      fieldId: 'rest.cookieAuth.method',
      required: true,
    },
    'rest.cookieAuth.body': {
      fieldId: 'rest.cookieAuth.body',
      visibleWhenAll: [{ field: 'rest.cookieAuth.method', is: ['POST'] }],
      required: true,
    },
    'rest.cookieAuth.uri': { fieldId: 'rest.cookieAuth.uri', required: true },
    'rest.cookieAuth.successStatusCode': {
      fieldId: 'rest.cookieAuth.successStatusCode',
    },
  },
  layout: {
    fields: [
      'rest.cookieAuth.method',
      'rest.cookieAuth.uri',
      'rest.cookieAuth.body',
      'rest.cookieAuth.successStatusCode',
    ],
  },
};
