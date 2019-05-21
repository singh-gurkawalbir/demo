export default {
  fields: [
    { fieldId: 'type' },
    { fieldId: 'name' },

    { fieldId: 'rest.mediaType' },
    { fieldId: 'rest.baseURI' },
    { fieldId: 'rest.bearerToken' },
    { fieldId: 'rest.tokenLocation' },
    { fieldId: 'rest.tokenParam' },
    { fieldId: 'rest.scopes' },
    { fieldId: 'rest.scopeDelimiter' },
    { fieldId: 'rest.refreshToken' },
    { fieldId: 'rest.oauth.tokenURI' },
    { fieldId: 'rest.disable.strictSSL' },
    { fieldId: 'rest.authType' },
    { fieldId: 'rest.authURI' },
    { fieldId: 'rest.authHeader' },
    { fieldId: 'rest.retryHeader' },
    { fieldId: 'rest.authScheme' },
    { fieldId: 'rest.headers' },
    { fieldId: 'rest.encrypted' },
    { fieldId: 'rest.encrypteds' },
    { fieldId: 'rest.unencrypted' },
    { fieldId: 'rest.unencrypteds' },
    { fieldId: 'rest.refreshTokenMethod' },
    { fieldId: 'rest.refreshTokenBody' },
    { fieldId: 'rest.refreshTokenURI' },
    { fieldId: 'rest.refreshTokenPath' },
    { fieldId: 'rest.refreshTokenMediaType' },
    { fieldId: 'rest.refreshTokenHeaders' },
    { fieldId: 'rest.info' },
    { fieldId: 'rest.pingRelativeURI' },
    { fieldId: 'rest.pingSuccessPath' },
    { fieldId: 'rest.pingSuccessValuess' },
    { fieldId: 'rest.pingFailurePath' },
    { fieldId: 'rest.pingFailureValuess' },
    { fieldId: 'rest.concurrencyLevel' },
    { fieldId: 'rest.pingMethod' },
    { fieldId: 'rest.pingBody' },
  ],
  fieldSets: [
    {
      header: 'basic.auth',
      collapsed: false,
      fields: [
        { fieldId: 'rest.basicAuth.username' },
        { fieldId: 'rest.basicAuth.password' },
      ],
    },
    {
      header: 'cookie.auth',
      collapsed: false,
      fields: [
        { fieldId: 'rest.cookieAuth.uri' },
        { fieldId: 'rest.cookieAuth.body' },
        { fieldId: 'rest.cookieAuth.method' },
        { fieldId: 'rest.cookieAuth.successStatusCode' },
      ],
    },
    {
      header: 'oauth',
      collapsed: false,
      fields: [
        { fieldId: 'rest.oauth.accessTokenPath' },
        { fieldId: 'rest.oauth.grantType' },
        { fieldId: 'rest.oauth.username' },
        { fieldId: 'rest.oauth.password' },
      ],
    },
  ],
};
