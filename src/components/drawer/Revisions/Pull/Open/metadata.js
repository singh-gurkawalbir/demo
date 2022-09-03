export default function getMetadata({integrationId}) {
  const metadata = {
    fieldMap: {
      description: {
        id: 'description',
        name: 'description',
        type: 'text',
        label: 'Description',
        helpKey: 'pull.description',
        required: true,
      },
      integration: {
        id: 'integration',
        name: 'integration',
        label: 'Integration',
        helpKey: 'pull.integration',
        noApi: true,
        type: 'integrationcloneselect',
        required: true,
        integrationId,
      },
    },
  };

  return metadata;
}

