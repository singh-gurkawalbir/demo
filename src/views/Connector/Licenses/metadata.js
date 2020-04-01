import { Typography } from '@material-ui/core';
import Delete from '../../../components/ResourceTable/actions/Delete';
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
      value: r => formatLastModified(r.created),
      orderBy: 'created',
    },
    {
      heading: 'Expires on',
      value(r) {
        return (
          <Typography color="error">{formatLastModified(r.expires)}</Typography>
        );
      },
      orderBy: 'expires',
    },
    {
      heading: 'Environment',
      value: r => (r.sandbox ? 'Sandbox' : 'Production'),
    },
  ],
  rowActions: [Delete],
};
