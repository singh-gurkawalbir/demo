import isEmpty from 'lodash/isEmpty';
import { isIntegrationApp } from '../../../../utils/flows';
import { adaptorTypeMap, isNewId } from '../../../../utils/resource';

export default {
  name: {
    isLoggable: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    isLoggable: true,
    type: 'text',
    label: 'Description',
  },

  // UI Specific field
  formView: {
    isLoggable: true,
    id: 'formView',
    type: 'formview',
    label: 'Form view',
    visible: r => !r?.useTechAdaptorForm || !isEmpty(r?.assistantMetadata),
    defaultValue: r => {
      if (!r) return 'false';
      if (adaptorTypeMap[r.adaptorType] === 'graph_ql') {
        if (!r.http) return 'false';
        if (!r.http.formType) return 'false';

        return r.http.formType === 'graph_ql' ? 'false' : 'true';
      }
      if (r.isHttpConnector || r.http?._httpConnectorResourceId || !(r.assistant || (r.http && r.http.formType === 'graph_ql'))) {
        if (!r.http) return 'false';
        if (!r.http.formType) return 'false';

        return r.http.formType === 'assistant' ? 'false' : 'true';
      }

      return `${r.assistant || (r.http && r.http.formType === 'graph_ql') ? 'false' : 'true'}`;
    },
    helpKey: 'formView',
  },
  _connectionId: {
    isLoggable: true,
    type: 'replaceconnection',
    resourceType: 'connections',
    showEditableDropdown: true,
    parentResourceType: 'imports',
    label: 'Connection',
    skipDefault: true,
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
    isLoggable: true,
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
    isLoggable: true,
    type: 'text',
    label: 'Distributed',
    defaultValue: true,
    visible: false,
  },
  maxAttempts: {
    isLoggable: true,
    type: 'text',
    label: 'Max attempts',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  ignoreExisting: {
    isLoggable: true,
    type: 'checkbox',
    label: 'Ignore existing records',
    defaultValue: r => !!(r && r.ignoreExisting),
  },
  ignoreMissing: {
    isLoggable: true,
    type: 'checkbox',
    label: 'Ignore missing records',
    defaultValue: r => !!(r && r.ignoreMissing),
  },
  idLockTemplate: {
    isLoggable: true,
    type: 'uri',
    label: 'Concurrency ID lock template',
    showExtract: false,
    showLookup: false,
  },
  dataURITemplate: {
    isLoggable: true,
    type: 'uri',
    label: 'Data URI template',
    showLookup: false,
  },
  oneToMany: {
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
    type: 'checkbox',
    label: 'Purge blob data immediately?',
  },
  assistantMetadata: {
    type: 'text',
    label: 'Assistant metadata',
  },
  useTechAdaptorForm: {
    isLoggable: true,
    type: 'checkbox',
    label: 'Use tech adaptor form',
    defaultValue: false,
  },
  mockResponse: {
    type: 'mockResponse',
    label: 'Mock response',
  },
  modelMetadata: { type: 'text', label: 'Model metadata' },
  adaptorType: {
    isLoggable: true,
    type: 'text',
    label: 'Adaptor type',
  },
  // #endregion common
  // #region filter
  'filter.expression.version': {
    isLoggable: true,
    type: 'radiogroup',
    label: 'Filter expression version',
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'filter.expression.rules': {
    isLoggable: true,
    type: 'text',
    label: 'Filter expression rules',
  },
  'filter.script._scriptId': {
    isLoggable: true,
    type: 'text',
    label: 'Filter script _script ID',
  },
  'filter.script.function': {
    isLoggable: true,
    type: 'text',
    label: 'Filter script function',
  },
  // #endregion filter
  // #region parsers[*]
  'parsers[*].version': {
    isLoggable: true,
    type: 'text',
    label: 'Parsers[*] version',
  },
  'parsers[*].rules': {
    isLoggable: true,
    type: 'text',
    label: 'Parsers[*] rules',
  },
  // #endregion parsers[*]
  // #region hooks
  hookType: {
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
    type: 'radiogroup',
    label: 'Response transform expression version',
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'responseTransform.expression.rules': {
    isLoggable: true,
    type: 'text',
    label: 'Response transform expression rules',
  },
  'responseTransform.script._scriptId': {
    isLoggable: true,
    type: 'text',
    label: 'Response transform script _script ID',
  },
  'responseTransform.script.function': {
    isLoggable: true,
    type: 'text',
    label: 'Response transform script function',
  },
  settings: {
    type: 'settings',
    defaultValue: r => r && r.settings,
  },
};
