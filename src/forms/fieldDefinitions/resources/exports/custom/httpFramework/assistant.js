export default {
  'assistantMetadata.version': {
    isLoggable: true,
    type: 'hfoptions',
    assistantFieldType: 'version',
    label: 'API version',
    required: true,
  },
  'assistantMetadata.resource': {
    isLoggable: true,
    type: 'hfoptions',
    assistantFieldType: 'resource',
    label: 'Resources',
    required: true,
  },
  'assistantMetadata.operation': {
    isLoggable: true,
    type: 'hfoptions',
    assistantFieldType: 'operation',
    label: 'API Endpoints',
    required: true,
  },
  'assistantMetadata.exportType': {
    isLoggable: true,
    type: 'hfoptions',
    assistantFieldType: 'exportType',
    label: 'Export type',
    required: true,
  },
  'assistantMetadata.searchParams': {
    isLoggable: true,
    type: 'hfsearchparams',
  },
};

