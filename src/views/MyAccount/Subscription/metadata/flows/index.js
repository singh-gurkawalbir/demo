import React, { useCallback } from 'react';
import NameCell from '../../../../../components/ResourceTable/metadata/flows/NameCell';

export default {
  columns: () => {
    const columns = [
      {
        heading: 'Flow',
        value: function Name(r) {
          const onClick = useCallback(() => {
            r && r.showDialog && r.showDialog(false);
          }, [r]);
          return (
            <NameCell
              flowId={r._id}
              integrationId={r._integrationId}
              isIntegrationApp={!!r._connectorId}
              name={r.name}
              description={r.description}
              isFree={r.free}
              onClick={onClick}
              isSubscriptionPage
            />
          );
        },
        orderBy: 'name',
      },
      {
        heading: 'Integration',
        value: r => r?.integrationName,
      }
    ];

    return columns;
  },
};
