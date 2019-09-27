import moment from 'moment';
import Delete from '../../actions/Delete';
import { getResourceLink } from '../../../CeligoTable/util';
import AuditLogs from '../../actions/AuditLogs';
import ReActivate from '../../actions/AccessTokens/Reactivate';
import Revoke from '../../actions/AccessTokens/Revoke';
import ReGenerate from '../../actions/AccessTokens/Regenerate';
import Display from '../../actions/AccessTokens/Display';

const getDisplayToken = accesstoken => <Display accesstoken={accesstoken} />;

export default {
  columns: [
    {
      heading: 'Name',
      value: r => getResourceLink('accesstokens', r),
      orderBy: 'name',
    },
    {
      heading: 'Description',
      value: r => r.description,
    },
    {
      // TODO add permission checks
      heading: 'Token',
      value: r => getDisplayToken(r),
    },
    {
      heading: 'Status',
      value: r => (r.revoked ? 'Revoked' : 'Active'),
    },
    {
      heading: 'Scope',
      value: r =>
        r.fullAccess ||
        (r._connectorId &&
          r.autoPurgeAt &&
          !r._connectionIds.length &&
          !r._exportIds.length &&
          !r._importIds.length)
          ? 'Full Access'
          : 'Custom',
    },
    {
      heading: 'Auto Purge',
      value: r => {
        // TODO logic to refresh this periodically
        let autoPurge = 'Never';
        const dtAutoPurgeAt = moment(r.autoPurgeAt);

        if (dtAutoPurgeAt.diff(moment(), 'seconds') <= 0) {
          autoPurge = 'Purged';
        } else if (r.autoPurgeAt) {
          const dtAutoPurgeAt = moment(r.autoPurgeAt);
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
      },
    },
  ],
  rowActions: r => {
    if (r.revoked) {
      return [ReGenerate, ReActivate, AuditLogs, Delete];
    }

    return [ReGenerate, Revoke, AuditLogs, Delete];
  },
};
