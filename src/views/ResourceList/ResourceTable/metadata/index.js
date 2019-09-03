import agents from './agents';
import connections from './connections';
import exports from './exports';
import templates from './templates';
import defaultResource from './default';

const metadata = {
  agents,
  connections,
  exports,
  templates,
};

export default function(resourceType) {
  return metadata[resourceType] || defaultResource(resourceType);
}
