import isEmpty from 'lodash/isEmpty';
import { isIntegrationApp } from '../../../../utils/flows';
import { isNewId } from '../../../../utils/resource';

const dateTimeOptions = [
  { label: 'YYYY-MM-DDTHH:mm:ss z', value: 'YYYY-MM-DDTHH:mm:ss z' },
  { label: 'YYYY-MM-DDTHH:mm:ss', value: 'YYYY-MM-DDTHH:mm:ss' },
  { label: 'YYYY-MM-DDTHH:mm:ssZ', value: 'YYYY-MM-DDTHH:mm:ssZ' },
  { label: 'YYYY-MM-DDTHH:mm:ss[Z]', value: 'YYYY-MM-DDTHH:mm:ss[Z]' },
  {
    label: 'YYYY-MM-DDTHH:mm:ss.SSSZZ',
    value: 'YYYY-MM-DDTHH:mm:ss.SSSZZ',
  },
  {
    label: 'YYYY-MM-DDTHH:mm:ss.SSSSZZ',
    value: 'YYYY-MM-DDTHH:mm:ss.SSSSZZ',
  },
  { label: 'YYYY-MM-DD hh:mm:ss', value: 'YYYY-MM-DD hh:mm:ss' },
  { label: 'X (Unix timestamp)', value: 'X' },
  { label: 'x (Unix ms timestamp)', value: 'x' },
  { label: 'M/D/YYYY', value: 'M/D/YYYY' },
  { label: 'YYMMDD', value: 'YYMMDD' },
  { label: 'MMDDYY', value: 'MMDDYY' },
  { label: 'DDMMYY', value: 'DDMMYY' },
  { label: 'M/D/YY', value: 'M/D/YY' },
  { label: 'D/M/YYYY', value: 'D/M/YYYY' },
  { label: 'D/M/YY', value: 'D/M/YY' },
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'MM/DD/YYYY', value: 'M/D/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  { label: 'MM/DD/YYYY HH:mm', value: 'MM/DD/YYYY HH:mm' },
  { label: 'MM/DD/YYYY HH:mm:ss', value: 'MM/DD/YYYY HH:mm:ss' },
];

