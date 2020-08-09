import React from 'react';
import DownloadDiagnostics from './actions/DownloadDiagnostics';
import ErrorLink from './ErrorLink';
import JobStatus from '../../../../../../components/JobDashboard/JobStatus';

export default {
  columns: [
    {
      heading: 'Step',
      value: r => r.name,
    },
    {
      heading: 'Status',
      value: r => <JobStatus job={r} />,
    },
    {
      heading: 'Success',
      value: r => r.numSuccess,
    },
    {
      heading: 'Ignored',
      value: r => r.numIgnore,
    },
    { heading: 'Errors', value: r => <ErrorLink job={r} /> },
    {
      heading: 'Pages',
      value: r => r.numPagesProcessed,
    },
    {
      heading: 'Duration',
      value: r => r.duration,
    },
    {
      heading: 'Completed',
      value: r => r.endedAt,
    },
  ],
  rowActions: () => [DownloadDiagnostics],
};
