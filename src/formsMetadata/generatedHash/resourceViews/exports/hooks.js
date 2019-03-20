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
  ],
  fieldSets: [
    {
      header: 'preSavePage',
      collapsed: false,
      fields: [
        { id: 'exportHooksPreSavePageFunction' },
        { id: 'exportHooksPreSavePage_scriptId' },
        { id: 'exportHooksPreSavePage_stackId' },
        { id: 'exportHooksPreSavePageConfiguration' },
      ],
    },
  ],
};
