import agents from './agents';
import connections from './connections';
import exports from './exports';
import flows from './flows';
import registerConnections from './registerConnections';
import defaultResource from './default';

const metadata = {
  agents,
  connections,
  exports,
  flows,
  registerConnections,
};

export default function(resourceType) {
  return metadata[resourceType] || defaultResource(resourceType);
}
