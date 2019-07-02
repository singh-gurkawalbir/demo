import moment from 'moment';

export function isPurged(autoPurgeAt) {
  if (!autoPurgeAt) {
    return false;
  }

  const dtAutoPurgeAt = moment(autoPurgeAt);

  return dtAutoPurgeAt.diff(moment(), 'seconds') <= 0;
}

export function getAutoPurgeAtAsString(autoPurgeAt) {
  let autoPurge = 'Never';

  if (isPurged(autoPurgeAt)) {
    autoPurge = 'Purged';
  } else if (autoPurgeAt) {
    const dtAutoPurgeAt = moment(autoPurgeAt);
    const dtEoDToday = moment().endOf('day');

    if (dtAutoPurgeAt.diff(dtEoDToday, 'seconds') <= 0) {
      autoPurge = 'Today';
    } else {
      let days = dtAutoPurgeAt.diff(dtEoDToday, 'days');
      const hours = dtAutoPurgeAt.diff(dtEoDToday, 'hours', true) % 24;

      if (hours > 0) {
        days += 1;
      }

      if (days === 1) {
        autoPurge = 'Tomorrow';
      } else {
        autoPurge = `${days} Days`;
      }
    }
  }

  return autoPurge;
}
