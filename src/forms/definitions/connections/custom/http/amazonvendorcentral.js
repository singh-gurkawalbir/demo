import { isNewId } from '../../../../../utils/resource';
import { amazonVendorCentralAuthURI,
  amazonVendorCentralMarketPlaceOptions,
  amazonSellerCentralBaseUriForNonMWSConnection } from '../../../../../utils/connections';

export default {
  preSave: formValues => {
    const newValues = {...formValues};

    newValues['/http/baseURI'] = amazonSellerCentralBaseUriForNonMWSConnection[newValues['/http/unencrypted/sellingRegion']];
    newValues['/http/auth/token/refreshMediaType'] = 'urlencoded';
    newValues['/http/auth/token/location'] = 'body';
    newValues['/http/auth/failStatusCode'] = 403;
    newValues['/http/auth/oauth/useIClientFields'] = false;
    newValues['/http/auth/oauth/authURI'] = amazonVendorCentralAuthURI[newValues['/http/unencrypted/marketplace']];
    newValues['/http/auth/oauth/tokenURI'] = 'https://api.amazon.com/auth/o2/token';
    newValues['/http/auth/oauth/accessTokenPath'] = 'access_token';
    newValues['/http/auth/oauth/grantType'] = 'authorizecode';
    newValues['/http/unencrypted/marketplaceId'] = newValues['/http/unencrypted/marketplace'];
    delete newValues['/http/sellingPartnerId'];
    delete newValues['/http/unencrypted/marketplace'];

    return {
      ...newValues,
      '/type': 'http',
      '/assistant': 'amazonvendorcentral',
      '/http/auth/type': 'oauth',
      '/http/mediaType': 'json',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    application: {
      fieldId: 'application',
    },
    'http.type': {
      id: 'http.type',
      label: 'API type',
      type: 'select',
      required: true,
      helpKey: 'amazonvendorcentral.connection.http.type',
      defaultDisabled: true,
      defaultValue: r => r?.http?.type ? r?.http?.type : 'vendor_central',
      options: [
        {
          items: [
            {
              value: 'vendor_central',
              label: 'Selling Partner API (SP-API)',
            },
          ],
        },
      ],
    },
    'http.unencrypted.sellingRegion': {
      id: 'http.unencrypted.sellingRegion',
      label: 'Selling region',
      type: 'select',
      required: true,
      helpKey: 'amazonvendorcentral.connection.http.unencrypted.sellingRegion',
      skipSort: true,
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
      optionsMap: amazonVendorCentralMarketPlaceOptions,
      type: 'dynamicselect',
      label: 'Marketplace',
      required: true,
      helpKey: 'amazonvendorcentral.connection.http.unencrypted.marketplace',
      defaultDisabled: r => !isNewId(r?._id),
      defaultValue: r => r?.http?.unencrypted?.marketplaceId,
    },
    'http.sellingPartnerId': {
      id: 'http.sellingPartnerId',
      type: 'text',
      label: 'Selling partner id',
      helpKey: 'amazonvendorcentral.connection.http.sellingPartnerId',
      defaultDisabled: true,
      visible: r => !isNewId(r?._id),
      defaultValue: r => r?.http?.unencrypted?.sellerId,
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
          // 'http.unencrypted.marketplaceId',
        ],
      },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
  actions: [
    {
      id: 'oauthandcancel',
    },
  ],
};
