import React from 'react';
import { Link } from 'react-router-dom';
import getRoutePath from '../../../../../utils/routePaths';
import NameCell from '../../../../../components/ResourceTable/metadata/flows/NameCell';

export default {
  columns: () => {
    const columns = [
      {
        heading: 'Flow',
        value: function Name(r) {
          return (
            <NameCell
              flowId={r._id}
              integrationId={r._integrationId}
              isIntegrationApp={!!r._connectorId}
              name={r.name}
              description={r.description}
              isFree={r.free}
            />
          );
        },
        orderBy: 'name',
      },
      {
        heading: 'Integration',
        value: function Name(r) {
          return (
            <div>
              <Link to={getRoutePath(`/integrations/${r?.integrationId || 'none'}`)}>{r?.integrationName}</Link>
            </div>
          );
        },
      }
    ];

    return columns;
  },
};
