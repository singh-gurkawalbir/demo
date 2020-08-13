import React from 'react';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';
import CeligoTimeAgo from '../../CeligoTimeAgo';

export default resourceType => ({
  columns: [
    {
      heading: 'Name',
      value: function DefaultResourceDrawerLink(r) {
        return <ResourceDrawerLink resourceType={resourceType} resource={r} />;
      },
      orderBy: 'name',
    },
    {
      heading: 'Last updated',
      value: r => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
  ],
  rowActions: () => [Delete, References],
});
