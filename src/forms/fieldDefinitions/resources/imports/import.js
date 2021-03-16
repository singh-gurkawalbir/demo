import { isNewId } from '../../../../utils/resource';

export default {
  name: { type: 'text', label: 'Name', required: true },
  description: { type: 'text', label: 'Description' },

  // UI Specific field
  formView: {
    id: 'formView',
    type: 'formview',
    label: 'Form view',
    visible: r => !r?.useTechAdaptorForm,
    defaultValue: r => r && `${r.assistant ? 'false' : 'true'}`,
    helpKey: 'formView',
  },
  _connectionId: {
    type: 'replaceconnection',
    resourceType: 'connections',
    label: 'Connection',
    appTypeIsStatic: true,
    allowEdit: true,
    connectionId: r => r?._connectionId,
    defaultValue: r => r?._connectionId,
    integrationId: r => r?._integrationId,
    connectorId: r => r?._connectorId,
  },
  apiIdentifier: {
    label: 'Invoke',
    helpKey: 'apiIdentifier',
    type: 'apiidentifier',
    visible: r => r && !isNewId(r._id),
  },
  sampleData: { type: 'text', label: 'Sample Data' },
  distributed: {
    type: 'text',
    label: 'Distributed',
    defaultValue: true,
    visible: false,
  },
  maxAttempts: {
    type: 'text',
    label: 'Max attempts',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  ignoreExisting: {
    type: 'checkbox',
    label: 'Ignore existing records',
    defaultValue: r => !!(r && r.ignoreExisting),
  },
  ignoreMissing: {
    type: 'checkbox',
    label: 'Ignore missing records',
    defaultValue: r => !!(r && r.ignoreMissing),
  },
  idLockTemplate: {
    type: 'uri',
    label: 'Concurrency ID lock template',
    // enableEditorV2: true,
    showExtract: false,
    showLookup: false,
  },
  dataURITemplate: {
    type: 'uri',
    label: 'Data URI template',
    // enableEditorV2: true,
    showLookup: false,
  },
  oneToMany: {
    type: 'radiogroup',
    label: 'One to many',
    helpKey: 'oneToMany',
    defaultValue: r => ((r?.oneToMany && r?.oneToMany !== 'false') ? 'true' : 'false'),
    options: [
      {
        items: [
          { label: 'Yes (advanced)', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
    ],
  },
  pathToMany: {
    type: 'text',
    label: 'Path to many',
    helpKey: 'pathToMany',
    omitWhenHidden: true,
    placeholder: 'Not needed for array/row based data',
    visibleWhen: [
      {
        field: 'oneToMany',
        is: ['true'],
      },
    ],
    validWhen: [
      {
        field: 'oneToMany',
        is: ['true'],
      },
    ],
  },
  blobKeyPath: {
    type: 'text',
    label: 'Blob key path',
    placeholder: 'Blob Key Path',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  deleteAfterImport: {
    type: 'checkbox',
    label: 'Purge blob data immediately?',
  },
  assistantMetadata: {
    type: 'text',
    label: 'Assistant metadata',
  },
  useTechAdaptorForm: {
    type: 'checkbox',
    label: 'Use tech adaptor form',
    defaultValue: false,
  },
  sampleResponseData: {
    type: 'text',
    label: 'Sample response data',
  },
  modelMetadata: { type: 'text', label: 'Model metadata' },
  adaptorType: { type: 'text', label: 'Adaptor type' },
  // #endregion common
  // #region filter
  'filter.expression.version': {
    type: 'radiogroup',
    label: 'Filter expression version',
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'filter.expression.rules': {
    type: 'text',
    label: 'Filter expression rules',
  },
  'filter.script._scriptId': {
    type: 'text',
    label: 'Filter script _script ID',
  },
  'filter.script.function': {
    type: 'text',
    label: 'Filter script function',
  },
  // #endregion filter
  // #region parsers[*]
  'parsers[*].version': {
    type: 'text',
    label: 'Parsers[*] version',
  },
  'parsers[*].rules': {
    type: 'text',
    label: 'Parsers[*] rules',
  },
  // #endregion parsers[*]
  // #region hooks
  hookType: {
    type: 'radiogroup',
    label: 'Hook type',
    defaultValue: 'script',
    options: [
      {
        items: [
          { label: 'Script', value: 'script' },
          { label: 'Stack', value: 'stack' },
        ],
      },
    ],
  },
  'hooks.preMap.function': {
    type: 'text',
    label: 'Pre map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
    requiredWhen: [
      {
        field: 'hooks.preMap._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.preMap._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.preMap._scriptId': {
    type: 'selectresource',
    label: 'Pre map script',
    resourceType: 'scripts',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.preMap._stackId': {
    label: 'Pre map stack',
    type: 'selectresource',
    resourceType: 'stacks',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.preMap.configuration': {
    type: 'text',
    label: 'Pre map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postMap.function': {
    type: 'text',
    label: 'Post map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
    requiredWhen: [
      {
        field: 'hooks.postMap._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postMap._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postMap._scriptId': {
    label: 'Post map script',
    type: 'selectresource',
    resourceType: 'scripts',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postMap._stackId': {
    label: 'Post map stack',
    type: 'selectresource',
    resourceType: 'stacks',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postMap.configuration': {
    type: 'text',
    label: 'Post map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postSubmit.function': {
    type: 'text',
    label: 'Post submit',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
    requiredWhen: [
      {
        field: 'hooks.postSubmit._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postSubmit._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postSubmit._scriptId': {
    label: 'Post submit script',
    type: 'selectresource',
    resourceType: 'scripts',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postSubmit._stackId': {
    label: 'Post submit stack',
    type: 'selectresource',
    resourceType: 'stacks',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postSubmit.configuration': {
    type: 'text',
    label: 'Post submit',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postAggregate.function': {
    type: 'text',
    label: 'Post aggregate',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
    requiredWhen: [
      {
        field: 'hooks.postAggregate._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postAggregate._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postAggregate._scriptId': {
    type: 'selectresource',
    resourceType: 'scripts',
    label: 'Post aggregate script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postAggregate._stackId': {
    type: 'selectresource',
    resourceType: 'stacks',
    label: 'Post aggregate stack',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postAggregate.configuration': {
    type: 'text',
    label: 'Post aggregate',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  // #endregion hooks
  // #region responseTransform
  'responseTransform.expression.version': {
    type: 'radiogroup',
    label: 'Response transform expression version',
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'responseTransform.expression.rules': {
    type: 'text',
    label: 'Response transform expression rules',
  },
  'responseTransform.script._scriptId': {
    type: 'text',
    label: 'Response transform script _script ID',
  },
  'responseTransform.script.function': {
    type: 'text',
    label: 'Response transform script function',
  },
  settings: {
    type: 'settings',
    defaultValue: r => r && r.settings,
  },
};
