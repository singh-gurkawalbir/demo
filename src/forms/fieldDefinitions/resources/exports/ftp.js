export default {
  'ftp.directoryPath': {
    type: 'text',
    label: 'Directory Path',
    required: true,
  },
  'ftp.fileNameStartsWith': {
    type: 'text',
    label: 'File Name Starts With',
  },
  'ftp.fileNameEndsWith': {
    type: 'text',
    label: 'File Name Ends With',
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
    label: 'Transform script _script Id',
  },
  'transform.script.function': {
    type: 'text',
    label: 'Transform script function',
  },
  // #endregion transform
};
