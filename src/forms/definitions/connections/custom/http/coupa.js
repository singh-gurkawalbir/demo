export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'coupa',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/users',
    '/http/baseURI': `https://${formValues['/http/coupaSubdomain']}.com/api`,
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'ACCEPT',
        value: 'application/json',
      },
    ],
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/oauth/clientCredentialsLocation': 'body',
    '/http/auth/oauth/grantType': 'clientcredentials',
    '/http/auth/oauth/tokenURI': `https://${formValues['/http/coupaSubdomain']}.com/oauth2/token`,
    '/http/auth/oauth/accessTokenBody': '{"grant_type": "client_credentials","scope":"{{{join connection.http.auth.oauth.scopeDelimiter connection.http.auth.oauth.scope}}}","client_id":"{{{clientId}}}","client_secret":"{{{clientSecret}}}"}',
    '/http/auth/oauth/accessTokenHeaders': [
      {
        name: 'Content-Type',
        value: 'application/x-www-form-urlencoded',
      },
    ],
    '/http/auth/token/refreshBody': '{"grant_type": "client_credentials","scope":"{{{join connection.http.auth.oauth.scopeDelimiter connection.http.auth.oauth.scope}}}","client_id":"{{{clientId}}}","client_secret":"{{{clientSecret}}}"}',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/token/refreshTokenPath': 'access_token',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/token/token': undefined,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.coupaSubdomain': {
      type: 'text',
      id: 'http.coupaSubdomain',
      startAdornment: 'https://',
      endAdornment: '.com',
      label: 'Subdomain',
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
            baseUri.indexOf('.com')
          );

        return subdomain;
      },
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      helpKey: 'coupa.connection.http._iClientId',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      required: true,
      scopes: [
        {
          subHeader: 'Required',
          scopes: [
            'core.user.read',
          ],
        },
        {
          subHeader: 'Optional',
          scopes: [
            'core.accounting.read',
            'core.accounting.write',
            'core.approval.read',
            'core.approval.write',
            'core.budget.read',
            'core.budget.write',
            'core.business_entity.read',
            'core.business_entity.write',
            'core.catalog.read',
            'core.catalog.write',
            'core.common.read',
            'core.common.write',
            'core.contract.read',
            'core.contract.write',
            'core.easy_form_response.approval.write',
            'core.easy_form_response.read',
            'core.easy_form_response.write',
            'core.expense.read',
            'core.expense.write',
            'core.integration.read',
            'core.integration.write',
            'core.inventory.adjustment.read',
            'core.inventory.adjustment.write',
            'core.inventory.asn.read',
            'core.inventory.asn.write',
            'core.inventory.balance.read',
            'core.inventory.common.read',
            'core.inventory.consumption.read',
            'core.inventory.consumption.write',
            'core.inventory.pick_list.read',
            'core.inventory.pick_list.write',
            'core.inventory.receiving.read',
            'core.inventory.receiving.write',
            'core.inventory.transfer.read',
            'core.inventory.transfer.write',
            'core.invoice.approval.bypass',
            'core.invoice.approval.write',
            'core.invoice.create',
            'core.invoice.delete',
            'core.invoice.read',
            'core.invoice.write',
            'core.item.read',
            'core.item.write',
            'core.object_translations.read',
            'core.object_translations.write',
            'core.order_pad.read',
            'core.order_pad.write',
            'core.pay.charges.read',
            'core.pay.charges.write',
            'core.pay.payment_accounts.read',
            'core.pay.payments.read',
            'core.pay.payments.write',
            'core.pay.statements.read',
            'core.pay.statements.write',
            'core.pay.virtual_cards.read',
            'core.pay.virtual_cards.write',
            'core.payables.expense.read',
            'core.payables.expense.write',
            'core.payables.external.read',
            'core.payables.external.write',
            'core.payables.invoice.read',
            'core.payables.invoice.write',
            'core.payables.order.read',
            'core.payables.order.write',
            'core.project.read',
            'core.project.write',
            'core.purchase_order.read',
            'core.purchase_order.write',
            'core.requisition.read',
            'core.requisition.write',
            'core.sourcing.pending_supplier.read',
            'core.sourcing.pending_supplier.write',
            'core.sourcing.read',
            'core.sourcing.response.award.write',
            'core.sourcing.response.read',
            'core.sourcing.response.write',
            'core.sourcing.write',
            'core.supplier_information_sites.read',
            'core.supplier_information_sites.write',
            'core.supplier_information_tax_registrations.delete',
            'core.supplier_information_tax_registrations.read',
            'core.supplier_information_tax_registrations.write',
            'core.supplier_sharing_settings.read',
            'core.supplier_sharing_settings.write',
            'core.supplier_sites.read',
            'core.supplier_sites.write',
            'core.supplier.read',
            'core.supplier.risk_aware.read',
            'core.supplier.risk_aware.write',
            'core.supplier.write',
            'core.uom.read',
            'core.uom.write',
            'core.user_group.read',
            'core.user_group.write',
            'core.user.write',
            'email',
            'login',
            'offline_access',
            'openid',
            'profile',
            'travel_booking.common.read',
            'travel_booking.search.write',
            'travel_booking.team.read',
            'travel_booking.team.write',
            'travel_booking.trip.read',
            'travel_booking.trip.write',
            'travel_booking.user.read',
            'travel_booking.user.write',
            'treasury.cash_management.delete',
            'treasury.cash_management.read',
            'treasury.cash_management.write',
          ],
        },
      ],
      defaultValue: r => r?.auth?.oauth?.scope || ['core.user.read'],
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.coupaSubdomain', 'http._iClientId', 'http.auth.oauth.scope'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
