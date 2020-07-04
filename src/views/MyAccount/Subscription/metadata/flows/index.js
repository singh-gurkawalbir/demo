export default {
  columns: () => {
    const columns = [
      {
        heading: 'Flow',
        value: r => r?.name,
        orderBy: 'name',
      },
      {
        heading: 'Integration',
        value: r => r?.integrationName,
      }
    ];

    return columns;
  },
};
