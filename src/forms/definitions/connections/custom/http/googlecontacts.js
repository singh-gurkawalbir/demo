export default {
  preSave: formValues => {
    const peoplescope = formValues['/http/scopePeople'];

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'googlecontactspeople',
      '/http/auth/type': 'oauth',
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://people.googleapis.com/v1',
      '/http/ping/relativeURI': '/contactGroups',
      '/http/ping/method': 'GET',
      '/http/auth/oauth/useIClientFields': false,
      '/http/auth/oauth/authURI': 'https://accounts.google.com/o/oauth2/auth',
      '/http/auth/oauth/tokenURI': 'https://accounts.google.com/o/oauth2/token',
      '/http/auth/oauth/scopeDelimiter': ' ',
      '/http/auth/oauth/scope': peoplescope,
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    application: {
      fieldId: 'application',
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
    },
    'http.scopePeople': {
      id: 'http.scopePeople',
      type: 'selectscopes',
      isLoggable: true,
      label: 'Configure scopes',
      helpKey: 'googlecontacts.connection.http.scopePeople',
      scopes: [
        'https://www.googleapis.com/auth/contacts',
        'https://www.googleapis.com/auth/contacts.readonly',
        'https://www.googleapis.com/auth/contacts.other.readonly',
        'https://www.googleapis.com/auth/directory.readonly',
      ],
      defaultValue: r => r?.http?.auth?.oauth?.scope || ['https://www.googleapis.com/auth/contacts'],
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http._iClientId', 'http.auth.oauth.callbackURL', 'http.scopePeople'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
