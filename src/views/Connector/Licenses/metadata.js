import React from 'react';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import Delete from '../../../components/ResourceTable/commonActions/Delete';
import Edit from '../../../components/ResourceTable/commonActions/Edit';
import ResourceDrawerLink from '../../../components/ResourceDrawerLink';
import CeligoTimeAgo from '../../../components/CeligoTimeAgo';

export default {
  columns: [
    {
      heading: 'Email',
      value: function ConnectorLicensesDrawerLink(r) {
        return (
          <ResourceDrawerLink resourceType="connectorLicenses" resource={r} />
        );
      },
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
      value: r => {
        if (!r.expires) return '';

        return (
          <Typography color="error">
            {moment(r.expires).format('MMM D, YYYY')} (<CeligoTimeAgo date={r.expires} />)
          </Typography>
        );
      },
      orderBy: 'expires',
    },
    {
      heading: 'Environment',
      value: r => (r.sandbox ? 'Sandbox' : 'Production'),
    },
  ],
  rowActions: [Edit, Delete],
};
