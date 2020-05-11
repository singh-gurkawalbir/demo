import { ConnectorNameComp } from '../ResourceTable/metadata';

export default {
  columns: [
    {
      heading: 'Name',
      value: function ConnectorName(r) {
        return <ConnectorNameComp r={r} />;
      },
    },
    {
      heading: 'Type',
      value: r => r.resourceType,
    },
  ],
};
