import React from 'react';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import { formatLastModified } from '../../CeligoTable/util';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';
import AuditLogs from '../commonActions/AuditLogs';
import Edit from '../commonActions/Edit';

export default {
  columns: [
    {
      heading: 'Name',
      value: function ScriptsDrawerLink(r) {
        return <ResourceDrawerLink resourceType="scripts" resource={r} />;
      },
      orderBy: 'name',
    },
    {
      heading: 'Last updated',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
  rowActions: [Edit, AuditLogs, References, Delete],
};
