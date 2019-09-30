import moment from 'moment';

export const getAutoPurgeAtAsString = at => {
  let autoPurge = 'Never';
  const dtAutoPurgeAt = moment(at.autoPurgeAt);

  if (dtAutoPurgeAt.diff(moment(), 'seconds') <= 0) {
    autoPurge = 'Purged';
  } else if (at.autoPurgeAt) {
    const dtAutoPurgeAt = moment(at.autoPurgeAt);
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
};

export default { getAutoPurgeAtAsString };
