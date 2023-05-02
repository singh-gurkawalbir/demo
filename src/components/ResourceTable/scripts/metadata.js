import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';
import AuditLogs from '../commonActions/AuditLogs';
import ViewExecutionLogs from '../commonActions/ExecutionLogs';
import Edit from '../commonActions/Edit';
import { useGetTableContext } from '../../CeligoTable/TableContext';

export default {
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      isLoggable: true,
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="scripts" resource={r} />,
      orderBy: 'name',
    },
    {
      key: 'lastUpdated',
      heading: 'Last updated',
      isLoggable: true,
      Value: ({rowData: r}) => <TimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
      width: '12%',
    },
  ],
  useRowActions: () => {
    const tableContext = useGetTableContext();
    const actions = [Edit];

    actions.push(ViewExecutionLogs);

    actions.push(AuditLogs, References);
    if (tableContext.type !== 'flowBuilder') {
      actions.push(Delete);
    }

    return actions;
  },

};
