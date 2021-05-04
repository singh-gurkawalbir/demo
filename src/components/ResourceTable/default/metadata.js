import React from 'react';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';
import CeligoTimeAgo from '../../CeligoTimeAgo';

export default resourceType => ({
  columns: [
    {
      heading: 'Name',
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType={resourceType} resource={r} />,
      orderBy: 'name',
    },
    {
      heading: 'Last updated',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
  ],
  rowActions: () => [Delete, References],
});
