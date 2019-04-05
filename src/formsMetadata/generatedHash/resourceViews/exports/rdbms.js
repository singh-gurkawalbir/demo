export default {
  fields: [
    { id: 'exportName' },
    { id: 'exportDescription' },
    { id: 'exportAsynchronous' },
    { id: 'exportApiIdentifier' },
    { id: 'exportType' },
    { id: 'exportPageSize' },
    { id: 'exportDataURITemplate' },
    { id: 'exportOneToMany' },
    { id: 'exportPathToMany' },
    { id: 'exportSampleData' },
    { id: 'exportOriginSampleData' },
    { id: 'exportAssistant' },
    { id: 'exportAssistantMetadata' },
    { id: 'exportIsLookup' },
    { id: 'exportUseTechAdaptorForm' },
    { id: 'exportAdaptorType' },
    { id: 'exportRdbmsQuery' },
  ],
  fieldSets: [
    {
      header: 'once',
      collapsed: false,
      fields: [{ id: 'exportRdbmsOnceQuery' }],
    },
  ],
};
