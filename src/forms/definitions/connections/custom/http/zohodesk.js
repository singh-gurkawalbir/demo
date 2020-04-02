export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'zohodesk',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://desk.zoho.com/api',
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI': 'https://accounts.zoho.com/oauth/v2/auth',
    '/http/auth/oauth/tokenURI': 'https://accounts.zoho.com/oauth/v2/token',
    '/http/auth/oauth/scopeDelimiter': ',',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/headers': [
      {
        name: 'orgId',
        value: '{{{connection.http.unencrypted.organizationId}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.organizationId': {
      id: 'http.unencrypted.organizationId',
      label: 'Organization Id',
      required: true,
      type: 'text',
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'Desk.tickets.ALL',
        'Desk.tickets.READ',
        'Desk.tickets.WRITE',
        'Desk.tickets.UPDATE',
        'Desk.tickets.CREATE',
        'Desk.tickets.DELETE',
        'Desk.contacts.READ',
        'Desk.contacts.WRITE',
        'Desk.contacts.UPDATE',
        'Desk.contacts.CREATE',
        'Desk.tasks.ALL',
        'Desk.tasks.WRITE',
        'Desk.tasks.READ',
        'Desk.tasks.CREATE',
        'Desk.tasks.UPDATE',
        'Desk.tasks.DELETE',
        'Desk.basic.READ',
        'Desk.basic.CREATE',
        'Desk.settings.ALL',
        'Desk.settings.WRITE',
        'Desk.settings.READ',
        'Desk.settings.CREATE',
        'Desk.settings.UPDATE',
        'Desk.settings.DELETE',
        'Desk.settings.READ',
        'Desk.search.READ',
      ],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.unencrypted.organizationId',
      'http.auth.oauth.scope',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
