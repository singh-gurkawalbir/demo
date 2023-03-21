export default {
  fieldMap: {
    'http.auth.oauth.oauth1.consumerKey': {
      fieldId: 'http.auth.oauth.oauth1.consumerKey',
      visibleWhenAll: [{ field: 'http.auth.oauth.oauth1.signatureMethod', is: ['hmac-sha1', 'hmac-sha256', 'hmac-sha512', 'plaintext', 'rsa-sha1', 'rsa-sha256', 'rsa-sha512'] }],
    },
    'http.auth.oauth.oauth1.consumerSecret': {
      fieldId: 'http.auth.oauth.oauth1.consumerSecret',
      visibleWhenAll: [
        { field: 'http.auth.oauth.oauth1.signatureMethod', is: ['hmac-sha1', 'hmac-sha256', 'hmac-sha512', 'plaintext'] },
      ],
    },
    'http.auth.oauth.oauth1.accessToken': {
      fieldId: 'http.auth.oauth.oauth1.accessToken',
      visibleWhenAll: [{ field: 'http.auth.oauth.oauth1.signatureMethod', is: ['hmac-sha1', 'hmac-sha256', 'hmac-sha512', 'plaintext', 'rsa-sha1', 'rsa-sha256', 'rsa-sha512'] }],
    },
    'http.auth.oauth.oauth1.tokenSecret': {
      fieldId: 'http.auth.oauth.oauth1.tokenSecret',
      visibleWhenAll: [
        { field: 'http.auth.oauth.oauth1.signatureMethod', is: ['hmac-sha1', 'hmac-sha256', 'hmac-sha512', 'plaintext'] },
      ],
    },
    'http.auth.oauth.oauth1.consumerPrivateKey': {
      fieldId: 'http.auth.oauth.oauth1.consumerPrivateKey',
      visibleWhenAll: [
        { field: 'http.auth.oauth.oauth1.signatureMethod', is: ['rsa-sha1', 'rsa-sha256', 'rsa-sha512'] },
      ],
    },
    'http.auth.oauth.oauth1.realm': {
      fieldId: 'http.auth.oauth.oauth1.realm',
      visibleWhenAll: [{ field: 'http.auth.oauth.oauth1.signatureMethod', is: ['hmac-sha1', 'hmac-sha256', 'hmac-sha512', 'plaintext', 'rsa-sha1', 'rsa-sha256', 'rsa-sha512'] }],
    },
  },
  layout: {
    fields: [
      'http.auth.oauth.oauth1.consumerKey',
      'http.auth.oauth.oauth1.consumerSecret',
      'http.auth.oauth.oauth1.accessToken',
      'http.auth.oauth.oauth1.tokenSecret',
      'http.auth.oauth.oauth1.consumerPrivateKey',
      'http.auth.oauth.oauth1.realm',
    ],
  },
};

