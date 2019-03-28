export default {
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
        { id: 'export.file.csv' },
      ],
    },

    {
      header: 'Sample Data',
      collapsed: true,
      fields: [
        { id: 'export.sampleData', mode: 'javascript' },
        // load connection
      ],
    },

    {
      header: 'Would you like to transform the records?',
      collapsed: true,
      fields: [
        { id: 'export.sampleData' },
        // load connection
      ],
    },
  ],
};
