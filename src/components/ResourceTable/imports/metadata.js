import React from 'react';
import ConnectorName from '../commonCells/ConnectorName';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import AuditLogs from '../commonActions/AuditLogs';
import Clone from '../commonActions/Clone';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';
import Edit from '../commonActions/Edit';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => <ResourceDrawerLink resourceType="imports" resource={r} />,
      orderBy: 'name',
    },
    {
      heading: 'Application',
      value: r => <ConnectorName resource={r} />,
    },
    {
      heading: 'Last updated',
      value: r => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
  ],
  rowActions: [Edit, AuditLogs, References, Clone, Delete],
};
