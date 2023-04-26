import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';

export default resourceType => ({
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType={resourceType} resource={r} />,
      orderBy: 'name',
    },
    {
      key: 'lastUpdated',
      heading: 'Last updated',
      Value: ({rowData: r}) => <TimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
  ],
  useRowActions: () => [Delete, References],
});