export default {
  // #region common
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
  _connectionId: {
    loggable: true,
    type: 'replaceconnection',
    resourceType: 'connections',
    parentResourceType: 'exports',
    label: 'Connection',
    appTypeIsStatic: true,
    skipDefault: true,
    connectionId: r => r?._connectionId,
    connectorId: r => r?._connectorId,
    visible: r => r?.adaptorType !== 'WebhookExport' && r?.type !== 'simple',
    defaultValue: r => r?._connectionId,
    integrationId: r => r?._integrationId,
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
  semiassistantoperationselect: {
    loggable: true,
    id: 'semiassistantoperationselect',
    type: 'semiassistantoperationselect',
  },
  asynchronous: {
    loggable: true,
    type: 'checkbox',
    label: 'Asynchronous',
  },
  apiIdentifier: {
    label: 'Invoke',
    helpKey: 'apiIdentifier',
    type: 'apiidentifier',
    visible: r => r && !isNewId(r._id),
  },
  configureAsyncHelper: {
    loggable: true,
    type: 'checkbox',
    label: 'Configure async helper',
  },
  type: {
    loggable: true,
    type: 'select',
    label: 'Type',
    options: [
      {
        items: [
          { label: 'Webhook', value: 'webhook' },
          { label: 'Distributed', value: 'distributed' },
          { label: 'Test – export only 1 record', value: 'test' },
          { label: 'Delta – export only modified data', value: 'delta' },
          { label: 'Once – export records only once', value: 'once' },
          { label: 'Tranlinedelta', value: 'tranlinedelta' },
          { label: 'Simple', value: 'simple' }, // dataloader
          { label: 'Blob', value: 'blob' }, // attachments
        ],
      },
    ],
  },
  pageSize: {
    loggable: true,
    type: 'text',
    label: 'Page size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    loggable: true,
    type: 'uri',
    label: 'Data URI template',
    stage: 'responseMappingExtract',
    showLookup: false,
  },
  traceKeyTemplate: {
    loggable: true,
    id: 'traceKeyTemplate',
    stage: 'responseMappingExtract',
    type: 'uri',
    label: r => !(r?.isLookup) ? 'Override trace key template' : 'Override child record trace key template',
    helpKey: r => r?.isLookup && 'import.traceKeyTemplate',
    visible: r => !isIntegrationApp(r),
    omitWhenHidden: true,
    visibleWhenAll: r => {
      if (r?.isLookup) {
        return [
          {
            field: 'oneToMany',
            is: ['true'],
          },
        ];
      }

      return [];
    },
    showLookup: false,
  },
  oneToMany: {
    loggable: true,
    type: 'radiogroup',
    label: 'One to many',
    defaultValue: r => ((r?.oneToMany && r?.oneToMany !== 'false') ? 'true' : 'false'),
    visible: r => !!(r && r.isLookup),
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
    placeholder: 'Not needed for array/row based data.',
    visible: r => !!(r && r.isLookup),
    visibleWhenAll: r => {
      if (r && r.isLookup) {
        return [
          {
            field: 'oneToMany',
            is: ['true'],
          },
        ];
      }

      return [];
    },
  },
  // sampleData: {
  //   type: 'editor',
  //   label: 'Sample Data',
  // },
  originSampleData: {
    type: 'text',
    label: 'Origin sample data',
  },
  assistantMetadata: {
    type: 'text',
    label: 'Assistant metadata',
  },
  isLookup: {
    loggable: true,
    type: 'checkbox',
    label: 'Is lookup',
  },
  useTechAdaptorForm: {
    loggable: true,
    type: 'checkbox',
    label: 'Use tech adaptor form',
  },
  adaptorType: {
    loggable: true,
    type: 'text',
    label: 'Adaptor type',
  },
  parsers: {
    loggable: true,
    label: 'XML parser helper',
    type: 'xmlparse',
    required: true,
  },
  // #endregion common
  // #region inputFilter
  'inputFilter.expression.version': {
    loggable: true,
    type: 'radiogroup',
    label: 'Input filter expression version',
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'inputFilter.expression.rules': {
    loggable: true,
    type: 'text',
    label: 'Input filter expression rules',
  },
  'inputFilter.script._scriptId': {
    loggable: true,
    type: 'text',
    label: 'Input filter script _script id',
  },
  'inputFilter.script.function': {
    loggable: true,
    type: 'text',
    label: 'Input filter script function',
  },
  // #endregion inputFilter
  // #region test
  'test.limit': {
    loggable: true,
    type: 'text',
    label: 'Test limit',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  // #endregion test
  // #region delta
  'delta.dateField': {
    loggable: true,
    type: 'text',
    label: 'Date fields to use in delta search',
    required: true,
    visibleWhen: [{ field: 'type', is: ['delta'] }],
  },
  'delta.dateFormat': {
    loggable: true,
    type: 'toggleSelectToText',
    selectHrefLabel: 'Use custom format',
    textHrefLabel: 'Use presets',
    label: 'Override delta date format',
    options: [
      {
        items: dateTimeOptions,
      },
    ],
    isTextComponent: r => {
      if ((r && r.delta === undefined) || r.delta.dateFormat === undefined) return false;

      return !(
        r &&
        r.delta &&
        r.delta.dateFormat &&
        dateTimeOptions.find(option => option.value === r.delta.dateFormat)
      );
    },
    visibleWhen: [{ field: 'type', is: ['delta'] }],
  },
  'delta.startDate': {
    loggable: true,
    type: 'text',
    label: 'Delta start date',
    visibleWhen: [{ field: 'type', is: ['delta'] }],
  },
  'delta.lagOffset': {
    loggable: true,
    type: 'textwithflowcontext',
    label: 'Delta date lag offset',
    visibleWhenAll: [{ field: 'type', is: ['delta'] }],
  },
  'delta.endDateField': {
    loggable: true,
    type: 'text',
    label: 'Delta end date field',
    visibleWhen: [{ field: 'type', is: ['delta'] }],
  },
  // #endregion delta
  // #region once
  'once.booleanField': {
    loggable: true,
    type: 'text',
    label: 'Boolean field to mark records as exported',
    required: true,
    visibleWhen: [{ field: 'type', is: ['once'] }],
  },
  // #endregion once
  // #region valueDelta
  'valueDelta.exportedField': {
    loggable: true,
    type: 'text',
    label: 'Value delta exported field',
  },
  'valueDelta.pendingField': {
    loggable: true,
    type: 'text',
    label: 'Value delta pending field',
  },
  // #endregion valueDelta
  // #region distributed
  'distributed.bearerToken': {
    type: 'text',
    label: 'Distributed bearer token',
  },
  // #endregion distributed
  // #region hooks
  hookType: {
    loggable: true,
    type: 'radiogroup',
    label: 'Hook type',
    defaultValue: r => {
      let isStackType = false;

      isStackType = !!(((r || {}).hooks || {}).preSavePage || {})._stackId;

      if (isStackType) {
        return 'stack';
      }

      return 'script';
    },
    options: [
      {
        items: [
          { label: 'Script', value: 'script' },
          { label: 'Stack', value: 'stack' },
        ],
      },
    ],
  },
  'hooks.preSavePage.function': {
    loggable: true,
    type: 'text',
    label: 'Pre save page',
  },
  'hooks.preSavePage._scriptId': {
    loggable: true,
    type: 'selectresource',
    resourceType: 'scripts',
    label: 'Pre save page script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.preSavePage._stackId': {
    loggable: true,
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Pre save page stack',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },

  // #endregion hooks
  // #region transform
  transform: {
    loggable: true,
    type: 'transformeditor',
    label: 'Transform expression rules',
    defaultValue: r => r && r.transform,
  },
  'transform.script._scriptId': {
    loggable: true,
    type: 'text',
    label: 'Transform script _script id',
  },
  'transform.script.function': {
    loggable: true,
    type: 'text',
    label: 'Transform script function',
  },
  // #endregion transform

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
    label: 'Filter script _script id',
  },
  'filter.script.function': {
    loggable: true,
    type: 'text',
    label: 'Filter script function',
  },
  rawData: {
    type: 'rawdata',
    label: 'Refresh sample data',
  },
  sampleData: {
    type: 'sampledata',
    label: 'Sample data',
  },
  skipRetries: {
    loggable: true,
    type: 'skipRetries',
    label: 'Do not store retry data',
    visible: r => !(r && r.isLookup),
  },
  settings: {
    type: 'settings',
    defaultValue: r => r && r.settings,
  },
};
