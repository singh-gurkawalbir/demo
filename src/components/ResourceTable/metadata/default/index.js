import ResourceDrawerLink from '../../../ResourceDrawerLink';
import Delete from '../../actions/Delete';
import References from '../../actions/References';
import { formatLastModified } from '../../../CeligoTable/util';

export default resourceType => ({
  columns: [
    {
      heading: 'Name',
      value: function DefaultResourceDrawerLink(r) {
        return <ResourceDrawerLink resourceType={resourceType} resource={r} />;
      },
      orderBy: 'name',
    },
    {
      heading: 'Updated on',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
  rowActions: () => [Delete, References],
});
