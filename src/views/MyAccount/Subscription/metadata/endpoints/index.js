import React from 'react';
import ConnectorName from '../../../../../components/ResourceTable/commonCells/ConnectorName';
import References from '../../actions/references';
import ConnectionResourceDrawerLink from '../../../../../components/ResourceDrawerLink/connection';

export default {
  useColumns: () => [
    {
      key: 'instances',
      heading: 'Instances',
      isLoggable: true,
      Value: ({rowData: r}) => <ConnectionResourceDrawerLink resource={r} />,
      orderBy: 'name',
    },
    {
      key: 'endPoint',
      heading: 'Endpoint apps',
      isLoggable: true,
      Value: ({rowData: r}) => <ConnectorName resource={r} />,
    },
    {
      key: 'whereUsed',
      heading: 'Where used',
      isLoggable: true,
      Value: ({rowData: r}) => <References resourceType="connections" rowData={r} isSubscriptionPage />,
    },
  ],
};
