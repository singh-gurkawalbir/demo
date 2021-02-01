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
        value: r => <CeligoTimeAgo date={r.time} />,
      },
      {
        heading: 'Step name',
        value: function StepName(r) {
          return (
            <ResourceName
              resourceId={r._resourceId}
          />
          );
        },
      },
      {
        heading: 'Function type',
        value: r => r.functionType,
      },
      {
        heading: 'Log level',
        value: r => r.logLevel,
      },
      {
        heading: 'Message',
        width: '25%',
        value: r => (
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
