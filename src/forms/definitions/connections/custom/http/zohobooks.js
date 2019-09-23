export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'zohobooks',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': 'https://books.zoho.com/api/v3',
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI': 'https://accounts.zoho.com/oauth/v2/auth',
    '/http/auth/oauth/tokenURI': 'https://accounts.zoho.com/oauth/v2/token',
    '/http/auth/oauth/scopeDelimiter': ',',
    '/http/headers': [{ name: 'Accept', value: 'application/json' }],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'ZohoBooks.contacts.CREATE',
        'ZohoBooks.contacts.UPDATE',
        'ZohoBooks.contacts.READ',
        'ZohoBooks.contacts.DELETE',
        'ZohoBooks.creditnotes.CREATE',
        'ZohoBooks.creditnotes.UPDATE',
        'ZohoBooks.creditnotes.READ',
        'ZohoBooks.creditnotes.DELETE',
        'ZohoBooks.invoices.CREATE',
        'ZohoBooks.invoices.UPDATE',
        'ZohoBooks.invoices.READ',
        'ZohoBooks.invoices.DELETE',
        'ZohoBooks.salesorders.CREATE',
        'ZohoBooks.salesorders.UPDATE',
        'ZohoBooks.salesorders.READ',
        'ZohoBooks.salesorders.DELETE',
        'ZohoBooks.estimates.CREATE',
        'ZohoBooks.estimates.UPDATE',
        'ZohoBooks.estimates.READ',
        'ZohoBooks.estimates.DELETE',
        'ZohoBooks.customerpayments.CREATE',
        'ZohoBooks.customerpayments.UPDATE',
        'ZohoBooks.customerpayments.READ',
        'ZohoBooks.customerpayments.DELETE',
        'ZohoBooks.expenses.CREATE',
        'ZohoBooks.expenses.UPDATE',
        'ZohoBooks.expenses.READ',
        'ZohoBooks.expenses.DELETE',
        'ZohoBooks.purchaseorders.CREATE',
        'ZohoBooks.purchaseorders.UPDATE',
        'ZohoBooks.purchaseorders.READ',
        'ZohoBooks.purchaseorders.DELETE',
        'ZohoBooks.bills.CREATE',
        'ZohoBooks.bills.UPDATE',
        'ZohoBooks.bills.READ',
        'ZohoBooks.bills.DELETE',
        'ZohoBooks.debitnotes.CREATE',
        'ZohoBooks.debitnotes.UPDATE',
        'ZohoBooks.debitnotes.READ',
        'ZohoBooks.debitnotes.DELETE',
        'ZohoBooks.vendorpayments.CREATE',
        'ZohoBooks.vendorpayments.UPDATE',
        'ZohoBooks.vendorpayments.READ',
        'ZohoBooks.vendorpayments.DELETE',
        'ZohoBooks.banking.CREATE',
        'ZohoBooks.banking.UPDATE',
        'ZohoBooks.banking.READ',
        'ZohoBooks.banking.DELETE',
        'ZohoBooks.accountants.CREATE',
        'ZohoBooks.accountants.UPDATE',
        'ZohoBooks.accountants.READ',
        'ZohoBooks.accountants.DELETE',
        'ZohoBooks.projects.CREATE',
        'ZohoBooks.projects.UPDATE',
        'ZohoBooks.projects.READ',
        'ZohoBooks.projects.DELETE',
        'ZohoBooks.settings.CREATE',
        'ZohoBooks.settings.UPDATE',
        'ZohoBooks.settings.READ',
        'ZohoBooks.settings.DELETE',
      ],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.oauth.scope'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
