import React from 'react';
import TimeAgo from 'react-timeago';

export default function AutoPurgeAt({ accessToken }) {
  if (accessToken && accessToken.autoPurgeAt) {
    return <TimeAgo date={accessToken.autoPurgeAt} />;
  }

  return 'Never';
}
