import React from 'react';
import References from '../../actions/references';
import ResourceDrawerLink from '../../../../../components/ResourceDrawerLink';


export default {
  columns: () => {
    const columns = [
      {
        heading: 'Agent',
        value: function AgentsNameLink(r) {
          return <ResourceDrawerLink resourceType="agents" resource={r} />;
        },
        orderBy: 'name',
      },
      {
        heading: 'Where used',
        value: function Type(r) {
          return <References resourceType="agents" rowData={r} />;
        },
      }
    ];

    return columns;
  },
};
