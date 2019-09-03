import agents from './agents';
import connections from './connections';
import exports from './exports';
import defaultResource from './default';

const metadata = {
  agents,
  connections,
  exports,
};

export default function(resourceType) {
  return metadata[resourceType] || defaultResource(resourceType);
}
