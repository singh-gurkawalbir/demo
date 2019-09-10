import agents from './agents';
import connections from './connections';
import exports from './exports';
import registerConnections from './registerConnections';
import defaultResource from './default';

const metadata = {
  agents,
  connections,
  exports,
  registerConnections,
};

export default function(resourceType) {
  return metadata[resourceType] || defaultResource(resourceType);
}
