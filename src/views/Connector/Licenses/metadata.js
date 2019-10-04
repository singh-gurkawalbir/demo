import Delete from '../../../components/ResourceTable/actions/Delete';
import { formatLastModified } from '../../../components/CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Email',
      value: r => r.user && r.user.email,
    },
    {
      heading: 'Status',
      value: r => (r.accepted ? 'Accepted' : 'Pending'),
    },
    {
      heading: 'Created Date',
      value: r => formatLastModified(r.created),
    },
    {
      heading: 'Expiration Date',
      value: r => formatLastModified(r.expires),
    },
    {
      heading: 'Environment',
      value: r => (r.sandbox ? 'Sandbox' : 'Production'),
    },
  ],
  rowActions: [Delete],
};
