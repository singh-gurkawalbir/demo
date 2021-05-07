import React from 'react';
import References from '../../actions/references';
import ConnectionResourceDrawerLink from '../../../../../components/ResourceDrawerLink/connection';

export default {
  useColumns: () => [
    {
      key: 'tradingPartner',
      heading: 'Trading partner',
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
      Value: ({rowData: r}) => <References resourceType="connections" rowData={r} isSubscriptionPage />,
    },
  ],
};
