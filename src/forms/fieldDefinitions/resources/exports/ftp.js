export default {
  'ftp.directoryPath': {
    loggable: true,
    type: 'uri',
    label: 'Directory path',
    required: true,
    showExtract: false,
    showLookup: false,
  },
  'ftp.fileNameStartsWith': {
    loggable: true,
    type: 'uri',
    label: 'File name starts with',
    showExtract: false,
    showLookup: false,
  },
  'ftp.fileNameEndsWith': {
    loggable: true,
    type: 'uri',
    label: 'File name ends with',
    showExtract: false,
    showLookup: false,
  },
  // #region transform
  'transform.expression.rules': {
    loggable: true,
    type: 'transformeditor',
    label: 'Transform expression rules',
    sampleData: r => r.sampleData,
    rules: r => r && r.transform && r.transform.rules,
  },
  'transform.script._scriptId': {
    loggable: true,
    type: 'text',
    label: 'Transform script _script id',
  },
  'transform.script.function': {
    loggable: true,
    type: 'text',
    label: 'Transform script function',
  },
  // #endregion transform
};
