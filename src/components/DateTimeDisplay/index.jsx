import { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import moment from 'moment';
import { selectors } from '../../reducers';
import { convertUtcToTimezone } from '../../utils/date';

export default function DateTimeDisplay({ date, dateTime }) {
  const { dateFormat, timeFormat } = useSelector(
    state => selectors.userOwnPreferences(state),
    shallowEqual
  );
  const timezone = useSelector(state => selectors.userTimezone(state));

  const out = useMemo(() => {
    if (!dateFormat || !timeFormat || !(date || dateTime)) {
      return '';
    }

    if (date) {
      return convertUtcToTimezone(moment(date), dateFormat, timeFormat, timezone, {dateOnly: true});
    }

    if (dateTime) {
      return convertUtcToTimezone(moment(dateTime), dateFormat, timeFormat, timezone);
    }
  }, [dateFormat, timeFormat, date, dateTime, timezone]);

  return out;
}
