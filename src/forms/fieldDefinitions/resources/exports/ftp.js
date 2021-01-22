export default {
  'ftp.directoryPath': {
    type: 'uri',
    label: 'Directory path',
    // editorTitle: 'Build directory path',
    required: true,
    showExtract: false,
    showLookup: false,
  },
  'ftp.fileNameStartsWith': {
    type: 'uri',
    label: 'File name starts with',
    // editorTitle: 'Build file name starts with',
    showExtract: false,
    showLookup: false,
  },
  'ftp.fileNameEndsWith': {
    type: 'uri',
    label: 'File name ends with',
    // editorTitle: 'Build file name ends with',
    showExtract: false,
    showLookup: false,
  },
  // #region transform
  'transform.expression.rules': {
    type: 'transformeditor',
    label: 'Transform expression rules',
    sampleData: r => r.sampleData,
    rules: r => r && r.transform && r.transform.rules,
  },
  'transform.script._scriptId': {
    type: 'text',
    label: 'Transform script _script id',
  },
  'transform.script.function': {
    type: 'text',
    label: 'Transform script function',
  },
  // #endregion transform
};
