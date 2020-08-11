import React from 'react';
import ExpiresOn from '../../../components/ResourceTable/commonCells/ExpiredOn';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => r.name,
      orderBy: 'name',
    },
    {
      heading: 'Email',
      value: r => r.email,
      orderBy: 'email',
    },
    {
      heading: 'Integration ID',
      value: r => r._integrationId,
      orderBy: '_integrationId',
    },
    {
      heading: 'Expires on',
      value: r => <ExpiresOn date={r.expires} />,
      orderBy: 'license.expires',
    },
    {
      heading: 'Environment',
      value: r => (r.sandbox ? 'Sandbox' : 'Production'),
    },
    {
      heading: 'Version',
      value: r => (r.updateInProgress ? 'In progress...' : r.version),
      orderBy: 'version',
    },
  ],
};
