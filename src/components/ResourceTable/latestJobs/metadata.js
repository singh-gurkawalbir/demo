import React from 'react';
import JobStatus from '../../JobDashboard/JobStatus';
import FlowStepName from './actions/FlowStepName';
import CeligoTimeAgo from '../../CeligoTimeAgo';

export default {
  columns: [
    {
      heading: 'Step',
      value: r => <FlowStepName job={r} />,
    },
    {
      heading: 'Status',
      value: r => <JobStatus job={r} />,
    },
    {
      heading: 'Success',
      value: r => (r.type === 'export' && r.numSuccess === 0) ? 'N/A' : r.numSuccess,
    },
    {
      heading: 'Ignored',
      value: r => r.numIgnore,
    },
    { heading: 'Errors', value: r => r.numError },
    {
      heading: 'Pages',
      value: r => r.type === 'export' ? r.numPagesGenerated : r.numPagesProcessed,
    },
    {
      heading: 'Duration',
      value: r => r.duration,
    },
    {
      heading: 'Completed',
      value: r => <CeligoTimeAgo date={r.endedAt} />,
    },
  ],
};
