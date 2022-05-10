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
  'assistantMetadata.ignoreExisting': {
    isLoggable: true,
    type: 'checkbox',
    label: 'Ignore existing records',
    helpText: 'If it is possible that the data being imported already exists in the application and you want to prevent accidentally re-importing the same data twice and creating duplicates, you can use this field to tell integrator.io to ignore existing data. A potential downside of using this field is the slight performance hit needed to check first if a record exists. ',
  },
  'assistantMetadata.ignoreMissing': {
    isLoggable: true,
    type: 'checkbox',
    label: 'Ignore missing records',
  },
  'assistantMetadata.lookupType': {
    isLoggable: true,
    type: 'select',
    label: 'How would you like to identify existing records?',
    required: true,
    helpText: 'Select an operation that will be performed in order to locate records in the destination application before attempting to sync the data in your flow. The search options available depend on the capabilities offered by the destination application.',
  },
  'assistantMetadata.lookupQueryParams': {
    isLoggable: true,
    type: 'assistantsearchparams',
  },
};
