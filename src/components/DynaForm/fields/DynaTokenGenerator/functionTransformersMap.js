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
      'rest.bearerToken': resp && resp.access_token,
    }),

    payloadTransformer: form => {
      const apiKey = form[`/rest/unencrypted/apiKey`];
      const apiSecret = form[`/rest/encrypted/apiSecret`];
      const base64EncodedToken = window.btoa(`${apiKey}:${apiSecret}`);

      return {
        base64EncodedToken,
        baseURI: 'https://api.pitneybowes.com/',
      };
    },
  },
  onelogin: {
    responseParser: resp => ({
      'http.auth.token.token': resp && resp.access_token,
      'http.auth.token.refreshToken': resp && resp.refresh_token,
    }),

    payloadTransformer: form => ({
      oneloginRegion: form[`/http/oneloginRegion`],
      clientId: form[`/http/unencrypted/apiKey`],
      clientSecret: form[`/http/encrypted/apiSecret`],
    }),
  },
  magento: {
    responseParser: resp => ({
      'http.auth.token.token': resp,
    }),

    payloadTransformer: form => ({
      baseURI: form[`/http/baseURI`],
      username: form[`/http/unencrypted/username`],
      password: form[`/http/encrypted/password`],
    }),
  },
  bronto: {
    responseParser: resp => ({
      'http.auth.token.token': resp && resp.access_token,
      'http.auth.token.refreshToken': resp && resp.refresh_token,
    }),

    payloadTransformer: form => ({
      clientId: form[`/http/unencrypted/clientId`],
      clientSecret: form[`/http/encrypted/clientSecret`],
    }),
  },
  dunandbradstreet: {
    responseParser: resp => ({
      'http.auth.token.token':
        resp && resp.AuthenticationDetail && resp.AuthenticationDetail.Token,
    }),

    payloadTransformer: form => ({
      username: form[`/http/unencrypted/username`],
      password: form[`/http/encrypted/password`],
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
      body: `{"grant_type":"${
        form['/http/unencrypted/grantType']
      }","client_id":"${form['/http/unencrypted/clientID']}","client_secret":"${
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
      subscriptionKey: form[`/http/encrypted/subscriptionKey`],
      applicationKey: form[`/http/unencrypted/applicationKey`],
    }),
  },
};
