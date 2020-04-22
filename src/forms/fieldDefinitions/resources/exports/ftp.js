export default {
  'ftp.directoryPath': {
    type: 'text',
    label: 'Directory path',
    required: true,
  },
  'ftp.fileNameStartsWith': {
    type: 'text',
    label: 'File name starts with',
  },
  'ftp.fileNameEndsWith': {
    type: 'text',
    label: 'File name ends with',
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
