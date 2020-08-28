import { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import moment from 'moment';
import { selectors } from '../../reducers';

export default function DateTimeDisplay({ date, dateTime }) {
  const { dateFormat, timeFormat } = useSelector(
    state => selectors.userOwnPreferences(state),
    shallowEqual
  );

  const out = useMemo(() => {
    if (!dateFormat || !timeFormat || !(date || dateTime)) {
      return '';
    }

    if (date) {
      return moment(date).format(dateFormat);
    }

    if (dateTime) {
      return moment(dateTime).format(
        `${dateFormat} ${timeFormat}`
      );
    }
  }, [date, dateTime, dateFormat, timeFormat]);

  return out;
}
