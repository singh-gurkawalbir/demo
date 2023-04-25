import { useEffect } from 'react';

const useScript = (url = '', id = '', agreeTOSAndPPRequired, callBack) => {
  useEffect(() => {
    const script = document.createElement('script');

    if (!url || !id || agreeTOSAndPPRequired) return;
    script.id = id;
    script.src = url;
    script.async = true;
    if (callBack) {
      script.onload = callBack;
    }

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (window.zE) {
      // the chat box should be minimized
        window.zE('webWidget', 'close');
        // Hiding the default launcher
        window.zE('webWidget', 'hide');
      }

      // removing zenDesk content
      // doing this will remove pendo icon
      delete window.zE;
      delete window.zEACLoaded;
      delete window.zESettings;
      delete window.zEWebpackACJsonp;
      delete window.zEmbed;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, id]);
};

export default useScript;
