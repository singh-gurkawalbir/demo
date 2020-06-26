import React from 'react';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import ResourceDrawerLink from '../../../ResourceDrawerLink';
import AuditLogs from '../../actions/AuditLogs';
import Clone from '../../actions/Clone';
import Delete from '../../actions/Delete';
import References from '../../actions/References';
import { ConnectorNameComp } from '..';
import Edit from '../../actions/Edit';

export default {
  columns: [
    {
      heading: 'Name',
      value: function ExportDrawerLink(r) {
        return <ResourceDrawerLink resourceType="exports" resource={r} />;
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
  rowActions: () => [Edit, AuditLogs, References, Clone, Delete],
};
