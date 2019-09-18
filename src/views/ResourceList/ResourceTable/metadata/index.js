import agents from './agents';
import connections from './connections';
import exports from './exports';
import flows from './flows';
import registerConnections from './registerConnections';
import attachFlows from './attachFlows';
import defaultResource from './default';

const metadata = {
  agents,
  connections,
  exports,
  flows,
  registerConnections,
  attachFlows,
};

export default function(resourceType) {
  return metadata[resourceType] || defaultResource(resourceType);
}
