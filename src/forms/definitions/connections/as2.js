import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = formValues;

    if (newValues['/ftp/entryParser'] === '') {
      delete newValues['/ftp/entryParser'];
    }

    if (newValues['/as2/partnerStationInfo/auth/type'] === 'basic') {
      newValues['/as2/partnerStationInfo/auth/token'] = undefined;
    } else if (newValues['/as2/partnerStationInfo/auth/type'] === 'token') {
      newValues['/as2/partnerStationInfo/auth/basic'] = undefined;
    } else if (newValues['/as2/partnerStationInfo/auth/type'] === 'none') {
      delete newValues['/as2/partnerStationInfo/auth/type'];
    }

    if (
      !newValues['/as2/contentBasedFlowRouter'] ||
      !newValues['/as2/contentBasedFlowRouter']._scriptId ||
      !newValues['/as2/contentBasedFlowRouter'].function
    ) {
      newValues['/as2/contentBasedFlowRouter'] = undefined;
    }

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    as2url: { fieldId: 'as2url' },
    'as2.as2Id': { fieldId: 'as2.as2Id' },
    requiremdnspartners: { fieldId: 'requiremdnspartners' },
    requireasynchronousmdns: { fieldId: 'requireasynchronousmdns' },
    'as2.userStationInfo.mdn.mdnSigning': {
      fieldId: 'as2.userStationInfo.mdn.mdnSigning',
    },
    'as2.userStationInfo.encoding': { fieldId: 'as2.userStationInfo.encoding' },
    'as2.userStationInfo.encryptionType': {
      fieldId: 'as2.userStationInfo.encryptionType',
    },
    'as2.userStationInfo.signing': { fieldId: 'as2.userStationInfo.signing' },
    'as2.unencrypted.userPublicKey': {
      fieldId: 'as2.unencrypted.userPublicKey',
    },
    'as2.encrypted.userPrivateKey': {
      fieldId: 'as2.encrypted.userPrivateKey',
    },
    'as2.userStationInfo.ipAddresses': {
      fieldId: 'as2.userStationInfo.ipAddresses',
    },
    'as2.partnerStationInfo.as2URI': {
      fieldId: 'as2.partnerStationInfo.as2URI',
    },
    'as2.partnerId': { fieldId: 'as2.partnerId' },
    partnerrequireasynchronousmdns: {
      fieldId: 'partnerrequireasynchronousmdns',
    },
    'as2.partnerStationInfo.mdn.mdnURL': {
      fieldId: 'as2.partnerStationInfo.mdn.mdnURL',
    },
    'as2.partnerStationInfo.mdn.mdnSigning': {
      fieldId: 'as2.partnerStationInfo.mdn.mdnSigning',
    },
    'as2.partnerStationInfo.encryptionType': {
      fieldId: 'as2.partnerStationInfo.encryptionType',
    },
    'as2.partnerStationInfo.signing': {
      fieldId: 'as2.partnerStationInfo.signing',
    },
    'as2.partnerStationInfo.signatureEncoding': {
      fieldId: 'as2.partnerStationInfo.signatureEncoding',
    },
    'as2.unencrypted.partnerCertificate': {
      fieldId: 'as2.unencrypted.partnerCertificate',
    },
    'as2.partnerStationInfo.auth.type': {
      fieldId: 'as2.partnerStationInfo.auth.type',
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return '';
        const output =
          r &&
          r.as2 &&
          r.as2.partnerStationInfo &&
          r.as2.partnerStationInfo.auth &&
          r.as2.partnerStationInfo.auth.type;

        return output || 'none';
      },
    },
    'as2.partnerStationInfo.auth.failStatusCode': {
      fieldId: 'as2.partnerStationInfo.auth.failStatusCode',
    },
    'as2.partnerStationInfo.auth.failPath': {
      fieldId: 'as2.partnerStationInfo.auth.failPath',
    },
    'as2.partnerStationInfo.auth.failValues': {
      fieldId: 'as2.partnerStationInfo.auth.failValues',
    },
    'as2.partnerStationInfo.auth.basic.username': {
      fieldId: 'as2.partnerStationInfo.auth.basic.username',
    },
    'as2.partnerStationInfo.auth.basic.password': {
      fieldId: 'as2.partnerStationInfo.auth.basic.password',
    },
    'as2.partnerStationInfo.auth.token.token': {
      fieldId: 'as2.partnerStationInfo.auth.token.token',
    },
    tokenHeader: {
      id: 'tokenHeader',
      label: 'How to send token?',
      type: 'labeltitle',
      visibleWhen: [
        { field: 'as2.partnerStationInfo.auth.type', is: ['token'] },
      ],
    },
    'as2.partnerStationInfo.auth.token.location': {
      fieldId: 'as2.partnerStationInfo.auth.token.location',
    },
    'as2.partnerStationInfo.auth.token.headerName': {
      fieldId: 'as2.partnerStationInfo.auth.token.headerName',
    },
    'as2.partnerStationInfo.auth.token.scheme': {
      fieldId: 'as2.partnerStationInfo.auth.token.scheme',
    },
    'as2.partnerStationInfo.auth.token.paramName': {
      fieldId: 'as2.partnerStationInfo.auth.token.paramName',
    },
    configureTokenRefresh: {
      id: 'configureTokenRefresh',
      type: 'checkbox',
      label: 'Configure Token Refresh',
      visibleWhenAll: [
        {
          field: 'as2.partnerStationInfo.auth.type',
          is: ['token'],
        },
        {
          field: 'as2.partnerStationInfo.auth.token.location',
          isNot: [''],
        },
      ],
      defaultValue: r =>
        !!(
          r &&
          r.as2 &&
          r.as2.partnerStationInfo &&
          r.as2.partnerStationInfo.auth &&
          r.as2.partnerStationInfo.auth.token &&
          r.as2.partnerStationInfo.auth.token.refreshRelativeURI
        ),
    },
    refreshTokenHeader: {
      id: 'refreshTokenHeader',
      label: 'How to Refresh Token?',
      type: 'labeltitle',
      visibleWhen: [{ field: 'configureTokenRefresh', is: [true] }],
    },
    configureApiRateLimits: {
      id: 'configureApiRateLimits',
      type: 'checkbox',
      label: 'Configure API Rate Limits',
      defaultValue: r =>
        !!(
          r &&
          r.as2 &&
          r.as2.partnerStationInfo &&
          r.as2.partnerStationInfo.rateLimit &&
          r.as2.partnerStationInfo.auth.limit
        ),
    },
    apiRateLimits: {
      id: 'apiRateLimits',
      label: 'API Rate Limits',
      type: 'labeltitle',
      visibleWhen: [{ field: 'configureApiRateLimits', is: [true] }],
    },
    'as2.partnerStationInfo.auth.token.refreshToken': {
      fieldId: 'as2.partnerStationInfo.auth.token.refreshToken',
    },
    'as2.partnerStationInfo.auth.token.refreshRelativeURI': {
      fieldId: 'as2.partnerStationInfo.auth.token.refreshRelativeURI',
    },
    'as2.partnerStationInfo.auth.token.refreshMediaType': {
      fieldId: 'as2.partnerStationInfo.auth.token.refreshMediaType',
    },
    'as2.partnerStationInfo.auth.token.refreshMethod': {
      fieldId: 'as2.partnerStationInfo.auth.token.refreshMethod',
    },
    'as2.partnerStationInfo.auth.token.refreshBody': {
      fieldId: 'as2.partnerStationInfo.auth.token.refreshBody',
    },
    'as2.partnerStationInfo.auth.token.refreshTokenPath': {
      fieldId: 'as2.partnerStationInfo.auth.token.refreshTokenPath',
    },
    'as2.partnerStationInfo.auth.token.refreshHeaders': {
      fieldId: 'as2.partnerStationInfo.auth.token.refreshHeaders',
    },
    'as2.partnerStationInfo.rateLimit.limit': {
      fieldId: 'as2.partnerStationInfo.rateLimit.limit',
    },
    'as2.partnerStationInfo.rateLimit.failStatusCode': {
      fieldId: 'as2.partnerStationInfo.rateLimit.failStatusCode',
    },
    'as2.partnerStationInfo.rateLimit.failPath': {
      fieldId: 'as2.partnerStationInfo.rateLimit.failPath',
    },
    'as2.partnerStationInfo.rateLimit.failValues': {
      fieldId: 'as2.partnerStationInfo.rateLimit.failValues',
    },
    'as2.partnerStationInfo.encoding': {
      fieldId: 'as2.partnerStationInfo.encoding',
    },
    'as2.contentBasedFlowRouter': {
      fieldId: 'as2.contentBasedFlowRouter',
    },
    'as2.concurrencyLevel': { fieldId: 'as2.concurrencyLevel' },
    'as2.preventCanonicalization': { fieldId: 'as2.preventCanonicalization' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'My AS2 Station Configuration',
        fields: [
          'as2url',
          'as2.as2Id',
          'requiremdnspartners',
          'requireasynchronousmdns',
          'as2.userStationInfo.mdn.mdnSigning',
          'as2.userStationInfo.encryptionType',
          'as2.userStationInfo.signing',
          'as2.userStationInfo.encoding',
          'as2.unencrypted.userPublicKey',
          'as2.encrypted.userPrivateKey',
          'as2.userStationInfo.ipAddresses',
        ],
      },
      {
        collapsed: true,
        label: 'Partner AS2 Station Configuration',
        fields: [
          'as2.partnerStationInfo.as2URI',
          'as2.partnerId',
          'partnerrequireasynchronousmdns',
          'as2.partnerStationInfo.mdn.mdnURL',
          'as2.partnerStationInfo.mdn.mdnSigning',
          'as2.partnerStationInfo.encryptionType',
          'as2.partnerStationInfo.signing',
          'as2.partnerStationInfo.encoding',
          'as2.partnerStationInfo.signatureEncoding',
          'as2.unencrypted.partnerCertificate',
        ],
      },
      {
        collapsed: true,
        label: 'Authentication',
        fields: [
          'as2.partnerStationInfo.auth.type',
          'as2.partnerStationInfo.auth.failStatusCode',
          'as2.partnerStationInfo.auth.failPath',
          'as2.partnerStationInfo.auth.failValues',
          'as2.partnerStationInfo.auth.basic.username',
          'as2.partnerStationInfo.auth.basic.password',
          'as2.partnerStationInfo.auth.token.token',
          'tokenHeader',
          'as2.partnerStationInfo.auth.token.location',
          'as2.partnerStationInfo.auth.token.headerName',
          'as2.partnerStationInfo.auth.token.scheme',
          'as2.partnerStationInfo.auth.token.paramName',
          'configureTokenRefresh',
          'configureApiRateLimits',
          'refreshTokenHeader',
          'as2.partnerStationInfo.auth.token.refreshToken',
          'as2.partnerStationInfo.auth.token.refreshRelativeURI',
          'as2.partnerStationInfo.auth.token.refreshMediaType',
          'as2.partnerStationInfo.auth.token.refreshMethod',
          'as2.partnerStationInfo.auth.token.refreshBody',
          'as2.partnerStationInfo.auth.token.refreshTokenPath',
          'as2.partnerStationInfo.auth.token.refreshHeaders',
          'apiRateLimits',
          'as2.partnerStationInfo.rateLimit.limit',
          'as2.partnerStationInfo.rateLimit.failStatusCode',
          'as2.partnerStationInfo.rateLimit.failPath',
          'as2.partnerStationInfo.rateLimit.failValues',
        ],
      },
      {
        collapsed: true,
        label: 'Routing Rules',
        fields: ['as2.contentBasedFlowRouter'],
      },
      {
        collapsed: true,
        label: 'Advanced Settings',
        fields: ['as2.preventCanonicalization', 'as2.concurrencyLevel'],
      },
    ],
  },
};
