/*
This file consists of assistant specific definitions
 which are essential for the token generation functionality.
Each assistant encompasses of two functions the responseParser
 and payloadTransformer that have to be implemented.

payloadTransformer: This function is intended to fabricate the request
 payload for the generate token call from the from values.
 The returned object would be the actual request payload.

responseParser: This function is intended to map the
  response of the generate token call to field values.
  The returned object should have fieldIds and the
  corresponding values those fields should take.


*/
export default {
  pitneybowes: {
    responseParser: resp => ({
      'http.auth.token.token': resp && resp.access_token,
    }),

    payloadTransformer: form => {
      const apiKey = form['/http/unencrypted/apiKey'];
      const apiSecret = form['/http/encrypted/apiSecret'];
      const base64EncodedToken = window.btoa(`${apiKey}:${apiSecret}`);
      const baseURI = `https://api${
        form['/http/sandbox'] === 'true' ? '-sandbox' : ''
      }.pitneybowes.com/`;

      return {
        base64EncodedToken,
        baseURI,
      };
    },
  },
  concurexpense: {
    responseParser: resp => {
      const refreshTokenExpiresAt = new Date();
      refreshTokenExpiresAt.setMilliseconds(resp && resp.refresh_expires_in);
      return { 'http.auth.token.token': resp && resp.access_token,
        'http.auth.token.refreshToken': resp && resp.refresh_token,
        'http.baseURI': resp && resp.geolocation,
        'http.unencrypted.edition': resp && resp.edition,
        'http.unencrypted.refreshTokenExpiresAt': refreshTokenExpiresAt && refreshTokenExpiresAt.toISOString(),
      };
    },
    payloadTransformer: form => ({
      username: form['/http/auth/oauth/username'],
      password: form['/http/auth/oauth/password'],
    }),
  },
  paypal: {
    responseParser: resp => ({
      'http.auth.token.token': resp && resp.access_token,
    }),

    payloadTransformer: form => {
      const clientId = form['/http/unencrypted/clientId'];
      const clientSecret = form['/http/encrypted/clientSecret'];
      const base64EncodedToken = window.btoa(`${clientId}:${clientSecret}`);
      const baseURI = `https://api${
        form['/http/accountType'] === 'sandbox' ? '.sandbox' : ''
      }.paypal.com`;

      return {
        base64EncodedToken,
        baseURI,
      };
    },
  },
  onelogin: {
    responseParser: resp => ({
      'http.auth.token.token': resp && resp.access_token,
      'http.auth.token.refreshToken': resp && resp.refresh_token,
    }),

    payloadTransformer: form => ({
      oneloginRegion: form['/http/oneloginRegion'],
      clientId: form['/http/unencrypted/apiKey'],
      clientSecret: form['/http/encrypted/apiSecret'],
    }),
  },
  tableau: {
    responseParser: resp => ({
      'http.unencrypted.siteId': resp && resp.credentials.site.id,
      'http.auth.token.token': resp && resp.credentials.token,
    }),

    payloadTransformer: form => ({
      username: form['/http/auth/basic/username'],
      password: form['/http/auth/basic/password'],
      baseURI: `https://${form['/http/myServer']}.online.tableau.com/api`,
      contentUrl: form['/http/unencrypted/contentUrl'],
    }),
  },
  magento: {
    responseParser: resp => ({
      'http.auth.token.token': resp,
    }),

    payloadTransformer: form => ({
      baseURI: form['/http/baseURI'],
      username: form['/http/unencrypted/username'],
      password: form['/http/encrypted/password'],
    }),
  },
  bronto: {
    responseParser: resp => ({
      'http.auth.token.token': resp && resp.access_token,
      'http.auth.token.refreshToken': resp && resp.refresh_token,
    }),

    payloadTransformer: form => ({
      clientId: form['/http/unencrypted/clientId'],
      clientSecret: form['/http/encrypted/clientSecret'],
    }),
  },
  dunandbradstreet: {
    responseParser: resp => ({
      'http.auth.token.token':
        resp && resp.AuthenticationDetail && resp.AuthenticationDetail.Token,
    }),

    payloadTransformer: form => ({
      username: form['/http/unencrypted/username'],
      password: form['/http/encrypted/password'],
    }),
  },
  sugarcrm: {
    responseParser: resp => ({
      'http.auth.token.token': resp && resp.access_token,
    }),

    payloadTransformer: form => ({
      baseURI: `https://${form['/sugarcrmSubdomain']}/rest/${
        form['/http/unencrypted/version']
      }`,
      body: `{"grant_type":"password","client_id":"${
        form['/http/unencrypted/clientID']
      }","client_secret":"${
        form['/http/encrypted/clientSecret']
      }","username":"${form['/http/unencrypted/username']}","password":"${
        form['/http/encrypted/password']
      }","platform":"${form['/http/unencrypted/platform']}"}`,
    }),
  },
  grms: {
    responseParser: resp => ({
      'http.auth.token.token': resp && resp.TransactionID,
    }),

    payloadTransformer: form => ({
      objData: {
        unencrypted: { apiKey: form['/http/unencrypted/apiKey'] },
        encrypted: { apiSecret: form['/http/encrypted/apiSecret'] },
      },
    }),
  },
  strata: {
    responseParser: resp => ({
      'http.auth.token.token': resp && resp.token,
    }),
    // subscriptionKey: objData.encrypted && objData.encrypted.subscriptionKey, applicationKey: objData.unencrypted && objData.unencrypted.applicationKey
    payloadTransformer: form => ({
      subscriptionKey: form['/http/encrypted/subscriptionKey'],
      applicationKey: form['/http/unencrypted/applicationKey'],
    }),
  },
  procurifyauthenticate: {
    responseParser: resp => ({
      'http.unencrypted.clientId': resp && resp.data.client_id,
      'http.encrypted.clientSecret': resp && resp.data.client_secret,
    }),
    payloadTransformer: form => ({
      baseURI: `https://${form['/http/procurifySubdomain']}.procurify.com/api`,
      base64EncodedToken: window.btoa(
        `${form['/http/unencrypted/username']}:${
          form['/http/encrypted/password']
        }`
      ),
    }),
  },

  procurify: {
    responseParser: resp => ({
      'http.auth.token.token': resp && resp.access_token,
    }),
    payloadTransformer: form => ({
      clientId: form['/http/unencrypted/clientId'],
      clientSecret: form['/http/encrypted/clientSecret'],
      username: form['/http/unencrypted/username'],
      password: form['/http/encrypted/password'],
      baseURI: `https://${form['/http/procurifySubdomain']}.procurify.com/api`,
    }),
  },
  logisense: {
    responseParser: resp => ({
      'http.auth.token.token': resp && resp.access_token,
    }),

    payloadTransformer: form => ({
      baseURI: `https://${form['/storeURL']}`,
      strictSSL: !(form['/environment'] === 'sandbox'),
      body: `{"username":"${form['/http/unencrypted/username']}","password":"${
        form['/http/encrypted/password']
      }","grant_type":"password","client_id":"${
        form['/http/encrypted/clientId']
      }"}`,
    }),
  },
};
