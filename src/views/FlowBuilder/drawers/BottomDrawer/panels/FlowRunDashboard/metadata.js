
export default {
  columns: [
    {
      heading: 'Step',
      value: r => r.message,
    },
    { heading: 'Source', value: r => r.source },
    {
      heading: 'Status',
      value: r => r.code,
    },
    {
      heading: 'Success',
      value: r => r.occurredAt,
    },
    {
      heading: 'Ignored',
      value: r => r.message,
    },
    { heading: 'Errors', value: r => r.source },
    {
      heading: 'Pages',
      value: r => r.code,
    },
    {
      heading: 'Duration',
      value: r => r.occurredAt,
    },
    {
      heading: 'Completed',
      value: r => r.occurredAt,
    },
  ],
};
