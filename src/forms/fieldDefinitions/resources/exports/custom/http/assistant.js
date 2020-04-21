export default {
  'assistantMetadata.version': {
    type: 'assistantoptions',
    assistantFieldType: 'version',
    label: 'API version',
    required: true,
  },
  'assistantMetadata.resource': {
    type: 'assistantoptions',
    assistantFieldType: 'resource',
    label: 'API name',
    required: true,
  },
  'assistantMetadata.operation': {
    type: 'assistantoptions',
    assistantFieldType: 'operation',
    label: 'Operation',
    required: true,
  },
  'assistantMetadata.exportType': {
    type: 'assistantoptions',
    assistantFieldType: 'exportType',
    label: 'Export type',
    required: true,
  },
  'assistantMetadata.searchParams': {
    type: 'assistantsearchparams',
  },
};
