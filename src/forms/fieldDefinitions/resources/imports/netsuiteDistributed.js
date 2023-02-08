import { BUNDLE_DEPRICATION_URL } from '../../../../constants';
import { isNewId } from '../../../../utils/resource';

export default {
  'netsuite_da.recordType': {
    isLoggable: true,
    label: 'Record type',
    required: true,
    type: 'netsuiterecordtype',
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
    isLoggable: true,
    type: 'text',
    visible: false,
  },
  'netsuite_da.subrecords': {
    isLoggable: true,
    required: false,
    type: 'netsuitesubrecords',
    connectionId: r => r && r._connectionId,
  },
  'netsuite_da.operation': {
    isLoggable: true,
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
    isLoggable: true,
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
  'netsuite_da.restletVersion': {
    isLoggable: true,
    fieldId: 'netsuite_da.restletVersion',
    type: 'netsuiteapiversion',
    label: 'NetSuite API version',
    defaultValue: r => {
      // eslint-disable-next-line camelcase
      const newFieldValue = r?.netsuite_da?.restletVersion;

      if (newFieldValue) return newFieldValue;

      // eslint-disable-next-line camelcase
      return r?.netsuite_da?.useSS2Restlets ? 'suiteapp2.0' : 'suitebundle';
    },
    options: [
      {
        items: [
          { label: 'SuiteApp SuiteScript 2.x (Recommended)', value: 'suiteapp2.0'},
          { label: 'SuiteApp SuiteScript 1.0', value: 'suiteapp1.0' },
          { label: 'SuiteBundle SuiteScript 1.0', value: 'suitebundle', description: `To be deprecated. <a target="_blank" rel="noreferrer" href=${BUNDLE_DEPRICATION_URL}>Learn more.</a>`, isWarningMessage: true },
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
