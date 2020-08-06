import React from 'react';
import { formatLastModified } from '../../CeligoTable/util';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import { ScriptName } from '../metadata';
import Delete from '../commonActions/Delete';
import AuditLogs from '../commonActions/AuditLogs';
import Edit from '../commonActions/Edit';

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
        return r.function;
      },
    },
    {
      heading: 'Script',
      value: function scriptName(r) {
        return <ScriptName id={r._scriptId} />;
      },
    },
    {
      heading: 'Last updated',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
  rowActions: () => [Edit, AuditLogs, Delete],
};
