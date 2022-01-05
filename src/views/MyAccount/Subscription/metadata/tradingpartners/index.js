import React from 'react';
import References from '../../actions/references';
import ConnectionResourceDrawerLink from '../../../../../components/ResourceDrawerLink/connection';

export default {
  useColumns: () => [
    {
      key: 'tradingPartner',
      heading: 'Trading partner',
      isLoggable: true,
      Value: ({rowData: resource}) => (
        <ConnectionResourceDrawerLink
          resource={resource}
            />
      ),
      orderBy: 'name',
    },
    {
      key: 'whereUsed',
      heading: 'Where used',
      isLoggable: true,
      Value: ({rowData: r}) => <References resourceType="connections" rowData={r} isSubscriptionPage />,
    },
  ],
};
