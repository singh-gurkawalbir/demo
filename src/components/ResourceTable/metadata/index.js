import agents from './agents';
import connections from './connections';
import exports from './exports';
import imports from './imports';
import scripts from './scripts';
import stacks from './stacks';
import connectors from './connectors';
import defaultResource from './default';

const metadata = {
  agents,
  connections,
  exports,
  imports,
  scripts,
  stacks,
  connectors,
};

export default function(resourceType) {
  return metadata[resourceType] || defaultResource(resourceType);
}
