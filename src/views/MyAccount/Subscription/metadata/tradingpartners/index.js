import React, {useCallback} from 'react';
import References from '../../actions/references';
import ConnectionResourceDrawerLink from '../../../../../components/ResourceDrawerLink/connection';


export default {
  columns: () => {
    const columns = [
      {
        heading: 'Trading partner',
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
        heading: 'Where used',
        value: function Type(r) {
          return <References resourceType="connections" rowData={r} isSubscriptionPage />;
        },
      }
    ];

    return columns;
  },
};
