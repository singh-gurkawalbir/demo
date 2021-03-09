import React from 'react';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';
import AuditLogs from '../commonActions/AuditLogs';
import ViewExecutionLogs from '../commonActions/ExecutionLogs';
import Edit from '../commonActions/Edit';
import CeligoTimeAgo from '../../CeligoTimeAgo';

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
      value: r => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
      width: '12%',
    },
  ],
  rowActions: (r, actionProps) => {
    const actions = [Edit];

    actions.push(ViewExecutionLogs);

    actions.push(AuditLogs, References);
    if (actionProps.type !== 'flowBuilder') {
      actions.push(Delete);
    }

    return actions;
  },

};
