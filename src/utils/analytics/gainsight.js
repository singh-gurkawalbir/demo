/* global aptrinsic */
export function initialize({ tagKey }) {
  try {
    /* eslint-disable */
    (function(n, t, a, e) {
      const i = 'aptrinsic';

      (n[i] =
        n[i] ||
        function() {
          (n[i].q = n[i].q || []).push(arguments);
        }),
        (n[i].p = e);
      const r = t.createElement('script');

      (r.async = !0), (r.src = `${a}?a=${e}`);
      const c = t.getElementsByTagName('script')[0];

      c.parentNode.insertBefore(r, c);
    })(
      window,
      document,
      'https://web-sdk.aptrinsic.com/api/aptrinsic.js',
      tagKey,
      {
        filterUrls: [
          '*/change-email/*',
          '*/reset-password/*',
          '*/set-initial-password/*',
          '*/accept-invite/*',
        ],
        filterType: 'mask',
      }
    );
    /* eslint-enable */
  } catch (ex) {
    // We can't do anything here, just a safe check to prevent it from crashing our app.
  }
}

export function identify(userInfo, accountInfo) {
  try {
    aptrinsic('identify', userInfo, accountInfo);
  } catch (ex) {
    // We can't do anything here, just a safe check to prevent it from crashing our app.
  }
}

export function track(eventId, details = {}) {
  try {
    aptrinsic('track', eventId, details);
  } catch (ex) {
    // We can't do anything here, just a safe check to prevent it from crashing our app.
  }
}
