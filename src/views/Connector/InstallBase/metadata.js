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
    },
    {
      heading: 'Integration ID',
      value: r => r._integrationId,
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
    {
      heading: 'Version',
      value: r => r.version,
    },
  ],
};
