import isEmpty from 'lodash/isEmpty';
import { isIntegrationApp } from '../../../../utils/flows';
import { isNewId } from '../../../../utils/resource';

export default {
  name: {
    loggable: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    loggable: true,
    type: 'text',
    label: 'Description',
  },

  // UI Specific field
  formView: {
    loggable: true,
    id: 'formView',
    type: 'formview',
    label: 'Form view',
    visible: r => !r?.useTechAdaptorForm || !isEmpty(r?.assistantMetadata),
    defaultValue: r => r && `${r.assistant ? 'false' : 'true'}`,
    helpKey: 'formView',
  },
  _connectionId: {
    loggable: true,
    type: 'replaceconnection',
    resourceType: 'connections',
    parentResourceType: 'imports',
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
  traceKeyTemplate: {
    loggable: true,
    id: 'traceKeyTemplate',
    type: 'uri',
    label: 'Override child record trace key template',
    visible: r => !isIntegrationApp(r),
    omitWhenHidden: true,
    visibleWhenAll: [
      {
        field: 'oneToMany',
        is: ['true'],
      },
    ],
    showLookup: false,
  },
  sampleData: { type: 'text', label: 'Sample Data' },
  distributed: {
    loggable: true,
    type: 'text',
    label: 'Distributed',
    defaultValue: true,
    visible: false,
  },
  maxAttempts: {
    loggable: true,
    type: 'text',
    label: 'Max attempts',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  ignoreExisting: {
    loggable: true,
    type: 'checkbox',
    label: 'Ignore existing records',
    defaultValue: r => !!(r && r.ignoreExisting),
  },
  ignoreMissing: {
    loggable: true,
    type: 'checkbox',
    label: 'Ignore missing records',
    defaultValue: r => !!(r && r.ignoreMissing),
  },
  idLockTemplate: {
    loggable: true,
    type: 'uri',
    label: 'Concurrency ID lock template',
    showExtract: false,
    showLookup: false,
  },
  dataURITemplate: {
    loggable: true,
    type: 'uri',
    label: 'Data URI template',
    showLookup: false,
  },
  oneToMany: {
    loggable: true,
    type: 'radiogroup',
    label: 'One to many',
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
    loggable: true,
    type: 'text',
    label: 'Path to many',
    helpKey: 'pathToMany',
    placeholder: 'Not needed for array/row based data',
    visibleWhenAll: [
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
    loggable: true,
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
    loggable: true,
    type: 'checkbox',
    label: 'Purge blob data immediately?',
  },
  assistantMetadata: {
    type: 'text',
    label: 'Assistant metadata',
  },
  useTechAdaptorForm: {
    loggable: true,
    type: 'checkbox',
    label: 'Use tech adaptor form',
    defaultValue: false,
  },
  sampleResponseData: {
    type: 'text',
    label: 'Sample response data',
  },
  modelMetadata: { type: 'text', label: 'Model metadata' },
  adaptorType: {
    loggable: true,
    type: 'text',
    label: 'Adaptor type',
  },
  // #endregion common
  // #region filter
  'filter.expression.version': {
    loggable: true,
    type: 'radiogroup',
    label: 'Filter expression version',
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'filter.expression.rules': {
    loggable: true,
    type: 'text',
    label: 'Filter expression rules',
  },
  'filter.script._scriptId': {
    loggable: true,
    type: 'text',
    label: 'Filter script _script ID',
  },
  'filter.script.function': {
    loggable: true,
    type: 'text',
    label: 'Filter script function',
  },
  // #endregion filter
  // #region parsers[*]
  'parsers[*].version': {
    loggable: true,
    type: 'text',
    label: 'Parsers[*] version',
  },
  'parsers[*].rules': {
    loggable: true,
    type: 'text',
    label: 'Parsers[*] rules',
  },
  // #endregion parsers[*]
  // #region hooks
  hookType: {
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
    type: 'radiogroup',
    label: 'Response transform expression version',
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'responseTransform.expression.rules': {
    loggable: true,
    type: 'text',
    label: 'Response transform expression rules',
  },
  'responseTransform.script._scriptId': {
    loggable: true,
    type: 'text',
    label: 'Response transform script _script ID',
  },
  'responseTransform.script.function': {
    loggable: true,
    type: 'text',
    label: 'Response transform script function',
  },
  settings: {
    type: 'settings',
    defaultValue: r => r && r.settings,
  },
};
