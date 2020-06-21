import React from 'react';
import ResourceDrawerLink from '../../../ResourceDrawerLink';
import Delete from '../../actions/Delete';
import AuditLogs from '../../actions/AuditLogs';
import Reactivate from '../../actions/AccessTokens/Reactivate';
import Revoke from '../../actions/AccessTokens/Revoke';
import Regenerate from '../../actions/AccessTokens/Regenerate';
import Display from '../../actions/AccessTokens/Display';
import AutoPurgeAt from '../../actions/AccessTokens/AutoPurgeAt';
import Edit from '../../actions/Edit';

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
      actionItems = [AuditLogs, Reactivate, Regenerate];
    } else {
      actionItems = [AuditLogs, Revoke, Regenerate];
    }

    if (!isOTT && r.revoked) {
      actionItems.push(Delete);
    }
    actionItems = [Edit, ...actionItems];


    return actionItems;
  },
};
