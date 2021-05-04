import React from 'react';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import { getJobDuration, getJobStatus } from '../../../utils/errorManagement';
import DownloadFiles from './actions/DownloadFiles';
import DownloadDiagnostics from './actions/DownloadDiagnostics';

export default {
  columns: [
    {
      heading: 'Status',
      Value: ({rowData: r}) => getJobStatus(r),
    },
    {
      heading: 'Duration',
      Value: ({rowData: r}) => getJobDuration(r),
    },
    {
      heading: 'Started',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.startedAt} />,
    },
    {
      heading: 'Completed',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.endedAt} />,
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
    {
      heading: 'Pages',
      Value: ({rowData: r}) => r.numPagesGenerated,
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
