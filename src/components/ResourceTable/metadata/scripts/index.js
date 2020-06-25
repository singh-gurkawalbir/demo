import React from 'react';
import ResourceDrawerLink from '../../../ResourceDrawerLink';
import Delete from '../../actions/Delete';
import References from '../../actions/References';
import AuditLogs from '../../actions/AuditLogs';
import { formatLastModified } from '../../../CeligoTable/util';
import Edit from '../../actions/Edit';

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
