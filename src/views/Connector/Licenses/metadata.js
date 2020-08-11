import React from 'react';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import Delete from '../../../components/ResourceTable/commonActions/Delete';
import Edit from '../../../components/ResourceTable/commonActions/Edit';
import ResourceDrawerLink from '../../../components/ResourceDrawerLink';
import { formatLastModified } from '../../../components/CeligoTable/util';

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
      value: r => r.created ? moment(r.created).format('MMM D, YYYY') : '',
      orderBy: 'created',
    },
    {
      heading: 'Expires on',
      value(r) {
        return (r.expires
          ? (
            <Typography color="error"> {moment(r.expires).format('MMM D, YYYY')} ({formatLastModified(r.expires)})</Typography>)
          : ''
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
