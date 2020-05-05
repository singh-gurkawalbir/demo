import ResourceDrawerLink from '../../../ResourceDrawerLink';
import Delete from '../../actions/Delete';
import AuditLogs from '../../actions/AuditLogs';
import Reactivate from '../../actions/AccessTokens/Reactivate';
import Revoke from '../../actions/AccessTokens/Revoke';
import Regenerate from '../../actions/AccessTokens/Regenerate';
import Display from '../../actions/AccessTokens/Display';
import AutoPurgeAt from '../../actions/AccessTokens/AutoPurgeAt';

const getDisplayToken = accessToken => <Display accessToken={accessToken} />;
const getAutoPurgeAt = accessToken => <AutoPurgeAt accessToken={accessToken} />;

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
      heading: 'Auto purge',
      value: r => getAutoPurgeAt(r),
    },
  ],
  rowActions: r => {
    let actionItems = [];
    const isOTT = r._connectorId && !r.autoPurgeAt;

    if (r.revoked) {
      actionItems = [Reactivate, Regenerate, AuditLogs];
    } else {
      actionItems = [Revoke, Regenerate, AuditLogs];
    }

    if (!isOTT && r.revoked) {
      actionItems.push(Delete);
    }

    return actionItems;
  },
};
