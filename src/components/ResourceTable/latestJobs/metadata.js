import React from 'react';
import FlowStepName from './cells/FlowStepName';
import FlowStepStatus from './cells/FlowStepStatus';
import CeligoTimeAgo from '../../CeligoTimeAgo';

export default {
  useColumns: () => [
    {
      key: 'step',
      heading: 'Step',
      Value: ({rowData: r}) => <FlowStepName job={r} />,
    },
    {
      key: 'status',
      heading: 'Status',
      Value: ({rowData: r}) => <FlowStepStatus job={r} />,
    },
    {
      key: 'success',
      heading: 'Success',
      Value: ({rowData: r}) => r.numSuccess,
    },
    {
      key: 'ignored',
      heading: 'Ignored',
      Value: ({rowData: r}) => r.numIgnore,
    },
    { key: 'errors',
      heading: 'Errors',
      Value: ({rowData: r}) => r.numOpenError },
    {
      key: 'resolved',
      heading: 'Resolved',
      Value: ({rowData: r}) => r.numResolved },
    {
      key: 'pages',
      heading: 'Pages',
      Value: ({rowData: r}) => r.type === 'export' ? r.numPagesGenerated || r.numPagesProcessed : r.numPagesProcessed,
    },
    {
      key: 'duration',
      heading: 'Duration',
      Value: ({rowData: r}) => r.duration,
    },
    {
      key: 'completed',
      heading: 'Completed',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.endedAt} />,
    },
  ],
};
