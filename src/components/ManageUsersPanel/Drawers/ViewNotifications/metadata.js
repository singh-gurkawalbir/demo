export default function viewNotificationsMetadata(props) {
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
          name: 'flows',
          type: 'multiselect',
          valueDelimiter: ',',
          label: 'Subscribed flows',
          defaultValue: flowValues,
          options: [{ items: flowOps }],
          selectAllIdentifier: integrationId,
        },
        connections: {
          id: 'connections',
          name: 'connections',
          type: 'multiselect',
          valueDelimiter: ',',
          label: 'Subscribed connections',
          defaultValue: connectionValues,
          options: [{ items: connectionOps }],
        },
      },
    }
  );
}

