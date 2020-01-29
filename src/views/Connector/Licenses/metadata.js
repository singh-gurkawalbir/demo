import { Typography } from '@material-ui/core';
import moment from 'moment';
import Delete from '../../../components/ResourceTable/actions/Delete';
import ResourceDrawerLink from '../../../components/ResourceDrawerLink';

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
      value: r => (r._integrationId ? 'Installed' : 'Pending'),
    },
    {
      heading: 'Created on',
      value: r => {
        if (r.created) {
          return moment(r.created).format('MMM Do, YYYY');
        }

        return '';
      },
    },
    {
      heading: 'Expires on',
      value(r) {
        let date = '';

        if (r.expires) {
          date = moment(r.expires).format('MMM Do, YYYY');
        }

        return <Typography color="error">{date}</Typography>;
      },
    },
    {
      heading: 'Environment',
      value: r => (r.sandbox ? 'Sandbox' : 'Production'),
    },
  ],
  rowActions: [Delete],
};
