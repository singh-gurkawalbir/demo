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
import CeligoTimeAgo from '../../CeligoTimeAgo';

const getDisplayToken = accessToken => <Display accessToken={accessToken} />;
const getAutoPurgeAt = accessToken => <AutoPurgeAt accessToken={accessToken} />;

export default {
  columns: [
    {
      heading: 'Name',
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="accesstokens" resource={r} />,
      orderBy: 'name',
    },
    {
      heading: 'Status',
      Value: ({rowData: r}) => (r.revoked ? 'Revoked' : 'Active'),
    },
    {
      heading: 'Scope',
      Value: ({rowData: r}) =>
        r.fullAccess ||
        (r._connectorId &&
          r.autoPurgeAt &&
          !r._connectionIds?.length &&
          !r._exportIds?.length &&
          !r._importIds?.length)
          ? 'Full Access'
          : 'Custom',
    },
    {
      heading: 'Auto purge',
      Value: ({rowData: r}) => getAutoPurgeAt(r),
    },
    {
      heading: 'Last updated',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
    {
      // TODO add permission checks
      heading: 'Token',
      Value: ({rowData: r}) => getDisplayToken(r),
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
