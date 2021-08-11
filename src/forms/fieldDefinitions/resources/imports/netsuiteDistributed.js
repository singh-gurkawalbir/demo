import { isNewId } from '../../../../utils/resource';

export default {
  'netsuite_da.recordType': {
    label: 'Record type',
    required: true,
    type: 'refreshableselect',
    filterKey: 'suitescript-recordTypes',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r._connectionId}/recordTypes`,
    placeholder: 'Please select a record type',
    connectionId: r => r && r._connectionId,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.mapping': {
    type: 'text',
    visible: false,
  },
  'netsuite_da.subrecords': {
    required: false,
    type: 'netsuitesubrecords',
    connectionId: r => r && r._connectionId,
    visibleWhen: [
      {
        field: 'netsuite_da.useSS2Restlets',
        is: ['false'],
      },
    ],
  },
  'netsuite_da.operation': {
    type: 'netsuiteimportoperation',
    fieldsToReset: [
      { id: 'ignoreExisting', type: 'checkbox' },
      { id: 'ignoreMissing', type: 'checkbox' },
    ],
    label: 'Operation',
    required: true,
    filterKey: 'suitescript-recordTypes',
    connectionId: r => r?._connectionId,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
    selectOptions: [
      {
        items: [
          { label: 'Add', value: 'add' },
          { label: 'Update', value: 'update' },
          { label: 'Add or update', value: 'addupdate' },
          { label: 'Attach', value: 'attach' },
          { label: 'Detach', value: 'detach' },
          { label: 'Delete', value: 'delete'},
        ],
      },
    ],
  },
  'netsuite.operation': {
    type: 'radiogroup',
    label: 'Operation',
    required: true,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
    options: [
      {
        items: [
          { label: 'Add', value: 'add' },
          { label: 'Update', value: 'update' },
          { label: 'Add or update', value: 'addupdate' },
        ],
      },
    ],
  },
  'netsuite_da.useSS2Restlets': {
    fieldId: 'netsuite_da.useSS2Restlets',
    type: 'netsuiteapiversion',
    label: 'NetSuite API version',
    // eslint-disable-next-line camelcase
    defaultValue: r => r?.netsuite_da?.useSS2Restlets ? 'true' : 'false',
    options: [
      {
        items: [
          { label: 'SuiteScript 1.0', value: 'false' },
          { label: 'SuiteScript 2.0 (beta)', value: 'true' },
        ],
      },
    ],
    defaultDisabled: r => {
      if (!isNewId(r._id)) {
        return true;
      }

      return false;
    },
    isNew: r => isNewId(r._id),
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
    connectionId: r => r?._connectionId,
    resourceType: 'imports',
    resourceId: r => r?._id,
  },
  'netsuite_da.internalIdLookup.expression': {
    type: 'netsuitelookup',
    label: 'How can we find existing records?',
    required: true,
    visibleWhen: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'netsuite_da.operation',
        is: ['update', 'addupdate', 'delete'],
      },
    ],
  },
  'netsuite_da.hooks.preMap.function': {
    type: 'text',
    label: 'Pre map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.preMap.fileInternalId': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Pre map file',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.postMap.function': {
    type: 'text',
    label: 'Post map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.postMap.fileInternalId': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Post map file',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.postSubmit.function': {
    type: 'text',
    label: 'Post submit',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite.file.name': {
    type: 'uri',
    label: 'Name',
    showExtract: false,
    showLookup: false,
    visibleWhenAll: [
      {
        field: 'netsuite.operation',
        is: ['add', 'addupdate'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'netsuite.file.fileType': {
    type: 'uri',
    label: 'File type',
    showExtract: false,
    showLookup: false,
    visibleWhenAll: [
      {
        field: 'netsuite.operation',
        is: ['add', 'addupdate'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'netsuite.file.folder': {
    type: 'uri',
    label: 'Folder',
    showExtract: false,
    showLookup: false,
    visibleWhenAll: [
      {
        field: 'netsuite.operation',
        is: ['add', 'addupdate'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'netsuite.file.internalId': {
    type: 'uri',
    label: 'File internal ID',
    showExtract: false,
    showLookup: false,
    visibleWhenAll: [
      {
        field: 'netsuite.operation',
        is: ['update'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'netsuite_da.hooks.postSubmit.fileInternalId': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Post submit file',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.batchSize': {
    type: 'text',
    label: 'Batch size limit',
    helpKey: 'import.netsuite_da.batchSize',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
};
