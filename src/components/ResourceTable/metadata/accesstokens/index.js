import ResourceDrawerLink from '../../../ResourceDrawerLink';
import Delete from '../../actions/Delete';
import AuditLogs from '../../actions/AuditLogs';
import Reactivate from '../../actions/AccessTokens/Reactivate';
import Revoke from '../../actions/AccessTokens/Revoke';
import Regenerate from '../../actions/AccessTokens/Regenerate';
import Display from '../../actions/AccessTokens/Display';
import { getAutoPurgeAtAsString } from './util';

const getDisplayToken = accessToken => <Display accessToken={accessToken} />;

export default {
  columns: [
    {
      heading: 'Name',
      value: function TokenDrawerLink(r) {
        return <ResourceDrawerLink resourceType="accesstokens" resource={r} />;
      },
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
      value: r =>
        // TODO logic to refresh this periodically
        getAutoPurgeAtAsString(r),
    },
  ],
  rowActions: r => {
    if (r.revoked) {
      return [Reactivate, Regenerate, AuditLogs, Delete];
    }

    return [Revoke, Regenerate, AuditLogs, Delete];
  },
};
