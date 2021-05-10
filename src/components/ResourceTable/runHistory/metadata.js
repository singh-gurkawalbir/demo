import React from 'react';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import { getJobDuration, getJobStatus } from '../../../utils/errorManagement';
import DownloadFiles from './actions/DownloadFiles';
import DownloadDiagnostics from './actions/DownloadDiagnostics';

export default {
  useColumns: () => [
    {
      key: 'status',
      heading: 'Status',
      Value: ({rowData: r}) => getJobStatus(r),
    },
    {
      key: 'duration',
      heading: 'Duration',
      Value: ({rowData: r}) => getJobDuration(r),
    },
    {
      key: 'started',
      heading: 'Started',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.startedAt} />,
    },
    {
      key: 'completed',
      heading: 'Completed',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.endedAt} />,
    },
    {
      key: 'success',
      heading: 'Success',
      Value: ({rowData: r}) => r.numSuccess,
    },
    {
      key: 'Ignored',
      heading: 'Ignored',
      Value: ({rowData: r}) => r.numIgnore,
    },
    {
      key: 'errors',
      heading: 'Errors',
      Value: ({rowData: r}) => r.numOpenError },
    {
      key: 'pages',
      heading: 'Pages',
      Value: ({rowData: r}) => r.numPagesGenerated,
    },

  ],
  useRowActions: job => {
    const actions = [DownloadDiagnostics];

    if (job.files?.length) {
      actions.push(DownloadFiles);
    }

    return actions;
  },
};
