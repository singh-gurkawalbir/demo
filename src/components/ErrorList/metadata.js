import Retry from './actions/Retry';

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
  ],
  rowActions: () => [Retry],
};
