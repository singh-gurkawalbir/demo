export default {
  fields: [
    { fieldId: 'rest.cookieAuth.method', required: true },
    {
      fieldId: 'rest.cookieAuth.body',
      visibleWhenAll: [
        {
          field: 'rest.cookieAuth.method',
          is: ['POST'],
        },
      ],
    },
    { fieldId: 'rest.cookieAuth.uri', required: true },
    { fieldId: 'rest.cookieAuth.successStatusCode' },
  ],
};
