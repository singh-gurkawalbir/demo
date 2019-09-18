import Delete from '../../actions/Delete';
import References from '../../actions/References';
import { getResourceLink, formatLastModified, getConnectorName } from '../util';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => getResourceLink('exports', r),
      orderBy: 'name',
    },
    { heading: 'Connector', value: r => getConnectorName(r) },
    {
      heading: 'Updated on',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
  actions: () => [Delete, References],
};
