import React from 'react';
import ExpiresOn from '../../../components/ResourceTable/commonCells/ExpiredOn';

export default {
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      // connector install base name is loggable?
      Value: ({rowData: r}) => r.name,
      orderBy: 'name',
    },
    {
      key: 'email',
      heading: 'Email',
      Value: ({rowData: r}) => r.email,
      orderBy: 'email',
    },
    {
      key: 'integrationId',
      heading: 'Integration ID',
      isLoggable: true,
      Value: ({rowData: r}) => r._integrationId,
      orderBy: '_integrationId',
    },
    {
      key: 'expiresOn',
      heading: 'Expires on',
      isLoggable: true,
      Value: ({rowData: r}) => <ExpiresOn date={r && r.license && r.license.expires} />,
      orderBy: 'license.expires',
    },
    {
      key: 'environment',
      heading: 'Environment',
      isLoggable: true,
      Value: ({rowData: r}) => (r.sandbox ? 'Sandbox' : 'Production'),
    },
    {
      key: 'version',
      heading: 'Version',
      isLoggable: true,
      Value: ({rowData: r}) => (r.updateInProgress ? 'In progress...' : r.version),
      orderBy: 'version',
    },
  ],
};
