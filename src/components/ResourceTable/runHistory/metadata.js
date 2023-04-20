import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
import { getJobDuration } from '../../../utils/errorManagement';
import DownloadFiles from './actions/DownloadFiles';
import DownloadDiagnostics from './actions/DownloadDiagnostics';
import JobStatusWithTag from './JobStatusWithTag';

export default {
  useColumns: () => [
    {
      key: 'status',
      heading: 'Status',
      isLoggable: true,
      Value: ({rowData: r}) => <JobStatusWithTag job={r} />,
      width: '10%',
    },
    {
      key: 'duration',
      heading: 'Duration',
      isLoggable: true,
      Value: ({rowData: r}) => getJobDuration(r),
    },
    {
      key: 'started',
      heading: 'Started',
      isLoggable: true,
      Value: ({rowData: r}) => <TimeAgo date={r.startedAt} />,
    },
    {
      key: 'completed',
      heading: 'Completed',
      isLoggable: true,
      Value: ({rowData: r}) => <TimeAgo date={r.endedAt} />,
    },
    {
      key: 'success',
      heading: 'Success',
      isLoggable: true,
      Value: ({rowData: r}) => r.numSuccess,
    },
    {
      key: 'Ignored',
      heading: 'Ignored',
      isLoggable: true,
      Value: ({rowData: r}) => r.numIgnore,
    },
    {
      key: 'errors',
      heading: 'Errors',
      isLoggable: true,
      Value: ({rowData: r}) => r.numError,
    },
    {
      key: 'pages',
      heading: 'Pages',
      isLoggable: true,
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
