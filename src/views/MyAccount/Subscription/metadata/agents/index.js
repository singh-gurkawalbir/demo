import React from 'react';
import References from '../../actions/references';
import ResourceDrawerLink from '../../../../../components/ResourceDrawerLink';

export default {
  useColumns: () => [
    {
      key: 'agent',
      heading: 'Agent',
      isLoggable: true,
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="agents" resource={r} />,
      orderBy: 'name',
    },
    {
      key: 'whereUsed',
      heading: 'Where used',
      isLoggable: true,
      Value: ({rowData: r}) => <References resourceType="agents" rowData={r} />,
    },
  ],
};
