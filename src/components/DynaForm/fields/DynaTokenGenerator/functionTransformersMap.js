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
};
