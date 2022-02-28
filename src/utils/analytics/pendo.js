/* global pendo */
export function initialize({ apiKey }) {
  /* eslint-disable */
    (function(apiKey){
        (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
        v=['initialize','identify','updateOptions','pageLoad','track'];for(w=0,x=v.length;w<x;++w)(function(m){
            o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
            y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
            z=e.getElempentsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
    })(apiKey);
      /* eslint-enable */
}

export function identify(userInfo, accountInfo) {
  const AA = {visitor: {...userInfo}, account: {...accountInfo}};

  console.log('AA ***', AA);
  pendo.initialize(AA);
}

export function track(eventId, details = {}) {
  try {
    pendo('track', eventId, details);
  } catch (ex) {
    // We can't do anything here, just a safe check to prevent it from crashing our app.
  }
}

