import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import TimeAgo from 'react-timeago';
import { selectors } from '../../../../../reducers';
import { convertUtcToTimezone } from '../../../../../utils/date';

const RenderValue = props => {
  const {humanized, epochTime} = props;
  const { dateFormat, timeFormat, timezone } = useSelector(state =>
    selectors.userProfilePreferencesProps(state),
  shallowEqual
  );
  const UTCDate = new Date(epochTime).toISOString();
  const lastModifiedInUserFormat = useMemo(() =>
    convertUtcToTimezone(UTCDate, dateFormat, timeFormat, timezone),
  [dateFormat, timeFormat, timezone, UTCDate]
  );

  return <>{lastModifiedInUserFormat}{humanized}</>;
};

const formatter = (value, unit, suffix, epochTime) => <RenderValue humanized={`(${value}${unit[0]} ${suffix})`} epochTime={epochTime} />;

export default function CeligoTimeAgo(props) {
  if (!props.date) {
    return null;
  }

  return (
    <TimeAgo {...props} formatter={formatter} />
  );
}
