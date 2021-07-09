import { isNewId } from '../../../../../utils/resource';
import { amazonSellerCentralAuthURI,
  amazonSellerCentralMarketPlaceOptions,
  amazonSellerCentralBaseUriForNonMWSConnection,
  amazonSellerCentralBaseUriForMWSConnection } from '../../../../../utils/connections';

export default {
  preSave: formValues => {
    const newValues = {...formValues};
    const baseURI = amazonSellerCentralBaseUriForNonMWSConnection[newValues['/http/unencrypted/sellingRegion']] ||
                  amazonSellerCentralBaseUriForMWSConnection[newValues['/http/unencrypted/marketplaceRegion']];

    const authURI = amazonSellerCentralAuthURI[newValues['/http/unencrypted/marketplace']];
    let authType = '';
    let mediaType = '';

    // backend not accepting empty string for iclientId. So in case iclientId is
    // not selected, sending null instead of empty string.
    const iClientId = newValues['/http/_iClientId'] || null;

    if (newValues['/http/type'] === 'Amazon-MWS') {
      newValues['/http/type'] = undefined;
      newValues['/http/_iClientId'] = iClientId;
      newValues['/http/ping/relativeURI'] = '/Sellers/2011-07-01?Action=ListMarketplaceParticipations&Version=2011-07-01';
      newValues['/http/ping/errorPath'] = '/ErrorResponse/Error/Message/text()';
      newValues['/http/ping/method'] = 'POST';
      newValues['/http/rateLimit/failStatusCode'] = 503;
      authType = 'custom';
      mediaType = 'xml';
    } else { // http.type is either SP-API or Hybrid
      newValues['/http/auth/token/refreshMediaType'] = 'urlencoded';
      newValues['/http/auth/token/refreshTokenPath'] = 'access_token';
      newValues['/http/auth/token/location'] = 'body';
      newValues['/http/auth/failStatusCode'] = 403;
      newValues['/http/auth/oauth/authURI'] = authURI;
      newValues['/http/auth/oauth/tokenURI'] = 'https://api.amazon.com/auth/o2/token';
      newValues['/http/unencrypted/marketplaceId'] = newValues['/http/unencrypted/marketplace'];
      delete newValues['/http/sellingPartnerId'];
      delete newValues['/http/unencrypted/marketplace'];
      authType = 'oauth';
      mediaType = 'json';
    }

    return {
      ...newValues,
      '/type': 'http',
      '/assistant': 'amazonmws',
      '/http/auth/type': authType,
      '/http/mediaType': mediaType,
      '/http/baseURI': baseURI,
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.sellerId': {
      id: 'http.unencrypted.sellerId',
      type: 'text',
      label: 'Seller id',
      required: true,
      helpKey: 'amazonmws.connection.http.unencrypted.sellerId',
      visibleWhenAll: [{field: 'http.type', is: ['Amazon-MWS']}],
    },
    'http.type': {
      id: 'http.type',
      label: 'API type',
      type: 'select',
      required: true,
      helpKey: 'amazonmws.connection.http.type',
      defaultValue: r => r?.http?.type || 'Amazon-MWS',
      options: [
        {
          items: [
            {
              value: 'Amazon-SP-API',
              label: 'Selling Partner API (SP-API)',
            },
            {
              value: 'Amazon-Hybrid',
              label: 'Hybrid Selling Partner API (SP-API and MWS)',
            },
            {
              value: 'Amazon-MWS',
              label: 'Marketplace Web Service API (MWS)',
            },
          ],
        },
      ],
    },
    'http.unencrypted.sellingRegion': {
      id: 'http.unencrypted.sellingRegion',
      label: 'Selling Region',
      type: 'select',
      required: true,
      visibleWhenAll: [{ field: 'http.type', is: ['Amazon-SP-API', 'Amazon-Hybrid'] }],
      defaultDisabled: r => !isNewId(r?._id) && r?.http?.type,
      options: [
        {
          items: [
            {
              value: 'northAmerica',
              label: 'North America',
            },
            {
              value: 'europe',
              label: 'Europe',
            },
            {
              value: 'farEast',
              label: 'Far East',
            },
          ],
        },
      ],
    },
    'http.unencrypted.marketplace': {
      id: 'http.unencrypted.marketplace',
      dependentFieldId: 'http.unencrypted.sellingRegion',
      optionsMap: amazonSellerCentralMarketPlaceOptions,
      type: 'dynamicselect',
      label: 'Marketplace',
      required: true,
      visibleWhenAll: [{ field: 'http.type', is: ['Amazon-SP-API', 'Amazon-Hybrid'] }],
      defaultDisabled: r => !isNewId(r?._id) && r?.http?.type,
      defaultValue: '',
    },
    'http.sellingPartnerId': {
      id: 'http.sellingPartnerId',
      type: 'text',
      label: 'Selling partner id (Read Only)',
      helpKey: 'amazonmws.connection.http.sellingPartnerId',
      defaultDisabled: true,
      visible: r => !isNewId(r?._id) && !!r?.http?.type,
      defaultValue: r => r?.http?.unencrypted?.sellerId,
    },
    'http.unencrypted.mwsAuthToken': {
      id: 'http.unencrypted.mwsAuthToken',
      type: 'text',
      label: 'MWS auth token',
      helpKey: 'amazonmws.connection.http.unencrypted.mwsAuthToken',
      required: false,
      visibleWhenAll: [{field: 'http.type', is: ['Amazon-MWS']}],
    },
    'http.unencrypted.marketplaceId': {
      id: 'http.unencrypted.marketplaceId',
      type: 'marketplaceid',
      label: 'Marketplace ID',
      skipSort: true,
      helpKey: 'amazonmws.connection.http.unencrypted.marketplaceId',
      required: true,
      visibleWhenAll: [{field: 'http.type', is: ['Amazon-MWS']}],
      options: [
        {
          items: [
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
              value: 'A1805IZSGTT6HS',
              label: 'A1805IZSGTT6HS (NL)',
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
              value: 'A2NODRKZP88ZB9',
              label: 'A2NODRKZP88ZB9 (SE)',
            },
            {
              value: 'A2VIGQ35RCS4UG',
              label: 'A2VIGQ35RCS4UG (AE)',
            },
            {
              value: 'A21TJRUUN4KGV',
              label: 'A21TJRUUN4KGV (IN)',
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
            {
              value: 'A33AVAJ2PDY3EV',
              label: 'A33AVAJ2PDY3EV (TR)',
            },
            {
              value: 'A17E79C6D8DWNP',
              label: 'A17E79C6D8DWNP (SA)',
            },
            {
              value: 'A19VAU5U5O7RUS',
              label: 'A19VAU5U5O7RUS (SG)',
            },
            {
              value: 'A1C3SOZRARQ6R3',
              label: 'A1C3SOZRARQ6R3 (PL)',
            },
          ],
        },
      ],
    },
    'http.unencrypted.marketplaceRegion': {
      id: 'http.unencrypted.marketplaceRegion',
      type: 'select',
      label: 'Marketplace region',
      helpKey: 'amazonmws.connection.http.unencrypted.marketplaceRegion',
      required: true,
      visibleWhenAll: [{field: 'http.type', is: ['Amazon-MWS']}],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          switch (baseUri) {
            case 'https://mws.amazonservices.com':
              return 'north_america';
            case 'https://mws-eu.amazonservices.com':
              return 'europe';
            case 'https://mws.amazonservices.in':
              return 'india';
            case 'https://mws.amazonservices.com.cn':
              return 'china';
            case 'https://mws.amazonservices.jp':
              return 'japan';
            case 'https://mws.amazonservices.com.au':
              return 'australia';
            default:
              return 'north_america';
          }
        }

        return '';
      },
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
      resourceType: 'iClients',
      filter: { provider: 'amazonmws' },
      label: 'IClient',
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      allowNew: true,
      allowEdit: true,
      helpKey: 'amazonmws.connection.http._iClientId',
      ignoreEnvironmentFilter: true,
      visibleWhenAll: [{field: 'http.type', is: ['Amazon-MWS']}],
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
        fields: [
          'http.type',
          'http.unencrypted.sellingRegion',
          'http.unencrypted.marketplace',
          'http.sellingPartnerId',
          'http.unencrypted.sellerId',
          'http.unencrypted.mwsAuthToken',
          'http.unencrypted.marketplaceId',
          'http.unencrypted.marketplaceRegion',
          'http._iClientId',
        ],
      },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
  actions: [
    {
      id: 'oauth',
      label: 'Save & authorize',
      visibleWhen: [
        {
          field: 'http.type',
          is: ['Amazon-SP-API', 'Amazon-Hybrid'],
        },
      ],
    },
    {
      id: 'save',
      label: 'Save',
      visibleWhen: [
        {
          field: 'http.type',
          is: ['Amazon-MWS'],
        },
        {
          field: 'http.type',
          is: [''],
        },
      ],
    },
    {
      id: 'saveandclose',
      visibleWhen: [
        {
          field: 'http.type',
          is: ['Amazon-MWS'],
        },
        {
          field: 'http.type',
          is: [''],
        },
      ],
    },
    {
      id: 'cancel',
    },
    {
      id: 'test',
      mode: 'secondary',
      visibleWhen: [
        {
          field: 'http.type',
          is: ['Amazon-MWS'],
        },
      ],
    },
  ],
};
