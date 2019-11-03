import Delete from '../../actions/Delete';
import References from '../../actions/References';
import AuditLogs from '../../actions/AuditLogs';
import { getResourceLink, formatLastModified } from '../../../CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Name',
      value: (r, actionProps, location) =>
        getResourceLink('scripts', r, location),
      orderBy: 'name',
    },
    {
      heading: 'Description',
      value: r => r.description,
      orderBy: 'description',
    },
    {
      heading: 'Updated on',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
  rowActions: [AuditLogs, References, Delete],
};
