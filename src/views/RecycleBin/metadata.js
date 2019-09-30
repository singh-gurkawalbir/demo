import { formatLastModified } from '../../components/CeligoTable/util';

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
      heading: 'Deleted Date',
      value: r => formatLastModified(r.doc && r.doc.lastModified),
    },
  ],
  // rowActions: [Restore, Purge],
};
