import React from 'react';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import { getJobDuration, getJobStatus } from '../../../utils/errorManagement';
import DownloadFiles from './actions/DownloadFiles';
import DownloadDiagnostics from './actions/DownloadDiagnostics';

export default {
  columns: [
    {
      heading: 'Status',
      value: r => getJobStatus(r),
    },
    {
      heading: 'Duration',
      value: r => getJobDuration(r),
    },
    {
      heading: 'Started',
      value: r => <CeligoTimeAgo date={r.startedAt} />,
    },
    {
      heading: 'Completed',
      value: r => <CeligoTimeAgo date={r.endedAt} />,
    },
    {
      heading: 'Success',
      value: r => r.numSuccess,
    },
    {
      heading: 'Ignored',
      value: r => r.numIgnore,
    },
    { heading: 'Errors', value: r => r.numOpenError },
    {
      heading: 'Pages',
      value: r => r.numPagesGenerated,
    },

  ],
  rowActions: job => {
    const actions = [DownloadDiagnostics];

    if (job.files?.length) {
      actions.push(DownloadFiles);
    }

    return actions;
  },
};
