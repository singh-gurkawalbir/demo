import React from 'react';
import { Typography } from '@material-ui/core';
import { formatLastModified } from '../../../components/CeligoTable/util';

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
      value(r) {
        return (
          <Typography color="error">
            {formatLastModified(r.license && r.license.expires)}
          </Typography>
        );
      },
      orderBy: 'license.expires',
    },
    {
      heading: 'Environment',
      value: r => (r.sandbox ? 'Sandbox' : 'Production'),
    },
    {
      heading: 'Version',
      value: r => (r.updateInProgress ? 'In Progress...' : r.version),
      orderBy: 'version',
    },
  ],
};
