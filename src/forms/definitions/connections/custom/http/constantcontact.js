export default {
  preSave: formValues => {
    const versionType = formValues['/versionType'];

    if (versionType === 'constantcontactv2') {
      return {
        ...formValues,
        '/type': 'http',
        '/assistant': 'constantcontactv2',
        '/http/auth/type': 'oauth',
        '/http/mediaType': 'json',
        '/http/baseURI': 'https://api.constantcontact.com/',
        '/http/ping/relativeURI': 'v2/eventspot/events?api_key={{{connection.http.unencrypted.apiKey}}}',
        '/http/ping/method': 'GET',
        '/http/auth/oauth/useIClientFields': false,
        '/http/auth/oauth/authURI':
          'https://oauth2.constantcontact.com/oauth2/oauth/siteowner/authorize',
        '/http/auth/oauth/tokenURI':
          'https://oauth2.constantcontact.com/oauth2/oauth/token',
        '/http/auth/token/refreshMethod': 'POST',
        '/http/auth/token/refreshMediaType': 'urlencoded',
      };
    }

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'constantcontactv3',
      '/http/auth/type': 'oauth',
      '/http/auth/oauth/useIClientFields': false,
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://api.cc.email/',
      '/http/ping/relativeURI': 'v3/contacts',
      '/http/ping/method': 'GET',
      '/http/auth/oauth/authURI': 'https://authz.constantcontact.com/oauth2/default/v1/authorize',
      '/http/auth/oauth/tokenURI':
            'https://authz.constantcontact.com/oauth2/default/v1/token',
      '/http/auth/oauth/scopeDelimiter': '',
      '/http/auth/oauth/scope': ['contact_data', 'offline_access'],
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshMediaType': 'urlencoded',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    httpAdvanced: { formId: 'httpAdvanced' },
    application: {
      fieldId: 'application',
    },
    versionType: {
      fieldId: 'versionType',
      helpKey: 'constantcontact.connection.http.versiontype',
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
      visibleWhen: [{ field: 'versionType', is: ['constantcontactv3'] },
      ],
      helpKey: 'constantcontact.connection.http._iClientId',
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
      visibleWhen: [{ field: 'versionType', is: ['constantcontactv3'] }],
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application', 'versionType'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http._iClientId', 'http.auth.oauth.callbackURL'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
