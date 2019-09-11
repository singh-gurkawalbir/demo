export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'http.body') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'http.lookups'
      );

      if (recordTypeField) {
        return {
          // we are saving http body in an array. Put correspond to 0th Index,
          // Post correspond to 1st index.
          // We will have 'Build HTTP Request Body for Create' and
          // 'Build HTTP Request Body for Update' in case user selects Composite Type as 'Create new Data and Update existing data'
          saveIndex: 0,
          lookups: {
            // passing lookupId fieldId and data since we will be modifying lookups
            //  from 'Manage lookups' option inside 'Build Http request Body Editor'
            fieldId: recordTypeField.fieldId,
            data: recordTypeField && recordTypeField.value,
          },
        };
      }
    }

    return null;
  },
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    { fieldId: 'oneToMany' },
    { fieldId: 'pathToMany' },
    { fieldId: 'http.method' },
    { fieldId: 'http.headers' },
    { fieldId: 'http.requestMediaType' },
    { fieldId: 'http.compositeType' },
    { fieldId: 'http.relativeURI' },
    // Manage lookup option is not visible directly  in form
    { fieldId: 'http.lookups', visible: false },
    { fieldId: 'http.response.successPath' },
    { fieldId: 'http.response.successValues' },
    { fieldId: 'http.response.resourceIdPath' },
    { fieldId: 'http.response.resourcePath' },
    { fieldId: 'http.response.errorPath' },
    { fieldId: 'http.batchSize' },
    {
      id: 'createNewData',
      type: 'labeltitle',
      label: 'Create New Data',
      visibleWhen: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
      ],
    },
    { fieldId: 'http.compositeMethodCreate' },
    { fieldId: 'http.bodyCreate' },
    { fieldId: 'http.resourceIdPathCreate' },
    { fieldId: 'http.resourceIdPathCreate' },
    { fieldId: 'http.resourcePathCreate' },
    {
      id: 'upateExistingData',
      type: 'labeltitle',
      label: 'Upate Existing Data',
      visibleWhen: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
      ],
    },
    { fieldId: 'http.compositeMethodUpdate' },
    { fieldId: 'http.relativeURIUpdate' },
    { fieldId: 'http.resourceIdPathUpdate' },
    { fieldId: 'http.resourcePathUpdate' },
    {
      id: 'ignoreExistingData',
      type: 'labeltitle',
      label: 'Ignore Existing Data',
      visibleWhen: [
        {
          field: 'http.compositeType',
          is: ['createandignore', 'updateandignore'],
        },
      ],
    },
    { fieldId: 'http.existingDataId' },
    {
      id: 'mediatypeInformation',
      type: 'labeltitle',
      label: 'Media type information',
    },
    { fieldId: 'http.successMediaType' },
    { fieldId: 'http.errorMediaType' },
    { fieldId: 'uploadFile' },
    {
      fieldId: 'file.csv.columnDelimiter',
      visibleWhen: [
        {
          field: 'http.requestMediaType',
          is: ['csv'],
        },
      ],
    },
    {
      fieldId: 'file.csv.includeHeader',
      visibleWhen: [
        {
          field: 'http.requestMediaType',
          is: ['csv'],
        },
      ],
    },
    { fieldId: 'file.csv.customHeaderRows' },
    {
      id: 'dataMapped',
      type: 'labeltitle',
      label: 'How should the data be mapped?',
    },
    { fieldId: 'oneToMany' },
    { fieldId: 'pathToMany' },
    { fieldId: 'http.body' },
  ],
  fieldSets: [
    {
      header: 'Advanced',
      collapsed: true,
      fields: [
        {
          fieldId: 'file.csv.rowDelimiter',
          visibleWhen: [
            {
              field: 'http.requestMediaType',
              is: ['csv'],
            },
          ],
        },
        {
          fieldId: 'file.csv.replaceTabWithSpace',
          visibleWhen: [
            {
              field: 'http.requestMediaType',
              is: ['csv'],
            },
          ],
        },
        {
          fieldId: 'file.csv.replaceNewLineWithSpace',
          visibleWhen: [
            {
              field: 'http.requestMediaType',
              is: ['csv'],
            },
          ],
        },
        { fieldId: 'http.ignoreEmptyNodes' },
        { fieldId: 'idLockTemplate' },
        { fieldId: 'dataURITemplate' },
        { fieldId: 'http.configureAsyncHelper' },
        { fieldId: 'http._asyncHelperId' },
      ],
    },
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: false,
      fields: [{ formId: 'hooks' }],
    },
  ],
};
