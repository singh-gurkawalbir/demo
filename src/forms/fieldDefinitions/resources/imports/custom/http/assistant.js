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
    helpText: 'Choose the <a href="https://api.slack.com/methods"> API resource </a>to send the records to Slack, such as <b> chat, groups,</b> or <b>team</b>. The methods below will change according to the resource you apply.',
  },
  'assistantMetadata.operation': {
    type: 'assistantoptions',
    assistantFieldType: 'operation',
    label: 'Operation',
    required: true,
    helpText: 'Choose the Slack <a href="https://api.slack.com/methods"> API methods </a> for the selected resource. For example, if you’re posting a field to a specific channel, select <b>chat</b> for the resource and <b>chat.postMessage</b> for the method. ',
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
