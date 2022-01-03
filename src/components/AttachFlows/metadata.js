export default {
  useColumns: () => [
    {
      key: 'selectAllFlows',
      heading: 'Select all flows',
      isLoggable: true,
      Value: ({rowData: r}) => r && r.name,
    },
  ],
};
