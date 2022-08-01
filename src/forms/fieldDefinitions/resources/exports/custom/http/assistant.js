export default {
  'assistantMetadata.version': {
    isLoggable: true,
    type: 'assistantoptions',
    assistantFieldType: 'version',
    label: 'API version',
    required: true,
  },
  'assistantMetadata.resource': {
    isLoggable: true,
    type: 'assistantoptions',
    assistantFieldType: 'resource',
    label: 'Resources',
    required: true,
  },
  'assistantMetadata.operation': {
    isLoggable: true,
    type: 'assistantoptions',
    assistantFieldType: 'operation',
    label: 'API Endpoints',
    required: true,
  },
  'assistantMetadata.exportType': {
    isLoggable: true,
    type: 'assistantoptions',
    assistantFieldType: 'exportType',
    label: 'Export type',
    required: true,
  },
  'assistantMetadata.searchParams': {
    isLoggable: true,
    type: 'assistantsearchparams',
  },
};
