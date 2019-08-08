export default {
  fields: [
    { formId: 'common' },
    {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    { fieldId: 's3.region' },
    { fieldId: 's3.bucket' },
    { fieldId: 'file.output' },
    { fieldId: 's3.keyStartsWith' },
    { fieldId: 's3.keyEndsWith' },
    { fieldId: 'ftp.type' },
    { fieldId: 'uploadFile' },
    { fieldId: 'file.csv' },
    { fieldId: 'file.json.resourcePath' },
    { fieldId: 'file.xlsx.hasHeaderRow' },
    { fieldId: 'file.xlsx.rowsPerRecord' },
    { fieldId: 'file.xlsx.keyColumns' },
    { fieldId: 'file.xml.resourcePath' },
    { fieldId: 'file.fileDefinition.resourcePath' },
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
