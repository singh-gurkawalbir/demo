export default {
  columns: [
    {
      heading: 'Message',
      value: r => r.message,
    },
    { heading: 'Source', value: r => r.source },
    {
      heading: 'Code',
      value: r => r.code,
    },
    {
      heading: 'Time stamp',
      value: r => r.occurredAt,
    },
    {
      heading: 'Resolved By',
      value: r => r.resolvedBy,
    },
  ],
};
