export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'amazonmws',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'xml',
    '/http/baseURI': 'https://mws.amazonservices.com/',
    '/http/ping/relativeURI':
      '/Sellers/2011-07-01?Action=ListMarketplaceParticipations&Version=2011-07-01',
    '/http/ping/errorPath': '/ErrorResponse/Error/Message/text()',
    '/http/ping/method': 'POST',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.sellerId': {
      id: 'http.unencrypted.sellerId',
      type: 'text',
      label: 'Seller Id:',
      helpText:
        'The account ID for the Amazon seller account you are integrating with. You do not need to include it in your relativeURI; integrator.io will automatically add it to all request parameters. If you do not know this value you can find it in the "Settings" section in Amazon Seller Central.',
      required: true,
    },
    'http.unencrypted.mwsAuthToken': {
      id: 'http.unencrypted.mwsAuthToken',
      type: 'text',
      label: 'MWS Auth Token:',
      helpText: 'The MWS authorization token.',
      required: false,
    },
    'http.unencrypted.marketplaceId': {
      id: 'http.unencrypted.marketplaceId',
      type: 'select',
      label: 'Marketplace Id:',
      options: [
        { items: [{ label: 'ATVPDKIKX0DER (US)', value: 'ATVPDKIKX0DER' }] },
      ],
      helpText:
        'Please specify the Amazon MWS "MarketplaceId" for this connection. This value is required for specific Amzaon MWS requests to succeed. Please note that you must be registered to sell in the Amazon MWS "MarketplaceId" selected, else your Amazon MWS calls will fail.',
      required: true,
    },
    'http.unencrypted.marketplaceRegion': {
      id: 'http.unencrypted.marketplaceRegion',
      type: 'select',
      label: 'Marketplace Region:',
      options: [
        { items: [{ label: 'North America', value: 'north_america' }] },
      ],
      helpText:
        'Please specify the Amazon MWS Region for this connection. Please note that you must be registered to sell in the Amazon MWS Region selected, else your Amazon MWS calls will fail.',
      required: true,
    },
    'http._iClientId': {
      id: 'http._iClientId',
      type: 'text',
      label: 'MIClient:',
      helpText:
        'Please specify the Amazon MWS "MarketplaceId" for this connection. This value is required for specific Amzaon MWS requests to succeed. Please note that you must be registered to sell in the Amazon MWS "MarketplaceId" selected, else your Amazon MWS calls will fail.',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.unencrypted.sellerId',
      'http.unencrypted.mwsAuthToken',
      'http.unencrypted.marketplaceId',
      'http.unencrypted.marketplaceRegion',
      'http._iClientId',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
