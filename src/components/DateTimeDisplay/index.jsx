import { useSelector } from 'react-redux';
import moment from 'moment';
import * as selectors from '../../reducers';

export default function DateTimeDisplay({ date, dateTime }) {
  const userOwnPreferences = useSelector(
    state => selectors.userOwnPreferences(state),
    (left, right) =>
      left &&
      right &&
      left.dateFormat === right.dateFormat &&
      left.timeFormat === right.timeFormat
  );

  if (!userOwnPreferences || !(date || dateTime)) {
    return '';
  }

  if (date) {
    return moment(date).format(userOwnPreferences.dateFormat);
  }

  if (dateTime) {
    return moment(dateTime).format(
      `${userOwnPreferences.dateFormat} ${userOwnPreferences.timeFormat}`
    );
  }
}
