import React from 'react';
import References from '../../actions/references';


export default {
  columns: () => {
    const columns = [
      {
        heading: 'Agent',
        value: r => r?.name,
        orderBy: 'name',
      },
      {
        heading: 'Where used',
        value: function Type(r) {
          return <References resourceType="agents" rowData={r} isSubscriptionPage />;
        },
      }
    ];

    return columns;
  },
};
