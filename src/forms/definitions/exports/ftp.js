export default {
  fields: [
    { formId: 'common' },
    { formId: 'ftpFile' },
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
