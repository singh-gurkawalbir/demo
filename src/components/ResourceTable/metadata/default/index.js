import Delete from '../../actions/Delete';
import References from '../../actions/References';
import { getResourceLink, formatLastModified } from '../../../CeligoTable/util';

export default resourceType => ({
  columns: [
    {
      heading: 'Name',
      value: (r, actionProps, location) =>
        getResourceLink(resourceType, r, location),
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
