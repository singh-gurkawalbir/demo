import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Tooltip } from '@material-ui/core';
import * as selectors from '../../reducers';
import { convertUtcToTimezone } from '../../utils/date';

const formatter = (value, unit, suffix, epochSeconds, nextFormatter) => {
  if (unit === 'second') return 'Just now';

  // we use the default formatter for all other units.
  return nextFormatter();
};

export default function CeligoTimeAgo(props) {
  const { dateFormat, timeFormat, timezone } = useSelector(state => {
    const { dateFormat, timeFormat, timezone } = selectors.userProfilePreferencesProps(state);

    return { dateFormat, timeFormat, timezone };
  }, shallowEqual);

  if (!props.date) {
    return null;
  }

  const lastModifiedInUserFormat = convertUtcToTimezone(
    props.date,
    dateFormat,
    timeFormat,
    timezone
  );

  return (
    <Tooltip title={lastModifiedInUserFormat}>
      <TimeAgo {...props} formatter={formatter} />
    </Tooltip>
  );
}
