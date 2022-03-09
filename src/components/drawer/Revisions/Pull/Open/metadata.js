export default function getMetadata({integrationId}) {
  const metadata = {
    fieldMap: {
      description: {
        id: 'description',
        type: 'text',
        label: 'Description',
        required: true,
      },
      integration: {
        id: 'integration',
        name: 'integration',
        label: 'Integration',
        type: 'integrationcloneselect',
        required: true,
        integrationId,
      },
    },
  };

  return metadata;
}

