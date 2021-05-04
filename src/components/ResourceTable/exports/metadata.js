import React from 'react';
import CeligoTimeAgo from '../../CeligoTimeAgo';
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
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="exports" resource={r} />,
      orderBy: 'name',
    },
    {
      key: 'application',
      heading: 'Application',
      Value: ({rowData: r}) => <ConnectorName resource={r} />,
    },
    {
      key: 'lastUpdated',
      heading: 'Last updated',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
  ],
  useRowActions: () => [Edit, AuditLogs, References, Clone, Delete],
};
