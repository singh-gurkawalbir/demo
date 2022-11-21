import { useEffect } from 'react';

const useScript = (url = '', id = '', callBack) => {
  useEffect(() => {
    const script = document.createElement('script');

    if (!url || !id) return;
    script.id = id;
    script.src = url;
    script.async = true;
    if (callBack) {
      script.onload = callBack;
    }

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, id]);
};

export default useScript;
