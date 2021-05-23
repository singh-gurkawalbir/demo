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
    type: 'text',
    label: 'Name',
    required: true,
  },

  description: {
    type: 'text',
    label: 'Description',
  },
  _connectionId: {
    type: 'replaceconnection',
    resourceType: 'connections',
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
    id: 'formView',
    type: 'formview',
    label: 'Form view',
    visible: r => !r?.useTechAdaptorForm,
    defaultValue: r => r && `${r.assistant ? 'false' : 'true'}`,
    helpKey: 'formView',
  },
  semiassistantoperationselect: {
    id: 'semiassistantoperationselect',
    type: 'semiassistantoperationselect',
  },
  asynchronous: {
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
    type: 'checkbox',
    label: 'Configure async helper',
  },
  type: {
    type: 'select',
    label: 'Type',
    options: [
      {
        items: [
          { label: 'Webhook', value: 'webhook' },
          { label: 'Distributed', value: 'distributed' },
          { label: 'Test', value: 'test' },
          { label: 'Delta', value: 'delta' },
          { label: 'Once', value: 'once' },
          { label: 'Tranlinedelta', value: 'tranlinedelta' },
          { label: 'Simple', value: 'simple' }, // dataloader
          { label: 'Blob', value: 'blob' }, // attachments
        ],
      },
    ],
  },
  pageSize: {
    type: 'text',
    label: 'Page size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    type: 'uri',
    label: 'Data URI template',
    showLookup: false,
  },
  traceKeyTemplate: {
    id: 'traceKeyTemplate',
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
  },
  oneToMany: {
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
    type: 'checkbox',
    label: 'Is lookup',
  },
  useTechAdaptorForm: {
    type: 'checkbox',
    label: 'Use tech adaptor form',
  },
  adaptorType: {
    type: 'text',
    label: 'Adaptor type',
  },
  parsers: {
    label: 'XML parser helper',
    type: 'xmlparse',
    required: true,
  },
  // #endregion common
  // #region inputFilter
  'inputFilter.expression.version': {
    type: 'radiogroup',
    label: 'Input filter expression version',
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'inputFilter.expression.rules': {
    type: 'text',
    label: 'Input filter expression rules',
  },
  'inputFilter.script._scriptId': {
    type: 'text',
    label: 'Input filter script _script id',
  },
  'inputFilter.script.function': {
    type: 'text',
    label: 'Input filter script function',
  },
  // #endregion inputFilter
  // #region test
  'test.limit': {
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
    type: 'text',
    label: 'Date field(s)',
    required: true,
    visibleWhen: [{ field: 'type', is: ['delta'] }],
  },
  'delta.dateFormat': {
    type: 'toggleSelectToText',
    selectHrefLabel: 'Use custom format',
    textHrefLabel: 'Use presets',
    label: 'Delta date format',
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
    type: 'text',
    label: 'Delta start date',
    visibleWhen: [{ field: 'type', is: ['delta'] }],
  },
  'delta.lagOffset': {
    type: 'textwithflowcontext',
    label: 'Offset',
    visibleWhenAll: [{ field: 'type', is: ['delta'] }],
  },
  'delta.endDateField': {
    type: 'text',
    label: 'Delta end date field',
    visibleWhen: [{ field: 'type', is: ['delta'] }],
  },
  // #endregion delta
  // #region once
  'once.booleanField': {
    type: 'text',
    label: 'Boolean field',
    required: true,
    visibleWhen: [{ field: 'type', is: ['once'] }],
  },
  // #endregion once
  // #region valueDelta
  'valueDelta.exportedField': {
    type: 'text',
    label: 'Value delta exported field',
  },
  'valueDelta.pendingField': {
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
    type: 'text',
    label: 'Pre save page',
  },
  'hooks.preSavePage._scriptId': {
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
    type: 'transformeditor',
    label: 'Transform expression rules',
    defaultValue: r => r && r.transform,
  },
  'transform.script._scriptId': {
    type: 'text',
    label: 'Transform script _script id',
  },
  'transform.script.function': {
    type: 'text',
    label: 'Transform script function',
  },
  // #endregion transform

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
    label: 'Filter script _script id',
  },
  'filter.script.function': {
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
    type: 'skipRetries',
    label: 'Do not store retry data',
    visible: r => !(r && r.isLookup),
  },
  settings: {
    type: 'settings',
    defaultValue: r => r && r.settings,
  },
};
