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
    helpText: 'If it is possible that the data being imported already exists in the application and you want to prevent accidentally re-importing the same data twice and creating duplicates, you can use this field to tell integrator.io to ignore existing data. A potential downside of using this field is the slight performance hit needed to check first if a record exists. ',
  },
  'assistantMetadata.ignoreMissing': {
    type: 'checkbox',
    label: 'Ignore missing records',
  },
  'assistantMetadata.lookupType': {
    type: 'select',
    label: 'How should we identify existing records?',
    required: true,
    helpText: 'Select an operation that will be performed in order to locate records in the destination application before attempting to sync the data in your flow. The search options available depend on the capabilities offered by the destination application.',
  },
  'assistantMetadata.lookupQueryParams': {
    type: 'assistantsearchparams',
  },
};
