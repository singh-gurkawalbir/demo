import React from 'react';
import { ConnectorNameComp } from '../metadata';
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
      value: function ImportsDrawerLink(r) {
        return <ResourceDrawerLink resourceType="imports" resource={r} />;
      },
      orderBy: 'name',
    },
    {
      heading: 'Application',
      value: function ConnectorName(r) {
        return <ConnectorNameComp r={r} />;
      },
    },
    {
      heading: 'Last updated',
      value: r => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
  ],
  rowActions: [Edit, AuditLogs, References, Clone, Delete],
};
