import ResourceDrawerLink from '../../../ResourceDrawerLink';
import Delete from '../../actions/Delete';
import References from '../../actions/References';
import AuditLogs from '../../actions/AuditLogs';
import { formatLastModified } from '../../../CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Name',
      value: function ScriptsDrawerLink(r) {
        return <ResourceDrawerLink resourceType="scripts" resource={r} />;
      },
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
