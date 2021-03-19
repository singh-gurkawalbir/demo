import accesstokens from './accesstokens/metadata';
import agents from './agents/metadata';
import connections from './connections/metadata';
import connectors from './connectors/metadata';
import eventreports from './eventreports/metadata';
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
import runHistory from './runHistory/metadata';
import orgOwnerUsers from './users/Metadata/orgOwnerUsers';
import orgUsers from './users/Metadata/orgUsers';

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
  runHistory,
  orgOwnerUsers,
  orgUsers,
  eventreports,
};

export default function (resourceType) {
  return metadata[resourceType] || defaultResource(resourceType);
}
