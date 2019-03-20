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
      header: 'expression',
      collapsed: false,
      fields: [
        { id: 'exportFilterExpressionVersion' },
        { id: 'exportFilterExpressionRules' },
      ],
    },
    {
      header: 'script',
      collapsed: false,
      fields: [
        { id: 'exportFilterScript_scriptId' },
        { id: 'exportFilterScriptFunction' },
      ],
    },
  ],
};
