import React from 'react';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import Delete from '../commonActions/Delete';
import AuditLogs from '../commonActions/AuditLogs';
import Reactivate from './actions/Reactivate';
import Revoke from './actions/Revoke';
import Regenerate from './actions/Regenerate';
import Display from './actions/Display';
import AutoPurgeAt from './actions/AutoPurgeAt';
import Edit from '../commonActions/Edit';

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

    if (!isOTT) {
      actionItems.push(Delete);
    }
    actionItems = [Edit, ...actionItems];

    return actionItems;
  },
};
