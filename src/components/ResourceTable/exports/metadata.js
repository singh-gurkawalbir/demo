import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import ConnectorName from '../commonCells/ConnectorName';
import AuditLogs from '../commonActions/AuditLogs';
import Clone from '../commonActions/Clone';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';
import Edit from '../commonActions/Edit';

export default {
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      isLoggable: true,
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="exports" resource={r} />,
      orderBy: 'name',
    },
    {
      key: 'application',
      heading: 'Application',
      isLoggable: true,
      Value: ({rowData: r}) => <ConnectorName resource={r} />,
    },
    {
      key: 'lastUpdated',
      heading: 'Last updated',
      isLoggable: true,
      Value: ({rowData: r}) => <TimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
  ],
  useRowActions: () => [Edit, AuditLogs, References, Clone, Delete],
};
