import React from 'react';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import AuditLogs from '../commonActions/AuditLogs';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';
import Edit from '../commonActions/Edit';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import { getHttpConnectorApplications } from '../../../constants/applications';

export default {
  useColumns: () => {
    const columns = [
      {
        key: 'name',
        heading: 'Name',
        isLoggable: true,
        Value: ({rowData: r}) => <ResourceDrawerLink resourceType="iClients" resource={r} />,
        orderBy: 'name',
      },
      {
        key: 'application',
        isLoggable: true,
        heading: 'Application',
        Value: ({rowData: r}) => r?._httpConnectorId ? getHttpConnectorApplications(r?._httpConnectorId)?.name : 'http',
        visible: false,
      },
      {
        key: 'lastUpdated',
        heading: 'Last updated',
        isLoggable: true,
        Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
        orderBy: 'lastModified',
      },
    ];

    return columns;
  },

  useRowActions: () => [Edit, AuditLogs, References, Delete],
};
