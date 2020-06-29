export default {
  'ftp.directoryPath': {
    type: 'namewitheditor',
    label: 'Directory path',
    editorTitle: 'Build directory path',
    required: true,
  },
  'ftp.fileNameStartsWith': {
    type: 'namewitheditor',
    label: 'File name starts with',
    editorTitle: 'Build file name starts with',
  },
  'ftp.fileNameEndsWith': {
    type: 'namewitheditor',
    label: 'File name ends with',
    editorTitle: 'Build file name ends with',
  },
  'ftp.backupDirectoryPath': {
    type: 'text',
    label: 'Archived directory path',
    visibleWhen: [
      {
        field: 'file.skipDelete',
        is: [false],
      }
    ]
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
