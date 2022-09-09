import React from 'react';
import FlowStepStatus from '../../latestJobs/cells/FlowStepStatus';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import ErrorCell from '../../../JobDashboard/RunHistory/ErrorCell';
import UserName from '../cells/UserName';
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  useColumns: () => [
    {
      key: 'status',
      heading: 'Retry status',
      isLoggable: true,
      Value: ({rowData: r}) => <FlowStepStatus job={r} />,
    },
    {
      key: 'duration',
      heading: 'Duration',
      isLoggable: true,
      Value: ({rowData: r}) => r.duration,
    },
    {
      key: 'started',
      heading: 'Retry started',
      isLoggable: true,
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.startedAt} />,
    },
    {
      key: 'completed',
      heading: 'Retry completed',
      isLoggable: true,
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.endedAt} />,
    },
    {
      key: 'success',
      heading: 'Success',
      isLoggable: true,
      Value: ({rowData: r}) => r.numSuccess,
    },
    {
      key: 'ignored',
      heading: 'Ignored',
      isLoggable: true,
      Value: ({rowData: r}) => r.numIgnore,
    },
    { key: 'errors',
      heading: 'Errors',
      // these fields are numbers so it should be okay if they are loggable
      isLoggable: true,
      Value: ({rowData: r}) => <ErrorCell job={r} disabled /> },
    {
      key: 'startedBy',
      heading: 'Retry started by',
      isLoggable: true,
      Value: ({rowData: r}) => {
        const {flowId} = useGetTableContext;

        return <UserName userId={r.triggeredBy} flowId={flowId} />;
      },
    },
  ],
};
