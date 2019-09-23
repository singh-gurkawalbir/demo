import Delete from '../../actions/Delete';
import References from '../../actions/References';
import Edit from '../../actions/Edit';
import AuditLogs from '../../actions/AuditLogs';
import Clone from '../../actions/Clone';
import {
  getResourceLink,
  formatLastModified,
  getConnectorName,
} from '../../../CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => getResourceLink('imports', r),
      orderBy: 'name',
    },
    { heading: 'Connector', value: r => getConnectorName(r) },
    {
      heading: 'Updated on',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
  rowActions: [Edit, Clone, AuditLogs, References, Delete],
};
