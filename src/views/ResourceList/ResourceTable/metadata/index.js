import agents from './agents';
import connections from './connections';
import exports from './exports';
import imports from './imports';
import templates from './templates';
import scripts from './scripts';
import defaultResource from './default';

const metadata = {
  agents,
  connections,
  exports,
  imports,
  templates,
  scripts,
};

export default function(resourceType) {
  return metadata[resourceType] || defaultResource(resourceType);
}
