import React from 'react';
import ConnectorName from '../../../../../components/ResourceTable/commonCells/ConnectorName';
import References from '../../actions/references';
import ConnectionResourceDrawerLink from '../../../../../components/ResourceDrawerLink/connection';

export default {
  columns: () => {
    const columns = [
      {
        heading: 'Instances',
        value: r => <ConnectionResourceDrawerLink resource={r} />,
        orderBy: 'name',
      },
      {
        heading: 'Endpoint apps',
        value: r => <ConnectorName resource={r} />,
      },
      {
        heading: 'Where used',
        value: r => <References resourceType="connections" rowData={r} isSubscriptionPage />,
      },
    ];

    return columns;
  },
};
