import { Typography } from '@material-ui/core';
import Delete from '../../../components/ResourceTable/actions/Delete';
import {
  getResourceLink,
  formatLastModified,
} from '../../../components/CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Email',
      value: (r, actionProps, location) =>
        getResourceLink('connectorLicenses', r, location),
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
