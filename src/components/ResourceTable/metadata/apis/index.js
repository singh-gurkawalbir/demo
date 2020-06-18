import React from 'react';
import Delete from '../../actions/Delete';
import References from '../../actions/References';
import { formatLastModified } from '../../../CeligoTable/util';
import ResourceDrawerLink from '../../../ResourceDrawerLink';
import AuditLogs from '../../actions/AuditLogs';

export default {
  columns: [
    {
      heading: 'Name',
      value: function ExportDrawerLink(r) {
        return <ResourceDrawerLink resourceType="apis" resource={r} />;
      },
      orderBy: 'name',
    },
    {
      heading: 'Function',
      value: function functionName(r) {
        return r.function
      }
    },
    {
      heading: 'Script',
      value: function scriptName(r) {
        return r._scriptId
      }
    },
    {
      heading: 'Last updated',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
  rowActions: () => [AuditLogs, References, Delete],
};
