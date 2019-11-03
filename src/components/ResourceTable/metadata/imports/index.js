import Delete from '../../actions/Delete';
import References from '../../actions/References';
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
      value: (r, actionProps, location) =>
        getResourceLink('imports', r, location),
      orderBy: 'name',
    },
    { heading: 'Connector', value: r => getConnectorName(r) },
    {
      heading: 'Updated on',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
  rowActions: [Clone, AuditLogs, References, Delete],
};
