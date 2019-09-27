import agents from './agents';
import connections from './connections';
import exports from './exports';
import flows from './flows';
import imports from './imports';
import scripts from './scripts';
import stacks from './stacks';
import connectors from './connectors';
import accesstokens from './accesstokens';
import defaultResource from './default';

const metadata = {
  agents,
  connections,
  exports,
  flows,
  imports,
  scripts,
  stacks,
  connectors,
  accesstokens,
};

export default function(resourceType) {
  return metadata[resourceType] || defaultResource(resourceType);
}
