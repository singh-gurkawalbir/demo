import { invert } from 'lodash';

export const RESOURCE_TYPE_SINGULAR_TO_PLURAL = Object.freeze({
  accesstoken: 'accesstokens',
  agent: 'agents',
  asyncHelper: 'asyncHelpers',
  connection: 'connections',
  connector: 'connectors',
  connectorLicense: 'connectorLicenses',
  export: 'exports',
  filedefinition: 'filedefinitions',
  flow: 'flows',
  iclient: 'iClients',
  import: 'imports',
  integration: 'integrations',
  script: 'scripts',
  stack: 'stacks',
  template: 'templates',
  license: 'licenses',
  api: 'apis',
  eventreport: 'eventreports',
  revision: 'revisions',
  user: 'users',
  notification: 'notifications',
});
export const RESOURCE_TYPE_PLURAL_TO_SINGULAR = Object.freeze(
  invert(RESOURCE_TYPE_SINGULAR_TO_PLURAL)
);
export const RESOURCE_TYPE_SINGULAR_TO_LABEL = Object.freeze({
  accesstoken: 'API token',
  asynchelper: 'Async helper',
  connection: 'Connection',
  connector: 'Connector',
  export: 'Export',
  filedefinition: 'File definition',
  flow: 'Flow',
  iclient: 'iClient',
  import: 'Import',
  integration: 'Integration',
  script: 'Script',
  stack: 'Stack',
  template: 'Template',
  license: 'License',
  agent: 'Agent',
  eventreport: 'Event report',
  revision: 'Revision',
  api: 'My API',
  ssoclient: 'SSO client',
  user: 'User',
  notification: 'Notification',
  mfa: 'MFA',
});
export const RESOURCE_TYPE_LABEL_TO_SINGULAR = Object.freeze(
  invert(RESOURCE_TYPE_SINGULAR_TO_LABEL)
);

export const NON_ARRAY_RESOURCE_TYPES = Object.freeze(['ui/assistants', 'tree/metadata']);

export const PATHS_DONT_NEED_INTEGRATOR_ASHAREID_HEADER = [
  'preferences',
  'profile',
  'published',
  'shared/ashares',
];

export const C_LOCKED_FIELDS = Object.freeze({
  exports: [
    'pageSize',
    'type',
    'netsuite.restlet.batchSize',
    'netsuite.restlet.searchId',
    'netsuite.distributed.executionContext',
    'netsuite.distributed.executionType',
    'netsuite.distributed.qualifier',
    'netsuite.distributed.sublists',
    'netsuite.distributed.forceReload',
    'netsuite.distributed.qualifier',
    'salesforce.relatedLists.referencedFields',
    'salesforce.relatedLists.parentField',
    'salesforce.relatedLists.sObjectType',
    'salesforce.relatedLists.filter',
    'salesforce.relatedLists.orderBy',
    'salesforce.relatedLists.userDefined',
    'salesforce.distributed.batchSize',
    'salesforce.soql.query',
    'salesforce.distributed.referencedFields',
    'salesforce.distributed.relatedLists',
    'schedule',
    'timeZone',
    'activeTab',
    'frequency',
    'startTime',
    'endTime',
    'daysToRunOn',
    'dayToRunOn',
    '_keepDeltaBehindFlowId',
    '_keepDeltaBehindExportId',
    'uploadFile',
    'ftp.directoryPath',
    'ftp.fileNameStartsWith',
    'ftp.fileNameEndsWith',
    'sampleData',
    'file.decompressFiles',
    'file.compressionFormat',
    'file.skipDelete',
    'file.csv',
    'mockOutput',
    'test.limit',
    'delta.dateField',
    'delta.lagOffset',
    'once.booleanField',
    'restlet.delta.dateField',
    'restlet.delta.lagOffset',
    'restlet.once.booleanField',
    'restlet.type',
    '_connectionId',
    'settings',
    'salesforce.distributed.qualifier',
  ],
  imports: [
    '_connectionId',
    'lookups',
    'batchSize',
    'netsuite.file.folder',
    'netsuite_da.batchSize',
    'netsuite_da.internalIdLookup.extract',
    'netsuite_da.internalIdLookup.searchField',
    'netsuite_da.internalIdLookup.operator',
    'netsuite_da.internalIdLookup.expression',
    'netsuite_da.mappings.lookups',
    'salesforce.idLookup.extract',
    'salesforce.idLookup.whereClause',
    'salesforce.upsert.externalIdField',
    'salesforce.lookups',
    'settings',
    'mockResponse',
  ],
  flows: [
    '_runNextFlowIds',
    'autoResolveMatchingTraceKeys',
    'disabled',
    'schedule',
    'timeZone',
    'activeTab',
    'frequency',
    'startTime',
    'endTime',
    'daysToRunOn',
    'dayToRunOn',
    '_keepDeltaBehindFlowId',
    '_keepDeltaBehindExportId',
    'settings',
  ],
  // According to the backend, none of the async helper fields are editable
  asyncHelpers: [],
});
export const FLOW_GROUP_FORM_KEY = 'flow-flowgroup';

