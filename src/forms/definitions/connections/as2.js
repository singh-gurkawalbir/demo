export default {
  preSubmit: formValues => {
    const newValues = formValues;

    if (newValues['/ftp/entryParser'] === '') {
      delete newValues['/ftp/entryParser'];
    }

    return newValues;
  },

  fields: [{ fieldId: 'type' }, { fieldId: 'name' }],
  fieldSets: [
    {
      header: 'My AS2 Station Configuration',
      collapsed: true,
      fields: [
        { fieldId: 'as2url' },
        { fieldId: 'as2.as2Id' },
        { fieldId: 'requiremdnspartners' },
        { fieldId: 'requireasynchronousmdns' },
        { fieldId: 'as2.userStationInfo.mdn.mdnSigning' },
        { fieldId: 'as2.userStationInfo.encoding' },
        { fieldId: 'as2.userStationInfo.encryptionType' },
        { fieldId: 'as2.userStationInfo.signing' },
        { fieldId: 'as2.unencrypted.userPublicKey' },
        { fieldId: 'as2.userStationInfo.encrypted.userPrivateKey' },
        { fieldId: 'as2.userStationInfo.ipAddresses' },
      ],
    },
    {
      header: 'Partner AS2 Station Configuration',
      collapsed: true,
      fields: [
        { fieldId: 'as2.partnerStationInfo.as2URI' },
        { fieldId: 'as2.partnerId' },
        { fieldId: 'partnerrequireasynchronousmdns' },
        { fieldId: 'as2.partnerStationInfo.mdn.mdnURL' },
        { fieldId: 'as2.partnerStationInfo.mdn.mdnSigning' },
        { fieldId: 'as2.partnerStationInfo.encryptionType' },
        { fieldId: 'as2.partnerStationInfo.signing' },
        { fieldId: 'as2.partnerStationInfo.signatureEncoding' },
        { fieldId: 'as2.unencrypted.partnerCertificate' },
      ],
    },
    {
      header: 'Authentication',
      collapsed: true,
      fields: [
        { fieldId: 'as2.partnerStationInfo.auth.type' },
        { fieldId: 'as2.partnerStationInfo.auth.failStatusCode' },
        { fieldId: 'as2.partnerStationInfo.auth.failPath' },
        { fieldId: 'as2.partnerStationInfo.auth.failValues' },
        { fieldId: 'as2.partnerStationInfo.auth.basic.username' },
        { fieldId: 'as2.partnerStationInfo.auth.basic.password' },
        { fieldId: 'as2.partnerStationInfo.auth.token.token' },
        {
          id: 'tokenHeader',
          label: 'How to send token?',
          type: 'labeltitle',
          visibleWhen: [
            {
              field: 'as2.partnerStationInfo.auth.type',
              is: ['token'],
            },
          ],
        },
        { fieldId: 'as2.partnerStationInfo.auth.token.location' },
        { fieldId: 'as2.partnerStationInfo.auth.token.headerName' },
        { fieldId: 'as2.partnerStationInfo.auth.token.scheme' },
        { fieldId: 'as2.partnerStationInfo.auth.token.paramName' },
        { fieldId: 'configureTokenRefresh' },
        {
          id: 'refreshTokenHeader',
          label: 'How to Refresh Token?',
          type: 'labeltitle',
          visibleWhen: [
            {
              field: 'configureTokenRefresh',
              is: [true],
            },
          ],
        },
        { fieldId: 'as2.partnerStationInfo.auth.token.refreshToken' },
        { fieldId: 'as2.partnerStationInfo.auth.token.refreshRelativeURI' },
        { fieldId: 'as2.partnerStationInfo.auth.token.refreshMediaType' },
        { fieldId: 'as2.partnerStationInfo.auth.token.refreshMethod' },
        { fieldId: 'as2.partnerStationInfo.auth.token.refreshBody' },
        { fieldId: 'as2.partnerStationInfo.auth.token.refreshTokenPath' },
        { fieldId: 'as2.partnerStationInfo.auth.token.refreshHeaders' },
      ],
    },
    {
      header: 'API Rate Limits',
      collapsed: true,
      fields: [
        { fieldId: 'as2.partnerStationInfo.rateLimit.limit' },
        { fieldId: 'as2.partnerStationInfo.rateLimit.failStatusCode' },
        { fieldId: 'as2.partnerStationInfo.rateLimit.failPath' },
        { fieldId: 'as2.partnerStationInfo.rateLimit.failValues' },
      ],
    },
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ fieldId: 'http.concurrencyLevel' }],
    },
  ],
};
