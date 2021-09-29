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
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://api.cc.email/',
      '/http/auth/oauth/authURI': 'https://api.cc.email/v3/idfed',
      '/http/auth/oauth/tokenURI':
            'https://idfed.constantcontact.com/as/token.oauth2',
      '/http/auth/oauth/scopeDelimiter': '',
      '/http/auth/oauth/scope': ['contact_data'],
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
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application', 'versionType'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
