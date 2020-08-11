import React from 'react';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import CeligoTimeAgo from '../../../components/CeligoTimeAgo';

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
      value: r => {
        if (!r.expires) return '';

        return (
          <Typography color="error">
            {moment(r.expires).format('MMM D, YYYY')} (<CeligoTimeAgo date={r.expires} />)
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
      value: r => (r.updateInProgress ? 'In progress...' : r.version),
      orderBy: 'version',
    },
  ],
};
