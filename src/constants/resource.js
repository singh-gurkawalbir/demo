import { invert } from 'lodash';

export const RESOURCE_TYPE_SINGULAR_TO_PLURAL = Object.freeze({
  accesstoken: 'accesstokens',
  agent: 'agents',
  asynchelper: 'asynchelpers',
  connection: 'connections',
  connector: 'connectors',
  export: 'exports',
  filedefinition: 'filedefinitions',
  flow: 'flows',
  iclient: 'iclients',
  import: 'imports',
  integration: 'integrations',
  script: 'scripts',
  stack: 'stacks',
  template: 'templates',
  license: 'licenses',
});
export const RESOURCE_TYPE_PLURAL_TO_SINGULAR = Object.freeze(
  invert(RESOURCE_TYPE_SINGULAR_TO_PLURAL)
);
export const RESOURCE_TYPE_SINGULAR_TO_LABEL = Object.freeze({
  accesstoken: 'API Token',
  asynchelper: 'Async Helper',
  connection: 'Connection',
  connector: 'Connector',
  export: 'Export',
  filedefinition: 'File Definition',
  flow: 'Flow',
  iclient: 'IClient',
  import: 'Import',
  integration: 'Integration',
  script: 'Script',
  stack: 'Stack',
  template: 'Template',
  license: 'License',
});
export const RESOURCE_TYPE_LABEL_TO_SINGULAR = Object.freeze(
  invert(RESOURCE_TYPE_SINGULAR_TO_LABEL)
);
export const recycleBinDependencies = {
  exports: ['exports', 'connections'],
  imports: ['imports', 'connections'],
  connections: ['connections'],
  flows: ['flows', 'integrations'],
  integrations: ['integrations'],
  stacks: ['stacks'],
  scripts: ['scripts'],
};
