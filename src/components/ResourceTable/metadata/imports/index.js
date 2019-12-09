import ResourceDrawerLink from '../../../ResourceDrawerLink';
import Delete from '../../actions/Delete';
import References from '../../actions/References';
import AuditLogs from '../../actions/AuditLogs';
import Clone from '../../actions/Clone';
import {
  formatLastModified,
  getConnectorName,
} from '../../../CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Name',
      value: function ImportsDrawerLink(r) {
        return <ResourceDrawerLink resourceType="imports" resource={r} />;
      },
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
