import moment from 'moment';
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
      heading: 'Deleted Date',
      value: r => moment(r.doc && r.doc.lastModified).format('MMM Do, YYYY'),
    },
    {
      heading: 'Auto Purge',
      value: r => {
        const restoreWithin = Math.ceil(
          (30 * 24 * 60 * 60 * 1000 -
            (Date.now() - new Date(r.doc && r.doc.lastModified))) /
            (24 * 60 * 60 * 1000)
        );

        return `${restoreWithin} ${restoreWithin === 1 ? 'day' : 'days'}`;
      },
    },
  ],
  rowActions: [Restore, Purge],
};
