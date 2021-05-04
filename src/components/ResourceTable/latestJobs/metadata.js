import React from 'react';
import FlowStepName from './cells/FlowStepName';
import FlowStepStatus from './cells/FlowStepStatus';
import CeligoTimeAgo from '../../CeligoTimeAgo';

export default {
  columns: [
    {
      heading: 'Step',
      Value: ({rowData: r}) => <FlowStepName job={r} />,
    },
    {
      heading: 'Status',
      Value: ({rowData: r}) => <FlowStepStatus job={r} />,
    },
    {
      heading: 'Success',
      Value: ({rowData: r}) => r.numSuccess,
    },
    {
      heading: 'Ignored',
      Value: ({rowData: r}) => r.numIgnore,
    },
    { heading: 'Errors', Value: ({rowData: r}) => r.numOpenError },
    { heading: 'Resolved', Value: ({rowData: r}) => r.numResolved },
    {
      heading: 'Pages',
      Value: ({rowData: r}) => r.type === 'export' ? r.numPagesGenerated : r.numPagesProcessed,
    },
    {
      heading: 'Duration',
      Value: ({rowData: r}) => r.duration,
    },
    {
      heading: 'Completed',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.endedAt} />,
    },
  ],
};
