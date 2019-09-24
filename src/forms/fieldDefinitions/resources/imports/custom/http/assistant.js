export default {
  'assistantMetadata.version': {
    type: 'assistantoptions',
    assistantFieldType: 'version',
    label: 'API Version',
    required: true,
  },
  'assistantMetadata.resource': {
    type: 'assistantoptions',
    assistantFieldType: 'resource',
    label: 'API Name',
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
    label: 'Ignore Existing Records?',
  },
  'assistantMetadata.ignoreMissing': {
    type: 'checkbox',
    label: 'Ignore Missing Records?',
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
