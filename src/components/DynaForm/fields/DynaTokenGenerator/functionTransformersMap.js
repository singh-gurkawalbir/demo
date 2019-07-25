export default {
  pitneybowes: {
    tokenSetForFieldsFn: resp => ({
      'rest.bearerToken': resp && resp.access_token,
      'rest.siteId': resp && resp.clientID,
    }),

    formPayloadFn: form => {
      const apiKey = form[`/rest/encrypted/apiKey`];
      const apiSecret = form[`/rest/encrypted/apiSecret`];
      const base64EncodedToken = window.btoa(`${apiKey}:${apiSecret}`);

      return {
        base64EncodedToken,
        baseURI: 'https://api.pitneybowes.com/',
      };
    },
  },
};
