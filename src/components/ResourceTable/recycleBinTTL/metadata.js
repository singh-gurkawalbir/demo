import React from 'react';
import Restore from './actions/Restore';
import Purge from './actions/Purge';
import DateTimeDisplay from '../../DateTimeDisplay';

export default {
  columns: [
    {
      heading: 'Name',
      Value: ({rowData: r}) => r.doc && r.doc.name,
      orderBy: 'doc.name',
    },
    {
      heading: 'Type',
      Value: ({rowData: r}) => r.model,
      orderBy: 'model',
    },
    {
      heading: 'Deleted date',
      Value: ({rowData: r}) => r.doc && <DateTimeDisplay dateTime={r.doc.lastModified} />,
      orderBy: 'doc.lastModified',
    },
    {
      heading: 'Auto purge',
      Value: ({rowData: r}) => {
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
