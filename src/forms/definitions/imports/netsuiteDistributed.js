export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'What would you like the data imported?',
    },
    { fieldId: 'netsuite.restlet.recordType' },
    { fieldId: 'netsuite.operation' },
    { fieldId: 'netsuite.ignoreExistingRecords' },
    { fieldId: 'netsuite.ignoreMissingRecords' },
    {
      id: 'suiteScript',
      type: 'labeltitle',
      label: 'SuiteScript Hooks (Optional, Developers Only)',
    },
    { fieldId: 'netsuite.suitescriptPremapFunction' },
    { fieldId: 'netsuite.suitescriptPremapFileInternalID' },
    { fieldId: 'netsuite.suitescriptPostmapFunction' },
    { fieldId: 'netsuite.suitescriptPostmapFileInternalID' },
    { fieldId: 'netsuite.suitescriptPostSubmitFunction' },
    { fieldId: 'netsuite.suitescriptPostSubmitFileInternalID' },
    {
      id: 'dataMapped',
      type: 'labeltitle',
      label: 'How should the data be mapped?',
    },
    { fieldId: 'file.parentOption' },
    { fieldId: 'file.childRecords' },
  ],
  fieldSets: [
    {
      header: 'Advanced',
      collapsed: true,
      fields: [
        { fieldId: 'file.concurrencyIdLockTemplate' },
        { fieldId: 'file.dataUriTemplate' },
      ],
    },
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: false,
      fields: [
        { fieldId: 'hookType' },
        { fieldId: 'hooks.preMap.function' },
        { fieldId: 'hooks.preMap._scriptId' },
        { fieldId: 'hooks.preMap._stackId' },
        { fieldId: 'hooks.postSubmit.function' },
        { fieldId: 'hooks.postSubmit._scriptId' },
        { fieldId: 'hooks.postSubmit._stackId' },
      ],
    },
  ],
};
