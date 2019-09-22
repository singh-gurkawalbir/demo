export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'zohomail',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://mail.zoho.com/api',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://accounts.zoho.com/oauth/v2/auth',
    '/rest/oauthTokenURI': 'https://accounts.zoho.com/oauth/v2/token',
    '/rest/scopeDelimiter': ',',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.scope': {
      fieldId: 'rest.scope',
      scopes: [
        'VirtualOffice.accounts.READ',
        'VirtualOffice.accounts.UPDATE',
        'VirtualOffice.partner.organization.READ',
        'VirtualOffice.partner.organization.UPDATE',
        'VirtualOffice.organization.subscriptions.READ',
        'VirtualOffice.organization.subscriptions.UPDATE',
        'VirtualOffice.organization.spam.READ',
        'VirtualOffice.organization.accounts.READ',
        'VirtualOffice.organization.accounts.CREATE',
        'VirtualOffice.organization.accounts.UPDATE',
        'VirtualOffice.messages.CREATE',
        'VirtualOffice.messages.READ',
        'VirtualOffice.messages.UPDATE',
        'VirtualOffice.messages.DELETE',
        'VirtualOffice.attachments.CREATE',
        'VirtualOffice.attachments.READ',
        'VirtualOffice.attachments.UPDATE',
        'VirtualOffice.attachments.DELETE',
        'VirtualOffice.organization.groups.CREATE',
        'VirtualOffice.organization.groups.READ',
        'VirtualOffice.organization.groups.UPDATE',
        'VirtualOffice.organization.groups.DELETE',
        'VirtualOffice.tags.CREATE',
        'VirtualOffice.tags.READ',
        'VirtualOffice.tags.UPDATE',
        'VirtualOffice.tags.DELETE',
        'VirtualOffice.folders.CREATE',
        'VirtualOffice.folders.READ',
        'VirtualOffice.folders.UPDATE',
        'VirtualOffice.folders.DELETE',
        'VirtualOffice.organization.domains.CREATE',
        'VirtualOffice.organization.domains.READ',
        'VirtualOffice.organization.domains.UPDATE',
        'VirtualOffice.organization.domains.DELETE',
      ],
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.scope'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
