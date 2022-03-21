export default function getMetadata({integrationId}) {
  const metadata = {
    fieldMap: {
      description: {
        id: 'description',
        name: 'description',
        type: 'text',
        label: 'Description',
        required: true,
      },
      integration: {
        id: 'integration',
        name: 'integration',
        label: 'Integration',
        helpKey: 'pull.integration',
        type: 'integrationcloneselect',
        required: true,
        integrationId,
      },
    },
  };

  return metadata;
}

