export default {
  'file.fileDefinition.resourcePath': {
    label: 'Resource Path',
    type: 'text',
  },
  'file.filedefinition.rules': {
    type: 'filedefinitioneditor',
    label: 'File Definition Rules ',
    refreshOptionsOnChangesTo: [
      'edix12.format',
      'file.fileDefinition.resourcePath',
    ],
    userDefinitionId: r =>
      r &&
      r.file &&
      r.file.fileDefinition &&
      r.file.fileDefinition._fileDefinitionId,
  },
  pageSize: {
    type: 'text',
    label: 'Page Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    type: 'relativeuri',
    label: 'Data URI Template',
    refreshOptionsOnChangesTo: ['name'],
    connectionId: r => r && r._connectionId,
  },
};
