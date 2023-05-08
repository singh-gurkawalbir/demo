export const fieldMeta = {
  fieldMap: {
    GraphType: {
      id: 'Type',
      name: 'Type',
      type: 'select',
      placeholder: 'Type of Graph',
      visibleWhenAll: [{ field: 'application', isNot: [''] }],
      options: [
        {
          items: [
            { label: 'Area', value: 'Area' },
            { label: 'Bar', value: 'Bar' },
            { label: 'Pie', value: 'Pie' },
          ],
        },
      ],
      label: 'Graph Type',
      required: true,
      noApi: true,
    },
    DateRange: {
      id: 'Range',
      name: 'Range',
      type: 'select',
      placeholder: 'Please Select Range',
      visibleWhenAll: [{ field: 'application', isNot: [''] }],
      options: [
        {
          items: [
            { label: 'Last 30 days', value: 'Last 30 days' },
            { label: 'Last 15 days', value: 'Last 15 days' },
            { label: 'Last 7 days', value: 'Last 7 days' },
          ],
        },
      ],
      label: 'Date Range',
      required: true,
      noApi: true,
    },
    connectionList: {
      id: 'connection',
      name: 'connection',
      helpKey: 'snapshot.description',
      type: 'text',
      noApi: true,
      label: 'Connection List',
      required: true,
    },
  },
  layout: {
    fields: ['GraphType', 'DateRange', 'connectionList'],
  },
};
