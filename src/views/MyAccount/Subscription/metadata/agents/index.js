import React from 'react';
import References from '../../actions/references';
import ResourceDrawerLink from '../../../../../components/ResourceDrawerLink';

export default {
  useColumns: () => [
    {
      key: 'agent',
      heading: 'Agent',
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="agents" resource={r} />,
      orderBy: 'name',
    },
    {
      key: 'whereUsed',
      heading: 'Where used',
      Value: ({rowData: r}) => <References resourceType="agents" rowData={r} />,
    },
  ],
};
