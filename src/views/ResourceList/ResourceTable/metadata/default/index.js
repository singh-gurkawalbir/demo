import Delete from '../../actions/Delete';
import References from '../../actions/References';
import { getResourceLink, formatLastModified } from '../util';

export default resourceType => ({
  columns: [
    {
      heading: 'Name',
      value: r => getResourceLink(resourceType, r),
      orderBy: 'name',
    },
    {
      heading: 'Updated on',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
  actions: [Delete, References],
});
