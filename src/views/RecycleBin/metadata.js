import { formatLastModified } from '../../components/CeligoTable/util';
import Restore from '../../components/ResourceTable/actions/RecycleBin/Restore';
import Purge from '../../components/ResourceTable/actions/RecycleBin/Purge';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => r.doc && r.doc.name,
      orderBy: 'name',
    },
    {
      heading: 'Type',
      value: r => r.model,
      orderBy: 'model',
    },
    {
      heading: 'Deleted On',
      value: r => formatLastModified(r.doc && r.doc.lastModified),
    },
    {
      heading: 'Auto Purge',
      value: r => formatLastModified(r.doc && r.doc.lastModified),
    },
  ],
  rowActions: [Restore, Purge],
};
