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
    },
    {
      heading: 'Status',
      value: r => (r.accepted ? 'Accepted' : 'Pending'),
    },
    {
      heading: 'Created on',
      value: r => formatLastModified(r.created),
    },
    {
      heading: 'Expires on',
      value(r) {
        return (
          <Typography color="error">{formatLastModified(r.expires)}</Typography>
        );
      },
    },
    {
      heading: 'Environment',
      value: r => (r.sandbox ? 'Sandbox' : 'Production'),
    },
  ],
  rowActions: [Delete],
};
