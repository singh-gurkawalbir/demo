export default {
  useColumns: () => [
    {
      key: 'selectAllFlows',
      heading: 'Select all flows',
      Value: ({rowData: r}) => r && r.name,
    },
  ],
};
