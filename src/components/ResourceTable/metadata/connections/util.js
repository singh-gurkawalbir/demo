import moment from 'moment';
import { SECONDS_IN_DAY } from '../../../../utils/constants';

// TODO unit test for this
export const showDownloadLogs = conn => {
  let toReturn = false;

  if (conn.debugDate) {
    if (moment() <= moment(conn.debugDate)) {
      toReturn = true;
    } else {
      toReturn = moment() - moment(conn.debugDate) <= SECONDS_IN_DAY;
    }
  }

  // TODO check whats different in the context of flow builder.
  // return toReturn && this.parent.type !== 'flowBuilder';
  return toReturn;
};

export default { showDownloadLogs };
