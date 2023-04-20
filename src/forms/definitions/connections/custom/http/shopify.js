import { SHOPIFY_BASIC_AUTH_PASSWORD_HELP_LINK, SHOPIFY_BASIC_AUTH_USERNAME_HELP_LINK, SHOPIFY_SCOPES } from '../../../../../constants';
import { isNewId } from '../../../../../utils/resource';

export default {
  preSave: (formValues, resource) => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'oauth') {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/oauth/useIClientFields'] = false;
      retValues['/http/auth/oauth/authURI'] = `https://${
        formValues['/http/storeName']
      }.myshopify.com/admin/oauth/authorize`;
      retValues['/http/auth/oauth/tokenURI'] = `https://${
        formValues['/http/storeName']
      }.myshopify.com/admin/oauth/access_token`;
      retValues['/http/auth/token/headerName'] = 'X-Shopify-Access-Token';
      retValues['/http/auth/token/scheme'] = ' ';
      retValues['/http/auth/oauth/scopeDelimiter'] = ',';
      retValues['/http/auth/basic'] = undefined;

      if (
        resource &&
        !resource._connectorId &&
        resource.http &&
        resource.http._iClientId
      ) {
        retValues['/http/_iClientId'] = undefined;
      }
    } else if (retValues['/http/auth/type'] === 'token') {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/token/headerName'] = 'X-Shopify-Access-Token';
      retValues['/http/auth/token/scheme'] = ' ';
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
      retValues['/http/auth/oauth/scopeDelimiter'] = undefined;
      retValues['/http/ping/relativeURI'] = '/orders.json';
      retValues['/http/ping/method'] = 'GET';
      retValues['/http/ping/successPath'] = '';
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
    if (
      resource &&
      resource._connectorId) {
      retValues['/http/baseURI'] = `https://${
        formValues['/http/storeName']
      }.myshopify.com`;
      retValues['/http/ping/relativeURI'] = '/admin/orders.json';

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
    } else {
      retValues['/http/ping/relativeURI'] = '/orders.json';
      retValues['/http/baseURI'] = `https://${
        formValues['/http/storeName']
      }.myshopify.com/admin/api/${formValues['/http/unencrypted/version']}`;
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
            content: '/articles/authors.json',
            themes: '/themes.json',
            products: '/products/count.json',
            customers: '/customers/count.json',
            orders: '/orders/count.json',
            script_tags: '/script_tags/count.json',
            fulfillments: '/fulfillment_services.json?scope=all',
            shipping: '/carrier_services.json',
            users: '/users.json',
          };

          retValues['/http/ping/relativeURI'] = pingURIs[scopeId];
        }
      }
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'shopify',
      '/http/mediaType': 'json',
      '/http/ping/method': 'GET',
    };
  },
  fieldMap: {
    name: {
      fieldId: 'name',
      label: 'Name your connection',
      placeholder: 'e.g., Shopify connection',
    },
    'http.auth.type': {
      id: 'http.auth.type',
      type: 'select',
      label: 'Auth type',
      required: true,
      helpKey: 'shopify.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'Basic', value: 'basic' },
            { label: 'Token', value: 'token' },
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
      defaultValue: r => {
        const authType = r && r.http && r.http.auth && r.http.auth.type;

        return authType || 'basic';
      },
    },
    'shopify.form.header.link': {
      fieldId: 'shopify.form.header',
      id: 'shopify.form.header.link',
      messageText: 'Shopify recommends creating connections directly from the Shopify App Store',
      isHeader: true,
      visible: r => isNewId(r._id),
    },
    'shopify.form.link': {
      fieldId: 'shopify.form.header',
      id: 'shopify.form.link',
      messageText: 'Shopify requires creating OAuth 2.0 connections directly from the Shopify App Store',
      visibleWhenAll: [
        {field: 'http.auth.type', is: ['oauth']},
      ],
    },
    'http.storeName': {
      id: 'http.storeName',
      type: 'shopifystorename',
      label: 'Store name',
      helpKey: 'shopify.connection.http.storeURL',
      showHelpLink: true,
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Store name should not contain spaces.',
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
      disabledWhenAll: r => {
        if (isNewId(r?._id)) {
          return [];
        }

        return [{ field: 'http.auth.type', is: ['oauth'] }];
      },
    },
    'http.unencrypted.version': {
      fieldId: 'http.unencrypted.version',
      type: 'select',
      label: 'API version',
      helpKey: 'shopify.connection.http.unencrypted.version',
      required: true,
      defaultValue: r =>
        (r && r.http && r.http.unencrypted && r.http.unencrypted.version) ||
        '2023-01',
      visible: r => !(r?._connectorId),
      options: [
        {
          items: [
            { label: '2022-07', value: '2022-07' },
            { label: '2022-10', value: '2022-10' },
            { label: '2023-01', value: '2023-01' },
          ],
        },
      ],
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'shopify.connection.http.auth.basic.username',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
      helpLink: SHOPIFY_BASIC_AUTH_USERNAME_HELP_LINK,
      deleteWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      removeWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'shopify.connection.http.auth.basic.password',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
      helpLink: SHOPIFY_BASIC_AUTH_PASSWORD_HELP_LINK,
      deleteWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      removeWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      defaultValue: '',
      label: 'Access Token',
      required: true,
      helpKey: 'shopify.connection.http.auth.token.token',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
      removeWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        {subHeader: 'Shopify scopes',
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
            'read_assigned_fulfillment_orders',
            'write_assigned_fulfillment_orders',
            'read_merchant_managed_fulfillment_orders',
            'write_merchant_managed_fulfillment_orders',
            'read_third_party_fulfillment_orders',
            'write_third_party_fulfillment_orders',
          ],
        },
        {
          subHeader: 'Shopify Plus scopes',
          scopes: [
            'read_users',
            'write_users',
            'read_gift_cards',
            'write_gift_cards',
          ]},
      ],
      visible: false,
      removeWhen: [{ field: 'http.auth.type', isNot: ['oauth'] }],
      defaultValue: r =>
        r?.http?.auth?.oauth?.scope || (r?.http?.auth?.type === 'oauth' && !r?.http?._iClientId ? SHOPIFY_SCOPES : undefined),
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['shopify.form.header.link'],
    containers: [
      {
        type: 'box',
        containers: [
          {
            type: 'indent',
            fields: [
              'name',
              'http.unencrypted.version',
              'http.storeName',
              'http.auth.type',
              'shopify.form.link',
              'http.auth.token.token',
              'http.auth.oauth.scope',
            ],
            containers: [
              {
                type: 'indent',
                fields: [
                  'http.auth.basic.username',
                  'http.auth.basic.password',
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'Advanced',
            fields: ['httpAdvanced'],
          },
        ],
      },
    ],
  },
  actions: [
    {
      id: 'shopifyoauthbuttongroup',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['oauth'],
        },
      ],
    },
    {
      id: 'saveandclosegroup',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: [''],
        },
      ],
    },
    {
      id: 'testandsavegroup',
      label: 'Test',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token', 'basic'],
        },
      ],
    },
  ],
};
