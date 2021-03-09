import React from 'react';
import ResourceDrawerLink from '../../ResourceDrawerLink';
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
      value: function TokenDrawerLink(r) {
        return <ResourceDrawerLink resourceType="accesstokens" resource={r} />;
      },
      orderBy: 'name',
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
          !r._connectionIds?.length &&
          !r._exportIds?.length &&
          !r._importIds?.length)
          ? 'Full Access'
          : 'Custom',
    },
    {
      heading: 'Auto purge',
      value: r => getAutoPurgeAt(r),
    },
    {
      heading: 'Last updated',
      value: r => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
    {
      // TODO add permission checks
      heading: 'Token',
      value: r => getDisplayToken(r),
    },
  ],
  rowActions: r => {
    let actionItems = [];

    if (r.revoked) {
      actionItems = [AuditLogs, Reactivate, Regenerate];
    } else {
      actionItems = [AuditLogs, Revoke, Regenerate];
    }

    actionItems = [Edit, ...actionItems];

    return actionItems;
  },
};
