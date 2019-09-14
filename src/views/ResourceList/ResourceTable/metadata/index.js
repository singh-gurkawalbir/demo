import agents from './agents';
import connections from './connections';
import exports from './exports';
import flows from './flows';
import defaultResource from './default';

const metadata = {
  agents,
  connections,
  exports,
  flows,
};

export default function(resourceType) {
  return metadata[resourceType] || defaultResource(resourceType);
}
