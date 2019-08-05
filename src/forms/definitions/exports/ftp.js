export default {
  fields: [
    { formId: 'common' },
    { fieldId: 'ftp.exportFrom' },
    { fieldId: 'ftp.directoryPath' },
    { fieldId: 'file.output' },
    { fieldId: 'ftp.fileNameStartsWith' },

    { fieldId: 'ftp.fileNameEndsWith' },
    { fieldId: 'ftp.type' },

    { fieldId: 'uploadFile' },
    { fieldId: 'ftp.csv.columnDelimiter' },
    { fieldId: 'file.json.resourcePath' },
    { fieldId: 'file.xml.resourcePath' },
    { fieldId: 'ftp.csv.trimSpaces' },
    { fieldId: 'ftp.csv.hasHeaderRow' },
    { fieldId: 'ftp.csv.rowsToSkip' },
    { fieldId: 'ftp.csv.rowsPerRecord' },
    { fieldId: 'ftp.csv.keyColumns' },
    { fieldId: 'file.xlsx.hasHeaderRow' },
    { fieldId: 'file.xlsx.rowsPerRecord' },
    { fieldId: 'ftp.xlsx.keyColumns' },

    { fieldId: 'file.fileDefinition.resourcePath' },
    // { fieldId: 'ftp.fileDefinition._fileDefinitionId' },
  ],
  fieldSets: [
    {
      header: 'Would you like to transform the records?',
      collapsed: false,
      fields: [{ fieldId: 'transform.expression.rules' }],
    },
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: false,
      fields: [{ formId: 'hooks' }],
    },
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [
        { fieldId: 'file.decompressFiles' },
        { fieldId: 'file.compressionFormat' },
        { fieldId: 'file.skipDelete' },
        { fieldId: 'file.encoding' },
        { formId: 'advancedSettings' },
      ],
    },
  ],
};
