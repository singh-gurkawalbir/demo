import getRoutePath from './routePaths';

export default function getResourcePagePath(
  resourceType,
  resourceId,
  options = {}
) {
  let path;

  switch (resourceType) {
    case 'accesstoken':
      path = `/tokens?_id=${resourceId}`;
      break;
    case 'connection':
      path = `/connections?_id=${resourceId}`;
      break;
    case 'export':
      path = `/exports/${resourceId}/edit`;
      break;
    case 'flow':
      path = `/integrations/${options._integrationId ||
        'none'}/settings/flows/${resourceId}/edit`;
      break;
    case 'import':
      path = `/imports/${resourceId}/edit`;
      break;
    case 'integration':
      path = `/integrations/${resourceId}/settings/flows`;
      break;
    case 'stack':
      path = `/stacks/${resourceId}/edit`;
      break;
    default:
      path = undefined;
  }

  return getRoutePath(path);
}
