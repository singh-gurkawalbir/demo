import getRoutePath from './routePaths';

/**
 * @param resourceDetails Details about the resource.
 * @param resourceDetails.type The type of the resource.
 * @param resourceDetails.id The id of the resource.
 * @param resourceDetails._integrationId _integrationId of the resource.
 */
export default function getExistingResourcePagePath(resourceDetails = {}) {
  const { type, id, _integrationId } = resourceDetails;
  let path;

  switch (type) {
    case 'accesstoken':
      path = `/tokens?_id=${id}`;
      break;
    case 'connection':
      path = `/connections?_id=${id}`;
      break;
    case 'export':
      path = `/exports/${id}/edit`;
      break;
    case 'flow':
      path = `/integrations/${_integrationId ||
        'none'}/settings/flows/${id}/edit`;
      break;
    case 'import':
      path = `/imports/${id}/edit`;
      break;
    case 'integration':
      path = `/integrations/${id}/settings/flows`;
      break;
    case 'stack':
      path = `/stacks/${id}/edit`;
      break;
    default:
      path = undefined;
  }

  return getRoutePath(path);
}
