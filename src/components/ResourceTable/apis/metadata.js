import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import ResourceName from '../commonCells/ResourceName';
import Delete from '../commonActions/Delete';
import AuditLogs from '../commonActions/AuditLogs';
import Edit from '../commonActions/Edit';

export default {
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="apis" resource={r} />,
      isLoggable: true,
      orderBy: 'name',
    },
    {
      key: 'function',
      heading: 'Function',
      // check if it is loggable
      isLoggable: true,
      Value: ({rowData: r}) => r.function,
    },
    {
      key: 'script',
      heading: 'Script',
      isLoggable: true,
      Value: ({rowData: r}) => <ResourceName resourceType="scripts" resourceId={r._scriptId} />,
    },
    {
      key: 'lastUpdated',
      heading: 'Last updated',
      isLoggable: true,
      Value: ({rowData: r}) => <TimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
  ],
  useRowActions: () => [Edit, AuditLogs, Delete],
};
