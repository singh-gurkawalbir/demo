import React from 'react';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import { formatLastModified } from '../../CeligoTable/util';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';

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
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
  rowActions: () => [Delete, References],
});
