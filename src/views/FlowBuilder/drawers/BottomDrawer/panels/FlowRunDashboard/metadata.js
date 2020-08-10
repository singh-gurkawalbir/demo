import React from 'react';
import DownloadDiagnostics from './actions/DownloadDiagnostics';
import CancelJob from './actions/CancelJob';
import ErrorLink from './ErrorLink';
import JobStatus from '../../../../../../components/JobDashboard/JobStatus';
import {JOB_STATUS} from '../../../../../../utils/constants';

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
  rowActions: r => {
    const actions = [];

    if (r?._flowJobId && r.status !== JOB_STATUS.QUEUED) {
      actions.push(DownloadDiagnostics);
      if (r.status === JOB_STATUS.RUNNING) {
        actions.push(CancelJob);
      }
    }

    return actions;
  },
};
