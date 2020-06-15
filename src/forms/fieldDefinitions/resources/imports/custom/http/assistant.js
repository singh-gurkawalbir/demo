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
  'assistantMetadata.ignoreExisting': {
    type: 'checkbox',
    label: 'Ignore existing records',
  },
  'assistantMetadata.ignoreMissing': {
    type: 'checkbox',
    label: 'Ignore missing records',
  },
  'assistantMetadata.lookupType': {
    type: 'select',
    label: 'How should we identify existing records?',
    required: true,
  },
  'assistantMetadata.lookupQueryParams': {
    type: 'assistantsearchparams',
  },
};
