import React, { useCallback } from 'react';
import { ConnectorNameComp } from '../../../../../components/ResourceTable/metadata';
import References from '../../actions/references';
import ConnectionResourceDrawerLink from '../../../../../components/ResourceDrawerLink/connection';


export default {
  columns: () => {
    const columns = [
      {
        heading: 'Instances',
        value: function ConnectionDrawerLink(resource) {
          const onClick = useCallback(() => {
            resource && resource.showDialog && resource.showDialog(false);
          }, [resource]);
          return (
            <ConnectionResourceDrawerLink
              resource={resource}
              onClick={onClick}
            />
          );
        },
        orderBy: 'name',
      },
      {
        heading: 'Endpoint apps',
        value: function ConnectorName(r) {
          return <ConnectorNameComp r={r} />;
        },
      },
      {
        heading: 'Where used',
        value: function Type(r) {
          return <References resourceType="connections" rowData={r} isSubscriptionPage />;
        },
      }
    ];

    return columns;
  },
};
