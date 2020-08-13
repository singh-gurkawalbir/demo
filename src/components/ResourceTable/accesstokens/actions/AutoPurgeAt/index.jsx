import { useState, useEffect } from 'react';
import moment from 'moment';
import { getAutoPurgeAtAsString } from './util';

export default function AutoPurgeAt({ accessToken }) {
  const [autoPurge, setAutoPurge] = useState(null);

  useEffect(() => {
    setAutoPurge(getAutoPurgeAtAsString(accessToken));

    /** Check and update purge status every minute until the token is purged */
    if (accessToken.autoPurgeAt && moment().diff(accessToken.autoPurgeAt) < 0) {
      const updateAutoPurgeTimer = setInterval(() => {
        setAutoPurge(getAutoPurgeAtAsString(accessToken));
      }, 60 * 1000);

      return () => {
        clearTimeout(updateAutoPurgeTimer);
      };
    }
  }, [accessToken]);

  return autoPurge;
}
