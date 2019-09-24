export default {
  columns: [
    {
      heading: 'Please select flows to attach',
      value: r => r && r.name,
      orderBy: 'name',
    },
  ],
  rowActions: () => [],
};
