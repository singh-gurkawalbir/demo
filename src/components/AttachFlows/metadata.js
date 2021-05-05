export default {
  useColumns: () => [
    {
      key: 'selectAllFlows',
      heading: 'Select all flows',
      Value: r => r && r.name,
    },
  ],
};