export const ALIAS_FORM_KEY = Object.freeze({
  integrations: 'integration-alias',
  flows: 'flow-alias',
});

export const UNASSIGNED_SECTION_ID = 'unassigned';
export const UNASSIGNED_SECTION_NAME = 'Unassigned';
export const NO_ENVIRONMENT_RESOURCE_TYPES = Object.freeze([
  'accesstokens',
  'agents',
  'iClients',
  'stacks',
  'templates',
  'published',
  'transfers',
  'connectors',
]);
export const RESOURCE_TYPES_WITHOUT_CREATE_EDIT_PAGE = Object.freeze([
  'asyncHelpers',
  'filedefinitions',
  'ssoclients',
  'users',
]);

export const NO_ENVIRONMENT_MODELS_FOR_BIN = Object.freeze(['Agent', 'Stack']);

export const AWS_REGIONS_LIST = [
  {
    label: 'US East (N. Virginia) [us-east-1]',
    value: 'us-east-1',
  },
  {
    label: 'US West (N. California) [us-west-1]',
    value: 'us-west-1',
  },
  {
    label: 'US West (Oregon) [us-west-2]',
    value: 'us-west-2',
  },
  {
    label: 'EU (Ireland) [eu-west-1]',
    value: 'eu-west-1',
  },
  {
    label: 'EU (Frankfurt) [eu-central-1]',
    value: 'eu-central-1',
  },
  {
    label: 'Asia Pacific (Tokyo) [ap-northeast-1]',
    value: 'ap-northeast-1',
  },
  {
    label: 'Asia Pacific (Seoul) [ap-northeast-2]',
    value: 'ap-northeast-2',
  },
  {
    label: 'Asia Pacific (Singapore) [ap-southeast-1]',
    value: 'ap-southeast-1',
  },
  {
    label: 'Asia Pacific (Sydney) [ap-southeast-2]',
    value: 'ap-southeast-2',
  },
  {
    label: 'South America (São Paulo) [sa-east-1]',
    value: 'sa-east-1',
  },
  {
    label: 'China (Beijing) [cn-north-1]',
    value: 'cn-north-1',
  },
  {
    label: 'US East (Ohio) [us-east-2]',
    value: 'us-east-2',
  },
  {
    label: 'Canada (Central) [ca-central-1]',
    value: 'ca-central-1',
  },
  {
    label: 'Asia Pacific (Mumbai) [ap-south-1]',
    value: 'ap-south-1',
  },
  {
    label: 'EU (London) [eu-west-2]',
    value: 'eu-west-2',
  },
  {
    label: 'EU (Stockholm) [eu-north-1]',
    value: 'eu-north-1',
  },
];

export const MAPPING_SAVE_STATUS = {
  REQUESTED: 'requested',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const CATEGORY_MAPPING_SAVE_STATUS = {
  REQUESTED: 'requested',
  SAVED: 'saved',
  CLOSE: 'close',
  FAILED: 'failed',
};

export const MOCK_INPUT_STATUS = {
  REQUESTED: 'requested',
  RECEIVED: 'received',
  ERROR: 'error',
};
export const OPEN_ERRORS_VIEW_TYPES = {
  SPLIT: 'split', // new view
  LIST: 'list', // old view
};

export const RESOURCE_DEPENDENCIES = { uninstall2: ['flows', 'exports', 'imports', 'connections', 'integrations', 'tree/metadata', 'asynchelpers', 'scripts']};
