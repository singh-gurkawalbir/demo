import React from 'react';
import { useGetTableContext } from '../CeligoTable/TableContext';
import ResourceLink from './ResourceLink';

export default {
  rowKey: 'id',
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      isLoggable: true,
      Value: ({rowData: r}) => {
        const { onClose, integrationId } = useGetTableContext();

        return (
          <ResourceLink
            integrationId={integrationId}
            name={r.name}
            resourceType={r.resourceType}
            id={r.id}
            onClick={onClose} />
        );
      },
    },
    {
      key: 'type',
      heading: 'Type',
      isLoggable: true,
      Value: ({rowData: r}) => r.resourceType,
    },
  ],
};
