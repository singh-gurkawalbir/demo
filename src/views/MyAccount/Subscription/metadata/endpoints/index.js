import React from 'react';
import ConnectorName from '../../../../../components/ResourceTable/commonCells/ConnectorName';
import References from '../../actions/references';
import ConnectionResourceDrawerLink from '../../../../../components/ResourceDrawerLink/connection';

export default {
  useColumns: () => [
    {
      key: 'instances',
      heading: 'Instances',
      Value: ({rowData: r}) => <ConnectionResourceDrawerLink resource={r} />,
      orderBy: 'name',
    },
    {
      key: 'endPoint',
      heading: 'Endpoint apps',
      Value: ({rowData: r}) => <ConnectorName resource={r} />,
    },
    {
      key: 'whereUsed',
      heading: 'Where used',
      Value: ({rowData: r}) => <References resourceType="connections" rowData={r} isSubscriptionPage />,
    },
  ],
};
