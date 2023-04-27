export default {
  fieldMap: {
    'rest.oauth.oauth1.consumerKey': {
      fieldId: 'rest.oauth.oauth1.consumerKey',
      visibleWhenAll: [{ field: 'rest.oauth.oauth1.signatureMethod', is: ['hmac-sha1', 'hmac-sha256', 'hmac-sha512', 'plaintext', 'rsa-sha1', 'rsa-sha256', 'rsa-sha512'] }],
    },
    'rest.oauth.oauth1.consumerSecret': {
      fieldId: 'rest.oauth.oauth1.consumerSecret',
      visibleWhenAll: [
        { field: 'rest.oauth.oauth1.signatureMethod', is: ['hmac-sha1', 'hmac-sha256', 'hmac-sha512', 'plaintext'] },
      ],
    },
    'rest.oauth.oauth1.accessToken': {
      fieldId: 'rest.oauth.oauth1.accessToken',
      visibleWhenAll: [{ field: 'rest.oauth.oauth1.signatureMethod', is: ['hmac-sha1', 'hmac-sha256', 'hmac-sha512', 'plaintext', 'rsa-sha1', 'rsa-sha256', 'rsa-sha512'] }],
    },
    'rest.oauth.oauth1.tokenSecret': {
      fieldId: 'rest.oauth.oauth1.tokenSecret',
      visibleWhenAll: [
        { field: 'rest.oauth.oauth1.signatureMethod', is: ['hmac-sha1', 'hmac-sha256', 'hmac-sha512', 'plaintext'] },
      ],
    },
    'rest.oauth.oauth1.consumerPrivateKey': {
      fieldId: 'rest.oauth.oauth1.consumerPrivateKey',
      visibleWhenAll: [
        { field: 'rest.oauth.oauth1.signatureMethod', is: ['rsa-sha1', 'rsa-sha256', 'rsa-sha512'] },
      ],
    },
    'rest.oauth.oauth1.realm': {
      fieldId: 'rest.oauth.oauth1.realm',
      visibleWhenAll: [{ field: 'rest.oauth.oauth1.signatureMethod', is: ['hmac-sha1', 'hmac-sha256', 'hmac-sha512', 'plaintext', 'rsa-sha1', 'rsa-sha256', 'rsa-sha512'] }],
    },
  },
  layout: {
    fields: [
      'rest.oauth.oauth1.consumerKey',
      'rest.oauth.oauth1.consumerSecret',
      'rest.oauth.oauth1.accessToken',
      'rest.oauth.oauth1.tokenSecret',
      'rest.oauth.oauth1.consumerPrivateKey',
      'rest.oauth.oauth1.realm',
    ],
  },
};

