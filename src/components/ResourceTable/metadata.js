import accesstokens from './accesstokens/metadata';
import agents from './agents/metadata';
import connections from './connections/metadata';
import connectors from './connectors/metadata';
import defaultResource from './default/metadata';
import exports from './exports/metadata';
import imports from './imports/metadata';
import scripts from './scripts/metadata';
import stacks from './stacks/metadata';
import apis from './apis/metadata';
import recycleBinTTL from './recycleBinTTL/metadata';
import templates from './templates/metadata';
import transfers from './transfers/metadata';
import auditLogs from './auditLog/metadata';
import openErrors from './errorManagement/openErrors/metadata';
import resolvedErrors from './errorManagement/resolvedErrors/metadata';
import latestJobs from './latestJobs/metadata';
import usersForOwner from './users/Metadata/usersForOwner';
import sharedUsers from './users/Metadata/sharedUsers';

const metadata = {
  agents,
  connections,
  exports,
  imports,
  scripts,
  stacks,
  connectors,
  accesstokens,
  apis,
  recycleBinTTL,
  templates,
  transfers,
  auditLogs,
  openErrors,
  resolvedErrors,
  latestJobs,
  usersForOwner,
  sharedUsers,
};

export default function (resourceType) {
  return metadata[resourceType] || defaultResource(resourceType);
}
