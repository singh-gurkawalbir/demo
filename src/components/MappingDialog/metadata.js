import StandaloneImportMapping from '../AFE/ImportMapping/StandaloneImportMapping';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => r && r.name,
      orderBy: 'name',
    },
    {
      heading: 'Import Mappings',
      value: function action(r) {
        return <StandaloneImportMapping resourceId={r && r._id} />;
      },
    },
  ],
};
