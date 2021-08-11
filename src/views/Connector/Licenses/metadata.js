import React from 'react';
import Delete from '../../../components/ResourceTable/commonActions/Delete';
import Edit from '../../../components/ResourceTable/commonActions/Edit';
import ExpiresOn from '../../../components/ResourceTable/commonCells/ExpiredOn';
import ResourceDrawerLink from '../../../components/ResourceDrawerLink';
import CeligoTimeAgo from '../../../components/CeligoTimeAgo';

export default {
  useColumns: () => [
    {
      key: 'email',
      heading: 'Email',
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="connectorLicenses" resource={r} />,
      orderBy: 'email',
    },
    {
      key: 'status',
      heading: 'Status',
      Value: ({rowData: r}) => (r._integrationId ? 'Installed' : 'Pending install'),
    },
    {
      key: 'created',
      heading: 'Created',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.created} />,
      orderBy: 'created',
    },
    {
      key: 'integrationId',
      heading: 'Integration ID',
      Value: ({rowData: r}) => r._integrationId,
    },
    {
      key: 'expires',
      heading: 'Expires',
      Value: ({rowData: r}) => <ExpiresOn date={r.expires} />,
      orderBy: 'expires',
    },
    {
      key: 'trialExpires',
      heading: 'Trial expires',
      Value: ({rowData: r}) => <ExpiresOn date={r.trialEndDate} />,
      orderBy: 'expires',
    },
    {
      key: 'environment',
      heading: 'Environment',
      Value: ({rowData: r}) => {
        if (r.type === 'integrationAppChild') {
          return null;
        }

        return r.sandbox ? 'Sandbox' : 'Production';
      },
      orderBy: 'sandbox',
    },
  ],
  useRowActions: () => [Edit, Delete],
};
