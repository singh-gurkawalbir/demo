const fileTypeToFileMode = {
  txt: 'text',
  js: 'javascript',
  csv: 'csv',
  json: 'json',
  xlsx: 'csv',
};
const getEditorMode = (allFields, fieldIdToMatch) => {
  const fileType = allFields.find(field => field.id === fieldIdToMatch);

  if (fileType) {
    return [fileTypeToFileMode[fileType.value]];
  }
};

export default {
  optionsHandler(fieldId, fields) {
    if (fieldId === 'export.uploadFile') {
      const fileType = fields.find(field => field.id === 'export.file.type');

      if (fileType) {
        return [fileType.value];
      }
    }

    if (fieldId === 'export.sampleData') {
      return getEditorMode(fields, 'export.file.type');
    }

    return null;
  },
  fields: [
    { id: 'export.name' },
    { id: 'export.description' },
    { id: 'export.asynchronous' },
    // { id: 'export.api.identifier' },
    // { id: 'export.type' },
    // { id: 'export.page.size' },
    // { id: 'export.dataURITemplate' },
    // { id: 'export.one.to.many' },
    // { id: 'export.path.to.many' },
    // { id: 'export.sample.data' },
    // { id: 'export.origin.sample.data' },
    // { id: 'export.assistant' },
    // { id: 'export.assistant.metadata' },
    // { id: 'export.is.lookup' },
    // { id: 'export.use.tech.adaptor.form' },
    // { id: 'export.adaptor.type' },
    // { id: 'export.file.csv' },
    // { id: 'export.ftp.directoryPath' },
    // { id: 'export.ftp.fileNameStartsWith' },
    // { id: 'export.ftp.fileNameEndsWith' },
    // { id: 'export.ftp.backupDirectoryPath' },
  ],
  fieldSets: [
    {
      header: 'Where would you like to export data from?      ',
      collapsed: true,
      fields: [
        { id: 'export.assistant' },
        // load connection
        { id: 'connection.rdbms.concurrencyLevel' },
      ],
    },

    {
      header: 'What would you like to export?',
      collapsed: true,
      fields: [
        { id: 'export.ftp.directoryPath' },
        // load connection
        { id: 'export.file.output' },
        { id: 'export.ftp.fileNameStartsWith' },
        { id: 'export.ftp.fileNameEndsWith' },
        { id: 'export.file.type' },
        {
          id: 'export.uploadFile',
          inputType: 'file',
          refreshOptionsOnChangesTo: 'export.file.type',
        },
        {
          id: 'export.file.csv',
          mode: 'csv',
          visibleWhen: [
            {
              field: 'export.file.type',
              is: ['csv'],
            },
          ],
        },
        {
          id: 'export.file.xml.resourcePath',
          visibleWhen: [
            {
              field: 'export.file.type',
              is: ['xml'],
            },
          ],
        },
        {
          id: 'export.file.json.resourcePath',
          visibleWhen: [
            {
              field: 'export.file.type',
              is: ['json'],
            },
          ],
        },
        {
          id: 'export.file.fileDefinition.resourcePath',
          visibleWhen: [
            {
              field: 'export.file.type',
              is: ['fileDefinition'],
            },
          ],
        },
      ],
    },

    {
      header: 'Sample Data',
      collapsed: true,
      fields: [
        {
          id: 'export.sampleData',
          mode: r => r && r.file && r.file.type,
          refreshOptionsOnChangesTo: 'export.file.type',
        },
        // load connection
      ],
    },

    {
      header: 'Would you like to transform the records?',
      collapsed: true,
      fields: [
        // load connection
        {
          id: 'export.transform.expression.rules',
        },
      ],
    },
  ],
};
