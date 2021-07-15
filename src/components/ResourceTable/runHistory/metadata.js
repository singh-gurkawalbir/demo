import React from 'react';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import { getJobDuration, getJobStatus, FILTER_KEYS } from '../../../utils/errorManagement';
import DownloadFiles from './actions/DownloadFiles';
import DownloadDiagnostics from './actions/DownloadDiagnostics';
import MultiSelectColumnFilter from '../commonCells/MultiSelectColumnFilter';

export default {
  useColumns: () => [
    {
      key: 'status',
      heading: 'Status',
      HeaderValue: function FlowSearchFilter() {
        const statusOptions = [{_id: 'all', name: 'All status'},
          {_id: 'canceled', name: 'Canceled'},
          {_id: 'completed', name: 'Completed'},
          {_id: 'failed', name: 'failed'}];

        return (
          <MultiSelectColumnFilter
            title="Status"
            filterBy="status"
            filterKey={FILTER_KEYS.RUN_HISTORY}
            options={statusOptions.map(({ _id, name}) => ({_id, name }))} />
        );
      },
      Value: ({rowData: r}) => getJobStatus(r),
      width: '10%',
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
