import React from 'react';
import DownloadDiagnostics from './actions/DownloadDiagnostics';
import ErrorLink from './ErrorLink';

export default {
  columns: [
    {
      heading: 'Step',
      value: r => r.name,
    },
    { heading: 'Source', value: r => r.type },
    {
      heading: 'Status',
      value: r => r.status,
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
