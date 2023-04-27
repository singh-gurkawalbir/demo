import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
import Delete from '../../../components/ResourceTable/commonActions/Delete';
import Edit from '../../../components/ResourceTable/commonActions/Edit';
import ExpiresOn from '../../../components/ResourceTable/commonCells/ExpiredOn';
import ResourceDrawerLink from '../../../components/ResourceDrawerLink';

export default {
  useColumns: () => [
    {
      key: 'email',
      heading: 'Email',
      // not loggable because the link text can have an email
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="connectorLicenses" resource={r} />,
      orderBy: 'email',
    },
    {
      key: 'status',
      heading: 'Status',
      isLoggable: true,
      Value: ({rowData: r}) => (r._integrationId ? 'Installed' : 'Pending install'),
    },
    {
      key: 'created',
      heading: 'Created',
      isLoggable: true,
      Value: ({rowData: r}) => <TimeAgo date={r.created} />,
      orderBy: 'created',
    },
    {
      key: 'integrationId',
      heading: 'Integration ID',
      isLoggable: true,
      Value: ({rowData: r}) => r._integrationId,
    },
    {
      key: 'expires',
      heading: 'Expires',
      isLoggable: true,
      Value: ({rowData: r}) => <ExpiresOn date={r.expires} />,
      orderBy: 'expires',
    },
    {
      key: 'trialExpires',
      heading: 'Trial expires',
      isLoggable: true,
      Value: ({rowData: r}) => <ExpiresOn date={r.trialEndDate} />,
      orderBy: 'expires',
    },
    {
      key: 'environment',
      heading: 'Environment',
      isLoggable: true,
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
