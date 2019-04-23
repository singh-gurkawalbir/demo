export default {
  fields: [
    { formId: 'common' },
    // { fieldId: 'ftp.directoryPath' },
    // { fieldId: 'ftp.fileNameStartsWith' },
    // { fieldId: 'ftp.fileNameEndsWith' },
    // { fieldId: 'ftp.backupDirectoryPath' },
    // { fieldId: 'exportData' },
    { formId: 'file' },
    { fieldId: 'ftp.exportTransformRecords' },
    { fieldId: 'transform.expression.rules' },
    { fieldId: 'ftp.exportHooks' },
    { formId: 'hooks' },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [
        {
          fieldId: 'file.compressionFormat',
        },
        { fieldId: 'file.skipDelete' },
        { fieldId: 'file.encoding' },

        { fieldId: 'pageSize' },
        { fieldId: 'dataURITemplate' },
      ],
    },
  ],
};
