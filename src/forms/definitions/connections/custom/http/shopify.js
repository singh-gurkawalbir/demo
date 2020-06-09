export default {
  preSave: (formValues, resource) => {
    const retValues = { ...formValues };

    retValues['/http/ping/relativeURI'] = '/admin/orders.json';

    if (retValues['/http/auth/type'] === 'oauth') {
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
      delete retValues['/http/auth/basic/username'];
      delete retValues['/http/auth/basic/password'];

      retValues['/http/auth/basic'] = undefined;

      if (
        retValues['/http/auth/oauth/scope'] &&
        !!retValues['/http/auth/oauth/scope'].length
      ) {
        const scope = retValues['/http/auth/oauth/scope'].find(
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

          retValues['/http/ping/relativeURI'] = pingURIs[scopeId];
        }
      }

      if (
        resource &&
        !resource._connectorId &&
        resource.http &&
        resource.http._iClientId
      ) {
        retValues['/http/_iClientId'] = undefined;
      }
    } else {
      retValues['/http/auth/basic/username'] = `${
        formValues['/http/auth/basic/username']
      }`;
      retValues['/http/auth/basic/password'] = `${
        formValues['/http/auth/basic/password']
      }`;
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
      retValues['/http/auth/token'] = undefined;
      retValues['/http/_iClientId'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'shopify',
      '/http/mediaType': 'json',
      '/http/baseURI': `https://${formValues['/http/storeURL']}.myshopify.com`,
      '/http/ping/method': 'GET',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      id: 'http.auth.type',
      type: 'select',
      label: 'Authentication type',
      helpKey: 'shopify.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'Basic', value: 'basic' },
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
      defaultValue: r => {
        const authType = r && r.http && r.http.auth && r.http.auth.type;

        if (authType === 'oauth') {
          return 'oauth';
        }

        return 'basic';
      },
    },
    'http.storeURL': {
      id: 'http.storeURL',
      startAdornment: 'https://',
      endAdornment: '.myshopify.com',
      type: 'text',
      label: 'Store url',
      helpKey: 'shopify.connection.http.storeURL',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.myshopify.com')
          );

        return subdomain;
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API key',
      helpKey: 'shopify.connection.http.auth.basic.username',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'shopify.connection.http.auth.basic.password',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    'http.auth.oauth.scope': {
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
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.auth.type',
      'http.storeURL',
      'http.auth.basic.username',
      'http.auth.basic.password',
      'http.auth.oauth.scope',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
  actions: [
    {
      id: 'cancel',
    },
    {
      id: 'oauth',
      label: 'Save & authorize',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['oauth'],
        },
      ],
    },
    {
      id: 'test',
      label: 'Test',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['basic'],
        },
      ],
    },
    {
      id: 'save',
      label: 'Test and save',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['basic'],
        },
        {
          field: 'http.auth.type',
          is: [''],
        },
      ],
    },
  ],
};
