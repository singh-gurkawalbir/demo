import moment from 'moment';

export const showDownloadLogs = conn => {
  let toReturn = false;

  if (conn.debugDate) {
    if (moment() <= moment(conn.debugDate)) {
      toReturn = true;
    } else {
      toReturn = moment().diff(moment(conn.debugDate), 'days') < 1;
    }
  }

  // TODO check whats different in the context of flow builder.
  // return toReturn && this.parent.type !== 'flowBuilder';
  return toReturn;
};

export default { showDownloadLogs };
