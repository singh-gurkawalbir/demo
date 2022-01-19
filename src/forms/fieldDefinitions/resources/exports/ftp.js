export default {
  'ftp.directoryPath': {
    isLoggable: true,
    type: 'uri',
    label: 'Directory path',
    required: true,
    showExtract: false,
    showLookup: false,
  },
  'ftp.fileNameStartsWith': {
    isLoggable: true,
    type: 'uri',
    label: 'File name starts with',
    showExtract: false,
    showLookup: false,
  },
  'ftp.fileNameEndsWith': {
    isLoggable: true,
    type: 'uri',
    label: 'File name ends with',
    showExtract: false,
    showLookup: false,
  },
  // #region transform
  'transform.expression.rules': {
    isLoggable: true,
    type: 'transformeditor',
    label: 'Transform expression rules',
    sampleData: r => r.sampleData,
    rules: r => r && r.transform && r.transform.rules,
  },
  'transform.script._scriptId': {
    isLoggable: true,
    type: 'text',
    label: 'Transform script _script id',
  },
  'transform.script.function': {
    isLoggable: true,
    type: 'text',
    label: 'Transform script function',
  },
  // #endregion transform
};
