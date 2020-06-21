import React from 'react';
import TimeAgo from 'react-timeago';

const formatter = (value, unit, suffix, epochSeconds, nextFormatter) => {
  if (unit === 'second') return 'Just now';

  // we use the default formatter for all other units.
  return nextFormatter();
};

export default function CeligoTimeAgo(props) {
  return <TimeAgo {...props} formatter={formatter} />;
}
