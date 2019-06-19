import moment from 'moment';

export default function getAutoPurgeAtAsString(autoPurgeAt) {
  let autoPurge = 'Never';

  if (autoPurgeAt) {
    const dtAutoPurgeAt = moment(autoPurgeAt);
    const dtNow = moment();
    const dtEoDToday = moment().endOf('day');

    if (dtAutoPurgeAt.diff(dtNow, 'seconds') <= 0) {
      autoPurge = 'Purged';
    } else if (dtAutoPurgeAt.diff(dtEoDToday, 'seconds') <= 0) {
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
