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

function LocalDateTime({ date }) {
  const { dateFormat, timeFormat, timezone } = useSelector(state => {
    if (!date) return null;
    const userPref = selectors.userProfilePreferencesProps(state);
    const timezone = selectors.userTimezone(state);

    return {
      dateFormat: userPref.dateFormat,
      timeFormat: userPref.timeFormat,
      timezone,
    };
  }, shallowEqual);

  return useMemo(() => date ? convertUtcToTimezone(date, dateFormat, timeFormat, timezone) : '', [dateFormat, timeFormat, timezone, date]);
}

export default function CeligoTimeAgo(props) {
  const showRelativeDateTime = useSelector(state => selectors.userOwnPreferences(state).showRelativeDateTime);

  if (!props.date) {
    return null;
  }
  if (!showRelativeDateTime) {
    return (
      <Tooltip data-public title={<TimeAgo {...props} formatter={formatter} />} aria-label="relative date time">
        <div>
          <LocalDateTime date={props.date} />
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip data-public title={<LocalDateTime date={props.date} />} aria-label="local date time">
      <TimeAgo {...props} formatter={formatter} />
    </Tooltip>
  );
}
