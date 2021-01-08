import React from 'react';
import ResourceName from '../../../components/ResourceName';
import ViewLogDetail from './actions/ViewLogDetail';

export default {
  columns: () => {
    const columns = [
      {
        heading: 'Date',
        value: r => r.time,
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
        value: r => r.message,
      },
    ];

    return columns;
  },
  rowActions: [ViewLogDetail],
};
