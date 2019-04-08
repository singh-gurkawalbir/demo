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
    if (fieldId === 'uploadFile') {
      const fileType = fields.find(field => field.id === 'file.type');

      if (fileType) {
        return [fileType.value];
      }
    }

    if (fieldId === 'sampleData') {
      return getEditorMode(fields, 'file.type');
    }

    return null;
  },
  fields: [
    { fieldId: 'name' },
    { fieldId: 'description' },
    { fieldId: 'asynchronous' },
    // { fieldId: 'api.identifier' },
    // { fieldId: 'type' },
    // { fieldId: 'page.size' },
    // { fieldId: 'dataURITemplate' },
    // { fieldId: 'one.to.many' },
    // { fieldId: 'path.to.many' },
    // { fieldId: 'sample.data' },
    // { fieldId: 'origin.sample.data' },
    // { fieldId: 'assistant' },
    // { fieldId: 'assistant.metadata' },
    // { fieldId: 'is.lookup' },
    // { fieldId: 'use.tech.adaptor.form' },
    // { fieldId: 'adaptor.type' },
    // { fieldId: 'file.csv' },
    // { fieldId: 'ftp.directoryPath' },
    // { fieldId: 'ftp.fileNameStartsWith' },
    // { fieldId: 'ftp.fileNameEndsWith' },
    // { fieldId: 'ftp.backupDirectoryPath' },
  ],
  fieldSets: [
    {
      header: 'Where would you like to export data from?      ',
      collapsed: true,
      fields: [
        { fieldId: 'assistant' },
        // load connection
        { fieldId: 'connection.rdbms.concurrencyLevel' },
      ],
    },

    {
      header: 'What would you like to export?',
      collapsed: true,
      fields: [
        { fieldId: 'ftp.directoryPath' },
        // load connection
        { fieldId: 'file.output' },
        { fieldId: 'ftp.fileNameStartsWith' },
        { fieldId: 'ftp.fileNameEndsWith' },
        { fieldId: 'file.type' },
        {
          fieldId: 'uploadFile',
          inputType: 'file',
          refreshOptionsOnChangesTo: 'file.type',
        },
        {
          fieldId: 'file.csv',
          mode: 'csv',
          visibleWhen: [
            {
              field: 'file.type',
              is: ['csv'],
            },
          ],
        },
        {
          fieldId: 'file.xml.resourcePath',
          visibleWhen: [
            {
              field: 'file.type',
              is: ['xml'],
            },
          ],
        },
        {
          fieldId: 'file.json.resourcePath',
          visibleWhen: [
            {
              field: 'file.type',
              is: ['json'],
            },
          ],
        },
        {
          fieldId: 'file.fileDefinition.resourcePath',
          visibleWhen: [
            {
              field: 'file.type',
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
          fieldId: 'sampleData',
          mode: r => r && r.file && r.file.type,
          refreshOptionsOnChangesTo: 'file.type',
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
          fieldId: 'transform.expression.rules',
        },
      ],
    },
  ],
};
