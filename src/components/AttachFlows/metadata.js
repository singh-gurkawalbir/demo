export default {
  useColumns: () => [
    {
      key: 'selectAllFlows',
      heading: 'Select all flows',
      width: '90%',
      isLoggable: true,
      Value: ({rowData: r}) => r && r.name,
    },
  ],
};
