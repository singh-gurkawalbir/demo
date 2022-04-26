import React from 'react';
import Restore from './actions/Restore';
import Purge from './actions/Purge';
import DateTimeDisplay from '../../DateTimeDisplay';
import { getTextAfterCount } from '../../../utils/string';

export default {
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      isLoggable: true,
      Value: ({rowData: r}) => r.doc && r.doc.name,
      orderBy: 'doc.name',
    },
    {
      key: 'type',
      heading: 'Type',
      isLoggable: true,
      Value: ({rowData: r}) => r.model,
      orderBy: 'model',
    },
    {
      key: 'deletedDate',
      heading: 'Deleted date',
      isLoggable: true,
      Value: ({rowData: r}) => r.doc && <DateTimeDisplay dateTime={r.doc.lastModified} />,
      orderBy: 'doc.lastModified',
    },
    {
      key: 'autoPurge',
      heading: 'Auto purge',
      isLoggable: true,
      Value: ({rowData: r}) => {
        let restoreWithin = Math.ceil(
          (30 * 24 * 60 * 60 * 1000 -
            (Date.now() - new Date(r.doc && r.doc.lastModified))) /
            1000
        );

        if (restoreWithin < 60) {
          return getTextAfterCount('second', restoreWithin);
        }

        restoreWithin = Math.ceil(restoreWithin / 60);
        if (restoreWithin < 60) {
          return getTextAfterCount('minute', restoreWithin);
        }

        restoreWithin = Math.ceil(restoreWithin / 60);
        if (restoreWithin < 24) {
          return getTextAfterCount('hour', restoreWithin);
        }

        restoreWithin = Math.ceil(restoreWithin / 24);

        return getTextAfterCount('day', restoreWithin);
      },
    },
  ],
  useRowActions: () => [Restore, Purge],
};
