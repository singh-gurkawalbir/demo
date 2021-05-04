import React from 'react';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import ResourceName from '../../ResourceName';
import TextOverflowCell from '../../TextOverflowCell';
import ViewLogDetail from './actions/ViewLogDetail';

export default {
  columns: () => {
    const columns = [
      {
        heading: 'Date',
        Value: ({rowData: r}) => <CeligoTimeAgo date={r.time} />,
      },
      {
        heading: 'Step name',
        Value: ({rowData: r}) => (
          <ResourceName
            resourceId={r._resourceId}
          />
        ),
      },
      {
        heading: 'Function type',
        Value: ({rowData: r}) => r.functionType,
      },
      {
        heading: 'Log level',
        Value: ({rowData: r}) => r.logLevel,
      },
      {
        heading: 'Message',
        width: '25%',
        Value: ({rowData: r}) => (
          <TextOverflowCell
            message={r.message}
            />
        ),
      },
    ];

    return columns;
  },
  rowActions: [ViewLogDetail],
};
