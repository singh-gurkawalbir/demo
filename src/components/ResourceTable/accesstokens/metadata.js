import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
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
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      isLoggable: true,
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="accesstokens" resource={r} />,
      orderBy: 'name',
    },
    {
      key: 'status',
      heading: 'Status',
      isLoggable: true,
      Value: ({rowData: r}) => (r.revoked ? 'Revoked' : 'Active'),
    },
    {
      key: 'scope',
      heading: 'Scope',
      isLoggable: true,
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
      key: 'autoPurge',
      heading: 'Auto purge',
      isLoggable: true,
      Value: ({rowData: r}) => getAutoPurgeAt(r),
    },
    {
      key: 'lastUpdates',
      heading: 'Last updated',
      isLoggable: true,
      Value: ({rowData: r}) => <TimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
    {
      key: 'token',
      // TODO add permission checks
      heading: 'Token',
      Value: ({rowData: r}) => getDisplayToken(r),
    },
  ],
  useRowActions: r => {
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
