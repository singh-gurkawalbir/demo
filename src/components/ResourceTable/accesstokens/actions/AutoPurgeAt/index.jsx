import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';

export default function AutoPurgeAt({ accessToken }) {
  if (accessToken && accessToken.autoPurgeAt) {
    return <TimeAgo date={accessToken.autoPurgeAt} />;
  }

  return 'Never';
}
