/* global pendo */
export function init() {
  try {
    /* eslint-disable */
    (function(apiKey){
        (function(p,e,n,d,o){
            var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
        v=['initialize','identify','updateOptions','pageLoad','track'];for(w=0,x=v.length;w<x;++w)(function(m){
            o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
            y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
            z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);
        })(window,document,'script','pendo');
    })('78f58e2a-2645-49fb-70cf-0fc21baff71f');
         /* eslint-enable */
  } catch (ex) {
    // We can't do anything here, just a safe check to prevent it from crashing our app.
  }
}
export function identify(userInfo, accountInfo) {
  try {
    pendo.initialize({
      visitor: userInfo,
      account: accountInfo,
    });
  } catch (ex) {
    // We can't do anything here, just a safe check to prevent it from crashing our app.
  }
}
export function track(eventId, details = {}) {
  try {
    pendo.track(eventId, details);
  } catch (ex) {
    // We can't do anything here, just a safe check to prevent it from crashing our app.
  }
}
