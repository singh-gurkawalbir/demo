import React from 'react';
import ResourceName from '../../../components/ResourceName';
import OverflowWrapper from '../../../components/ResourceTable/errorManagement/cells/OverflowWrapper';
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
        value: r => (
          <OverflowWrapper
            message={r.message}
            style={{maxWidth: 659}} />
        ),

      },
    ];

    return columns;
  },
  rowActions: [ViewLogDetail],
};
