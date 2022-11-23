export default {
  fieldMap: {
    'oauth2.location': {
      fieldId: 'oauth2.location',
    },
    'oauth2.headerName': {
      fieldId: 'oauth2.headerName',
      visibleWhenAll: [{ field: 'oauth2.location', is: ['header'] }],
    },
    'oauth2.scheme': {
      fieldId: 'oauth2.scheme',
      visibleWhenAll: [{ field: 'oauth2.location', is: ['header'] }],
    },
    'oauth2.customAuthScheme': {
      id: 'oauth2.customAuthScheme',
      type: 'text',
      label: 'Custom auth scheme',
      visibleWhenAll: [
        { field: 'oauth2.location', is: ['header'] },
        { field: 'oauth2.scheme', is: ['Custom'] },
      ],
      required: true,
      defaultValue: r => {
        if (!r?.oauth2?.scheme) return '';
        // custom auth scheme gets saved in 'scheme' field
        if (['Bearer', 'MAC', ' '].includes(r.oauth2.scheme)) return '';

        return r.oauth2.scheme;
      },
    },
    'oauth2.paramName': {
      fieldId: 'oauth2.paramName',
      visibleWhenAll: [{ field: 'oauth2.location', is: ['url'] }],
    },
  },
  layout: {
    fields: [
      'oauth2.location',
      'oauth2.headerName',
      'oauth2.scheme',
      'oauth2.customAuthScheme',
      'oauth2.paramName',
    ],
  },
};
