import Delete from '../../actions/Delete';
import Edit from '../../actions/Edit';
import References from '../../actions/References';
import AuditLogs from '../../actions/AuditLogs';
import { getResourceLink, formatLastModified } from '../util';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => getResourceLink('scripts', r),
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
  actions: [Edit, AuditLogs, References, Delete],
};
