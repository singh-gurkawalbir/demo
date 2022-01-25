import React from 'react';
import HeaderWithHelpText from '../commonCells/HeaderWithHelpText';
import FlowStepName from './cells/FlowStepName';
import FlowStepStatus from './cells/FlowStepStatus';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import ErrorCell from '../../JobDashboard/RunHistory/ErrorCell';

export default {
  useColumns: () => [
    {
      key: 'step',
      heading: 'Step',
      isLoggable: true,
      Value: ({rowData: r}) => <FlowStepName job={r} />,
    },
    {
      key: 'status',
      heading: 'Status',
      isLoggable: true,
      Value: ({rowData: r}) => <FlowStepStatus job={r} />,
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
      Value: ({rowData: r}) => <ErrorCell job={r} /> },
    {
      key: 'resolved',
      heading: 'Resolved',
      isLoggable: true,
      HeaderValue: () => <HeaderWithHelpText title="Auto-resolved" helpKey="runConsole.resolved" />,
      Value: ({rowData: r}) => r.numResolved },
    {
      key: 'pages',
      heading: 'Pages',
      isLoggable: true,
      Value: ({rowData: r}) => r.type === 'export' ? r.numPagesGenerated || r.numPagesProcessed : r.numPagesProcessed,
    },
    {
      key: 'duration',
      heading: 'Duration',
      isLoggable: true,
      Value: ({rowData: r}) => r.duration,
    },
    {
      key: 'completed',
      heading: 'Completed',
      isLoggable: true,
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.endedAt} />,
    },
  ],
};
