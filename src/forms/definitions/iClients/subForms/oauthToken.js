export default {
  fieldMap: {
    'oauth2.accessTokenLocation': {
      fieldId: 'oauth2.accessTokenLocation',
    },
    'oauth2.accessTokenheaderName': {
      fieldId: 'oauth2.accessTokenheaderName',
      visibleWhenAll: [{ field: 'oauth2.accessTokenLocation', is: ['header'] }],
    },
    'oauth2.scheme': {
      fieldId: 'oauth2.scheme',
      visibleWhenAll: [{ field: 'oauth2.accessTokenLocation', is: ['header'] }],
    },
    'oauth2.customAuthScheme': {
      id: 'oauth2.customAuthScheme',
      type: 'text',
      label: 'Custom auth scheme',
      visibleWhenAll: [
        { field: 'oauth2.accessTokenLocation', is: ['header'] },
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
    'oauth2.accessTokenParamName': {
      fieldId: 'oauth2.accessTokenParamName',
      visibleWhenAll: [{ field: 'oauth2.accessTokenLocation', is: ['url'] }],
    },
  },
  layout: {
    fields: [
      'oauth2.accessTokenLocation',
      'oauth2.accessTokenheaderName',
      'oauth2.scheme',
      'oauth2.customAuthScheme',
      'oauth2.accessTokenParamName',
    ],
  },
};
