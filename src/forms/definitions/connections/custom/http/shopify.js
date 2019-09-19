export default {
  preSubmit: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/authType'] === 'oauth') {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/oauth/authURI'] = `https://${
        formValues['/http/storeURL']
      }.myshopify.com/admin/oauth/authorize`;
      retValues['/http/auth/oauth/tokenURI'] = `https://${
        formValues['/http/storeURL']
      }.myshopify.com/admin/oauth/access_token`;
      retValues['/http/auth/token/headerName'] = 'X-Shopify-Access-Token';
      retValues['/http/auth/token/scheme'] = ' ';
      retValues['/http/auth/token/token'] = undefined;
      retValues['/http/auth/oauth/scopeDelimiter'] = ',';
    } else {
      retValues['/http/auth/basic/username'] = `${
        formValues['/http/auth/basic/username']
      }`;
      retValues['/http/auth/basic/password'] = `${
        formValues['/http/auth/basic/password']
      }`;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'shopify',
      '/http/auth/type': `${formValues['/http/authType']}`,
      '/http/mediaType': 'json',
      '/http/baseURI': `https://${formValues['/http/storeURL']}.myshopify.com`,
      '/http/ping/relativeURI': '/admin/articles/authors.json',
      '/http/ping/method': 'GET',
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.authType',
      type: 'select',
      label: 'Authentication Type',
      defaultValue: 'oauth',
      options: [
        {
          items: [
            { label: 'Basic', value: 'basic' },
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
      helpText:
        'Integrator.io supports the following authentication types: Basic: Select Basic if your service implements the HTTP basic authentication strategy. This authentication method adds a Base64 encoded username and password values in the "authentication" HTTP request header.Cookie: Select Cookie if your service relies on session-based authentication. Session based authentication is typically implemented by including a unique cookie into the HTTP request header. By selecting this option, the platform will automatically create and insert this cookie into every HTTP request it sends to your application.Custom: Select Custom for all other types. If you select the Custom authentication method, integrator.io will not perform any special authentication. It is up to the user to configure the HTTP request fields (method, relativeUri, headers, and body) of the import and export models to include {{placeholders}} for any authentication related values. These values can be stored in Encrypted and Unencrypted fields of this connection.Token: Select Token if your service relies on token-based authentication. The token may exist in the header, URL, or body of the HTTP request. This method also supports refreshing tokens if the service being called supports it. OAuth 2.0: Select this value if your application supports the OAuth 2.0 authentication.',
    },
    {
      id: 'http.storeURL',
      startAdornment: 'https://',
      endAdornment: '.myshopify.com',
      type: 'text',
      label: 'Store URL',
      helpText:
        'Go to your Shopify store and you can find out the store name in the browser URL. For example - if your Shopify store URL is "https://demo-store.myshopify.com/"", then provide "demo-store" as the store name.',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
    },
    {
      fieldId: 'http.auth.basic.username',
      label: 'API Key',
      helpText:
        'Login to your Shopify store and navigate to "Apps" section. Click on the respective private app and the API key can be found next to the "Authentication" section.',
      visibleWhen: [
        {
          field: 'http.authType',
          is: ['basic'],
        },
      ],
    },
    {
      fieldId: 'http.auth.basic.password',
      helpText:
        'Login to your Shopify store and navigate to "Apps" section. Click on the respective private app and the password can be found next to the "Authentication" section.',
      visibleWhen: [
        {
          field: 'http.authType',
          is: ['basic'],
        },
      ],
    },
    {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'read_content',
        'write_content',
        'read_themes',
        'write_themes',
        'read_products',
        'write_products',
        'read_product_listings',
        'read_customers',
        'write_customers',
        'read_orders',
        'write_orders',
        'read_all_orders',
        'read_draft_orders',
        'write_draft_orders',
        'read_inventory',
        'write_inventory',
        'read_locations',
        'read_script_tags',
        'write_script_tags',
        'read_fulfillments',
        'write_fulfillments',
        'read_shipping',
        'write_shipping',
        'read_analytics',
        'read_users',
        'write_users',
        'read_checkouts',
        'write_checkouts',
        'read_reports',
        'write_reports',
        'read_price_rules',
        'write_price_rules',
        'read_marketing_events',
        'write_marketing_events',
        'read_resource_feedbacks',
        'write_resource_feedbacks',
        'read_shopify_payments_payouts',
        'unauthenticated_read_product_listings',
        'unauthenticated_write_checkouts',
        'unauthenticated_write_customers',
        'unauthenticated_read_content',
      ],
      visibleWhen: [
        {
          field: 'http.authType',
          is: ['oauth'],
        },
      ],
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
  actions: [
    {
      id: 'oauth',
      label: 'Save & Authorize',
      visibleWhen: [
        {
          field: 'http.authType',
          is: ['oauth'],
        },
      ],
    },
    {
      id: 'test',
      label: 'Test',
      visibleWhen: [
        {
          field: 'http.authType',
          is: ['basic'],
        },
      ],
    },
    {
      id: 'save',
      label: 'Test and Save',
      visibleWhen: [
        {
          field: 'http.authType',
          is: ['basic'],
        },
      ],
    },
  ],
};
