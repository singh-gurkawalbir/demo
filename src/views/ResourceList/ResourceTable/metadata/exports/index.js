import Delete from '../../actions/Delete';
import References from '../../actions/References';
import Edit from '../../actions/Edit';
import AuditLogs from '../../actions/AuditLogs';
import Clone from '../../actions/Clone';
import { getResourceLink, formatLastModified } from '../util';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => getResourceLink('exports', r),
      orderBy: 'name',
    },
    {
      heading: 'Updated on',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
  actions: [Edit, Clone, AuditLogs, Delete, References],
};
