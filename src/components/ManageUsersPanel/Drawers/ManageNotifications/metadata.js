export default function notificationsMetadata(props) {
  const {
    connectionValues,
    connectionOps,
    flowValues,
    flowOps,
    integrationId,
  } = props;

  return (
    {
      fieldMap: {
        flows: {
          id: 'flows',
          helpKey: 'notifications.jobErrors',
          name: 'flows',
          type: 'multiselect',
          valueDelimiter: ',',
          label: 'Notify user on flow error',
          defaultValue: flowValues,
          options: [{ items: flowOps }],
          selectAllIdentifier: integrationId,
        },
        connections: {
          id: 'connections',
          helpKey: 'notifications.connections',
          name: 'connections',
          type: 'multiselect',
          valueDelimiter: ',',
          label: 'Notify user when connection goes offline',
          defaultValue: connectionValues,
          options: [{ items: connectionOps }],
        },
      },
    }
  );
}
