import React from 'react';
import Delete from '../../../components/ResourceTable/commonActions/Delete';
import Edit from '../../../components/ResourceTable/commonActions/Edit';
import ExpiresOn from '../../../components/ResourceTable/commonCells/ExpiredOn';
import ResourceDrawerLink from '../../../components/ResourceDrawerLink';
import CeligoTimeAgo from '../../../components/CeligoTimeAgo';

export default {
  columns: [
    {
      heading: 'Email',
      value: r => <ResourceDrawerLink resourceType="connectorLicenses" resource={r} />,
      orderBy: 'email',
    },
    {
      heading: 'Status',
      value: r => (r._integrationId ? 'Installed' : 'Pending'),
    },
    {
      heading: 'Created on',
      value: r => <CeligoTimeAgo date={r.created} />,
      orderBy: 'created',
    },
    {
      heading: 'Expires on',
      value: r => <ExpiresOn date={r.expires} />,
      orderBy: 'expires',
    },
    {
      heading: 'Environment',
      value: r => (r.sandbox ? 'Sandbox' : 'Production'),
    },
  ],
  rowActions: [Edit, Delete],
};
