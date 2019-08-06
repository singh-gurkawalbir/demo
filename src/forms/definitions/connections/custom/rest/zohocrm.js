export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'zohobooks',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://www.zohoapis.com/crm',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://accounts.zoho.com/oauth/v2/auth',
    '/rest/oauthTokenURI': 'https://accounts.zoho.com/oauth/v2/token',
    '/rest/scopeDelimiter': ',',
    '/rest/headers': [{ name: 'Accept', value: 'application/json' }],
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.scope',
      scopes: [
        'ZohoCRM.settings.all',
        'ZohoCRM.settings.modules.ALL',
        'ZohoCRM.settings.modules.READ',
        'ZohoCRM.users.ALL',
        'ZohoCRM.users.READ',
        'ZohoCRM.settings.roles.ALL',
        'ZohoCRM.settings.roles.READ',
        'ZohoCRM.settings.profiles.ALL',
        'ZohoCRM.settings.profiles.READ',
        'ZohoCRM.settings.modules.read',
        'ZohoCRM.settings.modules.all',
        'ZohoCRM.settings.all',
        'ZohoCRM.settings.fields.read',
        'ZohoCRM.settings.fields.all',
        'ZohoCRM.settings.all',
        'ZohoCRM.settings.layouts.read',
        'ZohoCRM.settings.layouts.all',
        'ZohoCRM.settings.all',
        'ZohoCRM.settings.related_lists.read',
        'ZohoCRM.settings.related_lists.all',
        'ZohoCRM.settings.all',
        'ZohoCRM.settings.custom_views.read',
        'ZohoCRM.settings.custom_views.all',
        'ZohoCRM.settings.all',
        'ZohoCRM.org.ALL',
        'ZohoCRM.org.READ',
        'ZohoCRM.notifications.ALL',
        'ZohoCRM.notifications.READ',
        'ZohoCRM.notifications.CREATE',
        'ZohoCRM.notifications.WRITE',
        'ZohoCRM.notifications.UPDATE',
        'ZohoCRM.modules.all',
        'ZohoCRM.modules.leads.ALL',
        'ZohoCRM.modules.leads.CREATE',
        'ZohoCRM.modules.leads.UPDATE',
        'ZohoCRM.modules.leads.WRITE',
        'ZohoCRM.modules.leads.READ',
        'ZohoCRM.modules.leads.DELETE',
        'ZohoCRM.modules.accounts.ALL',
        'ZohoCRM.modules.accounts.CREATE',
        'ZohoCRM.modules.accounts.UPDATE',
        'ZohoCRM.modules.accounts.WRITE',
        'ZohoCRM.modules.accounts.READ',
        'ZohoCRM.modules.accounts.DELETE',
        'ZohoCRM.modules.contacts.ALL',
        'ZohoCRM.modules.contacts.CREATE',
        'ZohoCRM.modules.contacts.UPDATE',
        'ZohoCRM.modules.contacts.WRITE',
        'ZohoCRM.modules.contacts.READ',
        'ZohoCRM.modules.contacts.DELETE',
        'ZohoCRM.modules.deals.ALL',
        'ZohoCRM.modules.deals.CREATE',
        'ZohoCRM.modules.deals.UPDATE',
        'ZohoCRM.modules.deals.WRITE',
        'ZohoCRM.modules.deals.READ',
        'ZohoCRM.modules.deals.DELETE',
        'ZohoCRM.modules.campaigns.ALL',
        'ZohoCRM.modules.campaigns.CREATE',
        'ZohoCRM.modules.campaigns.UPDATE',
        'ZohoCRM.modules.campaigns.WRITE',
        'ZohoCRM.modules.campaigns.READ',
        'ZohoCRM.modules.campaigns.DELETE',
        'ZohoCRM.modules.tasks.ALL',
        'ZohoCRM.modules.tasks.CREATE',
        'ZohoCRM.modules.tasks.UPDATE',
        'ZohoCRM.modules.tasks.WRITE',
        'ZohoCRM.modules.tasks.READ',
        'ZohoCRM.modules.tasks.DELETE',
        'ZohoCRM.modules.cases.ALL',
        'ZohoCRM.modules.cases.CREATE',
        'ZohoCRM.modules.cases.UPDATE',
        'ZohoCRM.modules.cases.WRITE',
        'ZohoCRM.modules.cases.READ',
        'ZohoCRM.modules.cases.DELETE',
        'ZohoCRM.modules.events.ALL',
        'ZohoCRM.modules.events.CREATE',
        'ZohoCRM.modules.events.UPDATE',
        'ZohoCRM.modules.events.WRITE',
        'ZohoCRM.modules.events.READ',
        'ZohoCRM.modules.events.DELETE',
        'ZohoCRM.modules.calls.ALL',
        'ZohoCRM.modules.calls.CREATE',
        'ZohoCRM.modules.calls.UPDATE',
        'ZohoCRM.modules.calls.WRITE',
        'ZohoCRM.modules.calls.READ',
        'ZohoCRM.modules.calls.DELETE',
        'ZohoCRM.modules.solutions.ALL',
        'ZohoCRM.modules.solutions.CREATE',
        'ZohoCRM.modules.solutions.UPDATE',
        'ZohoCRM.modules.solutions.WRITE',
        'ZohoCRM.modules.solutions.READ',
        'ZohoCRM.modules.solutions.DELETE',
        'ZohoCRM.modules.products.ALL',
        'ZohoCRM.modules.products.CREATE',
        'ZohoCRM.modules.products.UPDATE',
        'ZohoCRM.modules.products.WRITE',
        'ZohoCRM.modules.products.READ',
        'ZohoCRM.modules.products.DELETE',
        'ZohoCRM.modules.vendors.ALL',
        'ZohoCRM.modules.vendors.CREATE',
        'ZohoCRM.modules.vendors.UPDATE',
        'ZohoCRM.modules.vendors.WRITE',
        'ZohoCRM.modules.vendors.READ',
        'ZohoCRM.modules.vendors.DELETE',
        'ZohoCRM.modules.pricebooks.ALL',
        'ZohoCRM.modules.pricebooks.CREATE',
        'ZohoCRM.modules.pricebooks.UPDATE',
        'ZohoCRM.modules.pricebooks.WRITE',
        'ZohoCRM.modules.pricebooks.READ',
        'ZohoCRM.modules.pricebooks.DELETE',
        'ZohoCRM.modules.quotes.ALL',
        'ZohoCRM.modules.quotes.CREATE',
        'ZohoCRM.modules.quotes.UPDATE',
        'ZohoCRM.modules.quotes.WRITE',
        'ZohoCRM.modules.quotes.READ',
        'ZohoCRM.modules.quotes.DELETE',
        'ZohoCRM.modules.salesorders.ALL',
        'ZohoCRM.modules.salesorders.CREATE',
        'ZohoCRM.modules.salesorders.UPDATE',
        'ZohoCRM.modules.salesorders.WRITE',
        'ZohoCRM.modules.salesorders.READ',
        'ZohoCRM.modules.salesorders.DELETE',
        'ZohoCRM.modules.purchaseorders.ALL',
        'ZohoCRM.modules.purchaseorders.CREATE',
        'ZohoCRM.modules.purchaseorders.UPDATE',
        'ZohoCRM.modules.purchaseorders.WRITE',
        'ZohoCRM.modules.purchaseorders.READ',
        'ZohoCRM.modules.purchaseorders.DELETE',
        'ZohoCRM.modules.invoices.ALL',
        'ZohoCRM.modules.invoices.CREATE',
        'ZohoCRM.modules.invoices.UPDATE',
        'ZohoCRM.modules.invoices.WRITE',
        'ZohoCRM.modules.invoices.READ',
        'ZohoCRM.modules.invoices.DELETE',
        'ZohoCRM.modules.notes.ALL',
        'ZohoCRM.modules.notes.CREATE',
        'ZohoCRM.modules.notes.UPDATE',
        'ZohoCRM.modules.notes.WRITE',
        'ZohoCRM.modules.notes.READ',
        'ZohoCRM.modules.notes.DELETE',
        'ZohoCRM.modules.approvals.ALL',
        'ZohoCRM.modules.approvals.CREATE',
        'ZohoCRM.modules.approvals.UPDATE',
        'ZohoCRM.modules.approvals.WRITE',
        'ZohoCRM.modules.approvals.READ',
        'ZohoCRM.modules.approvals.DELETE',
        'ZohoCRM.modules.activities.ALL',
        'ZohoCRM.modules.activities.CREATE',
        'ZohoCRM.modules.activities.UPDATE',
        'ZohoCRM.modules.activities.WRITE',
        'ZohoCRM.modules.activities.READ',
        'ZohoCRM.modules.activities.DELETE',
        'ZohoCRM.modules.activities.ALL',
        'ZohoCRM.modules.activities.CREATE',
        'ZohoCRM.modules.activities.UPDATE',
        'ZohoCRM.modules.activities.WRITE',
        'ZohoCRM.modules.activities.READ',
        'ZohoCRM.modules.activities.DELETE',
        'ZohoCRM.bulk.read',
        'ZohoCRM.modules.all',
        'ZohoCRM.modules.notes.ALL',
        'ZohoCRM.modules.notes.READ',
        'ZohoCRM.modules.notes.CREATE',
        'ZohoCRM.modules.notes.WRITE',
        'ZohoCRM.modules.notes.UPDATE',
        'ZohoCRM.modules.notes.DELETE',
      ],
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
