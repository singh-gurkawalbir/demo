import Delete from './Actions/Delete';
import Cancel from './Actions/Cancel';

export default {
  columns: () => {
    const columns = [
      {
        heading: 'From User',
        value: r => r && r.fromUser,
        orderBy: 'name',
      },
      {
        heading: 'To User',
        value: r => r && r.toUser,
      },
      {
        heading: 'Integrations',
        value: r => r && r.integrations,
      },
      { heading: 'Status', value: r => r && r.status },
      {
        heading: 'Transfer Date',
        value: r => r && r.transferDate,
      },
    ];

    return columns;
  },
  rowActions: [Cancel, Delete],
};
