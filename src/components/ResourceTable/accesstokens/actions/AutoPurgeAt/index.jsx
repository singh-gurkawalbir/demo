import React from 'react';
import CeligoTimeAgo from '../../../../CeligoTimeAgo';

export default function AutoPurgeAt({ accessToken }) {
  if (accessToken && accessToken.autoPurgeAt) {
    return <CeligoTimeAgo date={accessToken.autoPurgeAt} />;
  }

  return 'Never';
}
