import React from 'react';
import ErrorLink from './ErrorLink';
import JobStatus from '../JobStatus';
import FlowStepName from './FlowStepName';
import DateTimeDisplay from '../../DateTimeDisplay';

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
    { heading: 'Errors', value: r => <ErrorLink job={r} /> },
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
      value: r => <DateTimeDisplay dateTime={r.endedAt} />,
    },
  ],
};
