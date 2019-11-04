export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    retValues['/rest/pingRelativeURI'] === '/admin/orders.json';

    if (retValues['/rest/authType'] === 'oauth') {
      retValues['/rest/tokenLocation'] = 'header';
      retValues['/rest/authURI'] = `https://${
        formValues['/rest/storeURL']
      }.myshopify.com/admin/oauth/authorize`;
      retValues['/rest/oauthTokenURI'] = `https://${
        formValues['/rest/storeURL']
      }.myshopify.com/admin/oauth/access_token`;
      retValues['/rest/authHeader'] = 'X-Shopify-Access-Token';
      retValues['/rest/authScheme'] = ' ';
      retValues['/rest/bearerToken'] = undefined;
      retValues['/rest/scopeDelimiter'] = ',';

      if (retValues['/rest/scope'] && !!retValues['/rest/scope'].length) {
        const scope = retValues['/rest/scope'].find(
          str => str !== 'read_analytics'
        );

        if (scope) {
          const scopeId = /^(read_|write_)(\w*)/.test(scope)
            ? /^(read_|write_)(\w*)/.exec(scope)[2]
            : '';
          const pingURIs = {
            content: '/admin/articles/authors.json',
            themes: '/admin/themes.json',
            products: '/admin/products/count.json',
            customers: '/admin/customers/count.json',
            orders: '/admin/orders/count.json',
            script_tags: '/admin/script_tags/count.json',
            fulfillments: '/admin/fulfillment_services.json?scope=all',
            shipping: '/admin/carrier_services.json',
            users: '/admin/users.json',
          };

          retValues['/rest/pingRelativeURI'] = pingURIs(scopeId);
        }
      }
    } else {
      retValues['/rest/authURI'] = undefined;
      retValues['/rest/basicAuth/username'] = `${
        formValues['/rest/basicAuth/username']
      }`;
      retValues['/rest/basicAuth/password'] = `${
        formValues['/rest/basicAuth/password']
      }`;
    }

    return {
      ...retValues,
      '/type': 'rest',
      '/assistant': 'shopify',
      '/rest/mediaType': 'json',
      '/rest/baseURI': `https://${formValues['/rest/storeURL']}.myshopify.com`,
      '/rest/pingMethod': 'GET',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.authType': {
      id: 'rest.authType',
      type: 'select',
      label: 'Authentication Type',
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
    'rest.storeURL': {
      id: 'rest.storeURL',
      startAdornment: 'https://',
      endAdornment: '.myshopify.com',
      type: 'text',
      label: 'Store URL',
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.myshopify.com')
          );

        return subdomain;
      },
      helpText:
        'Go to your Shopify store and you can find out the store name in the browser URL. For example - if your Shopify store URL is "https://demo-store.myshopify.com/"", then provide "demo-store" as the store name.',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
    },
    'rest.basicAuth.username': {
      fieldId: 'rest.basicAuth.username',
      label: 'API Key',
      helpText:
        'Login to your Shopify store and navigate to "Apps" section. Click on the respective private app and the API key can be found next to the "Authentication" section.',
      visibleWhen: [{ field: 'rest.authType', is: ['basic'] }],
    },
    'rest.basicAuth.password': {
      fieldId: 'rest.basicAuth.password',
      helpText:
        'Login to your Shopify store and navigate to "Apps" section. Click on the respective private app and the password can be found next to the "Authentication" section.',
      visibleWhen: [{ field: 'rest.authType', is: ['basic'] }],
    },
    'rest.scope': {
      fieldId: 'rest.scope',
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
      visibleWhen: [{ field: 'rest.authType', is: ['oauth'] }],
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'rest.authType',
      'rest.storeURL',
      'rest.basicAuth.username',
      'rest.basicAuth.password',
      'rest.scope',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
  actions: [
    { id: 'cancel' },
    {
      id: 'oauth',
      label: 'Save & Authorize',
      visibleWhen: [{ field: 'rest.authType', is: ['oauth'] }],
    },
    {
      id: 'test',
      label: 'Test',
      visibleWhen: [{ field: 'rest.authType', is: ['basic'] }],
    },
    {
      id: 'save',
      label: 'Test and Save',
      visibleWhen: [{ field: 'rest.authType', is: ['basic'] }],
    },
  ],
};
