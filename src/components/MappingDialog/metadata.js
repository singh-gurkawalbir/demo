import Mapping from './Mapping';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => r && r.name,
      orderBy: 'name',
    },
    {
      heading: 'Import Mappings',
      value: function MappingAction(r) {
        return (
          <Mapping
            connectionId={r && r._connectionId}
            resourceId={r && r._id}
          />
        );
      },
    },
  ],
};
