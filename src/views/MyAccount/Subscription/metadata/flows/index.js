import React from 'react';
import { Link } from 'react-router-dom';
import getRoutePath from '../../../../../utils/routePaths';
import NameCell from '../../../../../components/ResourceTable/flows/cells/NameCell';

export default {
  useColumns: () => [
    {
      key: 'flow',
      heading: 'Flow',
      Value: ({rowData: r}) => (
        <NameCell
          flowId={r._id}
          integrationId={r._integrationId}
          isIntegrationApp={!!r._connectorId}
          name={r.name}
          description={r.description}
          isFree={r.free}
            />
      ),
      orderBy: 'name',
    },
    {
      key: 'integration',
      heading: 'Integration',
      Value: ({rowData: r}) => (
        <div>
          <Link to={getRoutePath(`/integrations/${r?.integrationId || 'none'}`)}>{r?.integrationName}</Link>
        </div>
      ),
    },
  ],
};
