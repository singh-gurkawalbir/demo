import React from 'react';
import { useGetTableContext } from '../CeligoTable/TableContext';
import ResourceLink from './ResourceLink';

export default {
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      Value: ({rowData: r}) => {
        const {onClose} = useGetTableContext();

        return <ResourceLink name={r.name} resourceType={r.resourceType} id={r.id} onClick={onClose} />;
      },
    },
    {
      key: 'type',
      heading: 'Type',
      Value: ({rowData: r}) => r.resourceType,
    },
  ],
};
