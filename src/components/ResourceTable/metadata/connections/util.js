import moment from 'moment';

// TODO unit test for this
export const showDownloadLogs = conn => {
  let toReturn = false;

  if (conn.debugDate) {
    if (moment() <= moment(conn.debugDate)) {
      toReturn = true;
    } else {
      toReturn = moment() - moment(conn.debugDate) <= 24 * 60 * 60 * 1000;
    }
  }

  // TODO check whats different in the context of flow builder.
  // return toReturn && this.parent.type !== 'flowBuilder';
  return toReturn;
};

export default { showDownloadLogs };
