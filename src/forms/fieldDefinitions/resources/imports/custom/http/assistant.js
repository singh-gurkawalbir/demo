export default {
  'assistantMetadata.version': {
    type: 'importassistantoptions',
    assistantFieldType: 'version',
    label: 'API Version',
    required: true,
  },
  'assistantMetadata.resource': {
    type: 'importassistantoptions',
    assistantFieldType: 'resource',
    label: 'API Name',
    required: true,
  },
  'assistantMetadata.operation': {
    type: 'importassistantoptions',
    assistantFieldType: 'operation',
    label: 'Operation',
    required: true,
  },
  'assistantMetadata.ignoreExisting': {
    type: 'importassistantoptions',
    assistantFieldType: 'ignoreExisting',
    label: 'Ignore Existing Records?',
  },
  'assistantMetadata.ignoreMissing': {
    type: 'importassistantoptions',
    assistantFieldType: 'ignoreMissing',
    label: 'Ignore Missing Records?',
  },
  'assistantMetadata.lookupType': {
    type: 'importassistantoptions',
    assistantFieldType: 'lookupType',
    label: 'How should we identify existing records?',
    required: true,
  },
  'assistantMetadata.lookupQueryParams': {
    type: 'assistantsearchparams',
  },
};
