import React, {useCallback} from 'react';
import References from '../../actions/references';
import ResourceDrawerLink from '../../../../../components/ResourceDrawerLink';


export default {
  columns: () => {
    const columns = [
      {
        heading: 'Agent',
        value: function ExportDrawerLink(r) {
          const onClick = useCallback(() => {
            r && r.showDialog && r.showDialog(false);
          }, [r]);
          return <ResourceDrawerLink resourceType="agents" resource={r} onClick={onClick} />;
        },
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
