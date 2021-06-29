import React from 'react';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import ResourceName from '../commonCells/ResourceName';
import Delete from '../commonActions/Delete';
import AuditLogs from '../commonActions/AuditLogs';
import Edit from '../commonActions/Edit';
import CeligoTimeAgo from '../../CeligoTimeAgo';

export default {
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="apis" resource={r} />,
      orderBy: 'name',
    },
    {
      key: 'function',
      heading: 'Function',
      Value: ({rowData: r}) => r.function,
    },
    {
      key: 'script',
      heading: 'Script',
      Value: ({rowData: r}) => <ResourceName resourceType="scripts" resourceId={r._scriptId} />,
    },
    {
      key: 'lastUpdated',
      heading: 'Last updated',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
  ],
  useRowActions: () => [Edit, AuditLogs, Delete],
};
