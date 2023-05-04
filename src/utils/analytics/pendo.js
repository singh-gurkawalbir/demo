export function init({apiKey}) {
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
    })(apiKey);
         /* eslint-enable */
  } catch (ex) {
    // We can't do anything here, just a safe check to prevent it from crashing our app.
  }
}
export function identify(userInfo, accountInfo) {
  try {
    // eslint-disable-next-line no-undef
    pendo.initialize({
      visitor: userInfo,
      account: accountInfo,
    });
    // eslint-disable-next-line no-undef
    pendo.startSendingEvents();
    // eslint-disable-next-line no-undef
    pendo.startGuides();
  } catch (ex) {
    // We can't do anything here, just a safe check to prevent it from crashing our app.
  }
}
export function track(eventId, details = {}) {
  try {
    // eslint-disable-next-line no-undef
    pendo.track(eventId, details);
  } catch (ex) {
    // We can't do anything here, just a safe check to prevent it from crashing our app.
  }
}
export function stopSendingEvents() {
  try {
    // eslint-disable-next-line no-undef
    pendo.stopSendingEvents();
    // eslint-disable-next-line no-undef
    pendo.stopGuides();
  } catch (ex) {
    // We can't do anything here, just a safe check to prevent it from crashing our app.
  }
}
