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
      value: r => (r._integrationId ? 'Installed' : 'Pending install'),
    },
    {
      heading: 'Created',
      value: r => <CeligoTimeAgo date={r.created} />,
      orderBy: 'created',
    },
    {
      heading: 'Integration ID',
      value: r => r._integrationId,
    },
    {
      heading: 'Expires',
      value: r => <ExpiresOn date={r.expires} />,
      orderBy: 'expires',
    },
    {
      heading: 'Trial expires',
      value: r => <ExpiresOn date={r.trialEndDate} />,
      orderBy: 'expires',
    },
    {
      heading: 'Environment',
      value: r => {
        if (r.type === 'integrationAppChild') {
          return null;
        }

        return r.sandbox ? 'Sandbox' : 'Production';
      },
      orderBy: 'sandbox',
    },
  ],
  rowActions: [Edit, Delete],
};
