import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Tooltip } from '@material-ui/core';
import { selectors } from '../../reducers';
import { convertUtcToTimezone } from '../../utils/date';

const formatter = (value, unit, suffix, epochSeconds, nextFormatter) => {
  if (unit === 'second') return 'Just now';

  // we use the default formatter for all other units.
  return nextFormatter();
};

export default function CeligoTimeAgo(props) {
  const { dateFormat, timeFormat, timezone } = useSelector(state => {
    const userPref = props?.actionProps?.userProfilePreferencesProps || selectors.userProfilePreferencesProps(state);

    return {
      dateFormat: userPref.dateFormat,
      timeFormat: userPref.timeFormat,
      timezone: userPref.timezone,
    };
  }, shallowEqual);

  const lastModifiedInUserFormat = useMemo(() => props.date ? convertUtcToTimezone(props.date, dateFormat, timeFormat, timezone) : '', [dateFormat, timeFormat, timezone, props.date]);

  if (!props.date) {
    return null;
  }

  return (
    <Tooltip title={lastModifiedInUserFormat}>
      <TimeAgo {...props} formatter={formatter} />
    </Tooltip>
  );
}
