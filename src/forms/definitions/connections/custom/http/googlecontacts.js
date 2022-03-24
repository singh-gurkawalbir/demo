import { getGoogleContactsAPI } from '../../../../../utils/connections';

export default {
  preSave: formValues => {
    const apiType = formValues['/http/unencrypted/apiType'];
    const peoplescope = formValues['/http/scopePeople'];

    if (apiType === 'googlecontactspeople') {
      return {
        ...formValues,
        '/type': 'http',
        '/assistant': 'googlecontactspeople',
        '/http/auth/type': 'oauth',
        '/http/mediaType': 'json',
        '/http/baseURI': 'https://people.googleapis.com/v1',
        '/http/ping/relativeURI': '/contactGroups',
        '/http/ping/method': 'GET',
        '/http/auth/oauth/authURI': 'https://accounts.google.com/o/oauth2/auth',
        '/http/auth/oauth/tokenURI': 'https://accounts.google.com/o/oauth2/token',
        '/http/auth/oauth/scopeDelimiter': ' ',
        '/http/auth/oauth/scope': peoplescope,
      };
    }

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'googlecontacts',
      '/http/auth/type': 'oauth',
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://www.google.com/m8/feeds/',
      '/http/ping/relativeURI': 'contacts/default/full',
      '/http/ping/method': 'GET',
      '/http/auth/oauth/authURI': 'https://accounts.google.com/o/oauth2/auth',
      '/http/auth/oauth/tokenURI': 'https://accounts.google.com/o/oauth2/token',
      '/http/auth/oauth/scopeDelimiter': ' ',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.apiType': {
      id: 'http.unencrypted.apiType',
      type: 'select',
      label: 'API type',
      helpKey: 'googlecontacts.connection.http.unencrypted.apiType',
      required: true,
      defaultValue: r => getGoogleContactsAPI(r) || 'googlecontactspeople',
      options: [
        {
          items: [
            { label: 'People API', value: 'googlecontactspeople' },
            { label: 'Contacts API [Deprecated]', value: 'googlecontacts' },
          ],
        },
      ],
    },
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
      visibleWhen: [{ field: 'http.unencrypted.apiType', is: ['googlecontactspeople'] },
      ],
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'https://www.google.com/m8/feeds/',
        'https://www.googleapis.com/auth/contacts.readonly',
      ],
      visibleWhen: [{ field: 'http.unencrypted.apiType', is: ['googlecontacts'] }],
    },
    'http.scopePeople': {
      id: 'http.scopePeople',
      type: 'selectscopes',
      label: 'Configure scopes',
      helpKey: 'googlecontacts.connection.http.scopePeople',
      visibleWhen: [{ field: 'http.unencrypted.apiType', is: ['googlecontactspeople'] }],
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
      visibleWhen: [{ field: 'http.unencrypted.apiType', is: ['googlecontactspeople'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.apiType', 'http._iClientId', 'http.auth.oauth.callbackURL', 'http.auth.oauth.scope', 'http.scopePeople'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
