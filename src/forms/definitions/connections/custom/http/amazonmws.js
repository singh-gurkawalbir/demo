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
      label: 'Seller Id',
      helpText:
        'The account ID for the Amazon seller account you are integrating with. You do not need to include it in your relativeURI; integrator.io will automatically add it to all request parameters. If you do not know this value you can find it in the "Settings" section in Amazon Seller Central.',
      required: true,
    },
    'http.unencrypted.mwsAuthToken': {
      id: 'http.unencrypted.mwsAuthToken',
      type: 'text',
      label: 'MWS Auth Token',
      helpText: 'The MWS authorization token.',
      required: true,
    },
    'http.unencrypted.marketplaceId': {
      id: 'http.unencrypted.marketplaceId',
      type: 'select',
      label: 'Marketplace Id',
      helpText:
        'Please specify the Amazon MWS "MarketplaceId" for this connection. This value is required for specific Amzaon MWS requests to succeed. Please note that you must be registered to sell in the Amazon MWS "MarketplaceId" selected, else your Amazon MWS calls will fail.',
      required: true,
      options: [
        {
          items: [
            {
              value: 'A2EUQ1WTGCTBG2',
              label: 'A2EUQ1WTGCTBG2 (CA)',
            },
            {
              value: 'A2EUQ1WTGCTBG2',
              label: 'A2EUQ1WTGCTBG2 (CA)',
            },
            {
              value: 'A1AM78C64UM0Y8',
              label: 'A1AM78C64UM0Y8 (MX)',
            },
            {
              value: 'ATVPDKIKX0DER',
              label: 'ATVPDKIKX0DER (US)',
            },
            {
              value: 'A2Q3Y263D00KWC',
              label: 'A2Q3Y263D00KWC (BR)',
            },
            {
              value: 'A1PA6795UKMFR9',
              label: 'A1PA6795UKMFR9 (DE)',
            },
            {
              value: 'A1RKKUPIHCS9HS',
              label: 'A1RKKUPIHCS9HS (ES)',
            },
            {
              value: 'A13V1IB3VIYZZH',
              label: 'A13V1IB3VIYZZH (FR)',
            },
            {
              value: 'APJ6JRA9NG5V4',
              label: 'APJ6JRA9NG5V4 (IT)',
            },
            {
              value: 'A1F83G8C2ARO7P',
              label: 'A1F83G8C2ARO7P (UK)',
            },
            {
              value: 'A21TJRUUN4KGV',
              label: 'A21TJRUUN4KGV (IN)',
            },
            {
              value: 'A39IBJ37TRP1C6',
              label: 'A39IBJ37TRP1C6 (AU)',
            },
            {
              value: 'A1VC38T7YXB528',
              label: 'A1VC38T7YXB528 (JP)',
            },
            {
              value: 'AAHKV2X7AFYLW',
              label: 'AAHKV2X7AFYLW (CN)',
            },
            {
              value: 'A39IBJ37TRP1C6',
              label: 'A39IBJ37TRP1C6 (AU)',
            },
          ],
        },
      ],
    },
    'http.unencrypted.marketplaceRegion': {
      id: 'http.unencrypted.marketplaceRegion',
      type: 'select',
      label: 'Marketplace Region',
      helpText:
        'Please specify the Amazon MWS Region for this connection. Please note that you must be registered to sell in the Amazon MWS Region selected, else your Amazon MWS calls will fail.',
      required: true,
      options: [
        {
          items: [
            {
              value: 'north_america',
              label: 'North America',
            },
            {
              value: 'europe',
              label: 'Europe',
            },
            { value: 'india', label: 'India' },
            {
              value: 'china',
              label: 'China',
            },
            {
              value: 'japan',
              label: 'Japan',
            },
            {
              value: 'australia',
              label: 'Australia',
            },
          ],
        },
      ],
    },
    'http._iClientId': {
      id: 'http._iClientId',
      type: 'selectresource',
      resourceType: 'iClients',
      filter: { provider: 'amazonmws' },
      label: 'IClient',
      helpText:
        'Please specify the Amazon MWS "MarketplaceId" for this connection. This value is required for specific Amzaon MWS requests to succeed. Please note that you must be registered to sell in the Amazon MWS "MarketplaceId" selected, else your Amazon MWS calls will fail.',
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
