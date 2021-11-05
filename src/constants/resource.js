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
  iClient: 'iClients',
  import: 'imports',
  integration: 'integrations',
  script: 'scripts',
  stack: 'stacks',
  template: 'templates',
  license: 'licenses',
  api: 'apis',
  eventreport: 'eventreports',
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
  iclient: 'IClient',
  import: 'Import',
  integration: 'Integration',
  script: 'Script',
  stack: 'Stack',
  template: 'Template',
  license: 'License',
  agent: 'Agent',
  eventreport: 'Event report',
});
export const RESOURCE_TYPE_LABEL_TO_SINGULAR = Object.freeze(
  invert(RESOURCE_TYPE_SINGULAR_TO_LABEL)
);

const connections = ['connections', 'agents'];
const allResources = [
  'flows',
  'exports',
  'imports',
  'stacks',
  'scripts',
  'integrations',
  'apis',
  ...connections,
];

export const recycleBinDependencies = {
  stacks: ['stacks'],
  scripts: ['scripts'],
  agents: ['agents'],
  connections,
  exports: ['exports', ...connections],
  imports: ['imports', ...connections],
  flows: allResources,
  integrations: allResources,
};
