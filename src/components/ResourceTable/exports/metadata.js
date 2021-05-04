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
  columns: [
    {
      heading: 'Name',
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="exports" resource={r} />,
      orderBy: 'name',
    },
    {
      heading: 'Application',
      Value: ({rowData: r}) => <ConnectorName resource={r} />,
    },
    {
      heading: 'Last updated',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
  ],
  rowActions: () => [Edit, AuditLogs, References, Clone, Delete],
};
